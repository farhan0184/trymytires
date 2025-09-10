"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function HomepageSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      {/* Hero Section */}
      <div className="w-full relative h-[300px] lg:h-[400px] bg-gray-100 rounded-2xl overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-4 right-4 w-[200px] h-[250px]">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      </div>

      {/* Product Discount Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <Skeleton className="w-32 h-32 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="flex flex-col lg:flex-row gap-3 p-4 border rounded-xl">
        {["Year", "Make", "Model", "Trim"].map((item, i) => (
          <Skeleton key={i} className="h-10 flex-1 rounded-lg" />
        ))}
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>

      {/* About Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="w-full h-[200px] rounded-xl" />
      </div>

      {/* Why Try My Tires Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center gap-4 p-6 border rounded-xl"
          >
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
