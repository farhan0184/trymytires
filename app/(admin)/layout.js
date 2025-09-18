"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  Home,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
  ListOrdered,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import toast from "react-hot-toast";
import { useUser } from "../context/user";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const pathname = usePathname();
  

  const routes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="size-6" />,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Users",
      icon: <Users className="size-6" />,
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
    {
      label: "Order",
      icon: <ListOrdered className="size-6" />,
      href: "/admin/orders",
      active: pathname === "/admin/orders",
    },
    {
      label: "Product Section",
      icon: <ShoppingBag className="size-6" />,
      active:
        pathname === "/admin/product_section" ||
        pathname.startsWith("/admin/product_section/"),
      children: [
        {
          label: "Categories",
          href: "/admin/product_section/categories",
          active: pathname === "/admin/product_section/categories",
        },
        {
          label: "Brands",
          href: "/admin/product_section/brands",
          active: pathname === "/admin/product_section/brands",
        },
        {
          label: "Styles",
          href: "/admin/product_section/styles",
          active: pathname === "/admin/product_section/styles",
        },
        {
          label: "Types",
          href: "/admin/product_section/types",
          active: pathname === "/admin/product_section/types",
        },
        {
          label: "Seasons",
          href: "/admin/product_section/seasons",
          active: pathname === "/admin/product_section/seasons",
        },
        {
          label: "Speed Ratings",
          href: "/admin/product_section/speed_ratings",
          active: pathname === "/admin/product_section/speed_ratings",
        },
        {
          label: "Ply",
          href: "/admin/product_section/ply",
          active: pathname === "/admin/product_section/ply",
        },
        {
          label: "Performances",
          href: "/admin/product_section/performances",
          active: pathname === "/admin/product_section/performances",
        },
        {
          label: "Side Walls",
          href: "/admin/product_section/side_walls",
          active: pathname === "/admin/product_section/side_walls",
        },
        {
          label: "Lugs",
          href: "/admin/product_section/lugs",
          active: pathname === "/admin/product_section/lugs",
        },
        {
          label: "Finish",
          href: "/admin/product_section/finish",
          active: pathname === "/admin/product_section/finish",
        },
        {
          label: "Seasonal Designations",
          href: "/admin/product_section/seasonal_designations",
          active: pathname === "/admin/product_section/seasonal_designations",
        },
        {
          label: "Products",
          href: "/admin/product_section",
          active: pathname === "/admin/product_section",
        },
      ],
    },
    {
      label: "Languages",
      icon: <Settings className="size-6" />,
      href: "/admin/languages",
      active: pathname === "/admin/languages",
    },
    {
      label: "Page Settings",
      icon: <Settings className="size-6" />,
      href: "/admin/page_settings",
      active: pathname === "/admin/page_settings",
    },
    {
      label: "Settings",
      icon: <Settings className="size-6" />,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ];

  const renderRoutes = () =>
    routes.map((route) => {
      const hasChildren = !!route.children;
      const isOpen = openDropdown === route.label;

      return (
        <div key={route.href || route.label} className="space-y-1">
          {hasChildren ? (
            <button
              onClick={() => setOpenDropdown(isOpen ? null : route.label)}
              className={cn(
                "w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 subtitleText relative overflow-hidden transition-all duration-300 ease-in-out text-left",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-secondary before:to-secondary-foreground before:opacity-0 before:transition-opacity before:duration-300 before:-z-10",
                "hover:before:opacity-100 hover:text-white",
                route.active
                  ? "bg-gradient-to-r from-secondary-foreground to-secondary text-white font-bold"
                  : "text-black"
              )}
            >
              <div className="flex items-center   gap-3 z-10">
                {route.icon}
                {route.label}
              </div>
              <span className="z-10">
                {isOpen ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </span>
            </button>
          ) : (
            <Link
              href={route.href}
              onClick={() => setIsSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 subtitleText relative overflow-hidden transition-all duration-300 ease-in-out",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-secondary before:to-secondary-foreground before:opacity-0 before:transition-opacity before:duration-300 before:-z-10",
                "hover:before:opacity-100 hover:text-white",
                route.active
                  ? "bg-gradient-to-r from-secondary-foreground to-secondary text-white font-bold"
                  : "text-black"
              )}
            >
              <span className="relative z-10">{route.icon}</span>
              <span className="relative z-10">{route.label}</span>
            </Link>
          )}

          {hasChildren && isOpen && (
            <div className="pl-6 space-y-1 mt-1">
              {route.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                    "hover:bg-gradient-to-r from-secondary to-secondary-foreground hover:text-white tertiaryText",
                    child.active
                      ? "bg-gradient-to-r from-secondary-foreground to-secondary text-white font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    });


  return (
    <div className="h-full relative">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className="h-full flex flex-col border-r bg-gray-100/40 p-0">
            <div className="p-6 flex items-center gap-2 border-b">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-bold text-xl">Admin</span>
            </div>
            <div className="flex-1 overflow-auto p-2 scrollbar-hide">
              <div className="flex flex-col gap-1">
                {renderRoutes()}
              </div>
            </div>
            <div className="p-4 border-t mt-auto">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                asChild
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Back to Store
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 mt-2 cursor-pointer"
                onClick={() => {
                  localStorage.removeItem("token");
                  toast.success("Logged out successfully");
                  window.location.href = "/sign-in";
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50">
        <div className="h-full flex flex-col border-r ">
          <div className="p-6 flex items-center gap-2 border-b">
            <ShoppingBag className="h-6 w-6" />
            <span className="font-bold text-xl">Admin</span>
          </div>
          <div className="flex-1 overflow-auto p-2 scrollbar-hide">
            <div className="flex flex-col gap-1">
              {renderRoutes()}
            </div>
          </div>
          <div className="p-4 border-t mt-auto">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-12 subtitleText"
              asChild
            >
              <Link href="/">
                <Home className="size-6" />
                Back to Store
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 mt-2 h-12 cursor-pointer subtitleText"
              onClick={() => {
                localStorage.removeItem("token");
                toast.success("Logged out successfully");
                window.location.href = "/sign-in";
              }}
            >
              <LogOut className="size-6" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-72 h-full fixed top-0 right-0 w-full">
        <div className="h-full flex flex-col">
          <header className="h-16 border-b flex items-center gap-4 px-6">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="size-6" />
            </Button>
            <div className="ml-auto flex items-center gap-4">
              <Button variant="ghost" size="sm">
                Admin User
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
