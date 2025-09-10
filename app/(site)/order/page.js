"use client";

import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { ArrowBigLeft, ArrowLeft, Check, CreditCard } from "lucide-react";
import { useFetch } from "@/app/helper/hooks";
import { createOrder, fetchPageData, gettoCart, orderPrice, paymentList, publicCoupon } from "@/app/helper/backend";
import CustomInput from "@/components/commons/CustomForm2";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Image from "next/image";
const PaypalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#003087"
  >
    <path d="M20.126 7.096c-.203-2.044-1.947-3.59-4.049-3.59h-6.938l-.45 2.969h6.543c1.178 0 2.031.867 1.921 2.045-.102 1.072-.87 1.912-2.033 1.912h-6.543l-1.302 8.568h3.079l.888-5.849h3.734c2.027 0 3.731-1.513 4.15-3.555.092-.444.12-.902.09-1.355z"></path>
  </svg>
);

// Example: Custom SVG for Stripe
const StripeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#635BFF"
  >
    <path d="M16.5 3.5C14.14 2.18 11.24 2 8.5 2c-2.76 0-5.34.51-7.5 1.5v17c2.16.99 4.74 1.5 7.5 1.5 3.04 0 5.76-.53 8-1.5V3.5zM14 16c-1.33.67-2.66 1-4 1-2.76 0-4.66-1.24-4.5-3h3c0 .83.67 1.5 1.5 1.5 1.09 0 1.5-.72 1.5-1.5 0-2.12-4.5-1.5-4.5-5 0-1.79 1.43-3.5 4-3.5 1.17 0 2.34.33 3.5 1l-1 2c-.83-.5-1.5-.67-2.5-.67-1.09 0-1.5.61-1.5 1.33 0 2.05 4.5 1.33 4.5 5 0 1.44-.84 2.42-2 3z"></path>
  </svg>
);

function isHttpUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// --------------------
// Zod Schema
// --------------------
const formSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().optional(),
  mobile: z.string().min(1, "Required"),
  email: z.string().email().optional(),
  address: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  zip: z.string().min(1, "Required"),
  comment: z.string().optional(),
  payment_type: z.enum(["online", "delivery", "finance", "pickup"]),
  location: z.string().optional(),
  payment_method: z.enum(["stripe", "paypal", "cod"]),
}).superRefine((data, ctx) => {

  if (data.payment_type === "pickup") {
    if (data.payment_method !== "cod") {
      ctx.addIssue({
        path: ["payment_method"],
        code: z.ZodIssueCode.custom,
        message: "Payment method must be 'cod' for pickup.",
      });
    }
    if (!data.location) {
      ctx.addIssue({
        path: ["location"],
        code: z.ZodIssueCode.custom,
        message: "Location is required for pickup.",
      });
    }
  } else {
    if (!data.payment_method || !["paypal", "stripe"].includes(data.payment_method)) {
      ctx.addIssue({
        path: ["payment_method"],
        code: z.ZodIssueCode.custom,
        message: "Invalid payment method. Please choose either 'PayPal' or 'Stripe'.",
      });
    }
  }
});


// --------------------
// Component
// --------------------
export default function CheckoutForm() {
  const [coupon, setCoupon] = useState(false)
  const router = useRouter();




  const [couponCode, setCouponCode] = useState(""); // Input value



  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      address: "",
      state: "",
      city: "",
      zip: "",
      comment: "",
      payment_type: "online",
      location: "",
      payment_method: "",
    },
  });
  const paymentType = useWatch({ control: form.control, name: "payment_type" });

  const [data, getData, { loading, error, message }] = useFetch(orderPrice)
  const [locations, getLocations, { loading: locationLoading }] = useFetch(fetchPageData, { slug: "about_us" })
  const [cartData, getCartData] = useFetch(gettoCart);





  useEffect(() => {
    if (paymentType === "pickup") {
      form.setValue("payment_method", "cod");

    } else {
      form.setValue("payment_method", "");
      // form.setValue("location", "");
    }
  }, [paymentType, form]);



  if (loading && locationLoading) {
    return (<div className="relative lg:h-screen h-auto">
      <div className="absolute w-1/2 h-screen left-0 bg-gray-50 -z-10 lg:block hidden" />
      <div className="absolute w-1/2 h-screen right-0 bg-white -z-10 md:block hidden" />

      <div className="z-50 container mx-auto h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full py-10">

          {/* Left: User Details Skeleton */}
          <div className="space-y-4 lg:mr-10 w-full">
            <Skeleton className="h-6 w-1/2" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Right: Payment & Summary Skeleton */}
          <div className="space-y-4 lg:ml-10 w-full">
            <Skeleton className="h-6 w-1/2" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>

        </div>
      </div>
    </div>)
  }

  async function onSubmit(values) {

    const payload = {
      user_details: {
        first_name: values?.firstName,
        last_name: values?.lastName,
        mobile: values?.mobile,
        email: values?.email,
        address: values?.address,
        state: values?.state,
        city: values?.city,
        zip_code: values?.zip,
        ...(values?.comment.trim() !== "" && { comment: values?.comment }),
      },
      payment_type: values?.payment_type,
      payment_method: values?.payment_method,
      ...(values?.location && values?.payment_type === "pickup" && { shop_location: values?.location }),
      ...(coupon && { coupon: couponCode }),
    };



    const data = await createOrder(payload)

    if (!data.success) {
      toast.error(data.errorMessage);
      return;
    }
    const isUrl = isHttpUrl(data?.data);
    await getCartData()

    if (isUrl) {

      window.location.href = data?.data;
    } else {
      await getCartData()
      window.location.href = `/payment/success?_id=${data.data.order_id}&payment=${values?.payment_type}`;
      toast.success("Order created successfully, redirecting to payment successpage page...");
    }
  }




  return (
    <div className="relative lg:h-screen h-auto  ">
      <div className="absolute  w-1/2 h-screen left-0 top- bg-gray-50 -z-10 lg:block hidden"></div>
      <div className="absolute w-1/2 h-screen right-0 bg-white -z-10 md:block hidden"></div>

      <div className="z-50 container mx-auto  h-full  flex items-center ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 w-full lg:grid-cols-2 gap-10 "
          >
            {/* Left Side: User Details */}
            <Card
              className={
                "bg-transparent border-0 rounded-0 shadow-none lg:mr-10"
              }
            >
              <CardHeader className={'!px-0 lg:pt-0 pt-10'}>
                <div onClick={() => router.back()} className="flex items-center absolute lg:top-10 top-20 cursor-pointer gap-2 secondaryText1 font-bold ">
                  <ArrowLeft size={32} />
                  <h1>Go back</h1>
                </div>
                <CardTitle className={"primaryText font-bold "}>User details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-transparent lg:mt-0 mt-20">
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    form={form}
                    name="firstName"
                    title="First name*"
                    placeholder="Enter your first name"
                    className="h-12 subtitleText"
                    labelCls="subtitleText"
                    isMes={false}
                  />
                  <CustomInput
                    form={form}
                    name="lastName"
                    title="Last name"
                    placeholder="Enter your last name"
                    className="h-12 subtitleText"
                    labelCls="subtitleText"
                    isMes={false}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    form={form}
                    name="mobile"
                    title="Mobile Number *"
                    variant="mobile"
                    placeholder="(123) 456-7890"
                    className="h-12 subtitleText"
                    labelCls="subtitleText"
                    isMes={false}
                  />
                  <CustomInput
                    form={form}
                    name="email"
                    title="Email *"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 subtitleText"
                    labelCls="subtitleText"
                    isMes={false}
                  />
                </div>

                <CustomInput
                  form={form}
                  name="address"
                  title="Address*"
                  placeholder="Enter your address"
                  className="h-12 subtitleText"
                  labelCls="subtitleText"
                  isMes={false}
                />

                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    form={form}
                    name="state"
                    title="State*"
                    placeholder="Enter your state"
                    className="h-12 subtitleText"
                    labelCls="subtitleText"
                    isMes={false}
                  />
                  <CustomInput
                    form={form}
                    name="city"
                    title="City*"
                    placeholder="Enter your city"
                    className="h-12 subtitleText"
                    labelCls="subtitleText"
                    isMes={false}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    form={form}
                    name="zip"
                    title="ZIP code*"
                    placeholder="Enter ZIP code"
                    className="h-12 subtitleText"
                    labelCls="subtitleText"
                    isMes={false}
                  />
                  <CustomInput
                    form={form}
                    name="comment"
                    title="Comment (optional)"
                    placeholder="Any comments"
                    className="h-12 subtitleText"
                    labelCls="subtitleText"
                    isMes={false}
                  />
                </div>
              </CardContent>

            </Card>

            {/* Right Side: Payment & Delivery */}
            <hr className={'lg:hidden block'}/>
            <Card
              className={
                "bg-transparent border-0 rounded-0 shadow-none lg:ml-10 subtitleText"
              }
            >
              <CardContent className="pt-6 space-y-4 lg:mb-0 mb-20">

                <FormField
                  control={form.control}
                  name="payment_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <label
                            htmlFor="r1"
                            className="flex items-center space-x-2 border rounded-md h-12 px-2 cursor-pointer"
                          >
                            <RadioGroupItem value="online" id="r1" />
                            <span>Online Payment</span>
                          </label>

                          <label
                            htmlFor="r2"
                            className="flex items-center space-x-2 border rounded-md h-12 px-2 cursor-pointer"
                          >
                            <RadioGroupItem value="delivery" id="r2" />
                            <span>Delivery</span>
                          </label>

                          <label
                            htmlFor="r3"
                            className="flex items-center space-x-2 border bg-gray-200/30 cursor-not-allowed rounded-md h-12 px-2"
                          >
                            <RadioGroupItem value="finance" id="r3" disabled />
                            <span>Finance</span>
                          </label>

                          <label
                            htmlFor="r4"
                            className="flex items-center space-x-2 border rounded-md h-12 px-2 cursor-pointer"
                          >
                            <RadioGroupItem value="pickup" id="r4" />
                            <span>Pickup at Shop</span>
                          </label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(paymentType === "pickup") && (
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={"subtitleText text-black"}>
                          location
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            {locations?.content?.locations?.map((item, idx) => (<label
                              key={idx}
                              htmlFor={`location-${item.address}`}
                              className="flex items-center space-x-2 border rounded-md h-12 px-2 cursor-pointer"
                            >
                              <RadioGroupItem value={item.address} id={`location-${item.address}`} />
                              <span>{item.address}</span>
                            </label>))}




                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                )}


                {/* Conditionally Render Payment Method */}
                {(paymentType === "online" || paymentType === "delivery") && (
                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <hr />
                        <FormControl className="my-2">
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-3"
                          >
                            {/* Paypal */}
                            <label
                              htmlFor="paypal"
                              className={`flex flex-col items-center justify-center gap-1 rounded-md border w-[120px] h-16 text-xs font-medium cursor-pointer
                ${field.value === "paypal"
                                  ? "border-orange-400  text-orange-600"
                                  : "border-gray-200  text-gray-700 hover:border-gray-300"}
                transition-colors duration-200
              `}
                            >
                              <RadioGroupItem id="paypal" value="paypal" className="sr-only" />
                              <Image src={"/paypal.png"} alt="paypal" width={120} height={100} className="w-[120px] h-full rounded-md" />
                            </label>

                            {/* Stripe */}
                            <label
                              htmlFor="stripe"
                              className={`flex flex-col items-center justify-center gap-1 bg-white rounded-md border w-[120px] h-16 text-xs font-medium cursor-pointer
                ${field.value === "stripe"
                                  ? "border-orange-400  text-orange-600"
                                  : "border-gray-200  text-gray-700 hover:border-gray-300"}
                transition-colors duration-200
              `}
                            >
                              <RadioGroupItem id="stripe" value="stripe" className="sr-only" />
                              <Image src={"/download.png"} alt="paypal" width={120} height={100} className="w-[119px] h-full z-30 rounded-md" />
                            </label>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className={"text-xl"}/>

                        {/* Show courier charge info only for "delivery" */}
                        {paymentType === "delivery" && (
                          <div className="text-muted-foreground pt-2">
                            Courier charge: 10 mile free charge (After 10 mile $1/mile).
                          </div>
                        )}
                        <hr />
                      </FormItem>
                    )}
                  />
                )}

                {/* Price Summary */}
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between pb-2">
                    <h1 className="primaryText font-bold">Total</h1>
                    <div className="flex gap-3">
                      <div className="subtitleText text-right  text-muted-foreground line-through">
                        ${data?.totalDiscountPrice=== data?.totalOriginalPrice && (data?.totalOriginalPrice ?? 0)}
                      </div>
                      <div className="text-right font-bold text-primary primaryText">
                        ${data?.totalDiscountPrice ?? 0}
                      </div>
                    </div>
                  </div>
                  <hr />

                  <div className="flex justify-between items-center py-5">
                    <div onClick={() => setCoupon(!coupon)} className=" text-orange-600 cursor-pointer hover:underline">
                      Have a coupon code?
                    </div>
                    {coupon && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add coupon"
                          className="h-12 subtitleText"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button
                          type="button"
                          className="h-12 w-12 cursor-pointer"
                          onClick={async () => {
                            const data = await publicCoupon({ code: couponCode });
                            if (!data) {
                              toast.error("Invalid coupon code");
                              return;
                            }
                            if (data.data) {
                              getData({ coupon: couponCode });

                              toast.success(data.message);
                            } else {
                              toast.error(data.message);

                            }
                          }}

                        >
                          <Check className="size-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-orange-600 subtitleText h-12 hover:bg-orange-700 text-white cursor-pointer"
                  >
                    Submit order
                  </Button>
                  <p className="tertiaryText text-muted-foreground pt-2 text-center cursor-pointer">
                    By checking out, you agree with our{" "}
                    <span className="underline">Terms of Service</span> and
                    confirm you have read our{" "}
                    <span className="underline">Privacy Policy</span>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
