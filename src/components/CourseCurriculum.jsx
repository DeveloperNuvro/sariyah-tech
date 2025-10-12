// src/components/CourseCurriculum.jsx

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle } from "lucide-react";

export const CourseCurriculum = ({ lessons }) => (
  <div className="mt-12">
    <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
    <Accordion type="single" collapsible className="w-full">
      {lessons.map((lesson, index) => (
        <AccordionItem value={`item-${index}`} key={lesson._id}>
          <AccordionTrigger>
            <div className="flex items-center gap-3">
              <PlayCircle className="h-5 w-5 text-primary" />
              <span className="text-left">{lesson.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {/* You can add lesson descriptions or durations here later */}
            Preview for this lesson is not yet available.
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);