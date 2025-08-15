# **App Name**: SelfieAuth

## Core Features:

- Phone Number Input & OTP Request: Input field for phone number in E.164 format (+91XXXXXXXXXX) and a 'Send OTP' button that calls the Send OTP API.
- OTP Verification: OTP input screen with a 6-digit OTP entry and a 'Verify' button to call the Verify OTP API.
- Liveness Check: On-device liveness detection with front camera; prevents selfie capture if liveness check fails.
- Selfie Capture & Upload: Capture selfie image and upload to Upload Selfie API (multipart/form-data).
- Error Handling & Feedback: User-friendly error messages for API, camera/liveness failures, and invalid inputs.
- Successful Login: Navigation to home page with welcome message, user number, and uploaded selfie displayed after successful verification.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5), evoking trust and security, which is important for authentication apps.
- Background color: Very light gray (#F0F2F5), a muted version of the primary hue, providing a neutral backdrop that keeps focus on the interface elements.
- Accent color: Vivid orange (#FF9800), used sparingly for key CTAs and alerts to draw the user's attention without overwhelming the UI.
- Font: 'Inter', a sans-serif font, will be used for both headlines and body text, ensuring legibility across various screen resolutions in the mobile app.
- Clean, simple line icons for indicating processes like sending/verifying OTP, liveness check, and uploading selfie.
- Smooth transitions between screens and subtle loading animations for API calls.