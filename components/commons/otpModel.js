"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { X } from "lucide-react";
import { handleOtpResend, handleOtpSubmit } from "@/app/helper/formfunction";

export default function OTPModel({ isOpen, setIsOpen, data, navigate, action }) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Format countdown as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleContinue = async () => {
    if (otp.length !== 5) return;

    setIsLoading(true);

    await handleOtpSubmit(otp, setIsOpen, setIsLoading, data, navigate, action);
    setOtp(""); // Clear OTP input after submission
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const handleSendAgain = async () => {
    await handleOtpResend(data?.email, setCountdown, setOtp, action);
  };

  const handleBack = () => {
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 z-0">
      <Dialog open={isOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <DialogTitle className="sr-only">Enter Verification Code</DialogTitle>
          <div className="relative bg-white rounded-lg">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-8 py-8 pt-12">
              {/* Title */}
              <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
                Enter The code
              </h2>

              {/* Subtitle */}
              <p className="text-sm text-gray-600 text-center mb-8">
                Please enter 5-digit code sent to: {data?.email}
              </p>

              {/* OTP Input */}
              <div className="flex justify-center mb-6">
                <InputOTP
                  maxLength={5}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot
                      index={0}
                      className="w-12 h-12 text-lg border-2 border-gray-300 rounded-md focus:border-orange-500"
                    />
                    <InputOTPSlot
                      index={1}
                      className="w-12 h-12 text-lg border-2 border-gray-300 rounded-md focus:border-orange-500"
                    />
                    <InputOTPSlot
                      index={2}
                      className="w-12 h-12 text-lg border-2 border-gray-300 rounded-md focus:border-orange-500"
                    />
                    <InputOTPSlot
                      index={3}
                      className="w-12 h-12 text-lg border-2 border-gray-300 rounded-md focus:border-orange-500"
                    />
                    <InputOTPSlot
                      index={4}
                      className="w-12 h-12 text-lg border-2 border-gray-300 rounded-md focus:border-orange-500"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Resend text with countdown */}
              <div className="text-center mb-6">
                <span className="text-sm text-gray-600">
                  {"Didn't receive the code? "}
                  {countdown > 0 ? (
                    <span className="text-gray-500">
                      Send again in {formatTime(countdown)}
                    </span>
                  ) : (
                    <button
                      onClick={handleSendAgain}
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Send again
                    </button>
                  )}
                </span>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleContinue}
                  disabled={otp.length !== 5 || isLoading}
                  className="w-full inputFieldHeight primaryText btnGradient text-white cursor-pointer"
                >
                  {isLoading ? "VERIFYING..." : "Submit"}
                </Button>

                <Button
                  onClick={handleBack}
                  variant="secondary"
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 inputFieldHeight primaryText cursor-pointer"
                >
                  BACK
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
