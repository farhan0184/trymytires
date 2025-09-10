"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  fetchOrders,
  paymentPaypalSuccess,
  paymentStripeSuccess,
  sendInvoiceMail,
} from "@/app/helper/backend";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hasShownToast = useRef(false);

  const payment = searchParams.get("payment");
  const session_id = searchParams.get("session_id");
  const paymentId = searchParams.get("paymentId");
  const PayerID = searchParams.get("PayerID");
  const _id = searchParams.get("_id");

  const [invoice, setInvoice] = useState(null);
  const [processing, setProcessing] = useState(true);
  const [loading, setLoading] = useState(false);

  // --------------------------
  // Stripe Payment
  // --------------------------
  const handleStripePayment = async () => {
    try {
      await paymentStripeSuccess({ session_id, _id });
      toast.success("Your payment was successful!");
    } catch (error) {
      toast.error("An error occurred while verifying Stripe payment.");
    }
  };

  // --------------------------
  // PayPal Payment
  // --------------------------
  const handlePayPalPayment = async () => {
    try {
      await paymentPaypalSuccess({ paymentId, PayerID, _id });
      toast.success("Your payment was successful!");
    } catch (error) {
      toast.error("An error occurred while verifying PayPal payment.");
    }
  };

  // --------------------------
  // Process payment
  // --------------------------
  useEffect(() => {
    const processPayment = async () => {
      if (!_id || hasShownToast.current) return;
      hasShownToast.current = true;

      try {
        const data = await fetchOrders({ _id });
        const invoiceData = data?.data?.docs[0];
        setInvoice(invoiceData);

        // Send invoice email only once using localStorage
        const emailSentKey = `invoice_email_sent_${_id}`;
        if (!localStorage.getItem(emailSentKey)) {
          await sendInvoiceMail({ _id });
          localStorage.setItem(emailSentKey, "true");
        }

        if (payment === "pickup") {
          toast.success("Your COD order has been placed successfully!");
          setProcessing(false);
          return;
        }

        if (payment === "stripe") {
          setLoading(true);
          await handleStripePayment();
        } else if (payment === "paypal") {
          setLoading(true);
          await handlePayPalPayment();
        }
      } catch (error) {

        toast.error("An unexpected error occurred during payment processing.");
      } finally {
        setLoading(false);
        setProcessing(false);
      }
    };

    processPayment();
  }, [_id, payment]);

  // --------------------------
  // Loading state
  // --------------------------
  if (processing && loading && _id && invoice === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">
          Processing your payment...
        </span>
      </div>
    );
  }

  const today = new Date();
  const formattedDate = today.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // --------------------------
  // Success state
  // --------------------------
  return (
    <div className="flex flex-col items-center justify-center p-8 my-20 bg-white shadow-md rounded-lg max-w-md mx-auto space-y-6">
      <div className="text-green-500">
        <CheckCircle2 className="w-16 h-16" />
      </div>

      <h2 className="secondaryText1 font-bold text-center">
        {payment === "pickup" ? "Order" : "Payment"} Successful
      </h2>

      <p className="text-center text-gray-600 subtitleText">
        Thank you for your {payment === "pickup" ? "order" : "payment"}. Your
        order is being processed.
      </p>

      <div className="w-full border-t border-b border-gray-200 py-4 space-y-2 subtitleText">
        <div className="flex justify-between text-gray-700">
          <span>Amount Paid:</span>
          <span className="font-medium">${invoice?.total_price}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Payment Method:</span>
          <span className="font-medium">
            {invoice?.payment_method === "cod"
              ? "Pickup From Shop"
              : "Online Payment"}
          </span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Date & Time:</span>
          <span className="font-medium">{formattedDate}</span>
        </div>
      </div>

      <div className="flex flex-col space-y-3 w-full">
        <Button
          onClick={() => router.push("/user/billing-derails")}
          className="bg-orange-500 h-12 hover:bg-orange-600 w-full text-white cursor-pointer subtitleText"
        >
          GO TO INVOICE
        </Button>
        <Button
          onClick={() => router.push("/products?search=tires")}
          variant="outline"
          className="w-full h-12 cursor-pointer subtitleText"
        >
          CONTINUE SHOPPING
        </Button>
      </div>
    </div>
  );
}
