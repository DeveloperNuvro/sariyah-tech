import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, AlertCircle, Download, BookOpen, MoreVertical, Star, Eye, CheckCircle } from "lucide-react";
import { CourseProgressBar } from './CourseProgressBar';
import ReviewDialog from './ReviewDialog';
import { canReviewCourse } from '../features/reviews/reviewSlice';

// The props are fine, the course object is inside enrollmentDetails
export const MyCourseCard = ({ order, enrollmentDetails, certificate }) => {
  const dispatch = useDispatch();
  const { canReview, reviewReason } = useSelector((state) => state.reviews);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // Check if student can review this course when component mounts
  useEffect(() => {
    if (enrollmentDetails?.course?._id) {
      dispatch(canReviewCourse(enrollmentDetails.course._id));
    }
  }, [dispatch, enrollmentDetails?.course?._id]);

  const renderActionAndProgress = () => {
    // Case 1: The user is fully enrolled.
    if (enrollmentDetails) {
      const progress = enrollmentDetails.progress || 0;
      
      // Get the course object from enrollmentDetails.
      const course = enrollmentDetails.course;
      
      // Check all three conditions:
      //    - The instructor has ended the course (course.isEnded is true).
      //    - The student's progress is 100%.
      //    - The certificate record exists.
      const isCertificateReady = course?.isEnded && progress === 100 && certificate;

      // --- UI for a completed course with a certificate ---
      if (isCertificateReady) {
        return (
          <div className="space-y-3">
            <CourseProgressBar value={progress} />
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                  <a href={certificate.certificateUrl} target="_blank" rel="noopener noreferrer" download>
                    <Download className="mr-2 h-4 w-4" /> Certificate
                  </a>
                </Button>
                {canReview && (
                  <Button 
                    onClick={() => setShowReviewDialog(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  >
                    <Star className="mr-2 h-4 w-4" /> Review
                  </Button>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="self-start sm:self-center">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg rounded-lg">
                  <DropdownMenuItem asChild className="hover:bg-gray-50">
                    <Link to={`/learn/${order.course._id}`}>
                      <BookOpen className="mr-2 h-4 w-4" /> Review Course
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-gray-50">
                    <Link to={`/orders/${order._id}`}>
                      <Eye className="mr-2 h-4 w-4" /> View Order Details
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-xs text-muted-foreground">Course Completed!</p>
          </div>
        );
      }
      
      // --- UI for a course in progress ---
      return (
        <div className="space-y-3">
          <CourseProgressBar value={progress} />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
              <Link to={`/learn/${order.course._id}`}>
                <BookOpen className="mr-2 h-4 w-4" />
                {progress > 0 ? 'Continue Learning' : 'Start Learning'}
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="self-start sm:self-center">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg rounded-lg">
                <DropdownMenuItem asChild className="hover:bg-gray-50">
                  <Link to={`/orders/${order._id}`}>
                    <Eye className="mr-2 h-4 w-4" /> View Order Details
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {progress === 100 && !course?.isEnded && (
              <p className="text-xs text-muted-foreground">Certificate available after course ends.</p>
          )}
        </div>
      );
    }

    // Case 2: Payment status handling
    switch (order.paymentStatus) {
      case 'paid':
        // For paid orders without enrollment, show start learning button
        return (
          <div className="space-y-3">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" /> Payment Approved
            </Badge>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                <Link to={`/learn/${order.course._id}`}>
                  <BookOpen className="mr-2 h-4 w-4" /> Start Learning
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="self-start sm:self-center">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg rounded-lg">
                  <DropdownMenuItem asChild className="hover:bg-gray-50">
                    <Link to={`/orders/${order._id}`}>
                      <Eye className="mr-2 h-4 w-4" /> View Order Details
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="space-y-3">
            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
              <Clock className="mr-2 h-4 w-4" /> Pending Approval
            </Badge>
            <div className="flex justify-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg rounded-lg">
                  <DropdownMenuItem asChild className="hover:bg-gray-50">
                    <Link to={`/orders/${order._id}`}>
                      <Eye className="mr-2 h-4 w-4" /> View Order Details
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="space-y-3">
            <Badge variant="destructive">
              <AlertCircle className="mr-2 h-4 w-4" /> Payment Failed
            </Badge>
            <div className="flex justify-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg rounded-lg">
                  <DropdownMenuItem asChild className="hover:bg-gray-50">
                    <Link to={`/orders/${order._id}`}>
                      <Eye className="mr-2 h-4 w-4" /> View Order Details
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-3">
            <Badge variant="outline">{order.paymentStatus}</Badge>
            <div className="flex justify-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg rounded-lg">
                  <DropdownMenuItem asChild className="hover:bg-gray-50">
                    <Link to={`/orders/${order._id}`}>
                      <Eye className="mr-2 h-4 w-4" /> View Order Details
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white border border-gray-200/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          {/* Course Thumbnail and Info Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Course Thumbnail */}
            <div className="relative group flex-shrink-0">
              <img 
                src={order.course.thumbnail} 
                alt={order.course.title} 
                className="h-32 w-full sm:w-48 object-cover rounded-xl border border-gray-200/50 transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Course Information */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">{order.course.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <Avatar className="h-6 w-6 border border-gray-200">
                    <AvatarImage src={order.course.instructor?.avatar || order.course.instructor?.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-xs font-semibold">
                      {order.course.instructor?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-gray-600 font-medium">By {order.course.instructor?.name || 'Unknown Instructor'}</p>
                </div>
              </div>
              
              {/* Course Pricing */}
              <div className="flex items-center gap-2">
                {order.course?.discountPrice && order.course?.discountPrice < order.course?.price ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">৳{order.course?.discountPrice}</span>
                    <span className="text-sm text-gray-500 line-through">৳{order.course?.price}</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                      Save ৳{order.course?.price - order.course?.discountPrice}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-gray-900">৳{order.course?.price || '0'}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Section - Now under the content */}
          <div className="w-full">
            {renderActionAndProgress()}
          </div>
        </CardContent>
      </Card>
      
      {/* Review Dialog */}
      <ReviewDialog
        isOpen={showReviewDialog}
        onClose={() => setShowReviewDialog(false)}
        courseId={enrollmentDetails?.course?._id}
        courseTitle={order.course.title}
      />
    </>
  );
};