'use client'
import { columnFormatter } from '@/app/helper/util';
import { useI18n } from '@/app/provider/i18nProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'

const renderStars = (rating) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${star <= Math.floor(rating)
          ? 'fill-yellow-400 text-yellow-400'
          : star - 0.5 <= rating
            ? 'fill-yellow-400/50 text-yellow-400'
            : 'text-gray-300'
          }`}
      />
    ))}
    <span className="text-sm text-gray-600 ml-1">({rating})</span>
  </div>
);

export default function Product({ data }) {
  const router = useRouter()
  const { t, langCode } = useI18n()
  return (
    <Card className="w-full lg:mx-0 shadow-lg border-2 gap-2 border-[#C6C6C6] rounded-lg" >
      <CardHeader className="text-center px-3 pt-3 pb-0">
        <div className="w-full h-auto mx-auto border-gray-200 cursor-pointer" onClick={() => router.push(`/products/${data._id}`)}>
          {data?.brand?.image ? <Image
            src={data?.brand?.image}
            alt={data?.name || "Product Image"}
            width={200}
            height={400}
            className="mx-auto h-[50px] w-[60%] px-1"
          /> : <div className="mx-auto h-[50px] w-full px-1 bg-white">

          </div>}
          <Image
            src={
              data?.thumbnail_image?.trim()
                ? data.thumbnail_image
                : "https://via.placeholder.com/150"
            }
            alt={data?.name || "Product Image"}
            width={500}
            height={500}
            className="mx-auto h-[280px] w-full px-1"
          />
        </div>
      </CardHeader>
      <CardContent className="text-center p-3 border-t-2 border-gray-200">
        <CardTitle className="primaryText font-bold text-gray-900">
          {data?.name?.length > 20
            ? `${data?.name?.substring(0, 20)}...`
            : data?.name}
        </CardTitle>
        <div className="text-gray-600 invoiceText  border-b-2  border-gray-200 h-14 flex items-center justify-center"
          dangerouslySetInnerHTML={{
            __html: columnFormatter(data?.description, langCode, 80)
          }}
        >


        </div>
        <Button
          className="bg-text-foreground invoiceText cursor-pointer hover:bg-text-foreground/80 text-white w-1/3 h-12  my-5"
          onClick={() => router.push(`/products/${data?._id}`)}
        >
          See Details{" "}
        </Button>
      </CardContent>
    </Card>
  );
}
