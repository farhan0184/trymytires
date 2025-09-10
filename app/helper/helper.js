import { postMultipleImage, postSingleImage } from "./backend";


function isHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function isNonEmptyString(value) {
  return (
    (typeof value === "string" || value instanceof String) &&
    value.toString().trim().length > 0
  );
}

export async function handleImageUpload(input, single = false) {

  if (single) {
    if (Array.isArray(input) && input.length > 0 && input[0].originFileObj) {
      const formData = new FormData();
      formData.append("image", input[0].originFileObj);
      const result = await postSingleImage(formData);
      return result?.data?.image ? result.data.image : "";
    } else {
      return input?.url;
    }
  } else {


    const stringImages = [];
    const formData = new FormData();

    for (const item of input) {
      if (typeof item === "object" && item !== null && item.originFileObj) {
        formData.append("images", item.originFileObj);
      } else {
        stringImages.push(item?.url);
      }

    }

    let uploadedImages = [];
    if (formData.has("images")) {
      const result = await postMultipleImage(formData);
      uploadedImages = Array.isArray(result?.data?.images) ? result.data.images : [];
    }

    return [...stringImages, ...uploadedImages];
  }
}


export const withTimeout = (promise, ms = 10000) => 
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("Upload timeout")), ms))]);



