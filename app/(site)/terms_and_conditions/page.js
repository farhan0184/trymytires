'use client'
import { fetchPageData } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { columnFormatter } from "@/app/helper/util";
import { useI18n } from "@/app/provider/i18nProvider";
import Text from "@/components/site/common/text";
import Title from "@/components/site/common/title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TermsAndConditions = () => {
  const [data, getData, { loading }] = useFetch(fetchPageData, { slug: "term_and_condition" })
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
        <div
        className={`primaryText italic font-medium uppercase leading-[1.7] my-5 md:my-9`}
          dangerouslySetInnerHTML={{
            __html: columnFormatter(data?.content?.description, langCode)}}
        >

        </div>

      {/* <Text
          content={columnFormatter(data?.content?.description, langCode)}
          className={"mt-5 md:mt-9"}
        /> */}
    </div>
    </div >
  );
};

export default TermsAndConditions;
