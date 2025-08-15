import { z } from "zod";

export const PhoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required.")
    .regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid E.164 phone number (e.g., +91XXXXXXXXXX).")
    .min(11, "Please enter a complete phone number."),
});

export const OTPSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits.")
    .max(6, "OTP must be 6 digits.")
    .regex(/^\d{6}$/, "OTP must contain only digits."),
  phoneNumber: z.string(),
});
