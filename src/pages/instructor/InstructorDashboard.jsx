// src/pages/InstructorDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMyCourses, deleteCourse, toggleCoursePublishStatus, toggleCourseEndedStatus, fetchAllCoursesAdmin, recalculateCourseProgress } from '../../features/courses/courseSlice';
import toast from 'react-hot-toast';

import { InstructorCourseCard } from '@/components/InstructorCourseCard';
import { InstructorCourseCardSkeleton } from '@/components/InstructorCourseCardSkeleton';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, 
  FolderPlus, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award, 
  Sparkles,
  BarChart3,
  Clock,
  CheckCircle2,
  Eye,
  Settings,
  Filter,
  Search
} from 'lucide-react';

// Animation variants
const animationVariants = {
  container: { 
    hidden: { opacity: 0 }, 
    show: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.2 
      } 
    } 
  },
  fadeInUp: { 
    hidden: { y: 30, opacity: 0 }, 
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    } 
  },
  scaleIn: { 
    hidden: { scale: 0.95, opacity: 0 }, 
    show: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    } 
  },
  slideInLeft: { 
    hidden: { x: -50, opacity: 0 }, 
    show: { 
      x: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    } 
  }
};

// Enhanced stat cards with gradients and animations
const DashboardStatCard = ({ title, value, icon, gradient, delay = 0, subtitle }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
  >
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  </motion.div>
);

const InstructorDashboard = () => {
  const dispatch = useDispatch();
  const { instructorCourses, status } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleRecalculateProgress = (courseId) => {
    dispatch(recalculateCourseProgress(courseId))
      .unwrap()
      .then((result) => {
        toast.success(result.message || 'Progress recalculated successfully!');
      })
      .catch((err) => toast.error(`Failed to recalculate progress: ${err}`));
  };

  // Temporary function to recalculate all courses
  const handleRecalculateAllProgress = () => {
    const promises = instructorCourses.map(course => 
      dispatch(recalculateCourseProgress(course._id))
    );
    
    Promise.all(promises)
      .then(() => {
        toast.success('Progress recalculated for all courses!');
      })
      .catch((err) => toast.error(`Failed to recalculate some courses: ${err}`));
  };

  // Computed values for dashboard stats
  const totalCourses = instructorCourses.length;
  const publishedCourses = instructorCourses.filter(course => course.isPublished).length;
  const draftCourses = totalCourses - publishedCourses;
  const endedCourses = instructorCourses.filter(course => course.isEnded).length;

  // Filter courses based on search and tab
  const filteredCourses = instructorCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case "published":
        return matchesSearch && course.isPublished;
      case "draft":
        return matchesSearch && !course.isPublished;
      case "ended":
        return matchesSearch && course.isEnded;
      default:
        return matchesSearch;
    }
  });

  const renderContent = () => {
    if (status === 'loading') {
      return Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <InstructorCourseCardSkeleton />
        </motion.div>
      ));
    }

    if (filteredCourses.length === 0) {
      return (
        <motion.div 
          className="col-span-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
            <FolderPlus className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {searchTerm ? 'No Courses Found' : 'No Courses Yet'}
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            {searchTerm 
              ? `No courses match "${searchTerm}". Try adjusting your search.`
              : "You haven't created any courses yet. Start building your teaching empire!"
            }
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white">
            <Link to="/instructor/courses/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First Course
            </Link>
          </Button>
        </motion.div>
      );
    }

    return (
      <AnimatePresence>
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            layout
          >
            <InstructorCourseCard
              course={course}
              handleDelete={handleDelete}
              handleTogglePublish={handleTogglePublish}
              handleToggleEnded={handleToggleEnded}
              handleRecalculateProgress={handleRecalculateProgress}
              userRole={user?.role}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="flex flex-wrap items-center justify-between gap-6 mb-8"
          variants={animationVariants.fadeInUp}
          initial="hidden"
          animate="show"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
                Instructor Dashboard
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Manage your courses and build your teaching empire
            </p>
          </div>
          
          <div className="flex gap-3">
            {/* Temporary button to fix progress - remove after fixing */}
            {import.meta.env.DEV && instructorCourses.length > 0 && (
              <Button 
                onClick={handleRecalculateAllProgress}
                variant="outline"
                size="lg"
                className="bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100 transition-all duration-300"
              >
                🔧 Fix All Progress
              </Button>
            )}
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-semibold transition-all duration-300"
            >
              <Link to="/instructor/courses/create">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Course
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Section */}
        {instructorCourses.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={animationVariants.container}
            initial="hidden"
            animate="show"
          >
            <DashboardStatCard
              title="Total Courses"
              value={totalCourses}
              icon={<BookOpen className="w-5 h-5" />}
              gradient="from-cyan-500 to-blue-500"
              delay={0.1}
            />
            <DashboardStatCard
              title="Published"
              value={publishedCourses}
              icon={<Eye className="w-5 h-5" />}
              gradient="from-green-500 to-emerald-500"
              delay={0.2}
            />
            <DashboardStatCard
              title="Draft"
              value={draftCourses}
              icon={<Clock className="w-5 h-5" />}
              gradient="from-orange-500 to-yellow-500"
              delay={0.3}
            />
            <DashboardStatCard
              title="Ended"
              value={endedCourses}
              icon={<CheckCircle2 className="w-5 h-5" />}
              gradient="from-purple-500 to-pink-500"
              delay={0.4}
            />
          </motion.div>
        )}

        {/* Search and Filter Section */}
        {instructorCourses.length > 0 && (
          <motion.div 
            className="mb-8"
            variants={animationVariants.fadeInUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                    <TabsList className="grid w-full grid-cols-4 sm:w-auto bg-gray-100/50">
                      <TabsTrigger 
                        value="all" 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
                      >
                        All
                      </TabsTrigger>
                      <TabsTrigger 
                        value="published"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-300"
                      >
                        Published
                      </TabsTrigger>
                      <TabsTrigger 
                        value="draft"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white transition-all duration-300"
                      >
                        Draft
                      </TabsTrigger>
                      <TabsTrigger 
                        value="ended"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
                      >
                        Ended
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Courses Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={animationVariants.container}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
};

export default InstructorDashboard;