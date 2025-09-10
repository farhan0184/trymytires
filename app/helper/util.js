export const columnFormatter = (value, lang, sliceLength) => {
  let langCode = lang ? lang : "en";
  let text = "";

  if (value && typeof value === "object") {
    text = value[langCode] || value["en"] || "";
  }

  // If value is not an object, you could also handle strings directly
  if (typeof value === "string") {
    text = value;
  }

  // Slice only if sliceLength is provided
  return sliceLength ? text.slice(0, sliceLength) + "..." : text;
};
