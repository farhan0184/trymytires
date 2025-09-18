import * as React from "react";
import { CarouselPlugin, Slider } from "./slider";
import Image from "next/image";

const Hero = ({ image, slider_images }) => {
  return (
    <div className="banner md:mt-8 lg:mt-10">
      <div className="flex flex-col  md:flex-row md:h-[300px] lg:h-[520px]  md:gap-4">
        <div className="flex-[6]">
          <Slider images={slider_images} />
        </div>
        <div className="flex-[2] p-10 md:p-0 ">
          <Image
            src={image}
            width={1000}
            height={1000}
            alt="Picture of the author"
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
