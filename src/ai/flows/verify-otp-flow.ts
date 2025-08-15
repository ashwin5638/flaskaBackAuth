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
    try {
      const response = await fetch("https://flashback.inc:9000/api/mobile/verifyOTP", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: input.phoneNumber, otp: input.otp }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("API error:", result.message);
        return { success: false, message: result.message || "Invalid or expired OTP." };
      }

      return { success: true, message: "OTP verified successfully!", token: result.token };
    } catch (error) {
      console.error("Network or other error:", error);
      return { success: false, message: "An error occurred. Please try again later." };
    }
  }
);
