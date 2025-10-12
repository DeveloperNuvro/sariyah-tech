// src/components/CheckoutPageSkeleton.jsx

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export const CheckoutPageSkeleton = () => (
  <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
      {/* Left Column: Payment Form Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Right Column: Order Summary Skeleton */}
      <div className="mt-10 lg:mt-0">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-20 w-28 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-8 w-1/3" />
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
);