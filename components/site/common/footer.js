'use client'
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { useI18n } from "@/app/provider/i18nProvider";
import { useSite } from "@/app/context/site";
import { useFetch } from "@/app/helper/hooks";
import { fetchPublicSiteSettings } from "@/app/helper/backend";
import { Skeleton } from "@/components/ui/skeleton";

const navigationLinks = [
  { id: "home", href: "/", label: "Home" },
  { id: "tires", href: "/products?search=tires", label: "Tires" },
  { id: "wheels", href: "/products?search=wheels", label: "Wheels" },
  {
    id: "accessories",
    href: "/products?search=accessories",
    label: "Accessories",
  },
  { id: "products", href: "/all_product", label: "Products" },
  { id: "programs", href: "/program", label: "Programs & Services" },
  { id: "contact", href: "/contact", label: "Contact Us" },
  { id: "about", href: "/aboutus", label: "About Us" },
];

const Footer = () => {
  const { t } = useI18n()
  const [data, getData, { loading }] = useFetch(fetchPublicSiteSettings)
  if (loading) {
    return <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-[#2b0000] text-white py-10">
        <div className="container mx-auto flex items-center justify-between ">
          {/* Logo */}
          <Skeleton className="h-6 w-28 bg-gray-700 rounded-md" />

          {/* Navigation */}
          <div className="hidden md:flex gap-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-4 w-16 bg-gray-700 rounded-md"
              />
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <Skeleton className="h-5 w-5 bg-gray-700 rounded-full" />
            <Skeleton className="h-5 w-5 bg-gray-700 rounded-full" />
            <Skeleton className="h-5 w-5 bg-gray-700 rounded-full" />
          </div>
        </div>

        {/* Address Line */}
        <div className="text-center py-2">
          <Skeleton className="h-3 w-80 mx-auto bg-gray-700 rounded-md" />
        </div>
      </header>

      {/* Main Content Placeholder */}
      <main className="flex-1 container mx-auto p-6">
        <Skeleton className="h-48 w-full rounded-xl" />
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-4 border-t">
        <Skeleton className="h-3 w-72 mx-auto rounded-md" />
      </footer>
    </div>
  }
  return (
    <footer className="">
      <div className="w-full py-4 md:py-10 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left side - Logo */}
            <div className="mb-6 md:mb-0 md:flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png?height=40&width=120"
                  alt="Company Logo"
                  width={163}
                  height={54}
                  className="h-14 w-auto"
                />
              </Link>
            </div>

            {/* Middle - Navigation */}
            <nav className="mb-3 md:mb-0 ">
              <ul className="flex flex-wrap text-white justify-center  space-x-2 md:space-x-8 font-bold primaryText ">
                {navigationLinks.map((link) => (
                  <li key={link.id} className="text-sm md:text-lg">
                    <Link
                      href={link.href}
                      className=" hover:text-gray-300 transition-colors primaryText"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right side - Social icons */}
            <div className="hidden md:flex space-x-4 text-2xl">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={20} />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </Link>
            </div>
          </div>
          <div className="text-center md:mt-9">
            <p className="text-white text-xs md:text-2xl primaryText">
              {data?.site_address} - {data?.site_phone}
            </p>
          </div>
        </div>
      </div>
      <div className="text-center mt-2 bg-white ">
        <p className="primaryText md:p-4">
          {data?.site_footer}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
