'use client'
import React, { useState } from "react";
import { Minus, Plus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { addtoCart, deleteItemtoCart, gettoCart } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import toast from "react-hot-toast";
import { useSite } from "@/app/context/site";
import { useRouter } from "next/navigation";

const ShoppingCart = () => {
  const router = useRouter()
  const [data, getData, { loading }] = useFetch(gettoCart);
  const {  getcartdata } = useSite();


  const updateQuantity = async (id, newQuantity) => {
    
    const { success, message: msg, data, errorMessage } = await addtoCart({
      product: id,
      quantity: newQuantity
    });

    if (success) {
      toast.success(msg);
      getData();
    } else {
      toast.error(errorMessage || 'Failed to update quantity');
    }
  };

  const removeItem = async (id) => {
    try {
      const { success, message } = await deleteItemtoCart(id);
      if (success) {
        toast.success(message)
        await getData();
        await getcartdata()

      }
    } catch (error) {
      toast.error(error.message)
    }
  };



  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      {/* Table Header Skeleton */}
      <div className="grid grid-cols-12 gap-4 py-4 bg-[#F9FAFB] px-4">
        <div className="col-span-5 h-4 bg-gray-300 rounded"></div>
        <div className="col-span-3 h-4 bg-gray-300 rounded"></div>
        <div className="col-span-3 h-4 bg-gray-300 rounded"></div>
        <div className="col-span-1"></div>
      </div>

      {/* Cart Items Skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="grid grid-cols-12 gap-4 items-center p-4 border-b border-[#9A9A9A]">
          <div className="col-span-5 flex items-center space-x-4">
            <div className="w-[130px] h-[130px] bg-gray-300 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-48"></div>
              <div className="h-3 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
          <div className="col-span-3 flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="w-12 h-4 bg-gray-300 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
          <div className="col-span-3 text-center">
            <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
          </div>
          <div className="col-span-1 flex justify-center">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Main loading spinner
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <p className="text-gray-500 primaryText">Loading your cart...</p>
      </div>
    </div>
  );


  return (
    <div className="container mx-auto !my-[100px] bg-white">
      {/* Header */}
      <div className="text-center mb-20">
        <h1 className="secondaryText font-bold text-text italic">MY CART</h1>
      </div>

      {/* Show loading state */}
      {loading ? (
        // Option 1: Simple loading spinner (uncomment to use)
        // <LoadingSpinner />

        // Option 2: Detailed skeleton loading (current choice)
        <LoadingSkeleton />
      ) : data.length > 0 ? (
        <div>
          {/* Table Header */}
          <div className="grid grid-cols-12 sm:gap-4 gap-2 py-4 bg-[#F9FAFB]  sm:px-4 px-2 primaryText font-semibold textColorLight">
            <div className="col-span-5">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-3 text-center">Price</div>
            <div className="col-span-1"></div>
          </div>

          {/* Cart Items */}
          <div className="">
            {data.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-12 sm:gap-4 gap-2 items-center py-4 sm:px-4 px-2
                  border-b border-[#9A9A9A] 
                `}
              >
                {/* Product Info */}
                <div className="col-span-5 flex items-center space-x-4">
                  <div className="w-[130px] h-[130px] sm:flex hidden items-center justify-center">
                    {item.product.thumbnail_image ? (
                      <Image
                        src={item.product.thumbnail_image}
                        alt={item.product.name || "Product image"}
                        width={500}
                        height={500}
                        className="w-full h-full p-2 object-cover"
                      />
                    ) : (
                      <Image
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzUwMCcgZmlsbD0nI0VFRScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nNTAwJyBoZWlnaHQ9JzUwMCcgZmlsbD0nI2YyZjJmMicvPjx0ZXh0IHg9JzUwJScgeT0nNTAlJyBmb250LXNpemU9JzI0JyBmaWxsPScjOTk5JyB0ZXh0LWFuY2hvcj0nbWlkZGxlJz5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
                        alt="No image available"
                        width={500}
                        height={500}
                        className="w-full h-full p-2 object-cover blur-sm opacity-60"
                      />
                    )}

                  </div>
                  <div>
                    <h3 className="font-semibold primaryText text-black">
                      {item.product.name}
                    </h3>
                    <p className="subtitleText text-[#191919]">
                      Item: {item.product.item}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="col-span-3 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, - 1)}
                    className="w-8 h-8 flex items-center justify-center border cursor-pointer border-gray-300 rounded hover:bg-gray-100 transition-colors"

                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold primaryText text-black">
                    {item.quantity.toString().padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product._id, 1)}
                    className="w-8 h-8 flex items-center justify-center border cursor-pointer border-gray-300 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Price */}
                <div className="col-span-3 text-center">
                  <span className="font-semibold primaryText text-black">
                    ${(item.price).toFixed(2)}
                  </span>
                </div>

                {/* Remove Button */}
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => removeItem(item._id)}
                    className="w-6 h-6 flex items-center justify-center cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:!mt-[130px] !mt-[70px] sm:space-x-4 gap-5">
            <Button
              className="  text-white font-semibold primaryText cursor-pointer h-16 rounded-lg"
              onClick={()=> router.back()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Choose More Products"
              )}
            </Button>
            <Button
              className="  bg-secondary hover:bg-secondary/70 cursor-pointer text-white font-semibold primaryText h-16 rounded-lg"
              onClick={()=>router.push('/order')}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Checkout"
              )}
            </Button>
          </div>
        </div>
      ) : (
        /* Empty Cart Message */
        <div className="text-center py-16">
          <div className="mb-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"
                ></path>
              </svg>
            </div>
            <h3 className="font-semibold primaryText text-black mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Add some products to get started!
            </p>
            <Button
              className="text-white font-semibold primaryText cursor-pointer h-12 px-6 rounded-lg transition-colors"
              disabled={loading}
              onClick={()=> router.push('/products?search=tires')}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Start Shopping"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;