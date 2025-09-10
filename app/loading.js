
import React from "react";

export default function SiteLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative flex items-center justify-center mb-6">
        <span className="sr-only">Loading...</span>
        <div className="w-16 h-16 border-4 border-secondary-foreground border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute w-8 h-8 bg-secondary-foreground rounded-full animate-pulse"></div>
      </div>
      <div className="text-secondary-foreground text-xl font-semibold animate-pulse">
        Loading, please wait...
      </div>
    </div>
  );
}