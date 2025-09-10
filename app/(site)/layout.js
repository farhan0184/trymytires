import Footer from '@/components/site/common/footer'
import NavBar from '@/components/site/common/navbar'
import React from 'react'
import SiteProvider from '../context/site'
import { VehicleProvider } from '../provider/vehicleProvider'

export default function SiteLayout({ children }) {
  return (
    <SiteProvider>
      <VehicleProvider>
        <NavBar />
        {children}
        <Footer />
      </VehicleProvider>
    </SiteProvider>
  )
}
