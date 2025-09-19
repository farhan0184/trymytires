"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Minus,
  Plus,
  ShoppingCart,
  CreditCard,
  Truck,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { addtoCart, fetchProducts, fetchSingleProducts } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useUser } from "@/app/context/user";
import toast from "react-hot-toast";
import { useSite } from "@/app/context/site";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/app/provider/i18nProvider";
import { columnFormatter } from "@/app/helper/util";



export default function TireProductSection() {
  const params = useParams();
  const router = useRouter()
  const { t, langCode } = useI18n()
  const id = params.id;
  const [data, getData, { loading }] = useFetch(fetchProducts, {
    _id: id,
  })

  const { user, userLoading, getUser } = useUser();
  const { getcartdata } = useSite();
  const [quantity, setQuantity] = useState(1);

  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (data?.thumbnail_image && data?.images) {
      const imgs = [data.thumbnail_image, ...data.images].filter(Boolean); // remove empty strings
      setImages(imgs);
      setSelectedImage(imgs[0] || null);
    }
  }, [data]);



  if ((loading || userLoading) && !data && images.length === 0) {
    return (<div className="container mx-auto my-20 animate-pulse">
      <div className="flex lg:flex-row flex-col xl:gap-0 gap-10">
        {/* Left: Product Images */}
        <div className="lg:w-1/2 sm:w-[80%] w-[90%] mx-auto">
          <Skeleton className="w-full h-[500px] rounded mb-6" />
          <div className="flex gap-5 justify-center">
            <Skeleton className="w-1/3 h-[130px] rounded" />
            <Skeleton className="w-1/3 h-[130px] rounded" />
            <Skeleton className="w-1/3 h-[130px] rounded" />
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="lg:w-1/2 sm:w-[80%] w-[90%] mx-auto space-y-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-12 w-[157px]" />
          <Skeleton className="h-12 w-[157px]" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>

      {/* Specs */}
      <div className="mt-10 lg:w-full sm:w-[80%] w-[90%] mx-auto">
        <Skeleton className="h-6 w-40 mb-2" />
        <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-x-10 mt-2">
          {Array(5).fill().map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      </div>
    </div>);
  }

  const handleQuantityChange = (increment) => {
    setQuantity(Math.max(1, quantity + increment));
  };



  return (
    <div className="container mx-auto my-20">
      <div className="flex lg:flex-row flex-col xl:gap-0 gap-10">
        {/* Product Images */}
        <div className="lg:w-1/2 sm:w-[80%] w-[90%] mx-auto">
          <div className="xl:w-[80%] w-full  ">
            <div className="w-auto sm:h-[400px] lg:h-[500px] h-[300px] rounded-sm bg-white border  mb-6 flex  sm:items-center  justify-center ">
              <div className="lg:w-[70%] w-[50%] h-[70%] lg:-mt-20  mt-10 ">
                {selectedImage ? (
                  <Image
                    width={1000}
                    height={1000}
                    src={selectedImage}
                    alt={data?.name || "Product image"}
                    className=""
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjZGNkY2Ii8+Cjwvc3ZnPgo="
                  />
                ) : (
                  <div className="w-full h-full bg-[#F6F6F6] flex items-center justify-center rounded">
                    <span className="text-gray-500">{t("No image available")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-5 justify-center">
              {data?.images && data?.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`w-1/4 xl:h-[150px] sm:h-[130px] h-[100px] p-3 rounded bg-[#F6F6F6] overflow-hidden transition-all ${selectedImage === image ? "border border-gray-500" : ""
                    }`}
                >
                  {image ? (
                    <Image
                      width={100}
                      height={100}
                      src={image}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full "
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjZGNkY2Ii8+Cjwvc3ZnPgo="
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-gray-400 text-sm">{t("No image")}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 sm:w-[80%] w-[90%] mx-auto space-y-6">
          <div>
            <h1 className="secondaryText1  text-gray-900 mb-3">
              {data?.name}
            </h1>
            <div className="flex gap-10 subtitleText">
              <p>
                <span className="font-semibold">{t("Size:")}</span>{" "}
                <span>{data?.size}</span>
              </p>
              <p>
                <span className="font-semibold">{t("Item:")}</span>{" "}
                <span>{data?.item}</span>
              </p>
            </div>
          </div>
          <hr className="border-[#9A9A9A] mb-0" />
          <div className="subtitleText text-[#191919] mb-0 py-8 ">
            <h4 className="font-semibold">{t("Availability:")}</h4>
            <p>{t("If ordered by today Delivery by: 24 hours - 3 days (Maximum)")}</p>
          </div>
          <hr className="border-[#9A9A9A] mt-0" />
          {/* Pricing */}

          <div className="text-[#191919] py-4">
            <h4 className="font-semibold subtitleText">{t("Pricing Information:")}</h4>
            <div className="flex gap-2 items-end">
              <h2 className="secondaryText1">
                ${data?.discount_price === 0 ? data?.price : data?.discount_price}
              </h2>

              {/* Show original price with line-through only if there's a discount */}
              {data?.discount_value !== 0 && (
                <p className="line-through primaryText text-[#D9D9D9]">
                  ${data?.price}
                </p>
              )}
            </div>

          </div>

          {/* Quantity Selector */}
          <div className=" mb-6">
            <div className="flex items-center border rounded w-[157px] justify-between h-[45px]">
              <Button
                variant="ghost"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className={"border-r rounded-none h-[45px]"}
              >
                <Minus className="size-5" />
              </Button>
              <span className=" tertiaryText">{quantity}</span>
              <Button
                variant="ghost"
                onClick={() => handleQuantityChange(1)}
                className={"border-l rounded-none h-[45px]"}
              >
                <Plus className="size-5" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 ">
            <Button
              onClick={async () => {
                if (!user) {
                  router.push('/sign-in')
                  retutn;
                }
                const cart = {
                  product: id,
                  quantity: quantity
                }
                const { success, message: msg, data, errorMessage } = await addtoCart(cart);
                if (success) {
                  toast.success(msg)
                  await getcartdata()
                  router.push('/cart')
                }
              }}
              variant="outline"
              className=" lg:w-[157px] w-1/2 h-[45px] tertiaryText cursor-pointer border-[#E73C17] text-[#E73C17] rounded-none"
            >
              Add to Cart
            </Button>
            <Button onClick={async () => {
              if (!user) {
                router.push('/sign-in')
                retutn;
              }
              const cart = {
                product: id,
                quantity: quantity
              }
              const { success, message: msg, data, errorMessage } = await addtoCart(cart);
              if (success) {
                toast.success(msg)
                await getcartdata()
                router.push('/order')
              }
            }} className=" lg:w-[157px] w-1/2 gap-2 tertiaryText bg-[#E73C17] hover:bg-[#E73C17]/80 cursor-pointer text-white h-[45px] rounded-none">
              {t("Buy Now")}
            </Button>
          </div>

          {/* Description */}
          <div className="subtitleText lg:mt-14 mt-7">
            <p className="flex items-center gap-2  font-semibold">
              {t("Description")}
            </p>

            <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{
               __html: columnFormatter(data?.description, langCode)}}>
            </p>
          </div>
        </div>
      </div>
      {/* Specifications */}
      <div className="mt-10 lg:w-full sm:w-[80%] w-[90%] mx-auto">
        <h3 className="primaryText font-semibold font-[#191919] pb-2">
          {t("Specifications")}
        </h3>
        <hr className="border-[#9A9A9A]" />
        <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-x-10 mt-2 tertiaryText text-[#191919]">
          {data?.specifications?.map((spec, index) => {
            // Skip Mileage Warranty if 0
            if (spec.key === "Mileage Warranty" && (spec.value === "0" || spec.value === 0)) {
              return null;
            }

            // If spec is Bolt Circle 1 or Bolt Circle 2 → format with Lugs
            if (spec.key === "Bolt Circle 1" || spec.key === "Bolt Circle 2") {
              const lugsSpec = data?.specifications?.find(s => s.key === "Lug" || s.key === "Lugs");
              return (
                <div key={index} className="flex gap-1 items-center py-2">
                  <p className="font-semibold">Lugs/{spec.key}:</p>
                  <p>
                    {lugsSpec ? `${lugsSpec.value}X${spec.value}` : spec.value}
                  </p>
                </div>
              );
            }

            // Default render
            return (
              <div key={index} className="flex gap-1 items-center py-2">
                <p className="font-semibold">{spec.key}:</p>
                <p>
                  {spec.value} {spec.key === "Mileage Warranty" && "K"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}