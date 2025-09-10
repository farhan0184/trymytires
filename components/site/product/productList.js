// components/ProductList.js
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useFetch } from '@/app/helper/hooks';
import { fetchProducts } from '@/app/helper/backend';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Product from './product';
import VehicleFilter from '../searchPage/SearchForm';
import { useVehicle } from '@/app/provider/vehicleProvider';
import { Card, CardContent } from '@/components/ui/card';

// 🔹 Skeleton Loader
function ProductSkeleton() {
  return (
    <Card className="w-full animate-pulse">
      <CardContent className="p-4 space-y-4">
        <div className="w-full h-40 bg-gray-200 rounded-lg" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-6 w-20 bg-gray-300 rounded" />
      </CardContent>
    </Card>
  );
}

export default function ProductList() {
  const search = useSearchParams();
  const searchQuery = search.get('search') || '';
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [data, getData, { loading }] = useFetch(fetchProducts, { search: searchQuery, page });

  const {
    openVehicle,
    setOpenVehicle,
    vehicleFilters,
    handleVehicleFilterChange,
    handleVehicleSearch,
  } = useVehicle();

  useEffect(() => {
    getData({ search: searchQuery, page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, page]);

  const handlePageChange = (newPage) => {
    if (newPage !== data.page && newPage > 0 && newPage <= data.totalPages) {
      setPage(newPage);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchInput.trim()) {
     
      router.push(`/search?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput("");
    }
  };

  return (
    <>
      <h1 className="secondaryText text-text font-bold text-center mb-14">
        {searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}
      </h1>

      {/* Search Input */}
      <div className="flex justify-center">
        <div className="relative lg:w-[400px] w-full mb-10">
          <Input
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search your products"
            className="h-12 pl-3 pr-10 rounded text-black bg-white primaryText lg:placeholder:primaryText placeholder:italic"
          />
          <Search className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
        </div>
      </div>

      {/* Vehicle Filter */}
      {searchQuery !== "accessories" && (
        <VehicleFilter
          openVehicle={openVehicle}
          setOpenVehicle={setOpenVehicle}
          vehicleFilters={vehicleFilters}
          handleVehicleFilterChange={handleVehicleFilterChange}
          handleVehicleSearch={handleVehicleSearch}
          form="product"
        />
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 lg:px-0">
        {loading
          ? Array.from({ length: 10 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))
          : data?.docs?.map((featuredTire, index) => (
              <Product key={index} data={featuredTire} />
            ))}
      </div>

      {/* Pagination */}
      {!loading && data?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {/* Prev Button */}
          <Button
            variant="outline"
            onClick={() => handlePageChange(data.prevPage)}
            disabled={!data.hasPrevPage}
            className="subtitleText"
          >
            &lt;
          </Button>

          {/* Page Numbers */}
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === data.page ? "default" : "outline"}
                className={`cursor-pointer ${
                  pageNum === data.page
                    ? "bg-text-foreground text-white subtitleText"
                    : ""
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            )
          )}

          {/* Next Button */}
          <Button
            variant="outline"
            onClick={() => handlePageChange(data.nextPage)}
            disabled={!data.hasNextPage}
            className="subtitleText"
          >
            &gt;
          </Button>
        </div>
      )}
    </>
  );
}
