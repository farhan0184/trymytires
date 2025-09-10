'use client'
import { fetchPromotionProducts, fetchPromotionProductsByCategory } from '@/app/helper/backend';
import { useFetch } from '@/app/helper/hooks';
import { columnFormatter } from '@/app/helper/util';
import { useI18n } from '@/app/provider/i18nProvider';
import PromotionCard from '@/components/site/promotion/card';
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'
const data = [
    {
        id: 1,
        image: "/single_tire.png?height=200&width=200",
        title: "BR 001203",
        subtitle:
            "Closeout on BRIDGESTONE ALENZA AS ULTRA 295/40R21 while supplies last ",
        discountedDate: "2024-06-30",
        daysDiscount: "30% ",
        days: "Monday",
    },
    {
        id: 2,
        image: "/single_tire.png?height=200&width=200",
        title: "Goodyear SPORT",
        subtitle:
            "Closeout on BRIDGESTONE ALENZA AS ULTRA 295/40R21 while supplies last ",
        discountedDate: "2024-07-15",
        daysDiscount: "50% ",
        days: "Tuesday",
    },
    {
        id: 3,
        image: "/single_tire.png?height=200&width=200",
        title: "Car & Jeep Special",
        subtitle:
            "Closeout on BRIDGESTONE ALENZA AS ULTRA 295/40R21 while supplies last ",
        discountedDate: "2024-07-20",
        daysDiscount: "25% ",
        days: "Wednesday",
    },
    {
        id: 4,
        image: "/single_tire.png?height=200&width=200",
        title: "Sports Car",
        subtitle:
            "Closeout on BRIDGESTONE ALENZA AS ULTRA 295/40R21 while supplies last",
        discountedDate: "2024-08-01",
        daysDiscount: "40%",
        days: "Thursday",
    }
];

export default function Promotion() {
    const router = useRouter();
    const {langCode} = useI18n()

    const [promotionData, setPromotionData, { loading }] = useFetch(fetchPromotionProductsByCategory)



    if (loading) {
        return <div>Loading...</div>
    }


    const firstTire = promotionData[0]?.products[0]
    const tires = promotionData[0].products.slice(1, 5)
    const firstWheel = promotionData[1]?.products[0]
    const wheels = promotionData[1]?.products.slice(1, 5)
    const firstAccessories = promotionData[2]?.products[0]
    const accessories = promotionData[2]?.products.slice(1, 5)



    return (
        <div>
            <div className='text-center my-16'>
                <h1 className="secondaryText font-bold text-text italic uppercase">Promotions & Rebates</h1>
            </div>

            {firstTire !== undefined && <div className='container mx-auto  pb-10'>
                <div className='flex lg:flex-row flex-col lg:gap-10 gap-5'>
                    <div className='lg:w-[70%] w-full grid lg:grid-cols-2 gap-5 lg:order-1 order-2'>
                        {tires.map((item, idx) => (
                            <PromotionCard key={idx} item={item} router={router} />
                        ))

                        }
                    </div>
                    <Card className="relative lg:w-[30%] w-full py-10  overflow-hidden lg:order-2 order-1">
                        {/* Discount Badge */}


                        <CardContent className="flex flex-col items-center  justify-center text-center mt-6 z-30">
                            {/* Tire Image */}

                            <div className='relative'>
                                <div className="absolute top-4 md:top-5 right-10 lg:w-[80px] w-[60px] h-[40px] bg-primary-foreground skew-x-[-10deg] flex items-center justify-center">
                                    <div className="skew-x-[30deg] text-white text-center space-y-1.5">
                                        <p className="text-sm md:text-lg font-bold italic leading-none">{firstTire.discount_type === 'flat' && "$"}{firstTire.discount_value} {firstTire.discount_type !== 'flat' && "%"}</p>
                                        <p className="text-[8px] md:text-[10px] -mt-1 md:-mt-2 uppercase">Discount</p>
                                    </div>
                                </div>

                                <Image
                                    src={firstTire?.thumbnail_image}
                                    alt="Goodyear Tire"
                                    width={400}
                                    height={400}
                                    className=" w-fit lg:h-[250px] h-[200px]  object-contain"
                                    loading="lazy"
                                />
                            </div>

                            {/* Title */}
                            <h2 className="uppercase primaryText font-bold italic text-black mt-4">{firstTire.name}</h2>

                            {/* Description */}
                            <p className="text-xs md:text-base mt-1 text-black uppercase italic">
                                {columnFormatter(firstTire.description, langCode)}
                            </p>

                            {/* Sale End */}
                            <p className="text-xs md:text-base mt-1 text-black uppercase italic">
                                SALE ENDS ON SATURDAY 05/31/2025
                            </p>

                            {/* Button */}
                            <Button onClick={() => router.push(`/products/${firstTire?._id}`)} className="mt-4 px-5 py-2  text-xs md:text-base rounded-md text-white" >
                                SHOW ITEM
                            </Button>
                        </CardContent>
                        <div className='absolute bottom-0 bg-gradient-to-b from-white to-[#FF855D] w-full h-[60%] z-0'>

                        </div>
                    </Card>
                </div>

            </div>}
            {firstWheel !== undefined && <div className='container mx-auto pb-10'>
                <div className='flex lg:flex-row flex-col lg:gap-10 gap-5'>
                    <div className='lg:w-[70%] w-full grid lg:grid-cols-2 gap-5 order-2'>
                        {wheels.map((item, idx) => (
                            <PromotionCard key={idx} item={item} router={router}/>
                        ))

                        }
                    </div>
                    <Card className="relative lg:w-[30%] w-full p-0  overflow-hidden order-1 ">
                        {/* Discount Badge */}


                        <CardContent className="flex flex-col items-center justify-center text-center mt-6 z-50">
                            {/* Tire Image */}

                            <div className='relative'>
                                <div className="absolute top-4 md:top-5 right-10 lg:w-[80px] w-[60px] h-[40px] bg-primary-foreground skew-x-[-10deg] flex items-center justify-center">
                                    <div className="skew-x-[30deg] text-white text-center space-y-1.5">
                                        <p className="text-sm md:text-lg font-bold italic leading-none">{firstWheel.discount_type === 'flat' && "$"}{firstWheel.discount_value} {firstWheel.discount_type !== 'flat' && "%"}</p>
                                        <p className="text-[8px] md:text-[10px] -mt-1 md:-mt-2 uppercase">Discount</p>
                                    </div>
                                </div>

                                <Image
                                    src={firstWheel.thumbnail_image || "/placeholder.svg"}
                                    alt="Goodyear Tire"
                                    width={400}
                                    height={400}
                                    className=" w-fit lg:h-[300px] h-[200px] object-contain"
                                    loading="lazy"
                                />
                            </div>

                            {/* Title */}
                            <h2 className="uppercase primaryText font-bold italic text-black mt-4">{firstWheel?.name}</h2>

                            {/* Description */}
                            <p className="text-xs md:text-base mt-1 text-black uppercase italic px-5">
                                {columnFormatter(firstWheel?.description, langCode, 100)}
                            </p>

                            {/* Sale End */}
                            <p className="text-xs md:text-base mt-1 text-black uppercase italic">
                                SALE ENDS ON SATURDAY 05/31/2025
                            </p>

                            {/* Button */}
                            <Button onClick={() => router.push(`/products/${firstWheel?._id}`)} className="mt-4 px-5 py-2 lg:mb-0 mb-10 text-xs md:text-base rounded-md text-white" >
                                SHOW ITEM
                            </Button>
                        </CardContent>
                        <div className='absolute bottom-0 bg-gradient-to-b from-white to-[#FF855D] w-full h-[60%] z-0'>

                        </div>
                    </Card>
                </div>

            </div>}
            {firstAccessories !== undefined && <div className='container mx-auto pb-10'>
                <div className='flex lg:flex-row flex-col lg:gap-10 gap-5'>
                    <div className='lg:w-[70%] grid lg:grid-cols-2 gap-5 lg:order-1 order-2'>
                        {firstAccessories?.map((item, idx) => (
                            <PromotionCard key={idx} item={item} router={router}/>
                        ))}
                    </div>
                    <Card className="relative lg:w-[30%] w-full p-0  overflow-hidden lg:order-2 order-1">
                        {/* Discount Badge */}


                        <CardContent className="flex flex-col items-center justify-center text-center mt-6 z-30">
                            {/* Tire Imag?e */}

                            <div className='relative'>
                                <div className="absolute top-4 md:top-5 right-10 w-[80px] h-[40px] bg-primary-foreground skew-x-[-10deg] flex items-center justify-center">
                                    <div className="skew-x-[30deg] text-white text-center space-y-1.5">
                                        <p className="text-sm md:text-lg font-bold italic leading-none">{accessories?.discount_type === 'flat' && "$"}{accessories?.discount_value} {accessories?.discount_type !== 'flat' && "%"}</p>
                                        <p className="text-[8px] md:text-[10px] -mt-1 md:-mt-2 uppercase">Discount</p>
                                    </div>
                                </div>

                                <Image
                                    src={accessories?.thumbnail_image || "/placeholder.svg"}
                                    alt="Goodyear Tire"
                                    width={400}
                                    height={400}
                                    className=" w-fit lg:h-[300px] h-[200px] object-contain"
                                    loading="lazy"
                                />
                            </div>

                            {/* Title */}
                            <h2 className="uppercase primaryText font-bold italic text-black mt-4">{accessories?.name}</h2>

                            {/* Description */}
                            <p className="text-xs md:text-base mt-1 text-black uppercase italic">
                               {columnFormatter(accessories?.description, langCode)}
                            </p>

                            {/* Sale End */}
                            <p className="text-xs md:text-base mt-1 text-black uppercase italic">
                                SALE ENDS ON SATURDAY 05/31/2025
                            </p>

                            {/* Button */}
                            <Button onClick={() => router.push(`/products/${accessories?._id}`)} className="mt-4 px-5 py-2 lg:mb-0 mb-10 text-xs md:text-base rounded-md text-white" >
                                SHOW ITEM
                            </Button>
                        </CardContent>
                        <div className='absolute bottom-0 bg-gradient-to-b from-white to-[#FF855D] w-full h-[60%] z-0'>

                        </div>
                    </Card>
                </div>

            </div>}
        </div>
    )
}
