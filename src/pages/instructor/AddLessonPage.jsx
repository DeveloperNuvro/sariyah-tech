// src/pages/instructor/AddLessonPage.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addLessonToCourse, fetchLessonsForCourse } from '../../features/lessons/lessonSlice';
import { fetchCourseById } from '../../features/courses/courseSlice';

// Shadcn/UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, BookText } from "lucide-react";

const AddLessonPage = () => {
    const { courseId } = useParams();
    const dispatch = useDispatch();

    const { currentCourse } = useSelector((state) => state.courses);
    const { lessons, status: lessonStatus } = useSelector((state) => state.lessons);

    const [lessonData, setLessonData] = useState({
        title: '',
        content: '',
        videoUrl: '',
        duration: '',
    });

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseById(courseId));
            dispatch(fetchLessonsForCourse(courseId));
        }
    }, [courseId, dispatch]);

    const handleInputChange = (e) => {
        setLessonData({ ...lessonData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addLessonToCourse({ courseId, lessonData }))
            .unwrap()
            .then(() => {
                toast.success('Lesson added successfully!');
                setLessonData({ title: '', content: '', videoUrl: '', duration: '' });
                // Note: The new lesson will appear automatically because `addLessonToCourse`
                // should update the `lessons` state in your Redux slice.
            })
            .catch((err) => {
                toast.error(`Failed to add lesson: ${err.message || 'Server error'}`);
            });
    };

    const isLoading = lessonStatus === 'loading';

    return (
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
                <Button asChild variant="outline" size="icon">
                    <Link to="/dashboard/instructor">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Dashboard</span>
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Add Lesson</h1>
                    <p className="text-muted-foreground truncate max-w-sm">
                        To: {currentCourse?.title || <Skeleton className="h-5 w-48 inline-block" />}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Form */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>New Lesson Details</CardTitle>
                        <CardDescription>Fill out the form to add a new lesson to your course.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Lesson Title</Label>
                                <Input id="title" name="title" placeholder="e.g., Introduction to React" value={lessonData.title} onChange={handleInputChange} required disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Lesson Content</Label>
                                <Textarea id="content" name="content" placeholder="Type your lesson content here. HTML is supported." value={lessonData.content} onChange={handleInputChange} rows={8} disabled={isLoading} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="videoUrl">Video URL</Label>
                                    <Input id="videoUrl" name="videoUrl" placeholder="https://res.cloudinary.com/..." value={lessonData.videoUrl} onChange={handleInputChange} disabled={isLoading} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration (minutes)</Label>
                                    <Input id="duration" name="duration" type="number" min="0" placeholder="e.g., 15" value={lessonData.duration} onChange={handleInputChange} disabled={isLoading} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding Lesson...
                                    </>
                                ) : (
                                    'Add Lesson'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Right Column: Existing Lessons */}
                <Card className="sticky top-24">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Existing Lessons</CardTitle>
                        <Badge variant="secondary">{lessons.length}</Badge>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-0">
                        <ScrollArea className="h-96">
                            <div className="p-4 space-y-3">
                                {lessonStatus === 'loading' && lessons.length === 0 ? (
                                    Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
                                ) : lessons.length > 0 ? (
                                    lessons.map((lesson) => (
                                        <div key={lesson._id} className="flex items-center gap-3">
                                            <BookText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                            <p className="text-sm font-medium truncate">{lesson.title}</p>
                                            <Link
                                                to={`/instructor/lesson/${lesson._id}/quiz`}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Manage Quiz
                                            </Link>
                                            <Link to={`/instructor/lesson/${lesson._id}/quiz-results`} className="text-sm text-green-600 hover:underline">View Results</Link>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-center text-muted-foreground py-4">No lessons added yet.</p>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default AddLessonPage;