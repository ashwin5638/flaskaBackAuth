"use client";

import { useState } from "react";
import PhoneForm from "@/components/auth/phone-form";
import OtpForm from "@/components/auth/otp-form";
import LivenessCheck from "@/components/auth/liveness-check";
import Home from "@/components/auth/home";
import AuthContainer from "@/components/auth/auth-container";
import { AnimatePresence, motion } from "framer-motion";

type Step = "phone" | "otp" | "liveness" | "home";

export default function SelfieAuthPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selfie, setSelfie] = useState("");

  const handlePhoneSuccess = (phone: string) => {
    setPhoneNumber(phone);
    setStep("otp");
  };

  const handleOtpSuccess = () => {
    setStep("liveness");
  };

  const handleLivenessSuccess = (imageData: string) => {
    setSelfie(imageData);
    setStep("home");
  };

  const renderStep = () => {
    switch (step) {
      case "phone":
        return <PhoneForm onSuccess={handlePhoneSuccess} />;
      case "otp":
        return <OtpForm onSuccess={handleOtpSuccess} phoneNumber={phoneNumber} />;
      case "liveness":
        return <LivenessCheck onSuccess={handleLivenessSuccess} />;
      case "home":
        return <Home phoneNumber={phoneNumber} selfieImage={selfie} />;
      default:
        return <PhoneForm onSuccess={handlePhoneSuccess} />;
    }
  };

  const getTitleForStep = (currentStep: Step): string => {
    switch (currentStep) {
      case "phone":
        return "Enter Your Phone Number";
      case "otp":
        return "Verify OTP";
      case "liveness":
        return "Liveness Check";
      case "home":
        return "Welcome!";
      default:
        return "";
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <AuthContainer title={getTitleForStep(step)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </AuthContainer>
    </main>
  );
}
