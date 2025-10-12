// src/pages/CourseDetailPage.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom'; // <-- 1. Import useNavigate
import toast from 'react-hot-toast'; // <-- 2. Import toast
// Redux Imports
import { fetchCourseBySlug, clearCurrentCourse } from '../features/courses/courseSlice';
import { fetchMyEnrollments } from '@/features/enrollments/enrollmentSlice';
import { createOrder } from '@/features/orders/orderSlice';

// Shadcn UI Components & Icons
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle, CheckCircle2, Users, BookOpen, BarChart, ArrowRight } from 'lucide-react';

// --- SUB-COMPONENTS (Kept in one file as requested) ---

const CourseCurriculum = ({ lessons }) => {
    console.log(lessons)
    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4">Course Curriculum</h3>
            {lessons && lessons.length > 0 ? (
                <Accordion type="single" collapsible className="w-full bg-muted border rounded-lg">
                    {lessons.map((lesson, index) => (
                        <AccordionItem value={`item-${index}`} key={lesson._id}>
                            <AccordionTrigger className="px-6 hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <PlayCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span className="text-left font-semibold">{lesson.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4">
                                {lesson.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <p className="text-muted-foreground">No lessons have been added to this course yet.</p>
            )}
        </div>
    )
};

const CourseSidebar = ({ course, isEnrolled, isOwner, isAuthenticated, user, onEnrollClick }) => {
    const renderActionButtons = () => {
        if (isOwner || user?.role === 'admin') {
            return <Button variant="outline" className="w-full">Manage Course</Button>;
        }
        if (isEnrolled) {
            return (
                <Button asChild size="lg" className="w-full group bg-white text-black">
                    <Link to={`/learn/${course._id}`}>
                        Start Learning <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </Button>
            );
        }
        return (
            <Button
                size="lg"
                className="w-full group bg-white text-black"
                onClick={onEnrollClick} // <-- Use the handler from the parent
            >
                {course.price === 0 ? 'Enroll for Free' : 'Enroll Now'} {/* Dynamic button text */}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
        );
    };

    return (
        <div className="relative">
            <Card className="overflow-hidden shadow-xl lg:sticky lg:top-24 bg-card border">
                <CardHeader className="p-0">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-52 object-cover" />
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-3xl font-bold mb-4">${course.price}</p>
                    {renderActionButtons()}
                    <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                        <h4 className="font-semibold text-foreground">This course includes:</h4>
                        <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /><span>Full Lifetime Access</span></div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /><span>Certificate of Completion</span></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const CourseDetailSkeleton = () => (
    <div className="bg-background min-h-screen">
        {/* Header Skeleton */}
        <section className="relative w-full py-20 lg:py-32 bg-muted">
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
    const navigate = useNavigate()

    const { currentCourse, status } = useSelector((state) => state.courses);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { myEnrollments } = useSelector((state) => state.enrollments);
    console.log(currentCourse)

    const handleEnroll = () => {
        // First, check if the user is authenticated
        if (!isAuthenticated) {
            toast.error("Please log in to enroll in a course.");
            navigate('/login');
            return;
        }

        // If the course is free, dispatch the createOrder action directly
        if (currentCourse.price === 0) {
            dispatch(createOrder({ courseId: currentCourse._id }))
                .unwrap()
                .then(() => {
                    toast.success('Successfully enrolled! You can start learning now.');
                    // Re-fetch enrollments to update the UI instantly (e.g., show "Start Learning")
                    dispatch(fetchMyEnrollments());
                })
                .catch(err => {
                    toast.error(`Enrollment failed: ${err}`);
                });
        } else {
            // If the course is paid, navigate to the checkout page
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

    if (status === 'loading' || status === 'idle' || !currentCourse) {
        return <CourseDetailSkeleton />;
    }

    const instructorInitials = currentCourse.instructor?.name.split(' ').map(n => n[0]).join('') || 'U';

    return (
        <main className="bg-background">
            {/* --- IMMERSIVE COURSE HEADER --- */}
            <section className="relative w-full border-b">
                <div className="absolute inset-0">
                    <img src={currentCourse.thumbnail} alt={currentCourse.title} className="w-full h-full object-cover opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                </div>
                <div className="container relative z-10 mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
                    <Badge variant="secondary" className="mb-4">{currentCourse.category?.name || 'Development'}</Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground text-balance">
                        {currentCourse.title}
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl text-balance">
                        {currentCourse.description.substring(0, 150)}...
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                        <Avatar><AvatarImage src={currentCourse.instructor.avatarUrl} /><AvatarFallback>{instructorInitials}</AvatarFallback></Avatar>
                        <div><p className="font-semibold">{currentCourse.instructor.name}</p><p className="text-sm text-muted-foreground">Instructor</p></div>
                    </div>

                    {/* AT-A-GLANCE STATS */}
                    <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2"><BarChart className="h-5 w-5 text-primary" /><span className="capitalize font-medium">{currentCourse.level || 'All Levels'}</span></div>
                        <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /><span>{currentCourse.lessons?.length || 0} Lessons</span></div>
                        <div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><span>{currentCourse.enrollmentCount || 0} Students</span></div>
                    </div>
                </div>
            </section>

            {/* --- MAIN CONTENT SECTION --- */}
            <section className="container mx-auto px-4 py-12 lg:py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                    {/* Left Column: Course Details */}
                    <div className="lg:col-span-2">
                        <Card className="bg-muted border p-6">
                            <h3 className="text-2xl font-bold mb-4">What you'll learn</h3>
                            <ul className="space-y-3">
                                {/* This is a placeholder. Ideally, this would be a separate field in your data. */}
                                {currentCourse.description.split('. ').slice(0, 4).map((sentence, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span>{sentence.trim()}.</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <div className="mt-12">
                            <h3 className="text-2xl font-bold mb-4">About this course</h3>
                            <div className="prose prose-invert max-w-none text-muted-foreground">
                                <p>{currentCourse.description}</p>
                            </div>
                        </div>

                        <CourseCurriculum lessons={currentCourse.lessons} />
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="mt-8 lg:mt-0">
                        <CourseSidebar
                            course={currentCourse} isEnrolled={isEnrolled} isOwner={isOwner}
                            isAuthenticated={isAuthenticated} user={user} onEnrollClick={handleEnroll} 
                        />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default CourseDetailPage;