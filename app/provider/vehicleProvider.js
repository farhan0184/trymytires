// context/VehicleContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { customFetch } from "@/app/helper/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const VehicleContext = createContext(undefined);

export const VehicleProvider = ({ children }) => {
  const router = useRouter();
  const [frontWheels, setFrontWheels] = useState([]); // grouped wheels per vehicle
  const [openVehicle, setOpenVehicle] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [vehicleFilters, setVehicleFilters] = useState({
    year: "",
    make: "",
    model: "",
  });

  const handleVehicleFilterChange = (key, value) => {
    setVehicleFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "year")
      setVehicleFilters((prev) => ({ ...prev, make: "", model: "" }));
    if (key === "make") setVehicleFilters((prev) => ({ ...prev, model: "" }));
  };

  const handleVehicleSearch = async () => {
    if (!vehicleFilters.year || !vehicleFilters.make || !vehicleFilters.model) {
      toast.error("Please select year, make, and model.");
      return;
    }

    const apiUrl = `https://api.wheel-size.com/v2/search/by_model/?make=${vehicleFilters.make}&model=${vehicleFilters.model}&year=${vehicleFilters.year}&user_key=${process.env.wheel_size_key}&region=usdm`;
    const data = await customFetch(apiUrl);

    if (data?.data?.length > 0) {
      const allGroupedWheels = data.data.map((vehicle) => {
        return vehicle.wheels
          .map((wheel) => {
            const wheelSet = [];

            // Always add front wheel if it has required data
            if (
              wheel.front?.rim_diameter &&
              wheel.front?.rim_width &&
              wheel.front?.tire
            ) {
              wheelSet.push({
                is_stock: wheel.is_stock,
                position: "front",
                tire: wheel.front.tire,
                wheel: `${wheel.front.rim_diameter}x${wheel.front.rim_width}`,
              });
            }

            // Add rear wheel only if it has tire data (not empty string)
            if (
              wheel.rear?.rim_diameter &&
              wheel.rear?.rim_width &&
              wheel.rear?.tire &&
              wheel.rear.tire.trim() !== ""
            ) {
              wheelSet.push({
                is_stock: wheel.is_stock,
                position: "rear",
                tire: wheel.rear.tire,
                wheel: `${wheel.rear.rim_diameter}x${wheel.rear.rim_width}`,
              });
            }

            return wheelSet;
          })
          .filter((wheelSet) => wheelSet.length > 0); // Remove empty wheel sets
      });

      // Flatten the nested arrays
      const flattenedWheels = allGroupedWheels.flat();
      setFrontWheels(flattenedWheels);
      router.push("/search");
    }
  };

  return (
    <VehicleContext.Provider
      value={{
        frontWheels,
        setFrontWheels,
        openVehicle,
        setOpenVehicle,
        selectedFilters,
        setSelectedFilters,
        vehicleFilters,
        setVehicleFilters,
        handleVehicleFilterChange,
        handleVehicleSearch,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error("useVehicle must be used inside VehicleProvider");
  return ctx;
};
