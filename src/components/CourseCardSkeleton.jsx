// src/components/CourseCardSkeleton.jsx

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CourseCardSkeleton = () => (
  <Card className="w-full max-w-sm flex flex-col overflow-hidden">
    <Skeleton className="w-full h-48" />
    <CardHeader className="p-4 flex-grow">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardFooter className="p-4 pt-0 flex justify-between items-center">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-10 w-1/3" />
    </CardFooter>
  </Card>
);