# SelfieAuth:  Authentication App

This  application demonstrates a complete user authentication flow using a mobile number, OTP verification via WhatsApp, and an on-device liveness check with a selfie upload.

## Features

-   **Phone Number Authentication**: Users sign in with their mobile number.
-   **OTP Verification**: A One-Time Password is sent to the user's WhatsApp for verification.
-   **Liveness Check**: An interactive, on-device check to ensure the user is a real, live person before capturing a selfie.
-   **Secure Selfie Upload**: The captured selfie is securely uploaded to a backend service.
-   **Modern Tech Stack**: Built with React, TypeScript, Tailwind CSS, and Genkit for server-side logic.
-   **Component-Based UI**: Styled with ShadCN UI components for a polished and consistent look and feel.

## How It Works

The application guides the user through a multi-step authentication process:

1.  **Enter Phone**: The user provides their E.164 formatted phone number.
2.  **Verify OTP**: The user receives an OTP on WhatsApp and enters it into the app.
3.  **Liveness Check**: The app uses the front camera to guide the user through a series of actions (e.g., "Smile!", "Turn your head left").
4.  **Capture & Upload**: Upon successful liveness verification, a selfie is captured and uploaded.
5.  **Authenticated Session**: The user is logged in and greeted with a welcome screen showing their selfie and phone number.

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the application in development mode, run the following command:

```bash
npm run dev
```

This will start  development server, typically on [http://localhost:9002](http://localhost:9002).

## Project Structure

-   `src/app/`: The core application code, following the Next.js App Router structure.
    -   `page.tsx`: The main entry point for the authentication flow UI.
    -   `actions.ts`: Server Actions that handle communication with the backend APIs.
    -   `globals.css`: Global styles and Tailwind CSS configuration.
-   `src/components/`: Reusable React components.
    -   `auth/`: Components specific to the authentication flow (Phone form, OTP form, Liveness check, etc.).
    -   `ui/`: ShadCN UI components.
-   `src/ai/`: Genkit flows for server-side logic.
    -   `flows/`: Contains the logic for sending/verifying OTPs.
-   `src/lib/`: Utility functions and schema definitions.
    -   `schemas.ts`: Zod schemas for form validation and data typing.
-   `public/`: Static assets.
-   `config.ts`:  configuration.


https://github.com/user-attachments/assets/027a47ed-94f5-4e02-9bb3-e88e853b4f50

