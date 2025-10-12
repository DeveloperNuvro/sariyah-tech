// src/components/CourseLessonPageSkeleton.jsx

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const CourseLessonPageSkeleton = () => (
  <div className="flex h-screen bg-background">
    {/* Sidebar Skeleton */}
    <aside className="w-80 border-r p-4 hidden lg:flex flex-col">
      <Skeleton className="h-6 w-3/4 mb-4" /> <Skeleton className="h-4 w-1/2 mb-6" /> <Separator />
      <div className="flex-1 mt-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    </aside>

    {/* Main Content Skeleton */}
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-2/3" /> <Skeleton className="h-10 w-48" />
      </div>
      <Skeleton className="w-full aspect-video rounded-lg mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" /> <Skeleton className="h-6 w-5/6" /> <Skeleton className="h-6 w-3/4" />
      </div>
      <Skeleton className="h-24 w-full mt-8" />
    </main>
  </div>
);