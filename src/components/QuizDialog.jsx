// src/components/QuizDialog.jsx

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Quiz from './Quiz'; // Assuming Quiz component is in the same directory

export const QuizDialog = ({ isOpen, onClose, lessonId, lessonTitle }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-3xl  bg-gray-500">
      <DialogHeader>
        <DialogTitle className="text-2xl">Quiz: {lessonTitle}</DialogTitle>
        <DialogDescription>
          Answer the questions below to test your understanding of this lesson.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4  bg-gray-500">
        {/* The onQuizComplete prop in your Quiz component should now call the onClose function */}
        <Quiz lessonId={lessonId} onQuizComplete={onClose} />
      </div>
    </DialogContent>
  </Dialog>
);