'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star } from "lucide-react"
import Product from "../product/product"
import Header from "@/components/commons/header"
import { productBrand, productbycategory_brand } from "@/app/helper/backend"
import { useFetch } from "@/app/helper/hooks"
import TabProduct from "./tab_product"





export default function ProductShowcase({title, subTitle, query}) {
    const [brand, getBrand, {loading: brandLoading}] = useFetch(productBrand, {search: query, limit: 8} )
   
    
    if(brandLoading){
        return <p>loading</p>
    }
    const defaultValue = brand.docs[0]

    return (
        <div className="py-10">
            <Header
                title={title}
                subTitle={subTitle}
            />

            <Tabs defaultValue={defaultValue.name}className="w-full mt-5">
                <TabsList className="flex w-full md:gap-8 mb-8 bg-transparent h-auto overflow-x-auto  scrollbar">
                    {brand.docs.map((item, idx) => (
                        <TabsTrigger
                            key={idx}
                            value={item.name}
                            className="rounded-none lg:py-3 py-2 border-b-4 data-[state=active]:border-b-[#E42300] data-[state=active]:shadow-none cursor-pointer border-b-gray-400 transition-colors subtitleText font-bold"
                        >
                            {item.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {brand.docs.map((item, idx) => (
                    <TabsContent key={idx} value={item.name} className="mt-6">
                       <TabProduct category={query} brand={item.name}/>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
