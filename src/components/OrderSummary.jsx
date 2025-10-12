// src/components/OrderSummary.jsx

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const OrderSummary = ({ course }) => {
  const price = course.discountPrice || course.price;

  return (
    <Card className="sticky top-24 shadow-md">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="h-20 w-20 rounded-md object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold line-clamp-2">{course.title}</h3>
            <p className="text-sm text-muted-foreground">By {course.instructor.name}</p>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>৳{price}</span>
        </div>
      </CardContent>
    </Card>
  );
};