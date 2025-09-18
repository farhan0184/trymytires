"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel as CarouselComponent,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

export function Slider({ images }) {
  const [api, setApi] = useState(null);

  // Set up autoplay with looping
  useEffect(() => {
    if (!api) return;

    // Set up interval for autoplay
    const interval = setInterval(() => {
      // Check if we're at the last slide
      const lastSlideIndex = api.scrollSnapList().length - 1;
      const currentSlideIndex = api.selectedScrollSnap();

      if (currentSlideIndex === lastSlideIndex) {
        // If at last slide, manually scroll to first slide
        api.scrollTo(0);
      } else {
        // Otherwise, just go to next slide
        api.scrollNext();
      }
    }, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [api]);

  // Options for Embla Carousel
  const options = {
    align: "start",
    loop: true,
  };

  // Array of image data
  // const images = [
  //   {
  //     src: "/slider_1.png",
  //     alt: "Image 1",
  //     title: "Beautiful Landscape",
  //   },
  //   {
  //     src: "/slider_2.png",
  //     alt: "Image 2",
  //     title: "Beautiful Landscape",
  //   },
  //   {
  //     src: "/slider_1.png",
  //     alt: "Image 1",
  //     title: "Beautiful Landscape",
  //   },
  //   {
  //     src: "/slider_2.png",
  //     alt: "Image 2",
  //     title: "Beautiful Landscape",
  //   },
  // ];

  return (
    <CarouselComponent
      setApi={setApi}
      className="w-full max-w-full"
      opts={options}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="">
              <Card>
                <CardContent className="flex md:h-[300px] lg:h-[520px]">
                  <div className="w-full  ">
                    <Image
                      src={image || "/placeholder.svg"}
                      width={2000}
                      height={2000}
                      alt="Picture of the author"
                      className="w-full h-[60lvh] md:h-full object-cover"
                      // unoptimized
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </CarouselComponent>
  );
}
