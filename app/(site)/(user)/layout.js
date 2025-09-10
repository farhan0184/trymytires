"use client"
import { useState, useEffect, useRef } from "react"
import { Home, User, Package, CreditCard, LogOut, Menu, PanelLeftOpen } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useMediaQuery } from "../../helper/hooks"
import { LuPanelLeftOpen } from "react-icons/lu";
import { useUser } from "@/app/context/user"
import toast from "react-hot-toast"

const sidebarItems = [
  {
    title: "PROFILE",
    href: "/user",
    icon: User,
  },
  {
    title: "MY ORDERS",
    href: "/user/my-orders",
    icon: Package,
  },
  {
    title: "BILLING DETAILS",
    href: "/user/billing-derails",
    icon: CreditCard,
  },
  {
    title: "LOGOUT",
    href: "#",
    icon: LogOut,
    isLogout: true,
  },
]

export default function AccountLayout({
  children,
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const contentRef = useRef(null)
  const containerRef = useRef(null)
  const { user, userLoading, getUser } = useUser();

  useEffect(()=>{
    if(!user){
      getUser()
    }
  },[getUser, user])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false)
    }
  }, [pathname, isMobile])

  

  // Calculate content height
  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current && containerRef.current) {
        const contentRect = contentRef.current.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()
        
        // Calculate height from top of container to bottom of content
        const height = (contentRect.bottom - containerRect.top) + 20 // Add some padding
        setContentHeight(height)
      }
    }

    // Update height on mount and when content changes
    updateHeight()
    
    // Use ResizeObserver to detect content changes
    const resizeObserver = new ResizeObserver(updateHeight)
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }

    // Also listen for window resize
    window.addEventListener('resize', updateHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateHeight)
    }
  }, [children, pathname])

  // Show loading state AFTER all hooks have been called
   if (!userLoading && (!user || Object.keys(user).length === 0)) {
    window.location.href = "/sign-in";
  }

  // Logout handler function
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    window.location.href = "/sign-in";
  }

  // Sidebar content component to avoid duplication
  
  const SidebarContent = () => (
    <div className=" textColor ">
      <div className="flex items-center gap-2 mb-8 border-b-[3px] pb-4">
        <Home className="h-8 w-8 " />
        <h1 className="secondaryText font-bold  tracking-wide">ACCOUNT</h1>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          // Handle logout item differently
          if (item.isLogout) {
            return (
              <button
                key={item.title}
                onClick={handleLogout}
                className={cn(
                  "flex items-center gap-3 pr-3 py-1 primaryText font-bold rounded-md transition-colors w-full text-left",
                  "hover:text-primary-foreground hover:bg-gray-50 cursor-pointer"
                )}
              >
                {/* <Icon className="h-4 w-4" /> */}
                {item.title}
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 pr-3 py-1 primaryText font-bold   rounded-md transition-colors",
                isActive ? "text-primary-foreground " : " hover:text-primary-foreground hover:bg-gray-50",
              )}
              onClick={() => isMobile && setOpen(false)}
            >
              {/* <Icon className="h-4 w-4" /> */}
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="h-full container" ref={containerRef}>
      {/* Mobile Header with Menu Button */}
      <span className="lg:hidden  mt-5">
        <LuPanelLeftOpen onClick={() => setOpen(true)} className="text-3xl" />
      </span>

      <div className="flex h-full ">
        {/* Desktop Sidebar - Hidden on Mobile */}
        <div className={isMobile ? "hidden" : "w-[20%] pt-10  flex flex-col h-max"}>
          <div className="w-[80%] flex-1">
            <SidebarContent />
          </div>
          {/* Dynamic height background */}
          <div 
            className="absolute w-[50%] left-0 top-[115px] bg-[#F9FAFB] -z-50" 
            style={{ height: `${contentHeight}px` }} 
          />
        </div>

        {/* Mobile Sidebar - Sheet Component */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Account Navigation</SheetTitle>
            <div className="p-4">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Dynamic Content Area */}
        <div className="lg:w-[80%] w-full bg-white" ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  )
}