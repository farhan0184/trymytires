'use client'
import React from "react";
import Title from "../common/title";
import Image from "next/image";
import { columnFormatter } from "@/app/helper/util";
import { useI18n } from "@/app/provider/i18nProvider";

const About = ({about}) => {
  const {langCode} = useI18n()
  return (
    <div className="container md:p-3 rounded-lg mt-0 md:mt-10">
      <Title heading={columnFormatter(about?.title, langCode)} className={"block md:hidden"} />
      <div className="container bg-[#EEEEEE] rounded-lg mt-8 md:mt-10 ">
        <div className="px-2 md:px-10 md:py-8 lg:py-15 py-7">
          <Title heading={columnFormatter(about?.title, langCode)} className={"hidden md:block"} />
          <div className="bg-white mt-5 md:mt-10 rounded-lg ">
            <div className="flex flex-col-reverse md:flex-row items-center justify-between rounded-xl">
              <div className="p-4 md:p-10 lg:p-16 flex-1">
                <h1 className="uppercase max-w-[630px] italic md:leading-7 md:font-semibold primaryText text-center md:text-left ">
                  {/* This span shows only on md and above */}
                  <span className="hidden md:inline secondaryText md:font-bold">
                    {columnFormatter(about?.first_description, langCode)}{" "}
                  </span>
                  {/* This span shows only on small screens */}
                  <span className="inline md:hidden primaryText">
                    {columnFormatter(about?.first_description, langCode)}{" "}
                  </span>
                  {columnFormatter(about?.secound_description, langCode)}
                </h1>
              </div>

              <div className="flex-1">
                <div className="relative overflow-hidden w-full">
                  {/* SVG clip path only used on md and above */}
                  <svg
                    width="0"
                    height="0"
                    className="hidden md:block absolute"
                  >
                    <defs>
                      <clipPath
                        id="tire-clip"
                        clipPathUnits="objectBoundingBox"
                      >
                        <path d="M0.81 0.997 H0.001 L0.201 0.005 L0.201 0.003 L0.958 0.002 C0.958 0.002 0.985 0.0002 0.993 0.018 C0.997 0.027 1 0.044 1 0.044 V0.756 C1 0.756 0.987 0.896 0.946 0.949 C0.905 1.002 0.81 0.997 0.81 0.997 Z" />
                      </clipPath>
                    </defs>
                  </svg>

                  {/* Responsive image with conditional clip-path */}
                  <Image
                    src="/abouttires.png"
                    alt="About Try My Tires Image"
                    width={1000}
                    height={1000}
                    className="w-full md:h-[400px] object-cover rounded-t-2xl md:rounded-none"
                    style={{
                      // Only apply clipPath on md and above
                      clipPath: "url(#tire-clip)",
                      WebkitClipPath: "url(#tire-clip)", // for Safari
                    }}
                  />
                </div>

                {/* <Image src="/public/abouttires.png" /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
