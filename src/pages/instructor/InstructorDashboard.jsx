// src/pages/InstructorDashboard.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyCourses, deleteCourse, toggleCoursePublishStatus, toggleCourseEndedStatus,  fetchAllCoursesAdmin, } from '../../features/courses/courseSlice';
import toast from 'react-hot-toast';

import { InstructorCourseCard } from '@/components/InstructorCourseCard';
import { InstructorCourseCardSkeleton } from '@/components/InstructorCourseCardSkeleton';
import { Button } from "@/components/ui/button";
import { PlusCircle, FolderPlus } from 'lucide-react';

const InstructorDashboard = () => {
  const dispatch = useDispatch();
  const { instructorCourses, status } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

   useEffect(() => {
    // --- THIS IS THE KEY LOGIC CHANGE ---
    // If the user is an admin, fetch ALL courses.
    if (user?.role === 'admin') {
      dispatch(fetchAllCoursesAdmin());
    } 
    // Otherwise (if they are an instructor), fetch only their own courses.
    else if (user?.role === 'instructor') {
      dispatch(fetchMyCourses());
    }
  }, [dispatch, user]); 

  const handleDelete = (courseId) => {
    dispatch(deleteCourse(courseId))
      .unwrap()
      .then(() => toast.success('Course deleted successfully'))
      .catch((err) => toast.error(`Failed to delete course: ${err.message || 'Server error'}`));
  };

    const handleTogglePublish = (courseId) => {
    dispatch(toggleCoursePublishStatus(courseId))
      .unwrap()
      .then((result) => {
        // The backend sends a dynamic message, which is great!
        toast.success(result.message || 'Status updated successfully!');
      })
      .catch((err) => toast.error(`Failed to update status: ${err}`));
  };

    const handleToggleEnded = (courseId) => {
    dispatch(toggleCourseEndedStatus(courseId))
      .unwrap()
      .then((response) => toast.success(response.message))
      .catch(err => toast.error(`Failed: ${err}`));
  };

  const renderContent = () => {
    if (status === 'loading') {
      return Array.from({ length: 6 }).map((_, index) => (
        <InstructorCourseCardSkeleton key={index} />
      ));
    }

    if (instructorCourses.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
          <FolderPlus className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Courses Found</h2>
          <p className="text-muted-foreground mb-6">
            You haven't created any courses yet. Get started now!
          </p>
          <Button asChild>
            <Link to="/instructor/courses/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Course
            </Link>
          </Button>
        </div>
      );
    }

    return instructorCourses.map((course) => (
      <InstructorCourseCard
        key={course._id}
        course={course}
        handleDelete={handleDelete}
        handleTogglePublish={handleTogglePublish}
        handleToggleEnded={handleToggleEnded}
      />
    ));
  };

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses and content.</p>
        </div>
        <Button asChild size="lg">
          <Link to="/instructor/courses/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Course
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {renderContent()}
      </div>
    </main>
  );
};

export default InstructorDashboard;