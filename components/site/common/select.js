import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function SSelect({
  label,
  placeholder,
  data,
  func,
  defaultValue = "",
}) {
  return (
    <div className="w-full space-y-2">
      <Label className="subtitleText text-[#595959]">{label}</Label>
      <Select onValueChange={func} defaultValue={defaultValue}>
        <SelectTrigger className="w-full subtitleText searchSelector">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="text-black">
          {data.map((item, index) => (
            <SelectItem
              key={index}
              value={item.value}

              className="subtitleText searchSelectorItem"
            >
              {item.label} {/* ✅ show .label */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
