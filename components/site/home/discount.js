'use client'
import React from "react";
import { CardSlider } from "./cardslider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import VehicleFilter from "../searchPage/SearchForm";
import { useVehicle } from "@/app/provider/vehicleProvider";
import { useI18n } from "@/app/provider/i18nProvider";

const Discount = () => {
  const {t} = useI18n()
  const { openVehicle, setOpenVehicle, vehicleFilters, handleVehicleFilterChange, handleVehicleSearch, setFrontWheels } = useVehicle();
  return (
    <div className="container my-10">
      <div className="flex flex-col justify-between lg:flex-row md:gap-5 lg:gap-8">
        <div className=" lg:w-[70%] ">
          <div className="flex justify-between items-center ">
            <h1 className="text-[#212D65] italic primaryText font-bold pb-3 uppercase">
             { t("Items on sellout")} {t("Discount")}
            </h1>
            <Link href="/promotion">
              <h1 className="text-[#212D65] italic primaryText font-bold pb-3 uppercase cursor-pointer hover:text-text-foreground transition-colors">
                {t('See More')}
              </h1>
            </Link>
          </div>
          <div className="flex justify-center ">
            <CardSlider />
          </div>
        </div>
        <VehicleFilter
          openVehicle={openVehicle}
          setOpenVehicle={setOpenVehicle}
          vehicleFilters={vehicleFilters}
          handleVehicleFilterChange={handleVehicleFilterChange}
          handleVehicleSearch={handleVehicleSearch}
          form='home'
        />
      </div>
    </div>
  );
};

export default Discount;
