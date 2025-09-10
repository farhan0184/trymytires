'use client'
import React, { useEffect, useState } from 'react'
import TabsContent from './tab_layout'
import { fetchPageData, postSingleImage, updatePageData } from '@/app/helper/backend'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import MultipleImageInput from '@/components/commons/multipleImageInput'
import { useFetch } from '@/app/helper/hooks'
import toast from 'react-hot-toast'

export default function HomePage({ languages, setSelectedLang, selectedLang }) {
  const [formData, setFormData] = useState({})
  const [data, getData, { loading }] = useFetch(fetchPageData, { slug: "home_page" })

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
      if (!formData.promotional_image) {
        toast.error('Promotional image is required')
        return
      }

      const updatedForm = { ...formData }

      if (Array.isArray(updatedForm.slider_images)) {
        updatedForm.slider_images = await Promise.all(
          updatedForm.slider_images.map(async (img) => {
            if (img && typeof img !== 'string' && img.originFileObj) {
              const res = await postSingleImage({ image: img.originFileObj })
              return res?.data?.image || res
            }
            return img?.url || img
          })
        )
      }

      let promoImg = updatedForm.promotional_image
      if (promoImg && typeof promoImg !== 'string' && promoImg.originFileObj) {
        const res = await postSingleImage({ image: promoImg.originFileObj })
        promoImg = res?.data?.image || res
      }
      updatedForm.promotional_image = promoImg

      if (Array.isArray(updatedForm?.faq?.list)) {
        updatedForm.faq.list = await Promise.all(
          updatedForm.faq.list.map(async (item) => {
            let img = item.image
            if (img && typeof img !== 'string' && img.originFileObj) {
              const res = await postSingleImage({ image: img.originFileObj })
              img = res?.data?.image || res
            }
            return { ...item, image: img }
          })
        )
      }

      const updateData = await updatePageData({ _id: data?._id, content: updatedForm })
      if (updateData.success) {
        toast.success(updateData.message)
        getData({ slug: "home_page" })
      } else {
        toast.error(updateData.errorMessage)
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    }
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
            className={`cursor-pointer px-3 py-1 rounded-full tertiaryText  font-medium transition-colors duration-200 ${
              l.code === selectedLang
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Slider Images */}
        <div>
          <MultipleImageInput
            name="slider_images"
            label="Slider Images"
            max={5}
            value={formData?.slider_images?.map(normalizeFile) || []}
            onChange={(imgs) =>
              setFormData({ ...formData, slider_images: imgs })
            }
          />
        </div>

        {/* Promotional Image */}
        <div>
          <MultipleImageInput
            name="promotional_image"
            label="Promotional Image"
            max={1}
            value={formData?.promotional_image ? [normalizeFile(formData.promotional_image)] : []}
            onChange={(imgs) =>
              setFormData({ ...formData, promotional_image: imgs[0] || '' })
            }
          />
        </div>

        {/* About Section */}
        {languages?.map((l) => (
          <div
            key={l.code}
            style={{ display: l.code === selectedLang ? 'block' : 'none' }}
            className="space-y-4"
          >
            <h2 className=" font-bold subtitleText">About ({l.name})</h2>
            <Input
              required
              value={formData?.about?.title?.[l.code] || ''}
              className={"subtitleText h-12"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  about: {
                    ...formData.about,
                    title: { ...formData?.about?.title, [l.code]: e.target.value },
                  },
                })
              }
            />
            <Textarea
              required
              value={formData?.about?.first_description?.[l.code] || ''}
              className={"subtitleText h-32"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  about: {
                    ...formData.about,
                    first_description: {
                      ...formData?.about?.first_description,
                      [l.code]: e.target.value,
                    },
                  },
                })
              }
            />
            <Textarea
              required
              value={formData?.about?.secound_description?.[l.code] || ''}
              className={"subtitleText h-32"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  about: {
                    ...formData.about,
                    secound_description: {
                      ...formData?.about?.secound_description,
                      [l.code]: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
        ))}

        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold">FAQ</h2>
          {languages?.map((l) => (
            <div
              key={l.code}
              style={{ display: l.code === selectedLang ? 'block' : 'none' }}
            >
              <Input
                required
                value={formData?.faq?.title?.[l.code] || ''}
                className={"subtitleText h-12"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    faq: {
                      ...formData.faq,
                      title: {
                        ...formData?.faq?.title,
                        [l.code]: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
          ))}

          {formData?.faq?.list?.map?.((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg bg-gray-50 space-y-4"
            >
              <MultipleImageInput
                label="FAQ Image"
                name={`faq_image_${index}`}
                max={1}
                
                value={item.image ? [normalizeFile(item.image)] : []}
                onChange={(imgs) => {
                  const updated = [...formData.faq.list]
                  updated[index].image = imgs[0]
                  setFormData({
                    ...formData,
                    faq: { ...formData.faq, list: updated },
                  })
                }}
              />

              {languages?.map((l) => (
                <div
                  key={l.code}
                  style={{
                    display: l.code === selectedLang ? 'block' : 'none',
                  }}
                  className="space-y-2"
                >
                  <Input
                    required
                    value={item.title?.[l.code] || ''}
                    className={"subtitleText h-12"}
                    onChange={(e) => {
                      const updated = [...formData.faq.list]
                      updated[index].title = {
                        ...item.title,
                        [l.code]: e.target.value,
                      }
                      setFormData({
                        ...formData,
                        faq: { ...formData.faq, list: updated },
                      })
                    }}
                  />
                  <Textarea
                    required
                    value={item.description?.[l.code] || ''}
                    className={"subtitleText h-36"}
                    onChange={(e) => {
                      const updated = [...formData.faq.list]
                      updated[index].description = {
                        ...item.description,
                        [l.code]: e.target.value,
                      }
                      setFormData({
                        ...formData,
                        faq: { ...formData.faq, list: updated },
                      })
                    }}
                  />
                  <Input
                    required
                    value={item.feature_title?.[l.code] || ''}
                    className={"subtitleText h-12"}
                    onChange={(e) => {
                      const updated = [...formData.faq.list]
                      updated[index].feature_title = {
                        ...item.feature_title,
                        [l.code]: e.target.value,
                      }
                      setFormData({
                        ...formData,
                        faq: { ...formData.faq, list: updated },
                      })
                    }}
                  />

                  <div className="space-y-2">
                    {item.feature?.[l.code]?.map?.((f, fIdx) => (
                      <div key={fIdx} className="flex gap-2">
                        <Input
                          required
                          value={f}
                          className={"subtitleText h-12"}
                          onChange={(e) => {
                            const updated = [...formData.faq.list]
                            const features = [...(item.feature?.[l.code] || [])]
                            features[fIdx] = e.target.value
                            updated[index].feature = {
                              ...item.feature,
                              [l.code]: features,
                            }
                            setFormData({
                              ...formData,
                              faq: { ...formData.faq, list: updated },
                            })
                          }}
                        />
                        <button
                          type="button"
                          className="cursor-pointer px-2 bg-red-500 text-white rounded"
                          onClick={() => {
                            const updated = [...formData.faq.list]
                            const features = [...(item.feature?.[l.code] || [])]
                            features.splice(fIdx, 1)
                            updated[index].feature = {
                              ...item.feature,
                              [l.code]: features,
                            }
                            setFormData({
                              ...formData,
                              faq: { ...formData.faq, list: updated },
                            })
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="cursor-pointer px-3 py-1 bg-green-500 text-white rounded tertiaryText"
                      onClick={() => {
                        const updated = [...formData.faq.list]
                        const features = [...(item.feature?.[l.code] || [])]
                        features.push('')
                        updated[index].feature = {
                          ...item.feature,
                          [l.code]: features,
                        }
                        setFormData({
                          ...formData,
                          faq: { ...formData.faq, list: updated },
                        })
                      }}
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="cursor-pointer px-3 py-1 bg-red-600 text-white rounded tertiaryText"
                onClick={() => {
                  const updated = [...formData.faq.list]
                  updated.splice(index, 1)
                  setFormData({
                    ...formData,
                    faq: { ...formData.faq, list: updated },
                  })
                }}
              >
                Remove FAQ Item
              </button>
            </div>
          ))}

          <button
            type="button"
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded tertiaryText"
            onClick={() => {
              setFormData({
                ...formData,
                faq: {
                  ...formData.faq,
                  list: [
                    ...(formData?.faq?.list || []),
                    {
                      image: '',
                      title: {},
                      description: {},
                      feature_title: {},
                      feature: {},
                    },
                  ],
                },
              })
            }}
          >
            + Add FAQ Item
          </button>
        </div>

        <button
          type="submit"
          className="cursor-pointer mt-4 px-4 py-2 bg-primary text-white rounded subtitleText"
        >
          Submit
        </button>
      </form>
    </TabsContent>
  )
}
