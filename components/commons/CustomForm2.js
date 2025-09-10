"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import MultipleImageInput from "./multipleImageInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// ✅ Dynamically import ReactQuill so it only runs on client
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});
import "react-quill-new/dist/quill.snow.css";

const countryList = [
  { name: "United States", code: "US", dial_code: "+1" },

  // add more countries here
];

// ✅ Simple formatter for some countries
const formatNumber = (number, dial_code) => {
  const digits = number.replace(/\D/g, "");
  if (dial_code === "+1") {
    // US format (123) 456-7890
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return digits;
    return [
      match[1] ? `(${match[1]}` : "",
      match[1] && match[1].length === 3 ? ")" : "",
      match[2] ? ` ${match[2]}` : "",
      match[2] && match[2].length === 3 ? "-" : "",
      match[3] || "",
    ].join("");
  } else if (dial_code === "+880") {
    // BD: 01XXXXXXXXX
    const match = digits.match(/^(\d{0,2})(\d{0,8})$/);
    if (!match) return digits;
    return [match[1] ? match[1] : "", match[2] ? match[2] : ""].join("");
  }
  // Default: digits only
  return digits;
};

// ✅ Minimal Quill toolbar
const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // formatting
    [{ list: "ordered" }, { list: "bullet" }], // lists
    ["link"], // links
    ["clean"], // remove formatting
  ],
};

export default function CustomInput({
  form,
  name,
  title,
  placeholder,
  className,
  type = "text",
  variant = "input", // input, select, textarea, switch, image, mobile
  options = [],
  rows = 3,
  labelCls,
  description = "",
  max = 1, // for image
  pdf,
  noWebp,
  child,
  isMes = true,
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState(countryList[0]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {title && variant !== "image" && (
            <FormLabel className={cn("subtitleText text-black", labelCls)}>
              {title}
            </FormLabel>
          )}
          <FormControl>
            {variant === "select" ? (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between !h-12 subtitleText",
                      className
                    )}
                  >
                    {field.value
                      ? options
                        .find((o) => o.value === field.value)
                        ?.label.slice(0, 10)
                      : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>No option found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={`${option.label} ${option.value}`}
                          onSelect={() => {
                            field.onChange(option.value);
                            setOpen(false);
                          }}
                        >
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : variant === "textarea" ? (
              <ReactQuill
                theme="snow"
                value={field.value || ""}
                onChange={field.onChange}
                placeholder={placeholder}
                modules={quillModules}
                className={cn("subtitleText", className)}
                style={{
                  minHeight: "100px",   // small starting height
                  height: "auto",       // auto expand
                }}
              />
            ) : variant === "switch" ? (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  id={name}
                />
                {placeholder && <label htmlFor={name}>{placeholder}</label>}
              </div>
            ) : variant === "image" ? (
              <MultipleImageInput
                label={title}
                name={name}
                value={field.value}
                onChange={field.onChange}
                max={max}
                pdf={pdf}
                noWebp={noWebp}
                child={child}
              />
            ) : variant === "mobile" ? (
              <div className="flex space-x-2">
                {/* Country selector */}
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="!h-12 subtitleText bg-transparent"
                    >
                      {selectedCountry.dial_code} {selectedCountry.code}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[150px] p-0">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countryList.map((c) => (
                          <CommandItem
                            key={c.code}
                            value={c.name}
                            onSelect={() => {
                              setSelectedCountry(c);
                              setOpen(false);
                            }}
                          >
                            {c.name} ({c.dial_code})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Phone input */}
                <Input
                  {...field}
                  type="tel"
                  inputMode="numeric"
                  placeholder={placeholder || "Phone number"}
                  value={formatNumber(
                    field.value || "",
                    selectedCountry.dial_code
                  )}
                  onChange={(e) => {
                    let raw = e.target.value.replace(/\D/g, "");
                    field.onChange(raw); // digits only
                  }}
                  className={cn("h-12 subtitleText flex-1", className)}
                />
              </div>
            ) : (
              <Input
                {...field}
                type={type}
                inputMode={type === "number" ? "numeric" : undefined}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={placeholder}
                className={cn("h-12 subtitleText", className)}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {isMes && (
            <FormMessage className="text-text-foreground subtitleText" />
          )}
        </FormItem>
      )}
    />
  );
}
