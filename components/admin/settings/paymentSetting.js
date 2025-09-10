"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MultipleImageInput from "@/components/commons/multipleImageInput";
import toast from "react-hot-toast";
import { updateAdminSettings, postSingleImage } from "@/app/helper/backend";

export default function PaymentSettings({ settings }) {
  const [form, setForm] = useState({
    stripe: {
      credentials: {
        stripe_publishable_key:
          settings.stripe?.credentials?.stripe_publishable_key || "",
        stripe_secret_key: settings.stripe?.credentials?.stripe_secret_key || "",
        stripe_webhook_secret:
          settings.stripe?.credentials?.stripe_webhook_secret || "",
      },
      is_active: settings.stripe?.is_active || false,
      logo: settings.stripe?.logo || '',
      name: settings.stripe?.name || "Stripe",
    },
    paypal: {
      credentials: {
        paypal_client_id:
          settings.paypal?.credentials?.paypal_client_id || "",
        paypal_secret_key:
          settings.paypal?.credentials?.paypal_secret_key || "",
        paypal_base_url:
          settings.paypal?.credentials?.paypal_base_url || "",
      },
      is_active: settings.paypal?.is_active || false,
      logo: settings.paypal?.logo || '',
      name: settings.paypal?.name || "PayPal",
    },
  });

  // helper: safely update nested field
  const updateForm = (path, value) => {
    setForm((prev) => {
      const newForm = { ...prev };
      const keys = path.split(".");
      let obj = newForm;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newForm;
    });
  };

  const normalizeFile = (file) => {
    if (!file) return null;
    if (typeof file === "string") return { url: file };
    return file;
  };

  const handleSubmit = async () => {
    try {


      let payload = { ...form };

      // Stripe Logo upload
      if (
        payload.stripe.logo &&
        payload.stripe.logo instanceof File
      ) {
        const res = await postSingleImage({ image: payload.stripe.logo.originFileObj });

        payload.stripe.logo = res?.data?.image;
      }

      // PayPal Logo upload
      if (
        payload.paypal.logo &&
        typeof payload.paypal.logo instanceof File 
      ) {
        const res = await postSingleImage({ image: payload.paypal.logo[0].originFileObj });
        payload.paypal.logo = res?.data?.image;
      }

      // 👇 stringify nested settings
      const finalPayload = {
        stripe: {
          ...payload.stripe,
          logo: JSON.stringify(payload.stripe.logo)
        },
        paypal: {
          ...payload.paypal,
          logo: JSON.stringify(payload.paypal.logo)
        },
      };



      const res = await updateAdminSettings(finalPayload);

      if (res.success) {
        toast.success(res.message || "Payment settings updated!");
      } else {
        toast.error(res.errorMessage || "Failed to update payment settings");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };


  return (
    <div className="border p-4 rounded space-y-6">
      {/* Stripe */}
      <h2 className=" font-bold mb-2 subtitleText">Stripe Settings</h2>

      {/* <MultipleImageInput
        label="Stripe Logo"
        value={form.stripe.logo ? [normalizeFile(form.stripe.logo)] : []}
        onChange={(val) => updateForm("stripe.logo", val || null)}
        max={1}
      /> */}

      <Input
        placeholder="Publishable Key"
        className={'subtitleText h-10'}
        value={form.stripe.credentials.stripe_publishable_key}
        onChange={(e) =>
          updateForm("stripe.credentials.stripe_publishable_key", e.target.value)
        }
      />
      <Input
      className={'subtitleText h-10'}
        placeholder="Secret Key"
        value={form.stripe.credentials.stripe_secret_key}
        onChange={(e) =>
          updateForm("stripe.credentials.stripe_secret_key", e.target.value)
        }
      />
      <Input
      className={'subtitleText h-10'}
        placeholder="Webhook Secret"
        value={form.stripe.credentials.stripe_webhook_secret}
        onChange={(e) =>
          updateForm("stripe.credentials.stripe_webhook_secret", e.target.value)
        }
      />

      <hr className="my-4" />

      {/* PayPal */}
      <h2 className=" font-bold mb-2 subtitleText">PayPal Settings</h2>

      {/* <MultipleImageInput
        label="PayPal Logo"
        value={form.paypal.logo ? [normalizeFile(form.paypal.logo)] : []}
        onChange={(val) => updateForm("paypal.logo", val || null)}
        max={1}
      /> */}

      <Input
      className={'subtitleText h-10'}
        placeholder="Client ID"
        value={form.paypal.credentials.paypal_client_id}
        onChange={(e) =>
          updateForm("paypal.credentials.paypal_client_id", e.target.value)
        }
      />
      <Input
      className={'subtitleText h-10'}
        placeholder="Secret Key"
        value={form.paypal.credentials.paypal_secret_key}
        onChange={(e) =>
          updateForm("paypal.credentials.paypal_secret_key", e.target.value)
        }
      />
      <Input
      className={'subtitleText h-10'}
        placeholder="Base URL"
        value={form.paypal.credentials.paypal_base_url}
        onChange={(e) =>
          updateForm("paypal.credentials.paypal_base_url", e.target.value)
        }
      />

      {/* Submit Button */}
      <Button className="mt-4 subtitleText h-10" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
}
