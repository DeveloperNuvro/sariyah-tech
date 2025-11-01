// src/components/QuizDialog.jsx

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Quiz from './Quiz'; // Assuming Quiz component is in the same directory

export const QuizDialog = ({ isOpen, onClose, lessonId, lessonTitle }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-3xl max-h-[90vh] bg-gray-500 flex flex-col">
      <DialogHeader className="flex-shrink-0">
        <DialogTitle className="text-2xl">Quiz: {lessonTitle}</DialogTitle>
        <DialogDescription>
          Answer the questions below to test your understanding of this lesson.
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="flex-1 pr-4">
        <div className="py-4 bg-gray-500">
          {/* The onQuizComplete prop in your Quiz component should now call the onClose function */}
          <Quiz lessonId={lessonId} onQuizComplete={onClose} />
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
);