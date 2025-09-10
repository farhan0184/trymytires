"use client";
import { Input } from "@/components/ui/input";

export function MultiLangArrayInput({
  label,
  formData,
  setFormData,
  path,
  selectedLang,
  allLanguages,
}) {
  const getValuesObj = () => {
    const keys = path.split(".");
    let obj = formData;
    for (let k of keys) {
      if (!obj) return {};
      obj = obj[k.replace(/\[(\d+)\]/, (_, i) => Number(i))];
    }
    return obj || {};
  };

  const setValue = (newArr) => {
    const keys = path.split(".");
    const newData = { ...formData };
    let obj = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      let key = keys[i];
      const match = key.match(/\[(\d+)\]/);
      if (match) {
        const idx = Number(match[1]);
        key = key.replace(/\[(\d+)\]/, "");
        obj[key] = [...(obj[key] || [])];
        obj = obj[key][idx] = { ...(obj[key][idx] || {}) };
      } else {
        obj[key] = { ...(obj[key] || {}) };
        obj = obj[key];
      }
    }

    const lastKey = keys[keys.length - 1];
    obj[lastKey] = {
      ...(obj[lastKey] || {}),
      [selectedLang]: newArr,
    };
    setFormData(newData);
  };

  // Compute values for the current language and mirror length of all languages
  const valuesObj = getValuesObj();
  const maxLength = Math.max(
    ...allLanguages.map((lang) => valuesObj[lang]?.length || 0)
  );
  const values = Array.from(
    { length: maxLength },
    (_, i) => valuesObj[selectedLang]?.[i] || ""
  );

  return (
    <div className="mb-3 z-30">
      <label className="block text-sm font-medium mb-1">{label}</label>
      {values.map((v, i) => (
        <div key={i} className="flex items-center mb-2">
          <Input
            value={v}
            onChange={(e) => {
              const updatedValuesObj = getValuesObj();
              const updatedArr = Array.from({ length: maxLength }, (_, j) =>
                j === i
                  ? e.target.value
                  : updatedValuesObj[selectedLang]?.[j] || ""
              );
              setValue(updatedArr);
            }}
          />
          <button
            type="button"
            className="ml-2 px-2 py-1 text-xs bg-red-200 text-red-800 rounded"
            onClick={() => {
              const updatedValuesObj = getValuesObj();
              const updatedArr = Array.from({ length: maxLength }, (_, j) =>
                j !== i ? updatedValuesObj[selectedLang]?.[j] || "" : null
              ).filter(Boolean);
              setValue(updatedArr);
            }}
          >
            Delete
          </button>
        </div>
      ))}
      <button
        type="button"
        className="px-2 py-1 text-xs bg-gray-200 rounded z-50"
        onClick={() => {
          const updatedValuesObj = getValuesObj();
          const updatedArr = [...(updatedValuesObj[selectedLang] || []), ""];
          setValue(updatedArr);
        }}
      >
        + Add {label}
      </button>
    </div>
  );
}
