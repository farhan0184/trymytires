"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

function FeatureCard({
  id,
  icon,
  title,
  description,
  expandedContent,
  isExpanded,
  onToggle,
  t
}) {
  
  return (
    <Card className="flex flex-col h-full transition-all duration-500 ease-in-out">
      <CardHeader className="flex items-center justify-center p-6 bg-[#EEEEEE]">
        <div className="flex items-center justify-center">
          <Image
            src={icon || "/placeholder.svg"}
            width={1000}
            height={1000}
            alt="Picture of the author"
            className="w-[200px] h-[200px] object-contain md:object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center text-center p-6">
        <h3 className="font-bold line-clamp-2 text-2xl italic max-w-[250px] mb-4">
          {title}
        </h3>
        <p className="text-sm md:text-lg text-[#000000] max-w-[280px] line-clamp-4">
          {description}
        </p>

        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-in-out w-full mt-4",
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="pt-4 border-t border-gray-200 text-left">
            {expandedContent}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-6 flex justify-center">
        <Button
          variant="destructive"
          className="bg-[#E42300] hover:bg-red-700 md:text-xl "
          onClick={onToggle}
        >
          {isExpanded ? (
            <>
              {t("Show Less")} <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              {t("Learn More")} <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default FeatureCard;
