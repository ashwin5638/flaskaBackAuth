"use server";

import { z } from "zod";
import { sendOtp as sendOtpFlow } from "@/ai/flows/otp-flow";
import { verifyOtp as verifyOtpFlow } from "@/ai/flows/verify-otp-flow";
import { OTPSchema, PhoneSchema } from "@/lib/schemas";


// This function simulates calling an API to send an OTP.
// In a real application, this would involve an HTTP request to your backend.
export async function sendOtp(
  values: z.infer<typeof PhoneSchema>
): Promise<{ success: boolean; message: string }> {
  const validatedFields = PhoneSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Invalid phone number format." };
  }

  return await sendOtpFlow(validatedFields.data);
}

// This function simulates verifying the OTP.
export async function verifyOtp(
  values: z.infer<typeof OTPSchema>
): Promise<{ success: boolean; message: string; token?: string }> {
  const validatedFields = OTPSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Invalid OTP format." };
  }

  return await verifyOtpFlow(validatedFields.data);
}


// This function uploads the captured selfie.
export async function uploadSelfie(
  formData: FormData
): Promise<{ success: boolean; message: string; imageUrl?: string }> {

  const image = formData.get("image") as string;
  const username = formData.get("username") as string;
  
  if (!image || !username) {
    return { success: false, message: "Missing image or username." };
  }
  
  try {
    const response = await fetch("https://flashback.inc:9000/api/mobile/uploadUserPortrait", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          // The username here is the phone number from the previous steps
          username: username, 
          // The image is a Base64 encoded Data URI. We might need to trim the header.
          // e.g. "data:image/png;base64,iVBORw0KGgo..." -> "iVBORw0KGgo..."
          imageBase64: image.split(',')[1] 
      }),
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
