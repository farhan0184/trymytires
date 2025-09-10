"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Button from "../common/button";
import PromotionCard from "../promotion/card";
import { fetchPromotionProducts } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useRouter } from "next/navigation";

const carouselData = [
  {
    id: 1,
    image: "/single_tire.png?height=200&width=200",
    title: "BR 001203",
    subtitle:
      "Closeout on BRIDGESTONE ALENZA AS ULTRA 295/40R21 while supplies last ",
    discountedDate: "2024-06-30",
    daysDiscount: "30% ",
    days: "Monday",
  },
  {
    id: 2,
    image: "/single_tire.png?height=200&width=200",
    title: "Goodyear SPORT",
    subtitle:
      "Closeout on BRIDGESTONE ALENZA AS ULTRA 295/40R21 while supplies last ",
    discountedDate: "2024-07-15",
    daysDiscount: "50% ",
    days: "Tuesday",
  },
  {
    id: 3,
    image: "/single_tire.png?height=200&width=200",
    title: "Car & Jeep Special",
    subtitle:
      "Closeout on BRIDGESTONE ALENZA AS ULTRA 295/40R21 while supplies last ",
    discountedDate: "2024-07-20",
    daysDiscount: "25% ",
    days: "Wednesday",
  },
  {
    id: 4,
    image: "/single_tire.png?height=200&width=200",
    title: "Sports Car",
    subtitle:
      "Closeout on BRIDGESTONE ALENZA AS ULTRA 295/40R21 while supplies last",
    discountedDate: "2024-08-01",
    daysDiscount: "40%",
    days: "Thursday",
  },
  {
    id: 5,
    image: "/single_tire.png?height=200&width=200",
    title: "Most selling Tires",
    subtitle:
      "Closeout on BRIDGESTONE ALENZA AS ULTRA 295/40R21 while supplies last ",
    discountedDate: "2024-08-10",
    daysDiscount: "35%",
    days: "Friday",
  },
  {
    id: 6,
    image: "/single_tire.png?height=200&width=200",
    title: "Gadget Deals",
    subtitle:
      "Closeout on BRIDGESTONE ALENZA AS ULTRA 295/40R21 while supplies last ",
    discountedDate: "2024-08-15",
    daysDiscount: "20%",
    days: "Saturday",
  },
  {
    id: 7,
    image: "/single_tire.png?height=200&width=200",
    title: "Track Essentials",
    subtitle:
      "Closeout on BRIDGESTONE ALENZA AS ULTRA 295/40R21 while supplies last ",
    discountedDate: "2024-08-25",
    daysDiscount: "45%",
    days: "Sunday",
  },
  {
    id: 8,
    image: "/single_tire.png?height=200&width=200",
    title: "Travel Essentials",
    subtitle:
      "Closeout on BRIDGESTONE ALENZA AS ULTRA 295/40R21 while supplies last ",
    discountedDate: "2024-09-01",
    daysDiscount: "30% ",
    days: "Saturday",
  },
];

export function CardSlider() {
  const [api, setApi] = React.useState();
  const router = useRouter();
  React.useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [api]);

  const [promotionData, setPromotionData, { loading }] = useFetch(fetchPromotionProducts)

  

  return (
    <Carousel
      className="w-[95%] mx-auto relative"
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
        slidesToScroll: 1,
      }}
    >
      <CarouselContent className="-ml-0 ">
        {promotionData?.map((item) => (
          <CarouselItem
            key={item._id}
            className="pl-2 md:pl-4 basis-full  lg:basis-1/2"
          >
            <div className="">
              <PromotionCard item={item} router={router} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="h-8 w-8 cursor-pointer [&>svg]:h-6 [&>svg]:w-6 border-none lg:!block hidden" />
      <CarouselNext className="h-8 w-8 cursor-pointer [&>svg]:h-6 [&>svg]:w-6 border-none lg:!block hidden" />
    </Carousel>
  );
}
