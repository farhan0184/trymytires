'use client'
import { fetchPageData } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { columnFormatter } from "@/app/helper/util";
import { useI18n } from "@/app/provider/i18nProvider";
import Button from "@/components/site/common/button";
import Text from "@/components/site/common/text";
import Title from "@/components/site/common/title";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Program() {
  const [data, getData, { loading }] = useFetch(fetchPageData, { slug: "program" })
  const { langCode } = useI18n()
  if(!data && loading){
    return ( <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <Skeleton className="h-10 w-2/3 mb-4" />

      {/* Paragraph Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Image & Text Section Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Image/Card Skeleton */}
        <Card className="w-full lg:w-1/3 h-48">
          <CardContent>
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>

        {/* Text & Button Skeleton */}
        <div className="flex-1 space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </div>)
  }
  return (
    <div className="">
      <div className="lg:container mx-auto md:mt-8 lg:mt-12">
        <div className="w-full h-44 md:h-80 relative">
          {<Image
            src={data?.content?.banner}
            alt="Programs Image"
            fill
            className="object-fill lg:object-cover"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
            sizes="(max-width: 768px) 100vw, 1000px"
          />}
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-0 ">
        <div className="mt-9 md:mt-20">
          <Title heading={columnFormatter(data?.content?.title,langCode)} className={""} />

          <Text
            content={columnFormatter(data?.content?.description1,langCode)}
            className={"md:mt-6 text-justify md:text-left p-6 md:p-0"}
          />
        </div>

        <div className="mt-4 md:my-14 lg:my-20 ">
          <div className="flex flex-col md:flex-row justify-between gap-8 lg:gap-20">
            {/* Image Container - 30% width on desktop */}
            <div className="w-full md:w-[40%] md:flex-shrink-0 px-6 md:px-0">
              <Image
                src={data?.content?.image}
                alt="Programs Image"
                width={1000}
                height={1000}
                className="w-full h-32 md:h-60" // Reduced height
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>

            {/* Text Container - 70% width on desktop */}
            <div className="w-full md:w-[60%] p-6 md:p-0 ">
              <Text
                content={columnFormatter(data?.content?.description2,langCode)}
                className="text-justify md:text-left"
              />

              <Link href="/">
                {" "}
                <Button
                  child={"See Details"}
                  className={
                    "uppercase bg-secondary hover:bg-secondary/80 transition-all duration-300 ease-in-out primaryText font-bold text-white px-6 py-1 text-center rounded-xl cursor-pointer mt-3"
                  }
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
