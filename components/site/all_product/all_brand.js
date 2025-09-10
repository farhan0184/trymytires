'use client'
import { productBrandAll } from '@/app/helper/backend'
import { useFetch } from '@/app/helper/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import React from 'react'

export default function ALLBrands() {
  const [brand, getBrand, { loading: brandLoading }] = useFetch(productBrandAll);

  const skeletonItems = new Array(10).fill(null); // Show 10 skeleton cards

  return (
    <div className="bg-[#EEEEEE] p-5 grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5">
      {brandLoading
        ? skeletonItems.map((_, idx) => (
            <div
              key={idx}
              className="w-full bg-white h-[120px] flex items-center justify-center"
            >
              <Skeleton className="w-full h-full" />
            </div>
          ))
        : brand.map((item, idx) => (
            <div
              key={idx}
              className="w-full bg-white h-[120px] flex items-center"
            >
              <Image
                src={item.image}
                alt="image"
                width={400}
                height={100}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
    </div>
  );
}
