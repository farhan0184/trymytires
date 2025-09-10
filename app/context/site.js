"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../helper/hooks";
import { gettoCart } from "../helper/backend";


const SiteContext = createContext({});

const SiteProvider = ({ children }) => {
  // Cart State
  const [countCartQuantity, setCountCartQuantity] = useState(0);
  const [cartdata, getcartdata, { loading: cartloading }] = useFetch(
    gettoCart,
    {}
  );
  

  // Update cart quantity when cartdata changes
  useEffect(() => {
    if (cartdata?.length > 0) {
      setCountCartQuantity(cartdata.length);
    } else {
      setCountCartQuantity(0);
    }
  }, [cartdata]);

  // Fetch cart on mount
  useEffect(() => {
    getcartdata();
  }, []);


  // Only expose cart-related data
  const siteSettingsData = {
    countCartQuantity,
    setCountCartQuantity,
    cartdata,
    getcartdata,
  };

  return (
    <SiteContext.Provider value={siteSettingsData}>
      {children}
    </SiteContext.Provider>
  );
};

// Hook to access context
export const useSite = () => useContext(SiteContext);
 
export default SiteProvider;
