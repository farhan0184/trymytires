'use client'
import { fetchPageData } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { columnFormatter } from "@/app/helper/util";
import { useI18n } from "@/app/provider/i18nProvider";
import Button from "@/components/site/common/button";
import Text from "@/components/site/common/text";
import Title from "@/components/site/common/title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const AboutUs = () => {
  const router = useRouter()
  const [data, getData, { loading }] = useFetch(fetchPageData, { slug: "about_us" })
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
    <div className="container mt-8 md:mt-20">
      <div className="">
        <Title
          heading={columnFormatter(data?.content?.title, langCode)}
          className={""}
        />

        <Text
          content={columnFormatter(data?.content?.description1, langCode)}
          className={"mt-5 md:mt-9"}
        />
      </div>

      <div className="mt-8 md:mt-20 ">
        <Title heading={"try my tires Mission"} className={""} />
        <Text
          content={columnFormatter(data?.content?.description2, langCode)}
          className={"mt-5 md:mt-9"}
        />
      </div>
      <div className="mt-8 md:mt-20 text-center ">
        <Link href="/home">
          {" "}
          <Button
            child={"contact us for any Inquiry"}
            className={
              "uppercase bg-secondary primaryText font-bold text-white p-4 text-center rounded-xl cursor-pointer"
            }
            onClick={() => router.push("/contact") }
          />
        </Link>
      </div>

      <div className="mt-8 md:m-20 ">
        <Title heading={"Our Locations"} className={""} />
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-center mt-8 md:mt-11 ">
            {/* Milestone 1  */}
            {data?.content?.locations.map((item, idx) => (
              <div
                key={idx}
                className="md:col-span-2 uppercase primaryText  rounded-lg"
              >
                <h1 className="font-medium mb-3">
                  <span className="primaryText text-text-foreground	 font-bold">
                    Warehouse-{idx + 1}:
                  </span>{" "}
                  {item?.address}
                </h1>
                <div className="w-full h-64 md:h-[570px]">
                  <iframe
                    src={`https://www.google.com/maps?q=${item?.lat},${item?.lang}&hl=es;z=14&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded"
                  />
                </div>
              </div>
            ))}

            {/* Milestone 2 */}
            {/* <div className="md:col-span-2 uppercase primaryText rounded-lg">
              <h1 className="font-medium mb-3">
                <span className="primaryText text-text-foreground	 font-bold">
                  Warehouse-2:
                </span>{" "}
                1120 N first street San Jose, Ca 95112
              </h1>
              <div className="w-full h-64 md:h-[570px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29212.176107365023!2d90.42021447520368!3d23.76441870628774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7f55bd50695%3A0xdfde25902e49a6e1!2z4KaG4KaH4Kah4Ka_4Kav4Ka84Ka-4KayIOCmuOCnjeCmleCngeCmsiDgpoXgp43gpq_gpr7gpqjgp43gpqEg4KaV4Kay4KeH4KacLCDgpqzgpqjgprbgp43gprDgp4Ag4Ka24Ka-4KaW4Ka-!5e0!3m2!1sbn!2sbd!4v1749667528363!5m2!1sbn!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded"
                />
              </div>
            </div> */}

            {/* Milestone 3 */}
            {/* <div className="md:col-span-4 primaryText uppercase  md:mt-10 rounded-lg md:px-12">
              <h1 className="font-medium mb-3 md:text-center">
                <span className="primaryText text-text-foreground	 font-bold">
                  Warehouse-3:
                </span>{" "}
                1120 N first street San Jose, Ca 95112
              </h1>
              <div className="w-full h-64 md:h-[570px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29212.176107365023!2d90.42021447520368!3d23.76441870628774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7f55bd50695%3A0xdfde25902e49a6e1!2z4KaG4KaH4Kah4Ka_4Kav4Ka84Ka-4KayIOCmuOCnjeCmleCngeCmsiDgpoXgp43gpq_gpr7gpqjgp43gpqEg4KaV4Kay4KeH4KacLCDgpqzgpqjgprbgp43gprDgp4Ag4Ka24Ka-4KaW4Ka-!5e0!3m2!1sbn!2sbd!4v1749667528363!5m2!1sbn!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
