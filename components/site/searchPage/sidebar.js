'use client'
import { Check, ChevronDown, ChevronsUpDown } from "lucide-react";
import VehicleFilter from "./SearchForm";
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FilterSection from "./filter";
import { useVehicle } from "@/app/provider/vehicleProvider";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import axios from "axios";
import { getLincesePlate, getVin } from "@/app/helper/backend";

const collapseVariants = {
  open: { height: "auto", opacity: 1 },
  collapsed: { height: 0, opacity: 0 },
};

const states = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "DC" } // Washington, D.C.
];


const Sidebar = React.memo(function Sidebar(props) {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [open, setOpen] = useState(false);
  const [licence, setLicence] = useState({ state: "", plate: "" });
  const [vin, setVin] = useState("");
  const [vinNumber, setVinNumber] = useState(true)
  const [lincense, setLincese] = useState(true)

  const router = useRouter()
  const [openRefineBy, setOpenRefineBy] = useState(true);

  const { openVehicle, setOpenVehicle, vehicleFilters, handleVehicleFilterChange, handleVehicleSearch, setFrontWheels, frontWheels, setVehicleFilters } = useVehicle();
  const searchproduct = () => {
    handleVehicleSearch()
    props.getproductData({ search: '' })
    props.setVinData(null)
  }

  const handleVinDecoder = async (islicense) => {
    // More reliable scroll position
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

    let vinNumber = vin;
    handleVehicleFilterChange("year", "");
    handleVehicleFilterChange("make", "");
    handleVehicleFilterChange("model", "");
    props.getproductData({ search: '' });

    // Remove search query from URL
    const url = new URL(window.location);
    url.searchParams.delete("search");
    window.history.replaceState({}, document.title, url.toString());

    try {
      if (!!islicense) {
        const licenseResponse = await getLincesePlate({ ...licence });
        if (licenseResponse.success && licenseResponse.data) {
          vinNumber = licenseResponse.data.vin;
        } else {
          toast.error(licenseResponse.message);
          return;
        }
      }

      const vinResponse = await getVin({ vin: vinNumber });

      if (vinResponse.success) {
        const data = vinResponse.data;
        const wheelsArray = data.features.wheels || [];
        let wheelSize = "";
        let tireSize = "";

        wheelsArray.forEach(item => {
          if (item.includes("x")) {
            const match = item.match(/\d+\s*x\s*\d+(\.\d+)?/i);
            if (match) wheelSize = match[0];
          }
          if (item.includes("/")) {
            const match = item.match(/[A-Z]?\d+\/\d+R\d+/i);
            if (match) tireSize = match[0];
          }
        });

        if (wheelSize || tireSize) {
          props.setVinData({ wheel: wheelSize, tire: tireSize });
        } else {
          props.setVinData(null); // force null instead of undefined
        }
        props.getDataRefinements()
      } else {
        toast.error(vinResponse.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      // Restore scroll after DOM updates
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPos);
      });
    }
  };


  return (
    <div
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="font-semibold primaryText">Filter by:</h2>
        <span
          onClick={() => {
            setSelectedFilters({})
            setFrontWheels([])
            handleVehicleFilterChange("year", "")
            handleVehicleFilterChange("make", "")
            handleVehicleFilterChange("model", "")
            router.push("/search")
            setVin("")
            setLicence({ state: "", plate: "" })
            props.setVinData(null)

          }}
          className="tertiaryText text-primary-foreground cursor-pointer"
        >
          Clear All
        </span>
      </div>
      <VehicleFilter
        openVehicle={openVehicle}
        setOpenVehicle={setOpenVehicle}
        vehicleFilters={vehicleFilters}
        handleVehicleFilterChange={handleVehicleFilterChange}
        handleVehicleSearch={searchproduct}
      />
      {props.search && props.dataRefinements && frontWheels.length === 0 && (
        <div className="subtitleText">
          <button
            type="button"
            className="w-full flex justify-between items-center cursor-pointer border-2 border-[#000000] rounded py-2 px-3"
            onClick={() => setOpenRefineBy((p) => !p)}
          >
            <h2 className="font-semibold text-[#191919]">REFINE BY</h2>
            <ChevronDown
              className={`size-5 transition-transform ${openRefineBy ? "rotate-180" : "rotate-0"
                }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {openRefineBy && (
              <motion.div
                key="refine"
                variants={collapseVariants}
                initial="collapsed"
                animate="open"
                exit="collapsed"
                className="overflow-hidden p-4 "
              >
                <FilterSection
                  data={props.dataRefinements}

                  setSelectedFilters={setSelectedFilters}
                  selectedFilters={selectedFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="space-y-4">
        <div className="subtitleText">
          <button
            type="button"
            className="w-full flex justify-between items-center cursor-pointer border-2 border-[#000000] rounded py-2 px-3"
            onClick={() => setVinNumber((p) => !p)}
          >
            <h2 className="font-semibold text-[#191919]">VIN</h2>
            <ChevronDown
              className={`size-5 transition-transform ${vinNumber ? "rotate-180" : "rotate-0"
                }`}
            />
          </button>
        </div>

        {vinNumber && <AnimatePresence initial={false}>

          <motion.div
            key="vehicle"
            variants={{
              collapsed: { opacity: 0, height: 0 },
              open: { opacity: 1, height: "auto" },
            }}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            className="overflow-hidden space-y-4 px-2 "
          >
            {/* VIN Input */}
            <div>
              <label className="subtitleText font-semibold">Vehicle VIN Number</label>
              <input
                placeholder="Vin number 17-digits"
                // type="number"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                className="subtitleText w-full border-2 border-[#000000] rounded p-2"
              />
              {vin !== "" && vin.length !== 17 && <p className="text-base text-red-500">Enter 17 digits vin number</p>}
            </div>

            {/* Search Button */}
            <div className="flex justify-center mt-2 subtitleText">
              <button
                disabled={vin === "" && vin.length !== 17 ? true : false}
                onClick={async () => {

                  await handleVinDecoder(false)

                }}
                className="bg-[#7D6B6B] hover:bg-[#7D6B6B]/80 px-4 py-2 text-white font-semibold rounded cursor-pointer"
              >
                SEARCH
              </button>
            </div>
          </motion.div>

        </AnimatePresence>}
      </div>
      <div className="space-y-4">
        <div className="subtitleText">
          <button

            type="button"
            className="w-full flex justify-between items-center cursor-pointer border-2 border-[#000000] rounded py-2 px-3"
            onClick={() => setLincese((p) => !p)}
          >
            <h2 className="font-semibold text-[#191919]">Lincense Plate</h2>
            <ChevronDown
              className={`size-5 transition-transform ${lincense ? "rotate-180" : "rotate-0"
                }`}
            />
          </button>
        </div>

        {lincense && <AnimatePresence initial={false}>

          <motion.div
            key="vehicle"
            variants={collapseVariants}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            className="overflow-hidden space-y-4 px-2 subtitleText "
          >
            {/* State Combobox */}
            <div>
              <label className="font-semibold">State</label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between border-2 rounded border-black subtitleText ${licence.state === "" ? "text-gray-500" : ""} h-12`}
                  >
                    {licence.state
                      ? states.find((s) => s.value === licence.state)?.label
                      : "Select State"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search state..." />
                    <CommandList>
                      <CommandEmpty>No state found.</CommandEmpty>
                      <CommandGroup>
                        {states.map((s) => (
                          <CommandItem
                            key={s.value}
                            value={s.value}
                            onSelect={(currentValue) => {
                              setLicence((prev) => ({
                                ...prev,
                                state: currentValue === prev.state ? "" : currentValue,
                              }));
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                licence.state === s.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {s.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {licence.state == "" && licence.plate !== "" && <p className="text-base text-red-500">Select the state</p>}
            </div>

            {/* Plate Number Input */}
            <div>
              <label className="font-semibold">Plate Number</label>
              <input
                placeholder="Plate number"
                value={licence.plate}
                onChange={(e) =>
                  setLicence((prev) => ({ ...prev, plate: e.target.value }))
                }
                className="subtitleText w-full border-2 border-[#000000] rounded p-2"
              />
              {licence.state !== "" && licence.plate === "" && <p className="text-base text-red-500">Select the state</p>}
            </div>

            {/* Search Button */}
            <div className="flex justify-center mt-2">
              <button
                disabled={(licence.plate === "" && licence.state === "") ? true : false}
                className="bg-[#7D6B6B] hover:bg-[#7D6B6B]/80 px-4 py-2 text-white font-semibold rounded cursor-pointer"
                onClick={async () => {
                  await handleVinDecoder(true)

                }}
              >
                SEARCH
              </button>
            </div>
          </motion.div>

        </AnimatePresence>}
      </div>



    </div >


  );
});

export default Sidebar;
