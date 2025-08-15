import { z } from "zod";

export const PhoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required.")
    .regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid E.164 phone number (e.g., +91XXXXXXXXXX)."),
});

export const OTPSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits.")
    .max(6, "OTP must be 6 digits.")
    .regex(/^\d{6}$/, "OTP must contain only digits."),
});


export const SendOtpInputSchema = z.object({
  phoneNumber: z.string().describe('The phone number to send the OTP to.'),
});
export type SendOtpInput = z.infer<typeof SendOtpInputSchema>;

export const SendOtpOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendOtpOutput = z.infer<typeof SendOtpOutputSchema>;


export const VerifyOtpInputSchema = z.object({
  otp: z.string().describe('The one-time password to verify.'),
});
export type VerifyOtpInput = z.infer<typeof VerifyOtpInputSchema>;

export const VerifyOtpOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  token: z.string().optional(),
});
export type VerifyOtpOutput = z.infer<typeof VerifyOtpOutputSchema>;
