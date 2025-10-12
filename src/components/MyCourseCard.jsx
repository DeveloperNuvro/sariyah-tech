import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, AlertCircle, Download, BookOpen, MoreVertical } from "lucide-react";
import { CourseProgressBar } from './CourseProgressBar'; // Assumed to exist

// The props are fine, the course object is inside enrollmentDetails
export const MyCourseCard = ({ order, enrollmentDetails, certificate }) => {

  const renderActionAndProgress = () => {
    // Case 1: The user is fully enrolled.
    if (enrollmentDetails) {
      const progress = enrollmentDetails.progress || 0;
      
      // --- THIS IS THE LINE TO FIX ---
      // 1. Get the course object from enrollmentDetails.
      const course = enrollmentDetails.course;
      
      // 2. Check all three conditions:
      //    - The instructor has ended the course (course.isEnded is true).
      //    - The student's progress is 100%.
      //    - The certificate record exists.
      const isCertificateReady = course?.isEnded && progress === 100 && certificate;
      // --- END OF FIX ---


      // --- UI for a completed course with a certificate ---
      if (isCertificateReady) {
        return (
          <div className="flex flex-col items-end w-full">
            <CourseProgressBar value={progress} />
            <div className="flex w-full mt-3">
              <Button asChild className="flex-grow bg-green-600 hover:bg-green-700 text-white">
                <a href={certificate.certificateUrl} target="_blank" rel="noopener noreferrer" download>
                  <Download className="mr-2 h-4 w-4" /> Certificate
                </a>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="ml-1">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/learn/${order.course._id}`}>
                      <BookOpen className="mr-2 h-4 w-4" /> Review Course
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
             <p className="text-xs text-muted-foreground text-right mt-1">Course Completed!</p>
          </div>
        );
      }
      
      // --- UI for a course in progress ---
      return (
        <div className="flex flex-col items-end w-full">
          <CourseProgressBar value={progress} />
          <Button asChild className="mt-3">
            <Link to={`/learn/${order.course._id}`}>
              {progress > 0 ? 'Continue Learning' : 'Start Learning'}
            </Link>
          </Button>
          {progress === 100 && !course?.isEnded && (
              <p className="text-xs text-muted-foreground text-right mt-1">Certificate available after course ends.</p>
          )}
        </div>
      );
    }

    // Case 2: Payment is not yet approved.
    switch (order.paymentStatus) {
      case 'pending': return <Badge variant="outline" className="border-yellow-500 text-yellow-500"><Clock className="mr-2 h-4 w-4" /> Pending Approval</Badge>;
      case 'failed': return <Badge variant="destructive"><AlertCircle className="mr-2 h-4 w-4" /> Payment Failed</Badge>;
      default: return <Badge variant="outline">{order.paymentStatus}</Badge>;
    }
  };

  return (
    <Card className="w-full overflow-hidden transition-shadow hover:shadow-md bg-card border">
      <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-6">
        <img src={order.course.thumbnail} alt={order.course.title} className="h-28 w-full sm:w-44 object-cover rounded-md" />
        <div className="flex-1 self-start sm:self-center">
          <h3 className="text-lg font-bold line-clamp-2">{order.course.title}</h3>
          {/* <p className="text-sm text-muted-foreground">By {order.course.instructor.name}</p> */}
        </div>
        <div className="w-full sm:w-56 flex justify-start sm:justify-end mt-4 sm:mt-0">{renderActionAndProgress()}</div>
      </CardContent>
    </Card>
  );
};