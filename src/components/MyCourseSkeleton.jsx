// src/components/MyCourseCardSkeleton.jsx

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const MyCourseCardSkeleton = () => (
  <Card className="w-full">
    <CardContent className="p-4 flex items-center gap-6">
      <Skeleton className="h-28 w-44 rounded-md" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="w-48 flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </CardContent>
  </Card>
);