// components/ProductListSkeleton.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";

function ProductCardSkeleton() {
  return (
    <Card className="w-full animate-pulse">
      <CardContent className="p-4 space-y-4">
        <div className="w-full h-40 bg-gray-200 rounded-lg" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-8 w-20 bg-gray-300 rounded-full" />
      </CardContent>
    </Card>
  );
}

export default function ProductListSkeleton() {
  return (
    <div className="px-4 lg:px-0 animate-pulse">
      {/* Title */}
      <div className="h-8 w-48 bg-gray-300 rounded mx-auto mb-14" />

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="relative lg:w-[400px] w-full">
          <div className="h-12 w-full bg-gray-200 rounded" />
        </div>
      </div>

      {/* Vehicle Filter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-10 bg-gray-200 rounded" />
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <div className="h-10 w-10 bg-gray-200 rounded" />
        <div className="h-10 w-10 bg-gray-200 rounded" />
        <div className="h-10 w-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
