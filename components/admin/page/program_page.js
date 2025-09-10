'use client'
import React, { useEffect, useState } from 'react'
import TabsContent from './tab_layout'
import { fetchPageData, postSingleImage, updatePageData } from '@/app/helper/backend'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import MultipleImageInput from '@/components/commons/multipleImageInput'
import { useFetch } from '@/app/helper/hooks'
import toast from 'react-hot-toast'

export default function ProgramsPage({ languages, setSelectedLang, selectedLang }) {
  const [formData, setFormData] = useState({})
  const [data, getData, { loading }] = useFetch(fetchPageData, { slug: "program" })

  useEffect(() => {
    if (data?.content) setFormData(data.content)
  }, [data])

  if (!data && loading) return <p>Loading...</p>

  const normalizeFile = (file) => {
    if (!file) return null
    if (typeof file === 'string') return { url: file }
    return file
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let bannerUrl = formData.banner
      if (bannerUrl && typeof bannerUrl !== "string" && bannerUrl.originFileObj) {
        const result = await postSingleImage({ image: bannerUrl.originFileObj })
        bannerUrl = result?.data?.image || result
      }

      let imageUrl = formData.image
      if (imageUrl && typeof imageUrl !== "string" && imageUrl.originFileObj) {
        const result = await postSingleImage({ image: imageUrl.originFileObj })
        imageUrl = result?.data?.image || result
      }

      const payload = { ...formData, banner: bannerUrl, image: imageUrl }
      const updateData = await updatePageData({ _id: data?._id, content: payload })

      if (updateData.success) {
        toast.success(updateData.message)
        getData({ slug: "program" })
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
      {/* Language Selector */}
      <div className="flex flex-wrap justify-start gap-3 mt-4 mb-4">
        {languages?.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setSelectedLang(l.code)}
            className={`px-3 py-1 rounded-full tertiaryText font-medium cursor-pointer transition-colors duration-200 ${
              l.code === selectedLang ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Image */}
        <MultipleImageInput
          name="banner"
          label="Banner Image"
          max={1}
          value={formData?.banner ? [normalizeFile(formData.banner)] : []}
          onChange={(imgs) => setFormData({ ...formData, banner: imgs[0] || "" })}
        />

        {/* Main Image */}
        <MultipleImageInput
          name="image"
          label="Main Image"
          max={1}
          value={formData?.image ? [normalizeFile(formData.image)] : []}
          onChange={(imgs) => setFormData({ ...formData, image: imgs[0] || "" })}
        />

        {/* Multilingual Content */}
        {languages?.map((l) => (
          <div
            key={l.code}
            style={{ display: l.code === selectedLang ? 'block' : 'none' }}
            className="space-y-4"
          >
            <h2 className="subtitleText font-bold">Programs Content ({l.name})</h2>

            <div>
              <label className="block subtitleText font-medium mb-1">Title</label>
              <Input
                required
                className={"subtitleText h-12"}
                value={formData?.title?.[l.code] || ""}
                onChange={(e) => handleChange("title", l.code, e.target.value)}
              />
            </div>

            <div>
              <label className="block subtitleText font-medium mb-1">Description 1</label>
              <Textarea
                required
                className={"subtitleText h-36"}
                value={formData?.description1?.[l.code] || ""}
                onChange={(e) => handleChange("description1", l.code, e.target.value)}
              />
            </div>

            <div>
              <label className="block subtitleText font-medium mb-1">Description 2</label>
              <Textarea
                required
                className={"subtitleText h-36"}
                value={formData?.description2?.[l.code] || ""}
                onChange={(e) => handleChange("description2", l.code, e.target.value)}
              />
            </div>
          </div>
        ))}

        <button type="submit" className="mt-4 px-4 py-2 bg-primary text-white rounded">
          Submit
        </button>
      </form>
    </TabsContent>
  )
}
