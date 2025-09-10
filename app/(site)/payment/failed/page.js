"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentUnsuccessful() {
  const router = useRouter();

  const today = new Date();
  const formattedDate = today.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex flex-col items-center justify-center p-8 my-20 bg-white shadow-md rounded-lg max-w-md mx-auto space-y-6">
      {/* Icon */}
      <div className="text-red-500">
        <AlertTriangle className="w-16 h-16" />
      </div>

      {/* Title */}
      <h2 className="secondaryText1 font-bold text-center">Payment Unsuccessful</h2>

      {/* Description */}
      <p className="text-center text-gray-600 subtitleText">
        Something went wrong with your payment. Please try again.
      </p>

      {/* Payment Details */}
      <div className="w-full border-t border-b border-gray-200 py-4 space-y-2 subtitleText">
        <div className="flex justify-between text-gray-700">
          <span>Payment ID:</span>
          <span className="font-medium">292393</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Date & Time:</span>
          <span className="font-medium">{formattedDate}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col  w-full">
        <Button
          onClick={() => router.push("/user/billing-details")}
          className="bg-orange-500 h-12 hover:bg-orange-600 w-full text-white cursor-pointer subtitleText"
        >
          TRY AGAIN
        </Button>
        <p className="text-center mt-2">Have a question? <Link
          href={"/support"}
          
          className=" cursor-pointer text-orange-500"
        >
          Contact support
        </Link></p>
      </div>
    </div>
  );
}
