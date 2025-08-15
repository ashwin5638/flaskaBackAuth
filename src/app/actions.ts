"use server";

import { z } from "zod";

const PhoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required.")
    .regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid E.164 phone number (e.g., +91XXXXXXXXXX)."),
});

const OTPSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits.")
    .max(6, "OTP must be 6 digits.")
    .regex(/^\d{6}$/, "OTP must contain only digits."),
});


// --- Mock API Implementations ---

// This function simulates calling an API to send an OTP.
// In a real application, this would involve an HTTP request to your backend.
export async function sendOtp(
  values: z.infer<typeof PhoneSchema>
): Promise<{ success: boolean; message: string }> {
  const validatedFields = PhoneSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Invalid phone number format." };
  }

  const { phoneNumber } = validatedFields.data;

  console.log(`Simulating sending OTP to ${phoneNumber}...`);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate a potential API error for demonstration
  if (phoneNumber.includes("5555")) {
    console.error("Simulation: API error for rate-limited number.");
    return { success: false, message: "This phone number has been rate-limited. Please try again later." };
  }

  console.log("Simulation: OTP sent successfully.");
  return { success: true, message: "OTP has been sent to your WhatsApp." };
}

// This function simulates verifying the OTP.
export async function verifyOtp(
  values: z.infer<typeof OTPSchema>
): Promise<{ success: boolean; message: string; token?: string }> {
  const validatedFields = OTPSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, message: "Invalid OTP format." };
  }

  const { otp } = validatedFields.data;
  console.log(`Simulating verifying OTP: ${otp}...`);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // The "correct" OTP for this simulation is '123456'.
  if (otp !== "123456") {
    console.error("Simulation: Invalid OTP entered.");
    return { success: false, message: "Invalid or expired OTP. Please try again." };
  }

  console.log("Simulation: OTP verified successfully.");
  // In a real app, the backend would return a JWT.
  const mockJwt = "_mock_jwt_token_" + Math.random();
  return { success: true, message: "OTP verified successfully!", token: mockJwt };
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
