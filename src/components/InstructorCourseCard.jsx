// src/components/InstructorCourseCard.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusCircle, MoreVertical, ArrowUpCircle, ArrowDownCircle, Trash2, BarChart2, CheckCircle, CheckCheckIcon, Edit } from 'lucide-react';

export const InstructorCourseCard = ({ course, handleDelete, handleTogglePublish, handleToggleEnded, handleRecalculateProgress, userRole }) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="h-44 w-full object-cover"
      />
      <CardHeader>
        <CardTitle className="line-clamp-2 h-14">{course.title}</CardTitle>
        <div className="flex items-center justify-between pt-2">
          {/* Status Badge */}
          <Badge variant={course.isPublished ? 'success' : 'secondary'}>
            {course.isPublished ? 'Published' : 'Draft'}
          </Badge>
          {/* Price */}
          <div className="text-right">
            {course.discountPrice && course.discountPrice < course.price ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-primary">৳{course.discountPrice}</span>
                  <span className="text-sm text-muted-foreground line-through">৳{course.price}</span>
                </div>
                <div className="text-xs text-red-600 font-medium">
                  Save ৳{course.price - course.discountPrice}
                </div>
              </div>
            ) : (
              <p className="text-lg font-semibold text-primary">৳{course.price}</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      {/* The footer now has a clean layout with primary and secondary actions separated. */}
      <CardFooter className="mt-auto flex justify-between items-center p-4">
        {/* Primary Action */}
        <Button 
          asChild 
          variant="outline" 
          size="sm"
          className="border-2 border-cyan-400/20 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-pink-500/10 hover:border-cyan-400/40 transition-all duration-300"
        >
          <Link to={`/instructor/courses/${course._id}/add-lesson`}>
            <PlusCircle className="mr-2 h-4 w-4 text-cyan-600" />
            Add Lesson
          </Link>
        </Button>

        {/* Secondary Actions Menu */}
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-pink-500/10 hover:text-cyan-600 transition-all duration-300"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl p-2 min-w-[200px]"
            >
              {/* Publish / Unpublish Action - Only for Admins */}
              {userRole === 'admin' && (
                <DropdownMenuItem 
                  onClick={() => handleTogglePublish(course._id)}
                  className="hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 hover:text-green-700 rounded-lg transition-all duration-300 cursor-pointer"
                >
                  {course.isPublished ? (
                    <><ArrowDownCircle className="mr-2 h-4 w-4 text-orange-500" /> Unpublish</>
                  ) : (
                    <><ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" /> Publish</>
                  )}
                </DropdownMenuItem>
              )}
              
              {/* View Results Action */}
              <DropdownMenuItem 
                onClick={() => navigate(`/instructor/course/${course._id}/quiz-results`)}
                className="hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-indigo-500/10 hover:text-blue-700 rounded-lg transition-all duration-300 cursor-pointer"
              >
                <BarChart2 className="mr-2 h-4 w-4 text-blue-500" /> View Results
              </DropdownMenuItem>
              
              {course.isEnded ? (
                <DropdownMenuItem 
                  disabled
                  className="opacity-50 cursor-not-allowed rounded-lg"
                >
                  <CheckCheckIcon className="mr-2 h-4 w-4 text-gray-400" /> Course Ended
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => handleToggleEnded(course._id)}
                  className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:text-purple-700 rounded-lg transition-all duration-300 cursor-pointer"
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-purple-500" /> End Course
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="my-2 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

              {/* Edit Course */}
              <DropdownMenuItem 
                onClick={() => navigate(`/instructor/courses/${course._id}/edit`)}
                className="hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-indigo-500/10 hover:text-blue-700 rounded-lg transition-all duration-300 cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4 text-blue-500" /> Edit Course
              </DropdownMenuItem>

              {/* Recalculate Progress */}
              <DropdownMenuItem 
                onClick={() => handleRecalculateProgress(course._id)}
                className="hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-pink-500/10 hover:text-cyan-700 rounded-lg transition-all duration-300 cursor-pointer"
              >
                <BarChart2 className="mr-2 h-4 w-4 text-cyan-500" /> Recalculate Progress
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2 bg-gradient-to-r from-transparent via-red-300 to-transparent" />

              {/* Delete Action (triggers the AlertDialog) */}
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 hover:text-red-700 focus:text-red-700 rounded-lg transition-all duration-300 cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* This is the content for the Delete confirmation dialog */}
          <AlertDialogContent className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl rounded-2xl">
            <AlertDialogHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <AlertDialogTitle className="text-2xl font-bold text-gray-900">
                Delete Course?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 leading-relaxed">
                This action cannot be undone. This will permanently delete the course 
                <span className="font-semibold text-gray-900"> "{course.title}"</span> 
                and all of its associated lessons, quizzes, and student progress data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-3 pt-4">
              <AlertDialogCancel className="border-gray-300 hover:bg-gray-50 transition-colors duration-300">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleDelete(course._id)}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold transition-all duration-300"
              >
                Delete Course
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};