"use client";
import React, { useEffect, useState } from "react";
import TabsContent from "./tab_layout";
import {
  fetchPageData,
  updatePageData,
} from "@/app/helper/backend";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/app/helper/hooks";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// ✅ Dynamically import ReactQuill for client-side rendering only
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});
import "react-quill-new/dist/quill.snow.css";

export default function TermsAndConditions({
  languages,
  setSelectedLang,
  selectedLang,
}) {
  const [formData, setFormData] = useState({});
  const [data, getData, { loading }] = useFetch(fetchPageData, {
    slug: "term_and_condition",
  });

  useEffect(() => {
    if (data?.content) {
      setFormData(data.content);
    }
  }, [data]);

  if (!data && loading) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
      };

      const updateData = await updatePageData({
        _id: data?._id,
        content: payload,
      });

      if (updateData.success) {
        toast.success(updateData.message);
        getData({ slug: "term_and_condition" });
      } else {
        toast.error(updateData.errorMessage);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleChange = (field, lang, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev?.[field],
        [lang]: value,
      },
    }));
  };

  return (
    <TabsContent>
      {/* -------------------- Language Selector -------------------- */}
      <div className="flex flex-wrap justify-start gap-3 mt-4 mb-4">
        {languages?.map((l, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedLang(l.code)}
            className={`px-3 py-1 rounded-full font-medium cursor-pointer transition-colors duration-200 ${
              l.code === selectedLang
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* -------------------- Multilingual Content -------------------- */}
        {languages?.map((l) => (
          <div
            key={l.code}
            style={{ display: l.code === selectedLang ? "block" : "none" }}
            className="space-y-4"
          >
            <h2 className="subtitleText font-bold">
              Programs Content ({l.name})
            </h2>

            {/* Title */}
            <div>
              <label className="block subtitleText font-medium mb-1">
                Title
              </label>
              <Input
                required
                className={"subtitleText h-12"}
                value={formData?.title?.[l.code] || ""}
                onChange={(e) => handleChange("title", l.code, e.target.value)}
              />
            </div>

            {/* Description (ReactQuill instead of Textarea) */}
            <div>
              <label className="block subtitleText font-medium mb-1">
                Description
              </label>
              <ReactQuill
                theme="snow"
                value={formData?.description?.[l.code] || ""}
                onChange={(val) => handleChange("description", l.code, val)}
                placeholder={`Write ${l.name} description`}
                className="bg-white rounded-md"
                style={{ minHeight: "150px" }}
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
        >
          Submit
        </button>
      </form>
    </TabsContent>
  );
}
