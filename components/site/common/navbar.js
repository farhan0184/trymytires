"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, Globe, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/app/helper/hooks";
import { MdOutlineShoppingCart } from "react-icons/md";
import Image from "next/image";
import Button from "./button";
import { useUser } from "@/app/context/user";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import { useSite } from "@/app/context/site";
import { useI18n } from "@/app/provider/i18nProvider";

const publicNavItems = [
  { title: "HOME", href: "/" },
  { title: "TIRES", href: "/products?search=tires" },
  { title: "WHEELS", href: "/products?search=wheels" },
  { title: "ACCESSORIES", href: "/products?search=accessories" },
  { title: "PRODUCTS", href: "/all_product" },
  { title: "PROGRAMS & SERVICES", href: "/program" },
  { title: "CONTACT US", href: "/contact" },
  { title: "ABOUT US", href: "/aboutus" },
];

const protectedNavItems = [
  {
    title: "ORDERS & DELIVERIES",
    href: "/orders",
    children: [
      { title: "ORDER STATUS", href: "/user/billing-derails" },
      { title: "ALL ORDERS", href: "/user/my-orders" },
      // { title: "RETURNS", href: "/user/returns" },
    ],
  },
];

export default function NavBar() {
  const { user, userLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const { countCartQuantity } = useSite();
  const { languages, lang, changeLanguage, t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Load search history
  useEffect(() => {
    if (user?._id) {
      const stored = JSON.parse(localStorage.getItem("searchHistory") || "[]");
      const userHistory = stored.find((h) => h._id === user._id);
      if (userHistory) setSearchHistory(userHistory.search);
    }
  }, [user]);

  const saveSearch = (query) => {
    if (!user?._id || !query.trim()) return;
    let stored = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    let userHistory = stored.find((h) => h._id === user._id);

    if (userHistory) {
      userHistory.search = [query, ...userHistory.search.filter((q) => q !== query)].slice(0, 10);
      stored = stored.map((h) => (h._id === user._id ? userHistory : h));
    } else {
      userHistory = { _id: user._id, search: [query] };
      stored.push(userHistory);
    }

    localStorage.setItem("searchHistory", JSON.stringify(stored));
    setSearchHistory(userHistory.search);
  };

  const handleSearch = (q) => {


    if (!q.trim()) return;
    saveSearch(q);
    window.location.href = `/search?search=${encodeURIComponent(q)}`

    setSearchFocused(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false)
    setSearchQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(searchQuery.trim());
  };

  const filteredHistory = searchQuery
    ? searchHistory.filter((q) => q.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchHistory;

  const toggleDropdown = (title) => {
    setActiveDropdown((prev) => (prev === title ? null : title));
  };

  const handleAccountAction = (action) => {
    setAccountDropdownOpen(false);
    if (action === "logout") {
      localStorage.removeItem("token");
      toast.success(t("Logged Out Successfully"));
      router.push("/sign-in");
    } else if (action === "profile") {
      router.push(user?.role === "admin" ? "/admin" : "/user");
    }
  };

  const navItems = [
    ...(isMobile ? publicNavItems : []),
    ...(!userLoading && user ? protectedNavItems : []),
  ];

  return (
    <header className="w-full">
      <div className="bg-white lg:px-0 px-4 lg:bg-primary text-black py-2">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={isMobile ? "/logo_b.png" : "/logo.png"}
              alt="Logo"
              width={400}
              height={400}
              className="xl:w-28 md:w-24 w-20 h-auto"
            />
          </Link>

          {/* Desktop Search */}
          <div className="relative hidden lg:flex items-center w-[500px] h-12 px-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
            <Search className="mr-2 size-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 450)}
              placeholder={t("Search Placeholder")}
              className="flex-1 bg-transparent outline-none text-sm text-gray-500 primaryText"
            />

            {searchFocused && filteredHistory.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg  max-h-60 overflow-y-auto z-20">
                {filteredHistory.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center px-3 py-2 hover:bg-gray-100 cursor-pointer z-30"
                    onClick={() => {

                      if (!q.trim()) return;
                      saveSearch(q);
                      window.location.href = `/search?search=${encodeURIComponent(q)}`

                      setSearchFocused(false);
                      setMobileSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <p
                      className="hover:text-primary cursor-pointer z-30"
                    // onClick={() => handleSearch(q)}
                    >
                      {q}
                    </p>

                    <X
                      className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer z-30"
                      onMouseDown={(e) => e.preventDefault()} // prevent input blur hiding dropdown
                      onClick={(e) => {
                        e.stopPropagation(); // 🔑 Stop the click from bubbling to <p>
                        if (!user?._id) return;

                        // Remove from state
                        const updated = searchHistory.filter((item) => item !== q);
                        setSearchHistory(updated);

                        // Remove from localStorage
                        const stored = JSON.parse(localStorage.getItem("searchHistory") || "[]");
                        const newStored = stored.map((h) => {
                          if (h._id === user._id) {
                            return { ...h, search: updated };
                          }
                          return h;
                        });
                        localStorage.setItem("searchHistory", JSON.stringify(newStored));
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center lg:space-x-6 space-x-3">
            {/* Mobile Search Icon */}
            {isMobile && (
              <button onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen)
                setMobileMenuOpen(false)
              }}>
                <Search className="w-6 h-6 text-black" />
              </button>
            )}
            {/* Language Switcher */}
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <div
                  className={`flex items-center gap-2 px-2 primaryText py-3 ${isMobile ? "text-black" : "text-white hover:bg-[#3a0000]"
                    } font-semibold text-base rounded transition-colors cursor-pointer`}
                >
                  <Globe className="lg:block hidden w-8 h-8 text-orange-500" />
                  {languages?.find((l) => l._id === lang)?.name}
                  <ChevronDown className="lg:w-6 lg:h-6 w-4 h-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white text-black lg:min-w-[200px] min-w-[100px] max-h-48"
              >
                {languages?.map((l) => (
                  <DropdownMenuItem
                    key={l._id}
                    onClick={() => changeLanguage(l._id)}
                    className="cursor-pointer focus:bg-gray-300 px-3 py-2 primaryText text-center"
                  >
                    {t(l.name)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart Icon */}
            {!!user && user.role === "user" && (
              <Link href="/cart" className="relative">
                <MdOutlineShoppingCart className="lg:h-10 lg:w-10 w-7 h-7 text-primary-foreground" />
                <p className="text-base font-bold w-5 h-5 flex justify-center items-center bg-primary-foreground/40 text-white text-center absolute -top-1 -right-1 rounded-full">
                  {countCartQuantity}
                </p>
              </Link>
            )}

            {/* Account Dropdown */}
            <div className="hidden lg:flex items-center space-x-2">
              {!userLoading && user ? (
                <DropdownMenu open={accountDropdownOpen} onOpenChange={setAccountDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <button className="btnGradient cursor-pointer text-white rounded w-42 h-12 italic primaryText font-bold flex items-center justify-center gap-2">
                      <FaUser /> {t("ACCOUNT")} <ChevronDown className="w-6 h-6" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white text-black min-w-[180px]" sideOffset={5}>
                    <DropdownMenuItem onClick={() => handleAccountAction("profile")} className="cursor-pointer focus:bg-gray-100 px-3 py-2 flex items-center gap-2 primaryText">
                      {t("MANAGE_ACCOUNT")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAccountAction("logout")} className="cursor-pointer focus:bg-gray-100 px-3 py-2 flex items-center gap-2 text-red-600 hover:text-red-700 primaryText">
                      <LogOut className="!w-6 !h-6" /> {t("LOG_OUT")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button onClick={() => router.push("/sign-in")} className="btnGradient cursor-pointer text-white rounded w-42 h-12 italic primaryText font-bold flex items-center justify-center gap-2">
                  {t("LOGIN")}
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden py-4 text-black cursor-pointer" onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
              setMobileSearchOpen(false)
            }}>
              <div className="w-5 h-0.5 bg-black mb-1.5"></div>
              <div className="w-5 h-0.5 bg-black mb-1.5"></div>
              <div className="w-5 h-0.5 bg-black"></div>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {isMobile && mobileSearchOpen && (
          <div className="mt-2 flex items-center gap-2 px-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("Search Placeholder")}
              className="flex-1 border rounded-md px-3 py-2 text-sm"
            />
            <button onClick={() => handleSearch(searchQuery.trim())} className="bg-primary text-white px-4 py-2 rounded-md">
              {t("Search")}
            </button>
          </div>
        )}
      </div>

      {/* Desktop / Mobile Nav Menu */}
      <nav className="bg-white border-b-[2px] border-text-foreground text-black">
        <div className={"container mx-auto flex justify-between items-center"}>
          <div
            className={cn(
              `lg:flex items-center w-full ${!userLoading && user ? "justify-between" : "justify-center"
              }`,
              mobileMenuOpen
                ? "block absolute top-[65px] left-0 right-0 bg-white z-40 border-b-2"
                : "hidden"
            )}
          >
            {/* Public items */}
            <ul className="lg:flex hidden primaryText italic font-semibold xl:gap-5 gap-1">
              {publicNavItems.map((item) => (
                <li key={item.title} className="relative group">
                  <Link
                    href={item.href}
                    className={cn(
                      "block pr-2 py-2 hover:text-[#E42300]",
                      item.href ===
                      `${pathname}${search.get("search")
                        ? `?search=${search.get("search")}`
                        : ""
                      }` && "text-[#E42300] hover:text-black cursor-pointer"
                    )}
                  >
                    {t(item.title)}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Protected items */}
            <ul className="flex primaryText italic font-semibold flex-col w-full px-6 pb-10 lg:flex-row lg:w-auto lg:px-0 lg:pb-0">
              {navItems.map((item) => (
                <li key={item.title} className="relative group">
                  <div className="flex items-center">
                    <p
                      className="block py-2 hover:text-[#E42300] cursor-pointer"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push(item.href);
                      }}
                    >
                      {t(item.title)}
                    </p>
                    {item.children && (
                      <button
                        className="p-2"
                        onClick={() => toggleDropdown(item.title)}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {item.children && (
                    <div
                      className={cn(
                        "bg-white text-black shadow-md z-50",
                        isMobile
                          ? activeDropdown === item.title
                            ? "block"
                            : "hidden"
                          : "absolute right-0 mt-0 w-64 hidden group-hover:block"
                      )}
                    >
                      <ul>
                        {item.children.map((child) => (
                          <li key={child.title}>
                            <Link
                              href={child.href}
                              className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {t(child.title)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
              {/* Mobile login button */}
              {!userLoading && user ? (
                <Button
                  className="lg:hidden block btnGradient cursor-pointer text-white rounded w-42 h-12 italic primaryText font-bold"
                  func={() => {
                    setMobileMenuOpen(false);
                    window.location.href =
                      user.role === "admin" ? "/admin" : "/user";
                  }}
                  child={userLoading ? "..." : t("Dashboard")}
                />
              ) : (
                <Button
                  className="lg:hidden block btnGradient cursor-pointer text-white rounded w-42 h-12 italic primaryText font-bold"
                  func={() => {
                    setMobileMenuOpen(false);
                    router.push("/sign-in");
                  }}
                  child={userLoading ? "..." : t("LOGIN")}
                />
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header >
  );
}
