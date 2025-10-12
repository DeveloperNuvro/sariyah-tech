// src/pages/StudentDashboard.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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
import { BookOpenCheck, CheckCircle, Award } from "lucide-react";

// A new sub-component for our stat cards
const DashboardStatCard = ({ title, value, icon }) => (
    <Card className="bg-muted border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
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
        <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg bg-muted">
          <BookOpenCheck className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your Learning Journey Starts Here</h2>
          <p className="text-muted-foreground mb-6">You haven't enrolled in any courses yet.</p>
          <Button asChild><Link to="/">Browse Courses</Link></Button>
        </div>
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
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Learning Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Continue your learning journey and track your progress.</p>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
          <DashboardStatCard title="In Progress" value={coursesInProgress} icon={<BookOpenCheck className="h-4 w-4 text-muted-foreground" />} />
          <DashboardStatCard title="Completed" value={completedCourses} icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} />
          <DashboardStatCard title="Certificates" value={certificatesEarned} icon={<Award className="h-4 w-4 text-muted-foreground" />} />
      </div>

      {/* --- TABS & CONTENT --- */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-6">
                {renderContent()}
            </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default StudentDashboard;