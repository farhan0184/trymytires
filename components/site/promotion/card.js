'use client'
import { columnFormatter } from '@/app/helper/util';
import { useI18n } from '@/app/provider/i18nProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'


export default function PromotionCard({ item, router }) {
  const { t, langCode } = useI18n()
  return (
    <Card className="w-full mx-auto overflow-hidden">
      <CardContent className="p-0 border-l-8 border-secondary">
        <div className="flex flex-row items-center m-3 md:m-8 gap-5">
          <div className="relative">
            <div className="relative w-[150px] md:w-[200px] h-[150px] md:h-[200px] bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
              <Image
                src={item?.thumbnail_image || "/placeholder.svg"}
                alt={item?.name || ""}
                fill
                className="object-contain p-2" // keeps full image visible without crop
                loading="lazy"
              />
            </div>
            <div className="absolute top-2 right-7">
              <div className="relative">
                <Image
                  src="/discount_cart.png"
                  width={1000}
                  height={1000}
                  alt={item?.name || ""}
                  className="w-[40px] md:w-[60px] h-[40px] md:h-[50px] object-cover"
                  loading="lazy"
                />
                <div className="absolute  top-4 md:top-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center ">
                  <p className=" md:text-lg font-bold italic">
                    {item.discount_type === "flat" && "$"}
                    {item.discount_value} {item.discount_type !== "flat" && "%"}
                  </p>
                  <p className="text-[8px] md:text-[10px] -mt-1 md:-mt-2 uppercase">
                    {t("Discount")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1 md:space-y-2 z-40">
            <h1 className="text-[#212D65] uppercase primaryText font-bold italic line-clamp-1">
              {item?.name}
            </h1>
            <p
              className="uppercase italic max-w-[260px] text-xs md:text-base"
              dangerouslySetInnerHTML={{
                __html: columnFormatter(item?.description, langCode, 50),
              }}
            >
            </p>
            <p className="uppercase italic text-xs text-[#212D65]">
              <span>{t("Sale ends on")}</span>
              {/* {item?.days} {item?.discountedDate} */}
            </p>

            <Button
              onClick={() => {
                router.push(`/products/${item?._id}`);
              }}
              className={
                "bg-secondary hover: text-white uppercase rounded-md tracking-widest px-3 md:px-5 py-1 md:py-2 italic hover:bg-secondary/80 transition-all duration-300 ease-in-out text-xs md:text-sm cursor-pointer font-bold z-50 "
              }
            >
              {t("Show Items")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
