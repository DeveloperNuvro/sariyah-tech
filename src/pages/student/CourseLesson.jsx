// src/pages/CourseLessonPage.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

// Redux Imports
import { fetchLessonsForCourse, clearLessons } from '../../features/lessons/lessonSlice';
import { fetchCourseById, clearCurrentCourse } from '../../features/courses/courseSlice';
import { fetchProgressForCourse, updateLessonProgress, clearProgress } from '../../features/progress/progressSlice';
import { fetchMyEnrollments } from '../../features/enrollments/enrollmentSlice';
import { fetchQuizForLesson, clearCurrentQuiz } from '@/features/quiz/quizSlice';

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
import { ArrowLeft, ArrowRight, Menu, CheckCircle2, Circle, Loader2, Check, HelpCircle } from 'lucide-react';
import { YouTubeEmbed } from '@/components/YoutubeEmbed';
import Quiz from '@/components/Quiz';

// --- SUB-COMPONENTS (Kept in one file for convenience) ---

// Your Quiz Component (Assumed to exist)


const QuizDialog = ({ isOpen, onClose, lessonId, lessonTitle }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-3xl bg-gray-900">
      <DialogHeader>
        <DialogTitle className="text-2xl">Quiz: {lessonTitle}</DialogTitle>
        <DialogDescription>Answer the questions below to test your understanding of this lesson.</DialogDescription>
      </DialogHeader>
      <div className="py-4"><Quiz lessonId={lessonId} onQuizComplete={onClose} /></div>
    </DialogContent>
  </Dialog>
);

const LessonSidebar = ({ lessons, selectedLesson, onSelectLesson, courseTitle, courseProgress, onLinkClick }) => {
  const completedLessonsSet = new Set(courseProgress?.completedLessons || []);
  const progressPercentage = lessons.length > 0 ? (completedLessonsSet.size / lessons.length) * 100 : 0;

  return (
    <>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold truncate">{courseTitle}</h2>
        <div className="mt-3">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1.5">{Math.round(progressPercentage)}% Complete</p>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {lessons.map((lesson) => {
            const isCompleted = completedLessonsSet.has(lesson._id);
            return (
              <Button key={lesson._id} onClick={() => { onSelectLesson(lesson); if (onLinkClick) onLinkClick(); }} variant="ghost" className={`w-full justify-start cursor-pointer h-auto p-3 text-left ${selectedLesson?._id === lesson._id && "bg-accent"}`}>
                {isCompleted ? <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0 text-green-500" /> : <Circle className="h-5 w-5 mr-3 flex-shrink-0 text-muted-foreground" />}
                <span className={isCompleted ? "text-muted-foreground" : ""}>{lesson.title}</span>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </>
  );
};

const LessonContent = ({ lesson, courseProgress, onProgressToggle, onOpenQuiz, currentQuiz, quizStatus, progressStatus, onPrev, onNext, isFirstLesson, isLastLesson }) => {
  if (!lesson) return <div className="flex items-center justify-center h-full"><p>Select a lesson to begin.</p></div>;
  const isCompleted = courseProgress?.completedLessons.includes(lesson._id);
 
  console.log(lesson)
  return (
    <Card className="flex flex-col h-full bg-muted/50 border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <CardTitle className="text-2xl lg:text-3xl tracking-tight mb-2 sm:mb-0 text-balance">{lesson.title}</CardTitle>
            <Button onClick={() => onProgressToggle(lesson._id)} className='bg-white text-black' disabled={progressStatus === 'loading'} variant={isCompleted ? 'secondary' : 'default'} size="sm">
                {progressStatus === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isCompleted ? <Check className="mr-2 h-4 w-4" /> : null}
                {isCompleted ? 'Completed' : 'Mark as Complete'}
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {lesson.videoUrl && (
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-background mb-6 shadow-lg">
            <YouTubeEmbed url={lesson.videoUrl} />
   
          </div>
        )}
        <article className="prose prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        {quizStatus === 'loading' && <Skeleton className="h-24 w-full mt-8" />}
        {currentQuiz && (
          <Alert className="mt-8">
            <HelpCircle className="h-4 w-4" />
            <AlertTitle>Test Your Knowledge!</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <p>This lesson includes a quiz to check your understanding.</p>
              <Button onClick={onOpenQuiz}>Start Quiz</Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button onClick={onPrev} disabled={isFirstLesson} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Previous</Button>
        <Button onClick={onNext} disabled={isLastLesson}>Next Lesson <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </CardFooter>
    </Card>
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

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Access Denied. Please log in and enroll to view this course.</p>
            </div>
        );
    }

    // Auto-select lesson
    useEffect(() => {
        if (lessons.length > 0 && !selectedLesson) {
            const lastWatched = lessons.find(l => l._id === courseProgress.lastWatchedLesson);
            setSelectedLesson(lastWatched || lessons[0]);
        }
    }, [lessons, selectedLesson, courseProgress]);

    // Fetch quiz for selected lesson
    useEffect(() => {
        if (selectedLesson) dispatch(selectedLesson.quiz ? fetchQuizForLesson(selectedLesson._id) : clearCurrentQuiz());
    }, [selectedLesson, dispatch]);

    // Event Handlers
    const handleProgressToggle = (lessonId) => {
        const isCompleted = courseProgress.completedLessons.includes(lessonId);
        dispatch(updateLessonProgress({ courseId, lessonId, completed: !isCompleted })).unwrap().then(() => dispatch(fetchMyEnrollments()));
    };

    // Lesson Navigation Logic
    const currentLessonIndex = useMemo(() => lessons.findIndex(l => l._id === selectedLesson?._id), [lessons, selectedLesson]);
    const isFirstLesson = currentLessonIndex === 0;
    const isLastLesson = currentLessonIndex === lessons.length - 1;
    const handleNextLesson = () => { if (!isLastLesson) setSelectedLesson(lessons[currentLessonIndex + 1]); };
    const handlePrevLesson = () => { if (!isFirstLesson) setSelectedLesson(lessons[currentLessonIndex - 1]); };

    if (lessonStatus === 'loading' || !currentCourse) {
        return <CourseLessonPageSkeleton />;
    }

    return (
        <div className="flex h-screen bg-background">
            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="w-80 border-r flex-col h-full hidden lg:flex">
                <LessonSidebar lessons={lessons} selectedLesson={selectedLesson} onSelectLesson={setSelectedLesson} courseTitle={currentCourse?.title} courseProgress={courseProgress} />
            </aside>
            
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* --- MOBILE HEADER & SIDEBAR TRIGGER --- */}
                <header className="lg:hidden sticky top-0 z-10 flex items-center justify-between p-2 border-b bg-background/80 backdrop-blur-sm">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon"><Menu className="h-5 w-5" /></Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-80 flex flex-col">
                            <LessonSidebar lessons={lessons} selectedLesson={selectedLesson} onSelectLesson={setSelectedLesson} courseTitle={currentCourse?.title} courseProgress={courseProgress} onLinkClick={() => setIsSheetOpen(false)} />
                        </SheetContent>
                    </Sheet>
                    <Button asChild variant="ghost" size="sm" className="px-3">
                        <Link to="/dashboard/my-courses"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
                    </Button>
                </header>
                
                <div className="p-4 sm:p-6 lg:p-8 flex-grow">
                    <LessonContent 
                        lesson={selectedLesson} courseProgress={courseProgress} onProgressToggle={handleProgressToggle}
                        onOpenQuiz={() => setIsQuizModalOpen(true)} currentQuiz={currentQuiz}
                        quizStatus={quizStatus} progressStatus={progressStatus}
                        onPrev={handlePrevLesson} onNext={handleNextLesson}
                        isFirstLesson={isFirstLesson} isLastLesson={isLastLesson}
                    />
                </div>
            </main>

            <QuizDialog isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} lessonId={selectedLesson?._id} lessonTitle={selectedLesson?.title} />
        </div>
    );
};

export default CourseLessonPage;