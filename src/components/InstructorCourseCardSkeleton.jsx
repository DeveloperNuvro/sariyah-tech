// src/components/InstructorCourseCardSkeleton.jsx

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const InstructorCourseCardSkeleton = () => (
  <Card className="flex flex-col">
    <Skeleton className="h-44 w-full" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center gap-4 pt-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </CardHeader>
    <CardFooter className="mt-auto flex justify-end gap-2 p-4">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-9" />
    </CardFooter>
  </Card>
);