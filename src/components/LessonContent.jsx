// src/components/LessonContent.jsx

import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Check, HelpCircle } from "lucide-react";
import { YouTubeEmbed } from './YouTubeEmbed'; // <-- 1. IMPORT THE NEW COMPONENT
import { Skeleton } from './ui/skeleton';

export const LessonContent = ({ lesson, courseProgress, onProgressToggle, onOpenQuiz, currentQuiz, quizStatus, progressStatus }) => {
  if (!lesson) return <div className="flex items-center justify-center h-full"><p>Select a lesson to begin.</p></div>;

  const isCompleted = courseProgress?.completedLessons.includes(lesson._id);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2 sm:mb-0">{lesson.title}</h1>
        <Button onClick={() => onProgressToggle(lesson._id)} disabled={progressStatus === 'loading'} variant={isCompleted ? 'secondary' : 'default'} size="sm">
          {progressStatus === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isCompleted ? <Check className="mr-2 h-4 w-4" /> : null}
          {isCompleted ? 'Completed' : 'Mark as Complete'}
        </Button>
      </div>
      
      {/* --- 2. REPLACE THE VIDEO TAG WITH THE YOUTUBEEMBED COMPONENT --- */}
      {lesson.videoUrl && (
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-slate-900 mb-6 shadow-lg">
          <YouTubeEmbed url={lesson.videoUrl} />
        </div>
      )}
      
      <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />

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
    </div>
  );
};