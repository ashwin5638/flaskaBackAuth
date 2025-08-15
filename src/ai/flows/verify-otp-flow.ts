'use server';
/**
 * @fileOverview A flow for verifying a one-time password (OTP).
 *
 * - verifyOtp - A function that handles verifying the OTP.
 * - VerifyOtpInput - The input type for the verifyOtp function.
 * - VerifyOtpOutput - The return type for the verifyOtp function.
 */

import {ai} from '@/ai/genkit';
import { VerifyOtpInputSchema, VerifyOtpOutputSchema, type VerifyOtpInput, type VerifyOtpOutput } from '@/lib/schemas';


export async function verifyOtp(input: VerifyOtpInput): Promise<VerifyOtpOutput> {
  return verifyOtpFlow(input);
}

const verifyOtpFlow = ai.defineFlow(
  {
    name: 'verifyOtpFlow',
    inputSchema: VerifyOtpInputSchema,
    outputSchema: VerifyOtpOutputSchema,
  },
  async (input) => {
    console.log(`Simulating verifying OTP: ${input.otp}...`);

    // In a real app, you'd check the OTP against a value stored in your database
    // that you associated with the user's session.
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (input.otp !== "123456") {
        console.error("Simulation: Invalid OTP entered.");
        return { success: false, message: "Invalid or expired OTP. Please try again." };
    }

    console.log("Simulation: OTP verified successfully.");
    // In a real app, the backend would return a JWT.
    const mockJwt = "_mock_jwt_token_" + Math.random();
    return { success: true, message: "OTP verified successfully!", token: mockJwt };
  }
);
