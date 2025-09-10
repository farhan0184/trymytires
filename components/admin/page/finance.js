'use client'
import React, { useEffect, useState } from 'react'
import TabsContent from './tab_layout'
import { fetchPageData, postSingleImage, updatePageData } from '@/app/helper/backend'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import MultipleImageInput from '@/components/commons/multipleImageInput'
import { useFetch } from '@/app/helper/hooks'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'

export default function SnapFinancePage({ languages, setSelectedLang, selectedLang }) {
  const [formData, setFormData] = useState({})
  const [data, getData, { loading }] = useFetch(fetchPageData, { slug: "finance" })

  useEffect(() => {
    if (data?.content) setFormData(data.content)
  }, [data])

  if (!data && loading) return <p>Loading...</p>

  const normalizeFile = (file) => {
    if (!file) return null
    if (typeof file === 'string') return { url: file }
    if (file.url) return file
    return file
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const uploadImage = async (img) => {
        if (img && typeof img !== 'string' && img.originFileObj) {
          const res = await postSingleImage({ image: img.originFileObj })
          return res?.data?.image || res
        }
        return typeof img === 'object' && img.url ? img.url : img
      }

      const left_image1 = await uploadImage(formData.left_image1)
      const left_image2 = await uploadImage(formData.left_image2)
      const right_image = await uploadImage(formData.right_image)

      const snapList = await Promise.all(
        (formData?.snap?.list || []).map(async (item) => ({
          ...item,
          image: await uploadImage(item.image)
        }))
      )

      const payload = {
        ...formData,
        left_image1,
        left_image2,
        right_image,
        snap: { ...formData.snap, list: snapList }
      }

      const updateData = await updatePageData({ _id: data?._id, content: payload })

      if (updateData.success) {
        toast.success(updateData.message)
        getData({ slug: 'finance' })
      } else {
        toast.error(updateData.errorMessage)
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    }
  }

  const handleChange = (field, lang, value, parent = null) => {
    setFormData((prev) => {
      if (parent) {
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [field]: { ...prev[parent]?.[field], [lang]: value }
          }
        }
      }
      return { ...prev, [field]: { ...prev?.[field], [lang]: value } }
    })
  }

  return (
    <TabsContent>
      {/* Language Selector */}
      <div className="flex flex-wrap justify-start gap-3 mt-4 mb-4">
        {languages?.map((l, index) => (
          <button
            key={index}
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

      <form onSubmit={handleSubmit} className="space-y-6 flex gap-5 flex-wrap">
        {/* Images */}
        <MultipleImageInput
          name="left_image1"
          label="Left Image 1"
          max={1}
          value={normalizeFile(formData.left_image1) ? [normalizeFile(formData.left_image1)] : []}
          onChange={(imgs) => setFormData({ ...formData, left_image1: imgs[0] || '' })}
        />

        <MultipleImageInput
          name="left_image2"
          label="Left Image 2"
          max={1}
          value={normalizeFile(formData.left_image2) ? [normalizeFile(formData.left_image2)] : []}
          onChange={(imgs) => setFormData({ ...formData, left_image2: imgs[0] || '' })}
        />

        <MultipleImageInput
          name="right_image"
          label="Right Image"
          max={1}
          value={normalizeFile(formData.right_image) ? [normalizeFile(formData.right_image)] : []}
          onChange={(imgs) => setFormData({ ...formData, right_image: imgs[0] || '' })}
        />

        {/* Multilingual Fields */}
        {languages?.map((l) => (
          <div
            key={l.code}
            style={{ display: l.code === selectedLang ? 'block' : 'none' }}
            className="space-y-4"
          >
            <h2 className="subtitleText font-bold">Snap Finance Content ({l.name})</h2>

            <div>
              <label className="block subtitleText font-medium mb-1">Title</label>
              <Input
                required
                className={"subtitleText h-12"}
                value={formData?.title?.[l.code] || ''}
                onChange={(e) => handleChange('title', l.code, e.target.value)}
              />
            </div>

            <div>
              <label className="block subtitleText font-medium mb-1">Description</label>
              <Textarea
                required
                 className={"subtitleText h-36"}
                value={formData?.description?.[l.code] || ''}
                onChange={(e) => handleChange('description', l.code, e.target.value)}
              />
            </div>

            <h3 className="text-md font-semibold mt-4">Snap Section</h3>

            <div>
              <label className="block subtitleText font-medium mb-1">Snap Title</label>
              <Input
              className={"subtitleText h-12"}
                value={formData?.snap?.title?.[l.code] || ''}
                onChange={(e) => handleChange('title', l.code, e.target.value, 'snap')}
              />
            </div>

            <div>
              <label className="block subtitleText font-medium mb-1">Snap Description</label>
              <Textarea
               className={"subtitleText h-36"}
                value={formData?.snap?.description?.[l.code] || ''}
                onChange={(e) => handleChange('description', l.code, e.target.value, 'snap')}
              />
            </div>

            {/* Snap List Items */}
            <div className="mt-6 space-y-4">
              <h3 className="text-md font-semibold">Snap List Items</h3>

              {(formData?.snap?.list || []).map((item, idx) => (
                <div key={idx} className="border p-4 rounded-md space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const newList = [...formData.snap.list]
                      newList.splice(idx, 1)
                      setFormData({ ...formData, snap: { ...formData.snap, list: newList } })
                    }} 
                    className="absolute top-2 right-2 cursor-pointer text-red-500 subtitleText"
                  >
                    <Trash2/>
                  </button>

                  <MultipleImageInput
                    name={`snap_list_${idx}`}
                    label={`Snap List Image ${idx + 1}`}
                    max={1}
                    value={item.image ? [normalizeFile(item.image)] : []}
                    onChange={(imgs) => {
                      const newList = [...formData.snap.list]
                      newList[idx].image = imgs[0] || ''
                      setFormData({ ...formData, snap: { ...formData.snap, list: newList } })
                    }}
                  />

                  <div>
                    <label className="block subtitleText font-medium mb-1">Snap List Title ({l.name})</label>
                    <Input
                      value={item?.title?.[l.code] || ''}
                       className={"subtitleText h-12"}
                      onChange={(e) => {
                        const newList = [...formData.snap.list]
                        newList[idx].title = { ...newList[idx].title, [l.code]: e.target.value }
                        setFormData({ ...formData, snap: { ...formData.snap, list: newList } })
                      }}
                    />
                  </div>

                  <div>
                    <label className="block subtitleText font-medium mb-1">Snap List Description ({l.name})</label>
                    <Textarea
                      value={item?.description?.[l.code] || ''}
                       className={"subtitleText h-36"}
                      onChange={(e) => {
                        const newList = [...formData.snap.list]
                        newList[idx].description = { ...newList[idx].description, [l.code]: e.target.value }
                        setFormData({ ...formData, snap: { ...formData.snap, list: newList } })
                      }}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newList = [...(formData.snap?.list || []), { image: '', title: {}, description: {} }]
                  setFormData({ ...formData, snap: { ...formData.snap, list: newList } })
                }}
                className="mt-2 px-3 py-1 bg-gray-200 subtitleText cursor-pointer text-gray-700 rounded hover:bg-gray-300"
              >
                + Add Item
              </button>
            </div>
          </div>
        ))}

        <button type="submit" className="mt-4 px-4 py-2 bg-primary subtitleText cursor-pointer text-white rounded">
          Submit
        </button>
      </form>
    </TabsContent>
  )
}
