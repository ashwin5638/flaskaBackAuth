"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { OTPSchema, PhoneSchema } from "@/lib/schemas";


// This function calls the API to send an OTP.
export async function sendOtp(
  values: z.infer<typeof PhoneSchema>
): Promise<{ success: boolean; message: string }> {
  const validatedFields = PhoneSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Invalid phone number format." };
  }

  try {
      const response = await fetch("https://flashback.inc:9000/api/mobile/sendOTP", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: validatedFields.data.phoneNumber }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("API error:", result.message);
        return { success: false, message: result.message || "Failed to send OTP." };
      }

      return { success: true, message: "OTP has been sent to your WhatsApp." };
    } catch (error) {
      console.error("Network or other error:", error);
      return { success: false, message: "An error occurred. Please try again later." };
    }
}

// This function calls the API to verify the OTP.
export async function verifyOtp(
  values: z.infer<typeof OTPSchema>
): Promise<{ success: boolean; message: string; token?: string }> {
  const validatedFields = OTPSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Invalid OTP format." };
  }

  const payload = {
    ...validatedFields.data,
    login_platform: "MobileApp"
  };

  try {
      const response = await fetch("https://flashback.inc:9000/api/mobile/verifyOTP", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("API error:", result.message);
        return { success: false, message: result.message || "Invalid or expired OTP." };
      }
      
      if (result.success) {
        // Securely store the JWT in an HTTP-only cookie if it exists
        if(result.token) {
            cookies().set("auth_token", result.token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              path: "/",
            });
        }
         return { success: true, message: "OTP verified successfully!", token: result.token };
      }

      // If the API call was ok but verification failed (e.g. wrong OTP)
      return { success: false, message: result.message || "Invalid or expired OTP." };
    } catch (error) {
      console.error("Network or other error:", error);
      return { success: false, message: "An error occurred. Please try again later." };
    }
}






export async function uploadSelfie(
  formData: FormData,
  explicitToken?: string
): Promise<{
  success: boolean;
  message: string;
  imageUrl?: string;
  requiresLogin?: boolean;
}> {
  try {
    // 1. Authentication Handling
    let authToken = explicitToken;
    if (!authToken) {
      const cookieStore = await cookies();
      authToken = cookieStore.get("auth_token")?.value;
    }

    if (!authToken) {
      console.error("Authentication failed - No token found");
      return {
        success: false,
        message: "Session expired. Please log in again.",
        requiresLogin: true,
      };
    }

    // 2. Input Validation
    const image = formData.get("image");
    const username = formData.get("username");

    if (!image) {
      return { success: false, message: "No image file provided." };
    }
    if (!username || typeof username !== "string") {
      return { success: false, message: "Username is required." };
    }

    // 3. Image Processing
    let blob: Blob;
    try {
      if (image instanceof Blob) {
        blob = image;
      } else if (typeof image === "string" && image.startsWith("data:image")) {
        const response = await fetch(image);
        if (!response.ok) throw new Error("Failed to fetch image from data URL");
        blob = await response.blob();
      } else {
        return { success: false, message: "Unsupported image format." };
      }
      // Validate image size (e.g., max 5MB)
      if (blob.size > 5 * 1024 * 1024) {
        return { success: false, message: "Image size exceeds 5MB limit." };
      }
    } catch (error) {
      console.error("Image processing error:", error);
      return { success: false, message: "Error processing the image." };
    }

    // 4. Prepare FormData for upload
    const uploadFormData = new FormData();
    uploadFormData.append("image", blob, `selfie_${Date.now()}.png`);
    uploadFormData.append("username", username.trim());

    // 5. API Request
    const endpoint = "https://flashback.inc:9000/api/mobile/uploadUserPortrait";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: uploadFormData,
    });

    // 6. Handle Response
    let result: any = {};
    try {
      result = await response.json();
    } catch {
      // If no JSON response
      result = {};
    }

    if (!response.ok) {
      console.error("Upload failed:", {
        status: response.status,
        error: result?.message || "Unknown error",
      });

      if (response.status === 401) {
        const cookieStore = await cookies();
        await cookieStore.delete("auth_token");
        return {
          success: false,
          message: "Session expired. Please log in again.",
          requiresLogin: true,
        };
      }

      return {
        success: false,
        message: result?.message || "Upload failed. Please try again.",
      };
    }

    if (result?.success === false) {
      return {
        success: false,
        message: result.message || "Upload failed.",
      };
    }

    // 7. Success Case
    return {
      success: true,
      message: "Selfie uploaded successfully!",
      imageUrl: result?.imageUrl || (typeof image === "string" ? image : undefined),
    };

  } catch (error) {
    console.error("Unexpected error in uploadSelfie:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
