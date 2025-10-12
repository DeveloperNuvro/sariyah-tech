// src/pages/StudentDashboard.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Redux Imports
import { fetchMyOrders } from '../../features/orders/orderSlice';
import { fetchMyEnrollments } from '../../features/enrollments/enrollmentSlice';
import { fetchMyCertificates } from '@/features/certificates/certificateSlice';

// Shadcn UI & Component Imports
import { MyCourseCard } from '@/components/MyCourseCard';
import { MyCourseCardSkeleton } from '@/components/MyCourseCardSkeleton';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpenCheck, CheckCircle, Award, TrendingUp, Sparkles, ArrowRight, BookOpen } from "lucide-react";

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
const DashboardStatCard = ({ title, value, icon, gradient, delay = 0 }) => (
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
                <p className="text-xs text-gray-500 mt-1">Total count</p>
            </CardContent>
        </Card>
    </motion.div>
);


const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { myOrders, status: orderStatus } = useSelector((state) => state.orders);
  const { myEnrollments, status: enrollmentStatus } = useSelector((state) => state.enrollments);
  const { certificates, status: certStatus } = useSelector((state) => state.certificates);


  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchMyOrders());
    dispatch(fetchMyEnrollments());
    dispatch(fetchMyCertificates());
  }, [dispatch]);

  const enrollmentMap = useMemo(() => new Map(myEnrollments.map(e => [e.course._id, e])), [myEnrollments]);
  const certificateMap = useMemo(() => new Map(certificates.map(c => [c.course._id, c])), [certificates]);

  const isLoading = orderStatus === 'loading' || enrollmentStatus === 'loading' || certStatus === 'loading';

  // Calculate stats for the dashboard header
  const coursesInProgress = myEnrollments.filter(e => e.progress > 0 && e.progress < 100).length;
  const completedCourses = myEnrollments.filter(e => e.progress === 100).length;
  const certificatesEarned = certificates.length;

  // Filter orders based on the active tab
  const filteredOrders = useMemo(() => {
    if (activeTab === 'in-progress') {
        return myOrders.filter(order => {
            const enrollment = enrollmentMap.get(order.course._id);
            return enrollment && enrollment.progress > 0 && enrollment.progress < 100;
        });
    }
    if (activeTab === 'completed') {
        return myOrders.filter(order => {
            const enrollment = enrollmentMap.get(order.course._id);
            return enrollment && enrollment.progress === 100;
        });
    }
    return myOrders; // "all" tab
  }, [activeTab, myOrders, enrollmentMap]);


  const renderContent = () => {
    if (isLoading && myOrders.length === 0) {
      return Array.from({ length: 3 }).map((_, index) => <MyCourseCardSkeleton key={index} />);
    }

    if (myOrders.length === 0) {
      return (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center p-16 border-2 border-dashed border-gray-200/50 rounded-2xl bg-white/50 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-pink-400/5"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Learning Journey Starts Here</h2>
            <p className="text-gray-600 mb-8 max-w-md">Discover amazing courses and start building your skills today. Join thousands of learners already on their journey!</p>
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-semibold px-8 py-3 group"
            >
              <Link to="/courses">
                Browse Courses
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      );
    }

    if (filteredOrders.length === 0) {
        return <p className="text-center text-muted-foreground py-12">No courses in this category.</p>
    }

    return filteredOrders.map(order => {
      const enrollmentDetails = enrollmentMap.get(order.course._id);
      const certificate = certificateMap.get(order.course._id);
      return (
        <MyCourseCard key={order._id} order={order} enrollmentDetails={enrollmentDetails} certificate={certificate} />
      );
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400/5 to-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={animationVariants.container}
        >
          {/* Header Section */}
          <motion.div variants={animationVariants.fadeInUp} className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
                My Learning Dashboard
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Welcome back! Continue your learning journey and track your progress with beautiful insights.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={animationVariants.fadeInUp} className="grid gap-6 md:grid-cols-3 mb-12">
            <DashboardStatCard 
              title="In Progress" 
              value={coursesInProgress} 
              icon={<BookOpenCheck className="h-5 w-5" />}
              gradient="from-cyan-500 to-blue-500"
              delay={0.1}
            />
            <DashboardStatCard 
              title="Completed" 
              value={completedCourses} 
              icon={<CheckCircle className="h-5 w-5" />}
              gradient="from-green-500 to-emerald-500"
              delay={0.2}
            />
            <DashboardStatCard 
              title="Certificates" 
              value={certificatesEarned} 
              icon={<Award className="h-5 w-5" />}
              gradient="from-purple-500 to-pink-500"
              delay={0.3}
            />
          </motion.div>

          {/* Tabs & Content */}
          <motion.div variants={animationVariants.scaleIn}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white/90 backdrop-blur-sm border border-gray-200/50 p-1 shadow-lg rounded-xl">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg px-6 py-2"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    All Courses
                  </TabsTrigger>
                  <TabsTrigger 
                    value="in-progress"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg px-6 py-2"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    In Progress
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg px-6 py-2"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value={activeTab} className="mt-6">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                >
                  {renderContent()}
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default StudentDashboard;