"use client";

import { ChevronDown, Minus, Plus, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useFetch, useMediaQuery } from "@/app/helper/hooks";
import FilterSection from "@/components/site/searchPage/filter";

import SearchProduct from "@/components/site/searchPage/searchProduct";
import { productSearch, productSearchRefinements } from "@/app/helper/backend";

import Sidebar from "@/components/site/searchPage/sidebar";
import toast from "react-hot-toast";
import { customFetch } from "@/app/helper/api";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useVehicle } from "@/app/provider/vehicleProvider";

export default function SearchPage() {
  let search = useSearchParams().get("search");
  const router = useRouter()

  let { frontWheels } = useVehicle();
  const [vinData, setVinData] = useState(null)
  





  const [dataRefinements, getDataRefinements, { loadingRefinements }] =
    useFetch(productSearchRefinements, {
      search: search,
    });

  const [openFilter, setOpenFilter] = useState(false);
  const [
    productData,
    getproductData,
    { loading: productLoading, clear: productClear },
  ] = useFetch(productSearch, {}, false);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setData((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };




  // console.log("vinData in search page", vinData, search);
  return (
    <div className="container mx-auto lg:my-16 sm:my-10 my-5">
      {search && (
        <div>
          <h1 className="secondaryText1 font-semibold text-black">{`Search Result: "${search ?? ""
            }"`}</h1>
          <span className="primaryText">
            {productData?.docs?.length ?? 0} Results
          </span>
        </div>
      )}

      <div className="lg:hidden block">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              onClick={() => setOpenFilter(!openFilter)}
              className="mt-4 mb-2 bg-white text-black text-base cursor-pointer hover:bg-gray-100 border border-gray-300 flex items-center gap-2 "
            >
              <SlidersHorizontal />
              Filter by:
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className={"subtitleText"}>Edit profile</SheetTitle>
            </SheetHeader>
            <div className="px-5 overflow-y-scroll scrollbar-hide">
              <Sidebar
                dataRefinements={dataRefinements}
                getDataRefinements={getDataRefinements}
                getproductData={getproductData}
                search={"search"}
                setVinData={setVinData}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className={`mt-8 lg:flex xl:gap-20 lg:gap-14 gap-0`}>
        <div
          className={` hidden lg:block  p-4 lg:w-[340px] w-fit lg:min-h-[100vh]  text-sm border-2 border-[#000000] rounded-lg`}
        >
          <Sidebar
            dataRefinements={dataRefinements}
            getDataRefinements={getDataRefinements}
            getproductData={getproductData}
            search={"search"}
            setVinData={setVinData}
          />
        </div>

        {/* ---------------- Right side (Search results) ---------------- */}

        {!search && (frontWheels?.length > 0 || vinData !== null) ? (
          <table className="  border border-gray-300 lg:w-full w-auto h-min subtitleText">
            <thead>
              <tr>
                <th className="border border-gray-300 font-bold px-4 py-2 subtitleText">
                  Front / Rear
                </th>
                <th className="border border-gray-300 font-bold px-4 py-2 subtitleText">
                  OE Tires
                </th>
                <th className="border border-gray-300 font-bold px-4 py-2 subtitleText">
                  OE Wheels
                </th>
              </tr>
            </thead>
            <tbody>
              {vinData && (
                <tr
                 
                  className="hover:bg-gray-50 border-b border-t border-gray-200 subtitleText"
                >
                  <td className="px-6 py-4 whitespace-nowrap border-r  font-semibold text-gray-900 uppercase">
                    FRONT / REAR
                  </td>
                  <td onClick={() => router.push(`/search?search=${vinData.tire}`)} className="px-6 py-4 whitespace-nowrap cursor-pointer hover:text-blue-500  text-gray-900 font-medium text-center">
                    {vinData.tire}
                  </td>
                  <td onClick={() => router.push(`/search?search=${vinData.wheel}`)} className="px-6 py-4 whitespace-nowrap cursor-pointer hover:text-blue-500  text-gray-900 font-medium text-center">
                    {vinData.wheel}
                  </td>
                </tr>
              )}
              {frontWheels && frontWheels.map((wheelSet, setIndex) => {
                if (wheelSet.length === 2) {
                  // Two wheels - show as grouped rows with red border
                  return (
                    <React.Fragment key={setIndex}>
                      {wheelSet.map((wheel, wheelIndex) => (
                        <tr
                          key={`${setIndex}-${wheelIndex}`}
                          className={`hover:bg-gray-50 subtitleText ${wheelIndex === 0
                            ? ""
                            : ""
                            } ${wheelIndex === wheelSet.length - 1
                              ? "border-b border-gray-200"
                              : ""
                            } `}
                        >
                          <td className="px-6 py-4 whitespace-nowrap border-r  font-semibold text-gray-900 uppercase ">
                            {wheel.position}
                          </td>
                          <td onClick={() => router.push(`/search?search=${wheel.tire}`)} className="px-6 py-4 whitespace-nowrap cursor-pointer hover:text-blue-500  text-gray-900 font-medium text-center">
                            {wheel.tire}
                          </td>
                          <td onClick={() => router.push(`/search?search=${wheel.tire}`)} className="px-6 py-4 whitespace-nowrap cursor-pointer hover:text-blue-500  text-gray-900 font-medium text-center">
                            {wheel.wheel}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                } else {
                  // Single wheel - show as regular row
                  const wheel = wheelSet[0];
                  return (
                    <tr
                      key={setIndex}
                      className="hover:bg-gray-50 border-b border-t border-gray-200 subtitleText"
                    >
                      <td className="px-6 py-4 whitespace-nowrap border-r  font-semibold text-gray-900 uppercase">
                        FRONT / REAR
                      </td>
                      <td onClick={() => router.push(`/search?search=${wheel.tire}`)} className="px-6 py-4 whitespace-nowrap cursor-pointer hover:text-blue-500  text-gray-900 font-medium text-center">
                        {wheel.tire}
                      </td>
                      <td onClick={() => router.push(`/search?search=${wheel.wheel}`)} className="px-6 py-4 whitespace-nowrap cursor-pointer hover:text-blue-500  text-gray-900 font-medium text-center">
                        {wheel.wheel}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        ) : (
          <SearchProduct
            data={productData}
            getData={getproductData}
            loading={productLoading}
            clear={productClear}
            getDataRefinements={getDataRefinements}
          />
        )}
      </div>
    </div>
  );
}
