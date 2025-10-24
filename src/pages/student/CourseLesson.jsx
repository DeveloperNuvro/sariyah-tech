// src/pages/CourseLessonPage.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Redux Imports
import { fetchLessonsForCourse, clearLessons } from '../../features/lessons/lessonSlice';
import { fetchCourseById, clearCurrentCourse } from '../../features/courses/courseSlice';
import { fetchProgressForCourse, updateLessonProgress, clearProgress } from '../../features/progress/progressSlice';
import { fetchMyEnrollments } from '../../features/enrollments/enrollmentSlice';
import { fetchQuizForLesson, fetchQuizResult, clearCurrentQuiz } from '@/features/quiz/quizSlice';

// Shadcn UI Components & Icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Menu, CheckCircle2, Circle, Loader2, Check, HelpCircle, Play, BookOpen, Sparkles, Trophy } from 'lucide-react';
import { YouTubeEmbed } from '@/components/YoutubeEmbed';
import Quiz from '@/components/Quiz';

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

// --- SUB-COMPONENTS (Kept in one file for convenience) ---

// Your Quiz Component (Assumed to exist)


const QuizDialog = ({ isOpen, onClose, lessonId, lessonTitle }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-4xl bg-white/95 backdrop-blur-sm border border-gray-200/50">
      <DialogHeader className="text-center pb-6">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Quiz Challenge
          </DialogTitle>
        </div>
        <DialogDescription className="text-lg text-gray-600">
          Test your understanding of: <span className="font-semibold text-gray-900">{lessonTitle}</span>
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <Quiz lessonId={lessonId} onQuizComplete={onClose} />
      </div>
    </DialogContent>
  </Dialog>
);

const LessonSidebar = ({ lessons, selectedLesson, onSelectLesson, courseTitle, courseProgress, onLinkClick }) => {
  const completedLessonsSet = new Set(courseProgress?.completedLessons || []);
  const progressPercentage = lessons.length > 0 ? (completedLessonsSet.size / lessons.length) * 100 : 0;
  

  return (
    <>
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-br from-cyan-50/50 to-pink-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 truncate">{courseTitle}</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-gray-900">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-gray-200/50" 
            />
            <div 
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600">
            {completedLessonsSet.size} of {lessons.length} lessons completed
          </p>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessonsSet.has(lesson._id);
            const isSelected = selectedLesson?._id === lesson._id;
            return (
              <motion.div
                key={lesson._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Button 
                  onClick={() => { onSelectLesson(lesson); if (onLinkClick) onLinkClick(); }} 
                  variant="ghost" 
                  className={`w-full justify-start cursor-pointer h-auto p-4 text-left rounded-xl transition-all duration-300 group ${
                    isSelected 
                      ? "bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-400/20 shadow-lg" 
                      : "hover:bg-gray-50/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isCompleted 
                        ? "bg-gradient-to-br from-green-500 to-emerald-500" 
                        : isSelected
                        ? "bg-gradient-to-br from-cyan-500 to-pink-500"
                        : "bg-gray-200"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : isSelected ? (
                        <Play className="h-4 w-4 text-white" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium block truncate ${
                        isCompleted ? "text-gray-600" : "text-gray-900"
                      }`}>
                        {lesson.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        Lesson {index + 1}
                      </span>
                    </div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </>
  );
};

const LessonContent = ({ lesson, courseProgress, onProgressToggle, onOpenQuiz, currentQuiz, quizStatus, progressStatus, onPrev, onNext, isFirstLesson, isLastLesson }) => {
  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a lesson to begin</h3>
          <p className="text-gray-600">Choose a lesson from the sidebar to start learning</p>
        </div>
      </div>
    );
  }
  
  const isCompleted = courseProgress?.completedLessons.includes(lesson._id);
 
  return (
    <motion.div
      key={lesson._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      <Card className="flex flex-col h-full bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <CardHeader className="bg-gradient-to-r from-cyan-50/50 to-pink-50/50 border-b border-gray-200/50">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl lg:text-3xl tracking-tight text-gray-900 mb-2">
                {lesson.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isCompleted ? 'bg-green-500' : 'bg-cyan-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {isCompleted ? 'Completed' : 'In Progress'}
                </span>
              </div>
            </div>
            <Button 
              onClick={() => onProgressToggle(lesson._id)} 
              disabled={progressStatus === 'loading'} 
              className={`${
                isCompleted 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                  : 'bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600'
              } text-white font-semibold transition-all duration-300`}
              size="sm"
            >
              {progressStatus === 'loading' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isCompleted ? (
                <Check className="mr-2 h-4 w-4" />
              ) : null}
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow p-6">
          {lesson.videoUrl && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-8 relative group" style={{ minHeight: '400px' }}>
              <YouTubeEmbed key={lesson._id} url={lesson.videoUrl} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          )}
          
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: lesson.content }} />
          
          {quizStatus === 'loading' && (
            <div className="mt-8">
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          )}
          
          {currentQuiz && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
                <AlertTitle className="text-lg font-semibold text-gray-900">Test Your Knowledge!</AlertTitle>
                <AlertDescription className="flex justify-between items-center mt-2">
                  <p className="text-gray-700">This lesson includes a quiz to check your understanding.</p>
                  <Button 
                    onClick={onOpenQuiz}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  >
                    Start Quiz
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-gray-200/50 pt-6 bg-gray-50/50">
          <Button 
            onClick={onPrev} 
            disabled={isFirstLesson} 
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> 
            Previous
          </Button>
          <Button 
            onClick={onNext} 
            disabled={isLastLesson}
            className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-semibold disabled:opacity-50"
          >
            Next Lesson 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const CourseLessonPageSkeleton = () => (
    <div className="flex h-screen bg-background">
      <aside className="w-80 border-r p-4 hidden lg:flex flex-col"><Skeleton className="h-6 w-3/4 mb-4" /><Skeleton className="h-8 w-full mb-6" /><Separator /><div className="flex-1 mt-4 space-y-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div></aside>
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto"><div className="flex justify-between items-center mb-6"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-10 w-48" /></div><Skeleton className="w-full aspect-video rounded-lg mb-6" /><div className="space-y-4"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-5/6" /></div><div className="flex justify-between mt-8"><Skeleton className="h-10 w-32" /><Skeleton className="h-10 w-32" /></div></main>
    </div>
);


// --- MAIN PAGE COMPONENT ---

const CourseLessonPage = () => {
    const { courseId } = useParams();
    const dispatch = useDispatch();

    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false); // State for mobile sidebar
     const { isAuthenticated, status: authStatus } = useSelector((state) => state.auth);

    // Redux Selectors
    const { lessons, status: lessonStatus } = useSelector((state) => state.lessons);
    const { currentCourse } = useSelector((state) => state.courses);
    const { progressData, status: progressStatus } = useSelector((state) => state.progress);
    const { currentQuiz, status: quizStatus } = useSelector((state) => state.quizzes);

    const courseProgress = useMemo(() => progressData[courseId] || { completedLessons: [], lastWatchedLesson: null }, [progressData, courseId]);

    // Data Fetching and Cleanup
    useEffect(() => {
        // This effect will run when the component mounts and when the authentication status changes.
        if (courseId && isAuthenticated) {
            // ONLY fetch data once we know the user is authenticated.
            // This guarantees the Authorization header will be present for the API calls.
            dispatch(fetchCourseById(courseId));
            dispatch(fetchLessonsForCourse(courseId));
            dispatch(fetchProgressForCourse(courseId));
        }
        
        // Cleanup function remains the same
        return () => {
            dispatch(clearLessons()); 
            dispatch(clearCurrentCourse()); 
            dispatch(clearProgress()); 
            dispatch(clearCurrentQuiz());
        };
    }, [courseId, dispatch, isAuthenticated]);

    // Auto-select lesson
    useEffect(() => {
        if (lessons.length > 0 && !selectedLesson) {
            const lastWatched = lessons.find(l => l._id === courseProgress.lastWatchedLesson);
            setSelectedLesson(lastWatched || lessons[0]);
        }
    }, [lessons, selectedLesson, courseProgress]);
    

    // Fetch quiz and result for selected lesson
    useEffect(() => {
        if (selectedLesson) {
            if (selectedLesson.quiz) {
                dispatch(fetchQuizForLesson(selectedLesson._id));
                dispatch(fetchQuizResult(selectedLesson._id));
            } else {
                dispatch(clearCurrentQuiz());
            }
        }
    }, [selectedLesson, dispatch]);

    // Event Handlers
    const handleProgressToggle = (lessonId) => {
        const isCompleted = courseProgress.completedLessons.includes(lessonId);
        dispatch(updateLessonProgress({ courseId, lessonId, completed: !isCompleted })).unwrap().then(() => dispatch(fetchMyEnrollments()));
    };
    

    // Lesson Navigation Logic
    const currentLessonIndex = useMemo(() => lessons.findIndex(l => l._id === selectedLesson?._id), [lessons, selectedLesson]);

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Access Denied. Please log in and enroll to view this course.</p>
            </div>
        );
    }
    const isFirstLesson = currentLessonIndex === 0;
    const isLastLesson = currentLessonIndex === lessons.length - 1;
    const handleNextLesson = () => { if (!isLastLesson) setSelectedLesson(lessons[currentLessonIndex + 1]); };
    const handlePrevLesson = () => { if (!isFirstLesson) setSelectedLesson(lessons[currentLessonIndex - 1]); };

    if (lessonStatus === 'loading' || !currentCourse) {
        return <CourseLessonPageSkeleton />;
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/5 to-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="w-80 border-r border-gray-200/50 flex-col h-full hidden lg:flex bg-white/80 backdrop-blur-sm relative z-10">
                <LessonSidebar 
                    lessons={lessons} 
                    selectedLesson={selectedLesson} 
                    onSelectLesson={setSelectedLesson} 
                    courseTitle={currentCourse?.title} 
                    courseProgress={courseProgress} 
                />
            </aside>
            
            <main className="flex-1 flex flex-col overflow-y-auto relative z-10">
                {/* --- MOBILE HEADER & SIDEBAR TRIGGER --- */}
                <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/90 backdrop-blur-sm">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button 
                                variant="outline" 
                                size="icon"
                                className="border-gray-300 hover:bg-gray-50"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-80 flex flex-col bg-white/95 backdrop-blur-sm">
                            <LessonSidebar 
                                lessons={lessons} 
                                selectedLesson={selectedLesson} 
                                onSelectLesson={setSelectedLesson} 
                                courseTitle={currentCourse?.title} 
                                courseProgress={courseProgress} 
                                onLinkClick={() => setIsSheetOpen(false)} 
                            />
                        </SheetContent>
                    </Sheet>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-lg font-bold text-gray-900 truncate max-w-48">
                            {currentCourse?.title}
                        </h1>
                    </div>
                    
                    <Button 
                        asChild 
                        variant="ghost" 
                        size="sm" 
                        className="px-3 text-gray-600 hover:text-gray-900"
                    >
                        <Link to="/dashboard/my-courses">
                            <ArrowLeft className="mr-2 h-4 w-4" /> 
                            Back
                        </Link>
                    </Button>
                </header>
                
                <div className="p-4 sm:p-6 lg:p-8 flex-grow">
                    <AnimatePresence mode="wait">
                        <LessonContent 
                            key={`lesson-${selectedLesson?._id}`}
                            lesson={selectedLesson} 
                            courseProgress={courseProgress} 
                            onProgressToggle={handleProgressToggle}
                            onOpenQuiz={() => setIsQuizModalOpen(true)} 
                            currentQuiz={currentQuiz}
                            quizStatus={quizStatus} 
                            progressStatus={progressStatus}
                            onPrev={handlePrevLesson} 
                            onNext={handleNextLesson}
                            isFirstLesson={isFirstLesson} 
                            isLastLesson={isLastLesson}
                        />
                    </AnimatePresence>
                </div>
            </main>

            <QuizDialog 
                isOpen={isQuizModalOpen} 
                onClose={() => setIsQuizModalOpen(false)} 
                lessonId={selectedLesson?._id} 
                lessonTitle={selectedLesson?.title} 
            />
        </div>
    );
};

export default CourseLessonPage;