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


// This function uploads the captured selfie.
export async function uploadSelfie(
  formData: FormData,
  token?: string
): Promise<{ success: boolean; message: string; imageUrl?: string }> {
  const image = formData.get("image") as string;
  const username = formData.get("username") as string;

  if (!image || !username) {
    return { success: false, message: "Missing image or username." };
  }

  if (!token) {
    return { success: false, message: "Authentication token not found. Please log in again." };
  }
  
  try {
    // Convert data URI to Blob
    const fetchResponse = await fetch(image);
    const blob = await fetchResponse.blob();

    const uploadFormData = new FormData();
    uploadFormData.append('image', blob, 'selfie.png');
    uploadFormData.append('username', username);

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);

    const response = await fetch("https://flashback.inc:9000/api/mobile/uploadUserPortrait", {
      method: 'POST',
      headers: headers,
      body: uploadFormData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("API error:", result.message);
      return { success: false, message: result.message || "Failed to upload selfie." };
    }

    // The API might not return a URL, we will use the captured image for display
    return { success: true, message: "Selfie uploaded successfully!", imageUrl: image };
  } catch(error) {
    console.error("Network or other error:", error);
    return { success: false, message: "An error occurred during selfie upload." };
  }
}
