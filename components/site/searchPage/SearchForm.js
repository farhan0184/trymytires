"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { customFetch } from "@/app/helper/api";

import { useI18n } from "@/app/provider/i18nProvider";

const collapseVariants = {
  open: { height: "auto", opacity: 1 },
  collapsed: { height: 0, opacity: 0 },
};

// Helper for API fetch


export default function VehicleFilter({
  openVehicle,
  setOpenVehicle,
  vehicleFilters,
  handleVehicleFilterChange,
  handleVehicleSearch,
  form = "search"
}) {
  const { t } = useI18n();
  const years = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => {
    const year = 2026 - i;
    return { label: year.toString(), value: year.toString() };
  });

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  // Fetch makes when year changes
  useEffect(() => {
    if (vehicleFilters.year) {
      customFetch(
        `https://api.wheel-size.com/v2/makes/?year=${vehicleFilters.year}&region=usdm&user_key=${process.env.wheel_size_key}`
      ).then((res) => {
        if (res?.data) {
          const makeOptions = res.data.map((item) => ({
            value: item.slug,
            label: item.name,
          }));
          setMakes(makeOptions);

        }

        setModels([]);
      });
    } else {
      setMakes([]);
      setModels([]);
    }
  }, [vehicleFilters.year]);

  // Fetch models when make changes
  useEffect(() => {
    if (vehicleFilters.year && vehicleFilters.make) {

      customFetch(
        `https://api.wheel-size.com/v2/models/?year=${vehicleFilters.year}&make=${vehicleFilters.make}&region=usdm&user_key=${process.env.wheel_size_key}`
      ).then((res) => {

        if (res?.data) {
          const modelOptions = res.data.map((item) => ({
            value: item.slug,
            label: item.name,
          }));

          setModels(modelOptions);

        }
      });
    }
  }, [vehicleFilters.make]);



  return (
    <>
      {form === "search" && (
        <div className="subtitleText">
          <button
            type="button"
            className="w-full flex justify-between items-center cursor-pointer border-2 border-[#000000] rounded py-2 px-3"
            onClick={() => setOpenVehicle((p) => !p)}
          >
            <h2 className="font-semibold text-[#191919]">{t("VEHICLE")}</h2>
            <ChevronDown
              className={`size-5 transition-transform ${
                openVehicle ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {openVehicle && (
              <motion.div
                key="vehicle"
                variants={collapseVariants}
                initial="collapsed"
                animate="open"
                exit="collapsed"
                className="overflow-hidden space-y-2 p-4"
              >
                {/* Year Select */}
                <div>
                  <label className="font-semibold">{t("Year")}</label>
                  <select
                    className="w-full border-2 border-[#000000] rounded p-2"
                    value={vehicleFilters.year}
                    onChange={(e) =>
                      handleVehicleFilterChange("year", e.target.value)
                    }
                  >
                    <option value="">
                      {t("Select")} {t("Year")}
                    </option>
                    {years.map((y) => (
                      <option key={y.value} value={y.value}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Make Select */}
                <div>
                  <label className="font-semibold">{t("Make")}</label>
                  <select
                    className="w-full border-2 border-[#000000] rounded p-2"
                    value={vehicleFilters.make}
                    onChange={(e) =>
                      handleVehicleFilterChange("make", e.target.value)
                    }
                  >
                    <option value="">
                      {t("Select")} {t("Make")}
                    </option>
                    {makes.map((m, index) => (
                      <option key={index} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model Select */}
                <div>
                  <label className="font-semibold">{t("Model")}</label>
                  <select
                    className="w-full border-2 border-[#000000] rounded p-2"
                    value={vehicleFilters.model}
                    onChange={(e) =>
                      handleVehicleFilterChange("model", e.target.value)
                    }
                  >
                    <option value="">
                      {t("Select")} {t("Model")}
                    </option>
                    {models.map((m, index) => (
                      <option key={index} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div className="flex justify-center mt-2">
                  <button
                    className="bg-[#7D6B6B] hover:bg-[#7D6B6B]/80 px-4 py-2 text-white font-semibold rounded cursor-pointer"
                    onClick={handleVehicleSearch}
                  >
                    {t("Search")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {form === "home" && (
        <div className=" lg:w-[30%] w-full lg:mt-0 mt-5">
          <div className="w-full">
            {/* Header */}
            <div className="bg-yellow-400 text-black font-bold text-lg py-4 px-6 text-center">
              {t("SEARCH TIRE MANUALLY")}
            </div>

            {/* Form Section */}
            <div className="bg-gradient-to-r from-[#000000] via-[#4C4C4C] to-[#000000] h-[200px] flex items-center">
              {/* Select Dropdowns Row */}
              <div className="grid grid-cols-3 w-full gap-2 px-4">
                {/* YEAR */}
                <div>
                  <div className="text-white subtitleText font-semibold text-center">
                    {t("Year").toUpperCase()}
                  </div>
                  <select
                    className="w-full h-10 px-2 rounded-none tertiaryText text-gray-700 bg-white border border-gray-300 "
                    value={vehicleFilters.year}
                    onChange={(e) =>
                      handleVehicleFilterChange("year", e.target.value)
                    }
                  >
                    <option value="">{t("Select").toUpperCase()}</option>
                    {years.map((y) => (
                      <option key={y.value} value={y.value}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* MAKE */}
                <div>
                  <div className="text-white font-semibold subtitleText text-center">
                    {t("MAKE")}
                  </div>
                  <select
                    className="w-full h-10 px-2 rounded-none tertiaryText text-gray-700 bg-white border border-gray-300 "
                    value={vehicleFilters.make}
                    onChange={(e) =>
                      handleVehicleFilterChange("make", e.target.value)
                    }
                  >
                    <option value="">{t("Select").toUpperCase()}</option>
                    {makes.map((m, index) => (
                      <option key={index} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* MODEL */}
                <div>
                  <div className="text-white font-semibold subtitleText text-center">
                    {t("MODEL")}
                  </div>
                  <select
                    className="w-full h-10 px-2 rounded-none tertiaryText text-gray-700 bg-white border border-gray-300 "
                    value={vehicleFilters.model}
                    onChange={(e) =>
                      handleVehicleFilterChange("model", e.target.value)
                    }
                  >
                    <option value="">{t("Select").toUpperCase()}</option>
                    {models.map((m, index) => (
                      <option key={index} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleVehicleSearch}
              className="w-full bg-orange-500 hover:bg-orange-600 transition-colors text-white font-bold subtitleText py-4 px-6 cursor-pointer"
            >
              {t("Search").toUpperCase()}
            </button>
          </div>
        </div>
      )}
      {form === "product" && (
        <div className="flex justify-center mb-10">
          <div className="flex lg:flex-row flex-col gap-4 w-full lg:w-auto">
            {/* YEAR */}
            <div className="flex lg:flex-row flex-col lg:items-center gap-1 w-full">
              <label className="text-gray-700 font-bold mb-1 subtitleText">
                {t("Year")}
              </label>
              <select
                className="lg:w-[200px] w-full h-11 px-3 border border-gray-300 rounded bg-gray-50 text-gray-700 tertiaryText"
                value={vehicleFilters.year}
                onChange={(e) =>
                  handleVehicleFilterChange("year", e.target.value)
                }
              >
                <option value="">
                  {t("Select")} {t("Year")}
                </option>
                {years.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>

            {/* MAKE */}
            <div className="flex lg:flex-row flex-col lg:items-center gap-1">
              <label className="text-gray-700 font-bold subtitleText mb-1">
                {t("Make")}
              </label>
              <select
                className="lg:w-[200px] w-full h-11 px-3 border border-gray-300 rounded bg-gray-50 text-gray-700 tertiaryText"
                value={vehicleFilters.make}
                onChange={(e) =>
                  handleVehicleFilterChange("make", e.target.value)
                }
              >
                <option value="">
                  {t("Select")} {t("Make")}
                </option>
                {makes.map((m, index) => (
                  <option key={index} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* MODEL */}
            <div className="flex lg:flex-row flex-col lg:items-center gap-1">
              <label className="text-gray-700 font-bold subtitleText mb-1">
                {t("Model")}
              </label>
              <select
                className="lg:w-[200px] w-full h-11 px-3 border border-gray-300 rounded bg-gray-50 text-gray-700 tertiaryText"
                value={vehicleFilters.model}
                onChange={(e) =>
                  handleVehicleFilterChange("model", e.target.value)
                }
              >
                <option value="">
                  {t("Select")} {t("Model")}
                </option>
                {models.map((m, index) => (
                  <option key={index} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* SEARCH BUTTON */}
            <div className="flex items-end">
              <button
                onClick={handleVehicleSearch}
                className="w-32 h-11 bg-[#575757] hover:bg-[#575757]/70 text-white font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

