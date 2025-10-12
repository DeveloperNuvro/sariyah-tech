import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getDashboardStats } from '../../features/admin/adminSlice';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  DollarSign, 
  TrendingUp, 
  Award,
  FileText,
  Star,
  UserCheck,
  ShoppingCart,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
  }
};

// Enhanced stat cards with gradients and animations
const StatCard = ({ title, value, icon, gradient, delay = 0, subtitle }) => (
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

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, status } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  // Debug: Log dashboard stats to see the data structure
  useEffect(() => {
    if (dashboardStats?.recent?.courses) {
      console.log('Dashboard Stats - Recent Courses:', dashboardStats.recent.courses);
      dashboardStats.recent.courses.forEach((course, index) => {
        console.log(`Course ${index + 1}:`, {
          title: course.title,
          isPublished: course.isPublished,
          isEnded: course.isEnded,
          createdAt: course.createdAt
        });
      });
    }
  }, [dashboardStats]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

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
          className="flex items-center gap-4 mb-8"
          variants={animationVariants.fadeInUp}
          initial="hidden"
          animate="show"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Complete system overview and management
            </p>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={animationVariants.container}
          initial="hidden"
          animate="show"
        >
          {/* User Stats */}
          <StatCard
            title="Total Users"
            value={dashboardStats?.users?.total || 0}
            icon={<Users className="w-5 h-5" />}
            gradient="from-cyan-500 to-blue-500"
            delay={0.1}
          />
          <StatCard
            title="Students"
            value={dashboardStats?.users?.students || 0}
            icon={<GraduationCap className="w-5 h-5" />}
            gradient="from-green-500 to-emerald-500"
            delay={0.2}
          />
          <StatCard
            title="Instructors"
            value={dashboardStats?.users?.instructors || 0}
            icon={<Award className="w-5 h-5" />}
            gradient="from-purple-500 to-pink-500"
            delay={0.3}
          />

          {/* Course Stats */}
          <StatCard
            title="Total Courses"
            value={dashboardStats?.courses?.total || 0}
            icon={<BookOpen className="w-5 h-5" />}
            gradient="from-orange-500 to-red-500"
            delay={0.4}
          />
          <StatCard
            title="Published"
            value={dashboardStats?.courses?.published || 0}
            icon={<TrendingUp className="w-5 h-5" />}
            gradient="from-green-500 to-emerald-500"
            delay={0.5}
          />
          <StatCard
            title="Draft"
            value={dashboardStats?.courses?.unpublished || 0}
            icon={<FileText className="w-5 h-5" />}
            gradient="from-yellow-500 to-orange-500"
            delay={0.6}
          />

          {/* Content Stats */}
          <StatCard
            title="Total Lessons"
            value={dashboardStats?.content?.lessons || 0}
            icon={<FileText className="w-5 h-5" />}
            gradient="from-blue-500 to-indigo-500"
            delay={0.7}
          />
          <StatCard
            title="Categories"
            value={dashboardStats?.content?.categories || 0}
            icon={<Star className="w-5 h-5" />}
            gradient="from-pink-500 to-rose-500"
            delay={0.8}
          />
        </motion.div>

        {/* Engagement Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={animationVariants.container}
          initial="hidden"
          animate="show"
        >
          <StatCard
            title="Total Enrollments"
            value={dashboardStats?.engagement?.enrollments || 0}
            icon={<UserCheck className="w-5 h-5" />}
            gradient="from-cyan-500 to-blue-500"
            delay={0.9}
          />
          <StatCard
            title="Total Orders"
            value={dashboardStats?.engagement?.orders || 0}
            icon={<ShoppingCart className="w-5 h-5" />}
            gradient="from-green-500 to-emerald-500"
            delay={1.0}
          />
          <StatCard
            title="Total Revenue"
            value={`৳${dashboardStats?.engagement?.revenue || 0}`}
            icon={<DollarSign className="w-5 h-5" />}
            gradient="from-purple-500 to-pink-500"
            delay={1.1}
          />
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={animationVariants.container}
          initial="hidden"
          animate="show"
        >
          {/* Recent Users */}
          <motion.div variants={animationVariants.fadeInUp}>
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-gray-200/50">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Users className="w-5 h-5 text-cyan-600" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {dashboardStats?.recent?.users?.length > 0 ? (
                    dashboardStats.recent.users.map((user, index) => (
                      <div key={user._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent users</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Courses */}
          <motion.div variants={animationVariants.fadeInUp}>
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-200/50">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Recent Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {dashboardStats?.recent?.courses?.length > 0 ? (
                    dashboardStats.recent.courses.map((course, index) => (
                      <div key={course._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-600">by {course.instructor?.name}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.isEnded ? 'bg-gray-100 text-gray-800' :
                            course.isPublished === true ? 'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.isEnded ? 'Ended' :
                             course.isPublished === true ? 'Published' : 'Draft'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(course.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent courses</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
