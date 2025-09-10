import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";
export const UserDashboardSkeleton = () => {
  return (
    <div className="min-h-screen py-[64px]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>

        {/* Personal Information Card Skeleton */}
        <Card className="p-7 rounded-md">
          <CardHeader className="flex flex-row items-center justify-between p-0">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-10 w-20" />
          </CardHeader>
          <CardContent className="space-y-4 mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Generate 8 field skeletons */}
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>

            {/* Password Update Section Skeleton */}
            <div className="mt-10">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="mt-5 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
                <Skeleton className="h-10 w-40 mt-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
