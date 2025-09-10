'use client'
import React, { useEffect, useState } from 'react'
import TabsContent from './tab_layout'
import { fetchPageData, postSingleImage, updatePageData } from '@/app/helper/backend'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useFetch } from '@/app/helper/hooks'
import { toast } from 'react-hot-toast'

export default function ProductsData({ languages, setSelectedLang, selectedLang }) {
    const [formData, setFormData] = useState({});
    const [data, getData, { loading }] = useFetch(fetchPageData, { slug: "products" });

    // 👉 Load content into formData when API data is ready
    useEffect(() => {
        if (data?.content) {
            setFormData(data.content);
        }
    }, [data]);

    if (!data && loading) {
        return <p>Loading...</p>
    }

    const handleChange = (section, field, lang, value) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: {
                    ...prev[section]?.[field],
                    [lang]: value
                }
            }
        }));
    };

    return (
        <TabsContent>
            {/* Language Switcher */}
            <div className="flex flex-wrap justify-start gap-3 mt-4 mb-4">
                {languages?.map((l, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedLang(l.code)}
                        className={`px-3 py-1 rounded-full tertiaryText font-medium cursor-pointer transition-colors duration-200 ${l.code === selectedLang
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {l.name}
                    </button>
                ))}
            </div>

            <form
                onSubmit={async (e) => {
                    e.preventDefault();

                   

                    const updateData = await updatePageData({ _id: data?._id, content: formData });

                    if (updateData.success) {
                        toast.success(updateData.message)
                        getData({ slug: "products" })
                    } else {
                        toast.error(updateData.errorMessage)
                    }
                }}
                className="space-y-6"
            >
                {["tire", "wheel", "accessories", "brands"].map((section) => (
                    <div key={section}>
                        <h2 className="tertiaryText font-semibold capitalize mb-2">{section}</h2>

                        {languages?.map((l) => (
                            <div
                                key={l.code}
                                style={{ display: l.code === selectedLang ? "block" : "none" }}
                                className="mb-4"
                            >
                                {/* Title Input */}
                                <label className="block subtitleText font-medium mb-1">
                                    {section} Title ({l.name})
                                </label>
                                <Input
                                className={"subtitleText h-12"}
                                    value={formData?.[section]?.title?.[l.code] || ""}
                                    onChange={(e) => handleChange(section, "title", l.code, e.target.value)}
                                />

                                {/* Description Input */}
                                <label className="block subtitleText font-medium mt-3 mb-1">
                                    {section} Description ({l.name})
                                </label>
                                <Textarea
                                className={"subtitleText h-32"}
                                    value={formData?.[section]?.description?.[l.code] || ""}
                                    onChange={(e) => handleChange(section, "description", l.code, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                ))}

                <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-md"
                >
                    Save
                </button>
            </form>
        </TabsContent>
    )
}
