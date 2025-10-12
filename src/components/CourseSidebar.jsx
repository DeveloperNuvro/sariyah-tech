// src/components/CourseSidebar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const CourseSidebar = ({ course, isEnrolled, isOwner, isAuthenticated, user }) => {
  const renderActionButtons = () => {
    if (isOwner || user?.role === 'admin') {
      return <Button variant="outline" className="w-full">Manage Course</Button>;
    }
    if (isEnrolled) {
      return (
        <Button asChild className="w-full text-lg py-6">
          <Link to={`/learn/${course._id}`}>Start Learning</Link>
        </Button>
      );
    }
    return (
      <Button asChild className="w-full text-lg py-6">
        <Link to={isAuthenticated ? `/checkout/${course._id}` : '/login'}>
          Enroll Now
        </Link>
      </Button>
    );
  };

  return (
    <div className="relative">
      <Card className="overflow-hidden shadow-xl lg:sticky lg:top-24">
        <CardHeader className="p-0">
          <img src={course.thumbnail} alt={course.title} className="w-full h-52 object-cover" />
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-3xl font-bold mb-4">${course.price}</p>
          {renderActionButtons()}
          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Full Lifetime Access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Certificate of Completion</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};