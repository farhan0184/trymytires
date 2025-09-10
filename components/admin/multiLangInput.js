"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";



export function MultiLangInput({
  label,
  path,
  formData,
  setFormData,
  selectedLang,
  type = "input",
}) {
  const getValue = () => {
    try {
      const keys = path.split(".");
      let obj = formData;
      for (let k of keys) {
        const match = k.match(/(\w+)\[(\d+)\]/);
        if (match) {
          const key = match[1];
          const index = Number(match[2]);
          obj = obj[key]?.[index];
        } else {
          obj = obj[k];
        }
        if (!obj) return "";
      }
      return obj[selectedLang] || "";
    } catch {
      return "";
    }
  };

  const setValue = (val) => {
    const keys = path.split(".");
    const newData = { ...formData };
    let obj = newData;

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const match = k.match(/(\w+)\[(\d+)\]/);
      if (match) {
        const key = match[1];
        const index = Number(match[2]);
        if (!obj[key]) obj[key] = [];
        if (!obj[key][index]) obj[key][index] = {};
        if (i === keys.length - 1) {
          obj[key][index] = {
            ...(obj[key][index] || {}),
            [selectedLang]: val,
          };
        } else {
          obj = obj[key][index];
        }
      } else {
        if (!obj[k]) obj[k] = {};
        if (i === keys.length - 1) {
          obj[k] = {
            ...(obj[k] || {}),
            [selectedLang]: val,
          };
        } else {
          obj = obj[k];
        }
      }
    }

    setFormData(newData);
  };

  const value = getValue();

  return type === "textarea" ? (
    <Textarea
      label={label}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  ) : (
    <Input
      label={label}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
