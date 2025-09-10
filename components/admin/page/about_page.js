'use client'
import React, { useEffect, useState } from 'react'
import TabsContent from './tab_layout'
import { fetchPageData, updatePageData } from '@/app/helper/backend'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useFetch } from '@/app/helper/hooks'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'

export default function AboutPage({ languages, setSelectedLang, selectedLang }) {
    const [formData, setFormData] = useState({})
    const [data, getData, { loading }] = useFetch(fetchPageData, { slug: "about_us" })

    useEffect(() => {
        if (data?.content) {
            setFormData(data.content)
        }
    }, [data])

    if (!data && loading) {
        return <p>Loading...</p>
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
            }

            const updateData = await updatePageData({ _id: data?._id, content: payload })

            if (updateData.success) {
                toast.success(updateData.message)
                getData({ slug: "about_us" })
            } else {
                toast.error(updateData.errorMessage)
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong")
        }
    }

    const handleChange = (field, lang, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: {
                ...prev?.[field],
                [lang]: value
            }
        }))
    }


    return (
        <TabsContent>
            {/* -------------------- Language Selector -------------------- */}
            <div className="flex flex-wrap justify-start gap-3 mt-4 mb-4">
                {languages?.map((l, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedLang(l.code)}
                        className={`px-3 py-1 rounded-full tertiaryText cursor-pointer font-medium transition-colors duration-200 ${l.code === selectedLang
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
                        <h2 className="subtitleText font-bold">Programs Content ({l.name})</h2>

                        <div>
                            <label className="block subtitleText font-medium mb-1">Title</label>
                            <Input
                            className={"subtitleText h-12"}
                                required
                                value={formData?.title?.[l.code] || ""}
                                onChange={(e) => handleChange("title", l.code, e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block subtitleText font-medium mb-1">Description 1</label>
                            <Textarea
                             className={"subtitleText h-36"}
                                required
                                value={formData?.description1?.[l.code] || ""}
                                onChange={(e) => handleChange("description1", l.code, e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block subtitleText font-medium mb-1">Description 2</label>
                            <Textarea
                             className={"subtitleText h-36"}
                                required
                                value={formData?.description2?.[l.code] || ""}
                                onChange={(e) => handleChange("description2", l.code, e.target.value)}
                            />
                        </div>
                    </div>
                ))}

                {/* -------------------- Locations -------------------- */}
                {/* -------------------- Locations -------------------- */}
                <div className="space-y-4 mt-8">
                    <h2 className="text-lg font-bold">Locations</h2>

                    {formData?.locations?.map((loc, index) => {

                        return(
                        <div key={index} className="border p-4 rounded space-y-3">
                            <div>
                                <label className="block subtitleText font-medium mb-1">Address</label>
                                <Input
                                    value={loc.address || ""}
                                    className={"subtitleText h-12"}
                                    onChange={(e) => {
                                        const updated = [...formData.locations]
                                        updated[index].address = e.target.value
                                        setFormData((prev) => ({ ...prev, locations: updated }))
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block subtitleText font-medium mb-1">Latitude</label>
                                <Input
                                    value={loc.lat || ""}
                                    className={"subtitleText h-12"}
                                    onChange={(e) => {
                                        const updated = [...formData.locations]
                                        updated[index].lat = e.target.value
                                        setFormData((prev) => ({ ...prev, locations: updated }))
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block subtitleText font-medium mb-1">Longitude</label>
                                <Input
                                    value={loc.lang || ""}
                                    className={"subtitleText h-12"}
                                    onChange={(e) => {
                                        const updated = [...formData.locations]
                                        updated[index].lang = e.target.value
                                        setFormData((prev) => ({ ...prev, locations: updated }))
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    const updated = [...formData.locations]
                                    updated.splice(index, 1)
                                    setFormData((prev) => ({ ...prev, locations: updated }))
                                }}
                                className="text-red-500 cursor-pointer mt-2"
                            >
                                <Trash2/>
                            </button>
                        </div>
                    )
                    })}

                    <button
                        type="button"
                        onClick={() => {
                            setFormData((prev) => ({
                                ...prev,
                                locations: [...(prev.locations || []), { address: "", lat: "", lang: "" }],
                            }))
                        }}
                        className="px-3 py-1 bg-gray-200 rounded tertiaryText cursor-pointer hover:bg-gray-300 text-sm"
                    >
                        + Add Location
                    </button>
                </div>


                <button
                    type="submit"
                    className="mt-6 px-4 py-2 bg-primary text-white rounded subtitleText cursor-pointer"
                >
                    Submit
                </button>
            </form>
        </TabsContent>
    )
}
