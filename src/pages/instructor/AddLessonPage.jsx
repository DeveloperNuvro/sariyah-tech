// src/pages/instructor/AddLessonPage.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import { 
  ArrowLeft, 
  Loader2, 
  BookText, 
  Play, 
  Clock, 
  FileText, 
  Video, 
  Plus,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

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

    // Helper function to validate YouTube URL
    const isValidYouTubeUrl = (url) => {
        if (!url) return true; // Allow empty URLs
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
        return youtubeRegex.test(url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate YouTube URL
        if (lessonData.videoUrl && !isValidYouTubeUrl(lessonData.videoUrl)) {
            toast.error('Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)');
            return;
        }
        
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
                    <Button asChild variant="outline" size="icon" className="border-2 border-cyan-400/20 hover:bg-cyan-400/10">
                        <Link to="/dashboard/instructor">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back to Dashboard</span>
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
                                Add New Lesson
                            </h1>
                        </div>
                        <p className="text-gray-600">
                            To: {currentCourse?.title || <Skeleton className="h-5 w-48 inline-block" />}
                        </p>
                    </div>
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
                    variants={animationVariants.container}
                    initial="hidden"
                    animate="show"
                >
                    {/* Left Column: Form */}
                    <motion.div className="lg:col-span-2" variants={animationVariants.fadeInUp}>
                        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                            <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border-b border-gray-200/50">
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <FileText className="w-5 h-5 text-cyan-600" />
                                    New Lesson Details
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    Fill out the form to add a new lesson to your course
                                </CardDescription>
                            </CardHeader>
                            
                            <form onSubmit={handleSubmit}>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="flex items-center gap-2 text-gray-700 font-semibold">
                                            <BookText className="w-4 h-4 text-cyan-600" />
                                            Lesson Title
                                        </Label>
                                        <Input 
                                            id="title" 
                                            name="title" 
                                            placeholder="e.g., Introduction to React Components" 
                                            value={lessonData.title} 
                                            onChange={handleInputChange} 
                                            required 
                                            disabled={isLoading}
                                            className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 text-lg py-3"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="content" className="flex items-center gap-2 text-gray-700 font-semibold">
                                            <FileText className="w-4 h-4 text-cyan-600" />
                                            Lesson Content
                                        </Label>
                                        <Textarea 
                                            id="content" 
                                            name="content" 
                                            placeholder="Type your lesson content here. You can use HTML formatting for better presentation." 
                                            value={lessonData.content} 
                                            onChange={handleInputChange} 
                                            rows={8} 
                                            disabled={isLoading}
                                            className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="videoUrl" className="flex items-center gap-2 text-gray-700 font-semibold">
                                                <Video className="w-4 h-4 text-cyan-600" />
                                                YouTube Video URL
                                            </Label>
                                            <Input 
                                                id="videoUrl" 
                                                name="videoUrl" 
                                                placeholder="https://www.youtube.com/watch?v=VIDEO_ID" 
                                                value={lessonData.videoUrl} 
                                                onChange={handleInputChange} 
                                                disabled={isLoading}
                                                className={`border-gray-300 focus:ring-cyan-500 ${
                                                    lessonData.videoUrl && !isValidYouTubeUrl(lessonData.videoUrl) 
                                                        ? 'border-red-500 focus:border-red-500' 
                                                        : 'focus:border-cyan-500'
                                                }`}
                                            />
                                            
                                            <AnimatePresence>
                                                {lessonData.videoUrl && !isValidYouTubeUrl(lessonData.videoUrl) && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="flex items-center gap-2 text-sm text-red-600"
                                                    >
                                                        <AlertCircle className="w-4 h-4" />
                                                        Please enter a valid YouTube URL
                                                    </motion.div>
                                                )}
                                                {lessonData.videoUrl && isValidYouTubeUrl(lessonData.videoUrl) && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="flex items-center gap-2 text-sm text-green-600"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Valid YouTube URL
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            
                                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                <p className="font-medium mb-1">Supported formats:</p>
                                                <p>• https://www.youtube.com/watch?v=VIDEO_ID</p>
                                                <p>• https://youtu.be/VIDEO_ID</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="duration" className="flex items-center gap-2 text-gray-700 font-semibold">
                                                <Clock className="w-4 h-4 text-cyan-600" />
                                                Duration (minutes)
                                            </Label>
                                            <Input 
                                                id="duration" 
                                                name="duration" 
                                                type="number" 
                                                min="0" 
                                                placeholder="e.g., 15" 
                                                value={lessonData.duration} 
                                                onChange={handleInputChange} 
                                                disabled={isLoading}
                                                className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                
                                <CardFooter className="p-8 pt-0">
                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-semibold px-8 py-3 transition-all duration-300"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Adding Lesson...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-5 w-5" />
                                                Add Lesson
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </motion.div>

                    {/* Right Column: Existing Lessons */}
                    <motion.div className="sticky top-24" variants={animationVariants.scaleIn}>
                        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-200/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-gray-900">
                                        <Play className="w-5 h-5 text-purple-600" />
                                        Existing Lessons
                                    </CardTitle>
                                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                        {lessons.length}
                                    </Badge>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="p-0">
                                <ScrollArea className="h-96">
                                    <div className="p-4 space-y-3">
                                        {lessonStatus === 'loading' && lessons.length === 0 ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: i * 0.1 }}
                                                >
                                                    <Skeleton className="h-12 w-full rounded-lg" />
                                                </motion.div>
                                            ))
                                        ) : lessons.length > 0 ? (
                                            <AnimatePresence>
                                                {lessons.map((lesson, index) => (
                                                    <motion.div
                                                        key={lesson._id}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <BookText className="h-4 w-4 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
                                                            <div className="flex gap-2 mt-1">
                                                                <Link
                                                                    to={`/instructor/lesson/${lesson._id}/quiz`}
                                                                    className="text-xs text-cyan-600 hover:text-cyan-700 hover:underline"
                                                                >
                                                                    Manage Quiz
                                                                </Link>
                                                                <Link 
                                                                    to={`/instructor/lesson/${lesson._id}/quiz-results`} 
                                                                    className="text-xs text-green-600 hover:text-green-700 hover:underline"
                                                                >
                                                                    View Results
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        ) : (
                                            <motion.div 
                                                className="text-center py-8"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <BookText className="w-8 h-8 text-white" />
                                                </div>
                                                <p className="text-sm text-gray-500">No lessons added yet</p>
                                                <p className="text-xs text-gray-400 mt-1">Start by adding your first lesson</p>
                                            </motion.div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

export default AddLessonPage;