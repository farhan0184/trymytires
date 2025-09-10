"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomInput from "./Input";
import { contactSchema, forgetPasswordSchema, loginSchema, resetPasswordSchema, signupSchema, updatePasswordSchema } from "@/app/helper/zodSchema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OTPModel from "./otpModel";
import { toast } from "sonner";
import { handleApiRequest, handleLoginSubmit, handleOtpSend, handleResetPassword, handleUpdatePassword } from "@/app/helper/formfunction";
import { contactForm } from "@/app/helper/backend";

const schemas = {
  signin: loginSchema,
  signup: signupSchema,
  forget_password: forgetPasswordSchema,
  reset_password: resetPasswordSchema,
  update_password: updatePasswordSchema,
  contact: contactSchema
  // Add more schemas as needed
};

export default function CustomForm({
  formSchema,
  fields = [],
  btnCls = "",
  btnTitle = "Submit",
  labelCls = ""
}) {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const [otpModel, setOtpModel] = useState(false);
  const [data, setData] = useState({});
  // const { getUser, user, userLoading } = useUser();

  const schema = schemas[formSchema];
  if (!schema) {
    throw new Error(`Schema "${formSchema}" not found`);
  }


  // Dynamically generate default values from field names
  const defaultValues = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? "";
    return acc;
  }, {});

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (formData) => {

    try {
      switch (formSchema) {
        case "signin":
          await handleLoginSubmit(formData, setLoading, navigate);
          break;

        case "signup":
          await handleOtpSend(formData, setOtpModel, setLoading, setData, formSchema);
          break;

        case "forget_password":
          await handleOtpSend(formData, setOtpModel, setLoading, setData, formSchema);
          break;

        case "reset_password":
          await handleResetPassword(formData, setLoading, navigate);
          break;

        case "update_password":
          await handleUpdatePassword(formData, setLoading, navigate);
          break;
        case "contact":
          await handleApiRequest({
            apiFunc: contactForm,
            payload: formData,
            setLoading: setLoading,
            onSuccess: () => {
              form.reset();
            },
          });
          break;

        default:

          toast.error(`Unknown form schema: ${formSchema}`)
          break;
      }
    } catch (error) {
     
      toast.error(error.message || "An error occurred while submitting the form.");
    }
  };


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-6">
            {fields.map((field) => (
              <CustomInput
                key={field.name}
                form={form}
                name={field.name}
                title={field.title}
                placeholder={field.placeholder}
                className={field.className}
                type={field.type}
                variant={field.variant}
                options={field.options}
                rows={field.rows}
                labelCls={labelCls}
              />
            ))}

            {formSchema === "signin" && (
              <div className="text-end">
                <Link
                  href="/forgot-password"
                  className="text-blue-500 primaryText"
                >
                  ForgetPassword?
                </Link>
              </div>
            )}
          </div>
          <Button type="submit" className={btnCls} disabled={loading}>
            {loading ? "Loading..." : btnTitle}
          </Button>
        </form>
      </Form>

      {otpModel && data && (
        <OTPModel isOpen={otpModel} setIsOpen={setOtpModel} data={data} navigate={navigate} action={formSchema} />
      )}
    </>
  );
}
