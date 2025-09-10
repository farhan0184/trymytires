'use client'
import { fetchPageData } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { columnFormatter } from "@/app/helper/util";
import { useI18n } from "@/app/provider/i18nProvider";
import Header from "@/components/commons/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


const data = [
  {
    title: "No credit needed",
    subTitle: "Need solutions that think outside the box and your credit score - to determine your creditworthiness? Snap can help.",
    image: "/1.png"
  },
  {
    title: "So quick, so easy",
    subTitle: "Apply in minutes, get a decision in seconds. Approvals from $300 to $5,000.",
    image: "/2.png"
  },
  {
    title: "More shopping power",
    subTitle: "Shop now, pay later for tires and rims, furniture, mattresses, appliances, electronics, and more.",
    image: "/3.png"
  },
  {
    title: "Multiple solutions",
    subTitle: "Get it now with lease-to-own financing, an installment loan, or a retail installment contract (RIC).",
    image: "/4.png"
  }
]

export default function FinancePage() {
  const [data, getData, { loading }] = useFetch(fetchPageData, { slug: "finance" })
  const { langCode } = useI18n()


  if (!data && loading) {
    return (
      <div className="w-full flex justify-center py-8">
        <Card className="w-full max-w-3xl border rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">
                <Skeleton className="h-5 w-32" />
              </CardTitle>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-2 h-3 w-56" />
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: form skeleton */}
              <div className="p-6 space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
                {/* Subject */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
                {/* Message (textarea) */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-24 w-full rounded-md" />
                </div>

                {/* Submit button */}
                <Skeleton className="h-9 w-28 rounded-md" />

                {/* Support icons/lines */}
                <div className="pt-2 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="space-y-1 w-full">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="space-y-1 w-full">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: brand/visual panel */}
              <div className="relative min-h-[340px] md:min-h-[420px]">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-200 to-orange-500" />
                {/* Logo skeleton */}
                <div className="absolute top-6 right-6">
                  <Skeleton className="h-10 w-24 rounded-md" />
                </div>
                {/* Tire image skeleton */}
                <div className="absolute bottom-0 right-4 left-4">
                  <Skeleton className="h-40 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className=" container mx-auto  py-20 lg:px-0 !px-5">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-10 items-stretch">
        {/* Left Side */}
        <div className="space-y-5 h-full flex flex-col justify-between">
          <div className="w-full">
            <Image
              src={data?.content?.left_image1}
              alt="Picture of the author"
              width={1000}
              height={200}
              className="w-full h-[150px]"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
            />
          </div>

          <div className="w-full">
            <Image
              src={data?.content?.left_image2}
              alt="Picture of the author"
              width={1000}
              height={200}
              className="w-full h-[150px]"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
            />
          </div>

          <div className="space-y-6 w-[80%]">
            <h1 className="secondaryText1 font-bold uppercase">
              {columnFormatter(data?.content?.title, langCode)}
            </h1>
            <p className="primaryText uppercase">
              {columnFormatter(data?.content?.description, langCode)}
            </p>
            <Button className="primaryText font-bold btnGradient text-white h-12 px-5">
              Learn More
            </Button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full h-full">
          <Image
            src={data?.content?.right_image}
            alt="Picture of the author"
            width={500}
            height={500}
            className="w-full h-full object-cover"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
          />
        </div>
      </div>

      <div className="py-24">

        <Header title={columnFormatter(data?.content?.snap?.title, langCode)} subTitle={columnFormatter(data?.content?.snap?.description, langCode)} />
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-6">
          {data?.content?.snap?.list?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col justify-between h-full border rounded-xl bg-white shadow-sm p-5 text-center"
            >
              <div className="text-start mb-2.5">
                {/* Title */}
                <h4 className="subtitleText font-semibold mb-2">{columnFormatter(item?.title, langCode)}</h4>

                {/* Subtitle / Description */}
                <p className="text-sm text-gray-600 mb-4">{columnFormatter(item?.description, langCode)}</p>
              </div>

              {/* Image at bottom */}
              <div className="w-full h-[260px] flex justify-center items-end mt-auto">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={1000}
                  height={560}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
                />
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
}
