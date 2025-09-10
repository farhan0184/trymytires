import { productbycategory_brand } from '@/app/helper/backend'
import React from 'react'
import Product from '../product/product'
import { useFetch } from '@/app/helper/hooks'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function TabProduct({ category, brand }) {
    const router =  useRouter()

    const [product, getProduct, { loading: productLoading }] = useFetch(productbycategory_brand, { category: category, brand: brand })
    if (productLoading) {
        return (<div className="min-h-[600px] flex flex-col justify-between"><div className="flex items-center justify-center flex-1 text-muted-foreground">
            <p className="tertiaryText text-center">{brand} {category} products loading...</p>
        </div></div>)
    }

    return (
        <div className="min-h-[600px] flex flex-col justify-between">
            {product ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                        {product.map((tire) => (
                            <Product key={tire._id} data={tire} />
                        ))}
                    </div>
                    <div className="text-center mt-auto">
                        <Button onClick={()=>router.push(`/products?search=${brand.toLowerCase()}`)} className="h-12 border rounded-md tertiaryText text-black bg-white cursor-pointer hover:bg-white">
                            View All {brand} Tires
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center flex-1 text-muted-foreground">
                    <p className="tertiaryText text-center">{brand} tire products coming soon...</p>
                </div>
            )}
        </div>
    )
}
