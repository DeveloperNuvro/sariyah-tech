// src/components/LessonSidebar.jsx

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

export const LessonSidebar = ({ lessons, selectedLesson, onSelectLesson, courseTitle, courseProgress }) => {
  const completedLessonsSet = new Set(courseProgress?.completedLessons || []);

  return (
    <aside className="w-full lg:w-80 border-r flex-col h-full hidden lg:flex">
      <div className="p-4"><h2 className="text-lg font-semibold truncate">{courseTitle}</h2><p className="text-sm text-muted-foreground">{lessons.length} lessons</p></div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-2">
          {lessons.map((lesson) => {
            const isCompleted = completedLessonsSet.has(lesson._id);
            return (
              <Button key={lesson._id} onClick={() => onSelectLesson(lesson)} variant="ghost" className={cn("w-full justify-start h-auto p-3 text-left", selectedLesson?._id === lesson._id && "bg-accent")}>
                {isCompleted ? <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0 text-green-500" /> : <Circle className="h-5 w-5 mr-3 flex-shrink-0 text-muted-foreground" />}
                <span className={cn(isCompleted && "text-muted-foreground")}>{lesson.title}</span>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
};