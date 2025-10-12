// src/pages/CourseDetailPage.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Redux Imports
import { fetchCourseBySlug, clearCurrentCourse } from '../features/courses/courseSlice';
import { fetchMyEnrollments } from '@/features/enrollments/enrollmentSlice';
import { createOrder } from '@/features/orders/orderSlice';

// Shadcn UI Components & Icons
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    PlayCircle, CheckCircle2, Users, BookOpen, BarChart, ArrowRight, 
    Clock, Award, Star, Shield, Zap, Target, Globe, Calendar
} from 'lucide-react';

// Animation variants
const animationVariants = {
    container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } },
    fadeInUp: { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } },
    scaleIn: { hidden: { scale: 0.95, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } },
    slideInLeft: { hidden: { x: -50, opacity: 0 }, show: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } },
    slideInRight: { hidden: { x: 50, opacity: 0 }, show: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } }
};

// Helper function to format text content with proper HTML tags
const formatTextContent = (text) => {
    if (!text) return '';
    
    // Convert markdown-like formatting to HTML
    let formattedText = text
        // Bold text **text** or __text__
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        // Italic text *text* or _text_
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        // Headers # Header, ## Header, ### Header
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mb-2 mt-4">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mb-3 mt-6">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-4 mt-8">$1</h1>')
        // Line breaks
        .replace(/\n/g, '<br>')
        // Lists - * item or - item
        .replace(/^[\s]*[\*\-] (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
        // Numbered lists
        .replace(/^[\s]*\d+\. (.*$)/gim, '<li class="ml-4 mb-1">$1</li>');

    return formattedText;
};

// Component to render formatted content
const FormattedContent = ({ content, className = "" }) => {
    const formattedContent = formatTextContent(content);
    
    return (
        <div 
            className={`prose prose-gray max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
    );
};

// --- SUB-COMPONENTS ---

const CourseCurriculum = ({ lessons }) => {
    return (
        <motion.div 
            className="mt-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={animationVariants.fadeInUp}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Course Curriculum</h3>
            </div>
            
            {lessons && lessons.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg">
                    <Accordion type="single" collapsible className="w-full">
                        {lessons.map((lesson, index) => (
                            <AccordionItem value={`item-${index}`} key={lesson._id} className="border-b border-gray-200/50">
                                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400/20 to-pink-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <PlayCircle className="h-4 w-4 text-cyan-600" />
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-900">{lesson.title}</span>
                                            <p className="text-sm text-gray-500 mt-1">Lesson {index + 1}</p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4">
                                    <div className="bg-gray-50/50 rounded-lg p-4">
                                        <FormattedContent content={lesson.content} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No lessons have been added to this course yet.</p>
                </div>
            )}
        </motion.div>
    );
};

const CourseSidebar = ({ course, isEnrolled, isOwner, isAuthenticated, user, onEnrollClick, isEnrolling }) => {
    const renderActionButtons = () => {
        if (isOwner || user?.role === 'admin') {
            return (
                <Button 
                    asChild
                    variant="outline" 
                    className="w-full border-2 border-cyan-400/20 hover:bg-cyan-400/10"
                >
                    <Link to="/dashboard/instructor">
                        Manage Course
                    </Link>
                </Button>
            );
        }
        if (isEnrolled) {
            return (
                <Button asChild size="lg" className="w-full group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300">
                    <Link to={`/learn/${course._id}`}>
                        Start Learning <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </Button>
            );
        }
        return (
            <Button
                size="lg"
                className="w-full group bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white transition-all duration-300"
                onClick={onEnrollClick}
                disabled={isEnrolling}
            >
                {isEnrolling ? 'Processing...' : (course.price === 0 ? 'Enroll for Free' : 'Enroll Now')}
                {!isEnrolling && <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
            </Button>
        );
    };

    return (
        <motion.div 
            className="relative"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={animationVariants.scaleIn}
        >
            <Card className="overflow-hidden lg:sticky lg:top-24 bg-white border border-gray-200">
                <CardHeader className="p-0">
                    <div className="relative">
                        <img src={course.thumbnail} alt={course.title} className="w-full aspect-square object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white border-0">
                            {course.category?.name || 'Development'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="text-center mb-6">
                        <p className="text-4xl font-bold text-gray-900 mb-2">
                            {course.price === 0 ? 'Free' : `৳${course.price}`}
                        </p>
                        {course.price > 0 && (
                            <p className="text-sm text-gray-500">One-time payment</p>
                        )}
                        {isEnrolled && (
                            <div className="mt-3 inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                <CheckCircle2 className="h-4 w-4" />
                                Enrolled
                            </div>
                        )}
                    </div>
                    
                    {renderActionButtons()}
                    
                    <div className="mt-6 space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-cyan-500" />
                            This course includes:
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-600">Full Lifetime Access</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Award className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                                <span className="text-sm text-gray-600">Certificate of Completion</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                <span className="text-sm text-gray-600">Access on Mobile & Desktop</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Zap className="h-5 w-5 text-purple-500 flex-shrink-0" />
                                <span className="text-sm text-gray-600">30-Day Money Back Guarantee</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const CourseDetailSkeleton = () => (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
        {/* Header Skeleton */}
        <section className="relative w-full py-20 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-8 w-full max-w-2xl mb-8" />
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-4 w-24" /></div>
                </div>
                <div className="flex flex-wrap gap-6"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-24" /></div>
            </div>
        </section>
        {/* Content Skeleton */}
        <section className="container mx-auto px-4 py-12 lg:py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <div><Skeleton className="h-8 w-1/3 mb-4" /><Skeleton className="h-5 w-full mb-2" /><Skeleton className="h-5 w-5/6" /></div>
                    <div><Skeleton className="h-8 w-1/2 mb-4" /><div className="space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div></div>
                </div>
                <div className="mt-8 lg:mt-0"><Skeleton className="h-[500px] w-full rounded-lg" /></div>
            </div>
        </section>
    </div>
);

// --- MAIN PAGE COMPONENT ---

const CourseDetailPage = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentCourse, status } = useSelector((state) => state.courses);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { myEnrollments } = useSelector((state) => state.enrollments);
    const { status: orderStatus } = useSelector((state) => state.orders);

    // Debug: Log the course data to see what's coming from backend
    console.log('Course data from backend:', currentCourse);

    const handleEnroll = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to enroll in a course.");
            navigate('/login');
            return;
        }

        if (currentCourse.price === 0) {
            dispatch(createOrder({ courseId: currentCourse._id }))
                .unwrap()
                .then(() => {
                    toast.success('🎉 Successfully enrolled! You can start learning now.');
                    dispatch(fetchMyEnrollments());
                })
                .catch(err => {
                    console.error('Enrollment error:', err);
                    toast.error(`Enrollment failed: ${err.message || err}`);
                });
        } else {
            navigate(`/checkout/${currentCourse._id}`);
        }
    };

    useEffect(() => {
        if (slug) dispatch(fetchCourseBySlug(slug));
        if (isAuthenticated) dispatch(fetchMyEnrollments());
        return () => { dispatch(clearCurrentCourse()); };
    }, [slug, dispatch, isAuthenticated]);

    const isEnrolled = myEnrollments.some(e => e.course?._id === currentCourse?._id);
    const isOwner = user?._id === currentCourse?.instructor?._id;
    const isEnrolling = orderStatus === 'loading';
    
    // Debug: Log enrollment status
    console.log('Enrollment status:', { 
        isEnrolled, 
        courseId: currentCourse?._id, 
        myEnrollments: myEnrollments.map(e => ({ courseId: e.course?._id, courseTitle: e.course?.title }))
    });

    if (status === 'loading' || status === 'idle' || !currentCourse) {
        return <CourseDetailSkeleton />;
    }

    const instructorInitials = currentCourse.instructor?.name.split(' ').map(n => n[0]).join('') || 'U';

    return (
        <main className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full py-20 lg:py-32 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container relative z-10 mx-auto px-4 max-w-7xl">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={animationVariants.container}
                    >
                        <motion.div className="mb-6" variants={animationVariants.fadeInUp}>
                            <Badge className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white border-0 px-4 py-2">
                                {currentCourse.category?.name || 'Development'}
                            </Badge>
                        </motion.div>
                        
                        <motion.h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6"
                            variants={animationVariants.fadeInUp}
                        >
                            {currentCourse.title}
                        </motion.h1>
                        
                        <motion.p 
                            className="text-lg md:text-xl text-gray-600 max-w-4xl leading-relaxed mb-8"
                            variants={animationVariants.fadeInUp}
                        >
                            {currentCourse.shortDescription || currentCourse.description?.substring(0, 200) + '...'}
                        </motion.p>

                        <motion.div 
                            className="flex items-center gap-4 mb-8"
                            variants={animationVariants.fadeInUp}
                        >
                            <Avatar className="w-12 h-12 border-2 border-cyan-400/20">
                                <AvatarImage src={currentCourse.instructor.avatarUrl} />
                                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-pink-500 text-white">
                                    {instructorInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-gray-900">{currentCourse.instructor.name}</p>
                                <p className="text-sm text-gray-600">Instructor</p>
                            </div>
                        </motion.div>

                        {/* Pricing Display */}
                        <motion.div 
                            className="mb-8"
                            variants={animationVariants.fadeInUp}
                        >
                            {currentCourse.discountPrice && currentCourse.discountPrice < currentCourse.price ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl font-bold text-gray-900">৳{currentCourse.discountPrice}</span>
                                        <span className="text-2xl text-gray-500 line-through">৳{currentCourse.price}</span>
                                    </div>
                                    <div className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                                        Save ৳{currentCourse.price - currentCourse.discountPrice}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-4xl font-bold text-gray-900">৳{currentCourse.price}</div>
                            )}
                        </motion.div>

                        {/* Course Stats */}
                        <motion.div 
                            className="flex flex-wrap items-center gap-6"
                            variants={animationVariants.fadeInUp}
                        >
                            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                                <BarChart className="h-5 w-5 text-cyan-500" />
                                <span className="text-sm font-medium text-gray-700 capitalize">{currentCourse.level || 'All Levels'}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                                <BookOpen className="h-5 w-5 text-pink-500" />
                                <span className="text-sm font-medium text-gray-700">{currentCourse.lessons?.length || 0} Lessons</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                                <Users className="h-5 w-5 text-purple-500" />
                                <span className="text-sm font-medium text-gray-700">{currentCourse.enrollmentCount || 0} Students</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                                <Clock className="h-5 w-5 text-orange-500" />
                                <span className="text-sm font-medium text-gray-700">Lifetime Access</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="container mx-auto px-4 py-12 lg:py-16 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                    {/* Left Column: Course Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Overview */}
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={animationVariants.fadeInUp}
                        >
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-4 h-4 text-white" />
                                    </div>
                                    About This Course
                                </h3>
                                <FormattedContent content={currentCourse.description} className="text-gray-700 leading-relaxed" />
                            </div>
                        </motion.div>


                        {/* Course Objectives */}
                        {currentCourse.objectives && (
                            <motion.div
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={animationVariants.fadeInUp}
                            >
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                            <Target className="w-4 h-4 text-white" />
                                        </div>
                                        Course Objectives
                                    </h3>
                                    <FormattedContent content={currentCourse.objectives} className="text-gray-700 leading-relaxed" />
                                </div>
                            </motion.div>
                        )}

                        {/* Course Requirements */}
                        {currentCourse.requirements && (
                            <motion.div
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={animationVariants.fadeInUp}
                            >
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-white" />
                                        </div>
                                        Requirements
                                    </h3>
                                    <FormattedContent content={currentCourse.requirements} className="text-gray-700 leading-relaxed" />
                                </div>
                            </motion.div>
                        )}

                        {/* Course Prerequisites */}
                        {currentCourse.prerequisites && (
                            <motion.div
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={animationVariants.fadeInUp}
                            >
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                                            <BookOpen className="w-4 h-4 text-white" />
                                        </div>
                                        Prerequisites
                                    </h3>
                                    <FormattedContent content={currentCourse.prerequisites} className="text-gray-700 leading-relaxed" />
                                </div>
                            </motion.div>
                        )}

                        {/* Course Curriculum */}
                        <CourseCurriculum lessons={currentCourse.lessons} />
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="mt-8 lg:mt-0">
                        <CourseSidebar
                            course={currentCourse} 
                            isEnrolled={isEnrolled} 
                            isOwner={isOwner}
                            isAuthenticated={isAuthenticated} 
                            user={user} 
                            onEnrollClick={handleEnroll}
                            isEnrolling={isEnrolling}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default CourseDetailPage;