"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { addtoCart } from "@/app/helper/backend";
import { useUser } from "@/app/context/user";
import toast from "react-hot-toast";
import { useSite } from "@/app/context/site";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/app/provider/i18nProvider";

export default function SearchProduct({
  data,
  getData,
  loading,
  clear,
  getDataRefinements,
}) {
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { user } = useUser();
  const { getcartdata } = useSite();
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useI18n()

  useEffect(() => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    if (params.page) {
      setCurrentPage(Number(params.page));
    }

    const queryString = searchParams.toString();
    if (queryString) {
      clear();
      getData(params);
      getDataRefinements(params);
    } else {
      clear();
    }
  }, [searchParams.toString()]);

  const handleQuantityChange = (increment) => {
    setQuantity(Math.max(1, quantity + increment));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    router.push(`/search?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-2 border-[#E5E5E5] rounded-lg">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-auto w-[80px] rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-4 w-[40%]" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-[150px] w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      {data?.docs?.length > 0 ? (
        <>
          {data.docs.map((item, index) => (
            <Card key={index} className="border-2 border-[#000000] rounded-lg">
              <CardContent className="p-4">
                {/* --- Product Info Section --- */}
                <div className="flex lg:justify-between items-center gap-3 mb-3">
                  <div className="lg:hidden block w-[80px] h-[80px]">
                    {item?.thumbnail_image && (
                      <Image
                        src={item.thumbnail_image}
                        alt={item.name}
                        width={500}
                        height={500}
                      />
                    )}
                  </div>
                  <div className="flex flex-col lg:gap-3 gap-1">
                    <div className="flex items-center gap-3">
                      <h3 className="primaryText font-semibold cursor-pointer" onClick={() => router.push(`/products/${item._id}`)}>{item.name}</h3>
                      {item?.brand?.image && (
                        <Image
                          
                          src={item?.brand?.image}
                          alt={item?.brand?.name}
                          width={60}
                          height={60}
                          
                        />
                      )}
                    </div>
                    <div className="flex lg:gap-10 gap-5 subtitleText">
                      <p>
                        <span className="font-semibold">Size:</span> {item.size}
                      </p>
                      <p>
                        <span className="font-semibold">Item:</span>{" "}
                        {item?.item || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="subtitleText hidden lg:flex flex-col gap-3">
                    <p className="text-end">Price:</p>
                    <p className="primaryText font-semibold text-end">
                      ${item.discount_price}
                    </p>
                  </div>
                </div>

                <hr className="border-[#9A9A9A]" />

                {/* --- Quantity & Add to Cart --- */}
                <div className="flex justify-between items-center lg:py-4 py-2">
                  <div className="flex items-center gap-3 ">
                    <div className="hidden lg:block w-[130px] h-[100px] cursor-pointer" onClick={() => router.push(`/products/${item._id}`)}>
                      {item?.thumbnail_image && (
                        <Image
                          src={item.thumbnail_image}
                          alt={item.name}
                          width={500}
                          height={500}
                        />
                      )}
                    </div>
                    <div className="subtitleText  pt-10">
                      <h4>{t("If order by 12 pm today delivery will be")}:</h4>
                      <div className="space-y-0 mt-1">
                        <p className="font-semibold leading-tight">
                          {t("Tomorrow by 12 pm")}
                        </p>
                        <p className="text-[12px] lg:text-base leading-tight">
                          {t("Maximum delivery time 2 days")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="xl:flex hidden flex-col gap-3 w-[157px] mt-8">
                    <div className="flex items-center justify-between space-x-2 border w-full rounded-none h-[47px]">
                      <Button
                        variant="ghost"
                        className="flex items-center justify-center border-r h-[47px]"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="size-5" />
                      </Button>
                      <span className="text-center subtitleText text-black">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        onClick={() => handleQuantityChange(1)}
                        className="flex items-center justify-center border-l h-[47px]"
                      >
                        <Plus className="size-5" />
                      </Button>
                    </div>
                    <Button
                      onClick={async () => {
                        if (!user) return router.push("/sign-in");
                        const cart = { product: item._id, quantity };
                        const { success, message: msg } = await addtoCart(cart);
                        if (success) {
                          toast.success(msg);
                          await getcartdata();
                          // router.push('/cart');
                        }
                      }}
                      className="bg-text-foreground text-white hover:bg-text-foreground/80 py-2 px-4 h-[47px] cursor-pointer"
                    >
                      {t("Add to Cart")}
                    </Button>
                  </div>
                </div>
                <hr className="border-[#9A9A9A] xl:hidden block" />

                <div className="flex justify-between items-center my-4">
                  <div className="subtitleText lg:hidden flex flex-col gap-3">
                    <p className="">Price:</p>
                    <p className="primaryText font-semibold text-end">
                      ${item.discount_price}
                    </p>
                  </div>
                  <div className="lg:hidden flex  flex-col gap-3 w-[157px]">
                    <div className="flex items-center justify-between space-x-2 border w-full rounded-none h-[47px]">
                      <Button
                        variant="ghost"
                        className="flex items-center justify-center border-r h-[47px]"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="size-5" />
                      </Button>
                      <span className="text-center subtitleText text-black">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        onClick={() => handleQuantityChange(1)}
                        className="flex items-center justify-center border-l h-[47px]"
                      >
                        <Plus className="size-5" />
                      </Button>
                    </div>
                    <Button
                      onClick={async () => {
                        if (!user) return router.push("/sign-in");
                        const cart = { product: item._id, quantity };
                        const { success, message: msg } = await addtoCart(cart);
                        if (success) {
                          toast.success(msg);
                          await getcartdata();
                          // router.push('/cart');
                        }
                      }}
                      className="bg-text-foreground text-white hover:bg-text-foreground/80 py-2 px-4 h-[47px] cursor-pointer"
                    >
                      {t("Add to Cart")}
                    </Button>
                  </div>
                </div>


                {/* --- Additional Info --- */}
                <div className=" py-3 lg:px-10 px-5 bg-[#F6F6F6] tertiaryText flex flex-wrap sm:justify-normal justify-between lg:gap-10 gap-5">
                  <p>
                    <span className="font-semibold">{t("Brand")}:</span>{" "}
                    {item?.brand?.name || "N/A"}
                  </p>
                  {item?.category?.name === "Tires" && <>

                    <p>
                      <span className="font-semibold">{t("Warranty")}:</span>{" "}
                      {item?.mileage_warrranty || 0}
                    </p>
                    <p>
                      <span className="font-semibold">{t("Sidewall")}:</span>{" "}
                      {item?.sidewall?.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">UTQG:</span>{" "}
                      {item?.utqg || 0}
                    </p>
                    <p>
                      <span className="font-semibold">{t("Speed")}:</span>{" "}
                      {item?.utqg || 0}
                    </p>
                    <p>
                      <span className="font-semibold">Ply:</span>{" "}
                      {item?.ply || 0}
                    </p>
                  </>}
                  {item.category.name === "Wheels" && <>

                    <p>
                      <span className="font-semibold">{t("Finish")}:</span>{" "}
                      {item?.finish?.name || 0}
                    </p>
                    <p>
                      <span className="font-semibold">{t("Lugs/Bolt Circle 1")}:</span>{" "}
                      {item?.lug || "N/A"}X{item?.bolt_circle1}
                    </p>
                    <p>
                      <span className="font-semibold">{t("Offset")}:</span>{" "}
                      {item?.offset || 0}
                    </p>
                    <p>
                      <span className="font-semibold">{t("Hub Bore")}:</span>{" "}
                      {item?.hub_bore || 0}
                    </p>

                  </>}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* --- Pagination Controls --- */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {/* Prev Button */}
            <Button
              variant="outline"
              onClick={() => handlePageChange(data.prevPage)}
              disabled={!data.hasPrevPage}
              className={"subtitleText"}
            >
              &lt;
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === data.page ? "default" : "outline"}
                  className={`cursor-pointer ${page === data.page
                    ? "bg-text-foreground text-white subtitleText"
                    : ""
                    }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              )
            )}

            {/* Next Button */}
            <Button
              variant="outline"
              onClick={() => handlePageChange(data.nextPage)}
              disabled={!data.hasNextPage}
              className={"subtitleText"}
            >
              &gt;
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="bg-muted rounded-full p-6 mb-6">
            <SearchX className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">{t("No Products Found")}</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            {t(" We could not find any products matching your search. Try adjusting your filters or search again.")}
          </p>
        </div>
      )}
    </div>
  );
}
