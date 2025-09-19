'use client'
import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { useI18n } from "@/app/provider/i18nProvider";
import { useFetch } from "@/app/helper/hooks";
import { fetchPublicSiteSettings } from "@/app/helper/backend";
import { Skeleton } from "@/components/ui/skeleton";

// Move navigationLinks outside component to prevent recreation on each render
const navigationLinks = [
  { id: 1, href: "/", label: "home" },
  { id: 2, href: "/about", label: "about" },
  { id: 3, href: "/services", label: "services" },
  { id: 4, href: "/portfolio", label: "portfolio" },
  { id: 5, href: "/blog", label: "blog" },
  { id: 6, href: "/contact", label: "contact" },
  { id: 7, href: "/careers", label: "careers" }
];

// Social media links configuration
const socialLinks = [
  { 
    href: "https://facebook.com", 
    icon: FaFacebookF, 
    label: "Facebook" 
  },
  { 
    href: "https://twitter.com", 
    icon: FaTwitter, 
    label: "Twitter" 
  },
  { 
    href: "https://instagram.com", 
    icon: FaInstagram, 
    label: "Instagram" 
  }
];

// Loading skeleton component
const FooterSkeleton = memo(() => (
  <div className="flex flex-col h-auto">
    {/* Header */}
    <header className="bg-[#2b0000] text-white py-10">
      <div className="container mx-auto flex items-center justify-between">
        <Skeleton className="h-6 w-28 bg-gray-700 rounded-md" />
        
        <div className="hidden md:flex gap-6">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-16 bg-gray-700 rounded-md" />
          ))}
        </div>
        
        <div className="flex gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-5 w-5 bg-gray-700 rounded-full" />
          ))}
        </div>
      </div>
      
      <div className="text-center py-2">
        <Skeleton className="h-3 w-80 mx-auto bg-gray-700 rounded-md" />
      </div>
    </header>

    <main className="flex-1 container mx-auto p-6">
      <Skeleton className="h-14 w-full rounded-xl" />
    </main>

    <footer className="bg-white text-center py-4 border-t">
      <Skeleton className="h-3 w-72 mx-auto rounded-md" />
    </footer>
  </div>
));

FooterSkeleton.displayName = 'FooterSkeleton';

// Navigation component
const Navigation = memo(({ navigationLinks, t }) => (
  <nav className="mb-3 md:mb-0">
    <ul className="flex flex-wrap text-white justify-center space-x-2 md:space-x-8 font-bold primaryText">
      {navigationLinks.map((link) => (
        <li key={link.id} className="text-sm md:text-lg">
          <Link
            href={link.href}
            className="hover:text-gray-300 transition-colors primaryText"
          >
            {t(link.label)}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
));

Navigation.displayName = 'Navigation';

// Social links component
const SocialLinks = memo(() => (
  <div className="hidden md:flex space-x-4 text-2xl">
    {socialLinks.map(({ href, icon: Icon, label }) => (
      <Link
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-gray-300 transition-colors"
        aria-label={label}
      >
        <Icon size={20} />
      </Link>
    ))}
  </div>
));

SocialLinks.displayName = 'SocialLinks';

// Address component
const AddressInfo = memo(({ address, phone }) => (
  <div className="text-center md:mt-9">
    <p className="text-white text-xs md:text-2xl primaryText">
      {address && phone ? `${address} - ${phone}` : address || phone || ''}
    </p>
  </div>
));

AddressInfo.displayName = 'AddressInfo';

// Main Footer component
const Footer = memo(() => {
  const { t } = useI18n();
  const [data, , { loading }] = useFetch(fetchPublicSiteSettings);

  if (loading) {
    return <FooterSkeleton />;
  }

  return (
    <footer className="">
      <div className="w-full py-4 md:py-10 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo Section */}
            <div className="mb-6 md:mb-0 md:flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Company Logo"
                  width={163}
                  height={54}
                  className="h-14 w-auto"
                  priority={false}
                  sizes="(max-width: 768px) 120px, 163px"
                />
              </Link>
            </div>

            {/* Navigation */}
            <Navigation navigationLinks={navigationLinks} t={t} />

            {/* Social Media Links */}
            <SocialLinks />
          </div>

          {/* Address Information */}
          <AddressInfo address={data?.site_address} phone={data?.site_phone} />
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-2 bg-white">
        <p className="primaryText md:p-4">
          {data?.site_footer}
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;