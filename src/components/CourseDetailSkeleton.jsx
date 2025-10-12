// src/components/CourseDetailSkeleton.jsx

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const CourseDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
      {/* Left Column */}
      <div className="lg:col-span-2">
        <Skeleton className="h-5 w-1/4 mb-4" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-5/6 mb-6" />

        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>

      {/* Right Column (Sidebar) */}
      <div className="mt-8 lg:mt-0">
        <Card>
          <CardHeader>
            <Skeleton className="h-48 w-full" />
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-12 w-full" />
            <div className="pt-4 space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);