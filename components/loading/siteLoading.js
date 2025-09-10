"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Lottie from "lottie-react";

export default function Loading() {
  const [animationData, setAnimationData] = useState(null); // null;
  const [minDelayDone, setMinDelayDone] = useState(false); // ← new

  /** fetch the Lottie JSON */
  useEffect(() => {
    fetch("/lotties/animation-loading.json")
      .then((res) => res.json())
      .then(setAnimationData)
  }, []);

  /** 2‑second minimum display timer */
  useEffect(() => {
    const t = setTimeout(() => setMinDelayDone(true), 900); // ← 2000 ms
    return () => clearTimeout(t);
  }, []);

  /** show the animation only when BOTH are ready */
  const canShowAnimation = animationData && minDelayDone;

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="shadow-xl p-6 w-80 rounded-2xl">
        <CardContent className="flex flex-col items-center">
          {canShowAnimation ? (
            <Lottie animationData={animationData} loop className="h-40 w-40" />
          ) : (
            <Loader2 className="animate-spin h-10 w-10 text-primary" />
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            Loading, please wait…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
