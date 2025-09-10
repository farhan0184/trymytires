'use client'
import Text from "@/components/site/common/text";
import Title from "@/components/site/common/title";
import CustomForm from "@/components/commons/CustomForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { FiPhoneCall } from "react-icons/fi";
import { IoMailOpenOutline } from "react-icons/io5";
import { fetchPageData } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useI18n } from "@/app/provider/i18nProvider";
import { columnFormatter } from "@/app/helper/util";
import { Skeleton } from "@/components/ui/skeleton";

export default function Contact() {
  const [data, getData, { loading }] = useFetch(fetchPageData, { slug: "contact_us" })
  const { langCode } = useI18n()
  const fields = [
    {
      name: "name",
      placeholder: "Name*",
      variant: "input",
      type: "text",
      className:
        "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic",
    },
    {
      name: "email",
      placeholder: "Email*",
      type: "email",
      variant: "input",
      className:
        "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic",
    },
    {
      name: "subject",
      placeholder: "subject*",
      variant: "input",
      type: "text",
      className:
        "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic",
    },
    {
      name: "message",
      placeholder: "Write here how we can help you...",
      type: "text",
      variant: "textarea",
      className:
        "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic !h-32",
    },
  ];
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
    <div>
      <div className="container my-9  md:mt-14 lg:mt-16 lg:mb-9 md:mb-5">
        <div>
          <Title heading={columnFormatter(data?.content?.title,langCode)} className={""} />
          <Text
            content={columnFormatter(data?.content?.description1,langCode)}
            className={"text-justify md:text-left p-6 md:p-0 mt-6 md:mt-10"}
          />
        </div>

        <div className="lg:w-[80%] w-[90%] p-0 border-2 border-primary-foreground mx-auto rounded-xl shadow-2xl my-10 lg:my-28">
          <div className="flex md:flex-row">
            <div className="p-6 md:p-20 w-full flex-1">
              <Card className="border-none !important shadow-none !important">
                <CardHeader className={"p-0 !important"}>
                  <div className="">
                    <h2 className="text-5xl font-bold mb-4">{columnFormatter(data?.content?.title,langCode)}</h2>
                    <p className="uppercase max-w-[430px] text-lg font-bold italic leading-[2]">
                      {columnFormatter(data?.content?.description2,langCode)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <CustomForm
                    formSchema={"contact"}
                    fields={fields}
                    btnCls={
                      "w-full inputFieldHeight primaryText btnGradient text-white cursor-pointer rounded-2xl font-bold"
                    }
                    btnTitle={"Send"}
                  />
                </CardContent>
                <div>
                  <p
                    className="subtitleText text-primary-foreground uppercase font-semibold italic tracking-wider text-center lg:text-left
"
                  >
                    Customer support Available 24/7
                  </p>
                  <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 mt-2 md:mt-4 md:items-center">
                    <div className="flex flex-col text-center lg:text-left lg:flex-row gap-2 lg:gap-8  mt-4 items-center">
                      <div className="">
                        <FiPhoneCall className="text-2xl md:text-5xl" />
                      </div>
                      <div className="mt-1 lg:mt-0">
                        <p className="subtitleText font-bold uppercase">
                          Phone
                        </p>
                        <p className="subtitleText text-primary-foreground line-clamp-1">
                          {data?.content?.site_phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col text-center lg:text-left lg:flex-row gap-2 lg:gap-8  mt-4 items-center">
                      <div>
                        <IoMailOpenOutline className="text-2xl md:text-6xl" />
                      </div>
                      <div className="mt-1 lg:mt-0">
                        <p className="subtitleText font-bold uppercase">
                          Email
                        </p>
                        <p className="subtitleText text-primary-foreground">
                          {data?.content?.site_email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="hidden lg:block flex-1 relative">
              <div className="w-2/3 absolute right-0 bg-gradient-to-t from-[#EA500E] to-white p-2 rounded-r-xl h-full">
                <Image
                  src="/logo_b.png"
                  alt="Programs Image"
                  width={1000}
                  height={1000}
                  className="mt-10 md:mt-24 w-64 mx-auto"
                  loading="lazy"
                  sizes=""
                />
              </div>

              <div className="absolute -bottom-0 right-0">
                <Image
                  src="/contact_tire.png"
                  alt="Programs Image"
                  width={1000}
                  height={1000}
                  className="rounded-xl w-4xl h-full object-cover"
                  loading="lazy"
                  sizes=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Image
          src="/suitabletire.png"
          alt="Programs Image"
          width={1000}
          height={1000}
          className="w-full h-1/2 object-fill"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 1000px"
        />
      </div>
    </div>
  );
}
