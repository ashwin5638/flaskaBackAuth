'use server';
/**
 * @fileOverview A flow for sending a one-time password (OTP).
 *
 * - sendOtp - A function that handles sending the OTP.
 * - SendOtpInput - The input type for the sendOtp function.
 * - SendOtpOutput - The return type for the sendOtp function.
 */

import {ai} from '@/ai/genkit';
import { SendOtpInputSchema, SendOtpOutputSchema, type SendOtpInput, type SendOtpOutput } from '@/lib/schemas';


export async function sendOtp(input: SendOtpInput): Promise<SendOtpOutput> {
  return sendOtpFlow(input);
}

const sendOtpFlow = ai.defineFlow(
  {
    name: 'sendOtpFlow',
    inputSchema: SendOtpInputSchema,
    outputSchema: SendOtpOutputSchema,
  },
  async (input) => {
    try {
      const response = await fetch("https://flashback.inc:9000/api/mobile/sendOTP", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: input.phoneNumber }),
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
);
