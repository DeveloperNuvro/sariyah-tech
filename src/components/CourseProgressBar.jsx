// src/components/CourseProgressBar.jsx

import React from 'react';
import { Progress } from "@/components/ui/progress";

/**
 * A reusable progress bar with a percentage label.
 * Uses Shadcn's Progress component for theme consistency.
 * @param {object} props - Component props.
 * @param {number} props.value - The progress value (0-100).
 */
export const CourseProgressBar = ({ value }) => {
  const progressValue = value || 0;

  return (
    <div className="w-full">
      <Progress value={progressValue} className="h-2" />
      <p className="text-right text-xs text-muted-foreground mt-1.5">
        {Math.round(progressValue)}% Complete
      </p>
    </div>
  );
};