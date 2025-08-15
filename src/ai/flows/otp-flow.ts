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
    console.log(`Simulating sending OTP to ${input.phoneNumber}...`);

    // In a real application, you would integrate with an OTP service like Twilio here.
    // For example:
    // const result = await twilio.messages.create({
    //   body: `Your OTP is ${generatedOtp}`,
    //   from: 'your_twilio_number',
    //   to: input.phoneNumber
    // });
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate a potential API error for demonstration
    if (input.phoneNumber.includes("5555")) {
        console.error("Simulation: API error for rate-limited number.");
        return { success: false, message: "This phone number has been rate-limited. Please try again later." };
    }

    console.log("Simulation: OTP sent successfully.");
    return { success: true, message: "OTP has been sent to your WhatsApp." };
  }
);
