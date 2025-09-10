"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const collapseVariants = {
  open: { height: "auto", opacity: 1 },
  collapsed: { height: 0, opacity: 0 },
};

const MAX_VISIBLE_ITEMS = 10;

// ✅ Map API keys → filter keys
const filterKeyMap = {
  brands: "brand",
  types: "type",
  styles: "style",
  finishes: "finish",
  lugs_types: "lugs_type",
  seasons: "season",
  speed_ratings: "speed_rating",
  plys: "ply",
  performances: "performance",
  sidewalls: "side_wall",
  seasonal_designations: "season_designation",
  rimDiameters: "rim_diameter",
  offsets: "offset",
  lugs: "lug",
  boltCircles1: "bolt_circle1",
  boltCircles2: "bolt_circle2",
  hubBores: "hub_bore",
  loads: "load",
  rpms: "rpm",
  treadDepths: "tread_depth",
  rimWidthsMin: "rim_width_min",
  rimWidthsMax: "rim_width_max",
  loadRatings: "load_rating",
  widths: "width",
  stocks: "stock",
  backSpacings: "back_spacing",
  shipWeights: "ship_weight",
};

// ✅ Keys we don’t want to show
const hiddenKeys = ["price", "discount_price"];

export default function FilterSection({
  data,
  setSelectedFilters,
  selectedFilters,
}) {
  const [openSections, setOpenSections] = useState({});
  const [showAllItems, setShowAllItems] = useState({});
  const [search, setSearch] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ Get search query from URL
  useEffect(() => {
    const s = searchParams.get("search");
    setSearch(s);
  }, [searchParams]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleShowAll = (key) => {
    setShowAllItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilter = (filterKey, value) => {
    setSelectedFilters((prev) => {
      const prevSelected = prev[filterKey] || [];
      const isSelected = prevSelected.includes(value);
      const newSelected = isSelected
        ? prevSelected.filter((v) => v !== value)
        : [...prevSelected, value];
      const updated = { ...prev, [filterKey]: newSelected };
      if (newSelected.length === 0) delete updated[filterKey];
      return updated;
    });
  };

  const handleSliderChange = (filterKey, values) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: values,
    }));
  };

  // ✅ Sync filters with URL
  useEffect(() => {
    if (!searchParams) return;

    const params = [];

    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        if (typeof values[0] === "number" && values.length === 2) {
          params.push(`${key}=${values[0]}-${values[1]}`);
        } else {
          const encoded = values
            .map((v) => encodeURIComponent(v.toLowerCase()))
            .join(",");
          params.push(`${key}=${encoded}`);
        }
      }
    });

    const queryString = params.join("&");
    router.replace(`${pathname}?${queryString}`);
  }, [selectedFilters, search, pathname, router, searchParams]);

  return (
    <div>
      {data &&
        Object.entries(data).map(([rawKey, values]) => {
          // 🚫 Skip unwanted filters
          if (hiddenKeys.includes(rawKey)) {
            return null;
          }

          const isRange =
            typeof values === "object" && "min" in values && "max" in values;

          if (
            (!Array.isArray(values) || values.length === 0) &&
            (!isRange || values.min === values.max)
          ) {
            return null;
          }

          const key = filterKeyMap[rawKey] || rawKey;
          const open = openSections[key] ?? true;
          const showAll = showAllItems[key] ?? false;

          return (
            <div key={key} className="subtitleText">
              {/* Section header */}
              <button
                type="button"
                onClick={() => toggleSection(key)}
                className="w-full flex justify-between items-center cursor-pointer border-2 border-[#000000] rounded py-2 px-3"
              >
                <h2 className="font-semibold subtitleText text-[#191919]">
                  {`Select ${key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())}`}
                </h2>
                <ChevronDown
                  className={`size-5 transition-transform ${
                    open ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Expandable content */}
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key={key}
                    variants={collapseVariants}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    className="overflow-hidden space-y-2 p-4"
                  >
                    {isRange ? (
                      <>
                        <Slider
                          defaultValue={[values.min, values.max]}
                          min={values.min}
                          max={values.max}
                          step={1}
                          onValueChange={(val) =>
                            handleSliderChange(key, val)
                          }
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{values.min}</span>
                          <span>{values.max}</span>
                        </div>
                      </>
                    ) : (
                      (showAll ? values : values.slice(0, MAX_VISIBLE_ITEMS)).map(
                        (item) => {
                          const id =
                            typeof item === "object" ? item._id : item.toString();
                          const name =
                            typeof item === "object"
                              ? item.name
                              : item.toString();
                          const selected =
                            selectedFilters[key]?.includes(name) || false;

                          return (
                            <div
                              key={id}
                              className="flex items-center space-x-2 border-2 border-[#000000] rounded py-2 px-3"
                            >
                              <Checkbox
                                id={`${key}-${id}`}
                                checked={selected}
                                onCheckedChange={() =>
                                  toggleFilter(key, name)
                                }
                                className="size-5"
                              />
                              <label
                                htmlFor={`${key}-${id}`}
                                className="subtitleText"
                              >
                                {name}
                              </label>
                            </div>
                          );
                        }
                      )
                    )}

                    {!isRange && values.length > MAX_VISIBLE_ITEMS && (
                      <button
                        type="button"
                        onClick={() => toggleShowAll(key)}
                        className="text-xs underline text-gray-600"
                      >
                        {showAll ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
    </div>
  );
}













/* 
import SSelect from "../common/select";
import { Button } from "@/components/ui/button";
      

      <div className="subtitleText">
        <button
          type="button"
          className="w-full flex justify-between items-center cursor-pointer border-2 border-[#000000] rounded py-2 px-3"
          onClick={() => setOpenProductType((p) => !p)}
        >
          <h2 className="font-semibold text-[#191919]">PRODUCT TYPE</h2>
          <ChevronDown
            className={`size-5 transition-transform ${openProductType ? "rotate-180" : "rotate-0"
              }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openProductType && (
            <motion.div
              key="productType"
              variants={collapseVariants}
              initial="collapsed"
              animate="open"
              exit="collapsed"
              className="overflow-hidden space-y-2 p-4"
            >
              <SSelect
                label="Product Category"
                placeholder="Tires"
                data={["Tires", "Wheels", "Accessories"]}
                func={(value) => setProductType(value)}
                defaultValue={productType}
              />

              <div>
                <span className="text-xs sm:text-sm lg:text-[18px] text-[#595959]">
                  Select Brands
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {brands[productType]?.map((brand) => (
                    <span
                      key={brand}
                      className="bg-gray-100 border px-2 py-1 rounded text-xs"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

*/
