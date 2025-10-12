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
import { PlusCircle, MoreVertical, ArrowUpCircle, ArrowDownCircle, Trash2, BarChart2, CheckCircle, CheckCheckIcon } from 'lucide-react';

export const InstructorCourseCard = ({ course, handleDelete, handleTogglePublish, handleToggleEnded }) => {
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
          <p className="text-lg font-semibold text-primary">${course.price}</p>
        </div>
      </CardHeader>
      
      {/* The footer now has a clean layout with primary and secondary actions separated. */}
      <CardFooter className="mt-auto flex justify-between items-center p-4">
        {/* Primary Action */}
        <Button asChild variant="outline" size="sm">
          <Link to={`/instructor/courses/${course._id}/add-lesson`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Lesson
          </Link>
        </Button>

        {/* Secondary Actions Menu */}
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Publish / Unpublish Action */}
              <DropdownMenuItem onClick={() => handleTogglePublish(course._id)}>
                {course.isPublished ? (
                  <><ArrowDownCircle className="mr-2 h-4 w-4" /> Unpublish</>
                ) : (
                  <><ArrowUpCircle className="mr-2 h-4 w-4" /> Publish</>
                )}
              </DropdownMenuItem>
              
              {/* View Results Action */}
              <DropdownMenuItem onClick={() => navigate(`/instructor/course/${course._id}/quiz-results`)}>
                <BarChart2 className="mr-2 h-4 w-4" /> View Results
              </DropdownMenuItem>
                {course.isEnded ?
                <DropdownMenuItem disabled>
                <CheckCheckIcon className="mr-2 h-4 w-4" /> Course Ended
              </DropdownMenuItem>
              
              :
              <DropdownMenuItem onClick={() => handleToggleEnded(course._id)}>
                <CheckCircle className="mr-2 h-4 w-4" /> End Course
              </DropdownMenuItem>
            }

              <DropdownMenuSeparator />

              
           

              {/* Delete Action (triggers the AlertDialog) */}
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* This is the content for the Delete confirmation dialog */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the course "{course.title}" and all of its associated lessons and data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(course._id)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};