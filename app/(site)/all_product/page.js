"use client"
import { fetchPageData, productBrandAll } from '@/app/helper/backend'
import { useFetch } from '@/app/helper/hooks'
import { columnFormatter } from '@/app/helper/util'
import { useI18n } from '@/app/provider/i18nProvider'
import Header from '@/components/commons/header'
import ALLBrands from '@/components/site/all_product/all_brand'
import ProductShowcase from '@/components/site/all_product/tabs_product'
import Image from 'next/image'
import React from 'react'

export default function AllProductsPage() {
  const [data, getData, {loading}] = useFetch(fetchPageData, {slug:"products"})
  const {langCode} = useI18n()

  
  return (
    <div>
      <div className="relative h-[80vh] w-full">
        <Image
          src="/Group1597883423.png" // or your uploaded one
          alt="hero image"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className='container mx-auto'>
        <ProductShowcase title={columnFormatter(data?.content?.tire?.title,langCode)} subTitle={columnFormatter(data?.content?.tire?.description,langCode)} query={'tires'}/>
        <ProductShowcase title={columnFormatter(data?.content?.wheel?.title,langCode)} subTitle={columnFormatter(data?.content?.wheel?.description,langCode)} query={'wheels'}/>
        <ProductShowcase title={columnFormatter(data?.content?.accessories?.title,langCode)} subTitle={columnFormatter(data?.content?.accessories?.description,langCode)} query={'wheels'}/>

        <Header title={columnFormatter(data?.content?.brands?.title,langCode)} subTitle={columnFormatter(data?.content?.brands?.description,langCode)}/>

        <ALLBrands/>
        
      </div>
    </div>
  )
}
