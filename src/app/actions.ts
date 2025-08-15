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


// This function simulates uploading the captured selfie.
export async function uploadSelfie(
  formData: FormData
): Promise<{ success: boolean; message: string; imageUrl?: string }> {

  const image = formData.get("image");
  const username = formData.get("username");
  
  if (!image || !username) {
    return { success: false, message: "Missing image or username." };
  }

  console.log(`Simulating uploading selfie for ${username}...`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  console.log("Simulation: Selfie uploaded successfully.");
  // In a real app, the backend would store the image and return a URL.
  // Here we just pass the data URI back for display.
  const imageUrl = image.toString();
  return { success: true, message: "Selfie uploaded successfully!", imageUrl };
}
