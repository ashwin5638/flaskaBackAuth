"use server";

import { z } from "zod";
import { cookies } from "next/headers";
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

  const result = await verifyOtpFlow({
      ...validatedFields.data,
      login_platform: "MobileApp"
  });

  if (result.success && result.token) {
    // Securely store the JWT in an HTTP-only cookie
    cookies().set("auth_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  }

  return result;
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

  const token = cookies().get("auth_token")?.value;

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

    const response = await fetch("https://flashback.inc:9000/api/mobile/uploadUserPortrait", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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
