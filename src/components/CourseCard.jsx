// src/components/CourseCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from './ui/badge';
import { BookOpen, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export const CourseCard = ({ course }) => {
    const instructorInitials = course.instructor?.name.split(' ').map(n => n[0]).join('') || 'U';

    return (
        <Link to={`/course/${course.slug}`} className="group cursor-pointer">
            <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border bg-card">
                <CardHeader className="p-0">
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                    />
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col">
                    <Badge variant="secondary" className="mb-2 w-fit">{course.category?.name || 'General'}</Badge>
                    <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors flex-grow">
                        {course.title}
                    </h3>
                    
                    {/* --- THIS IS THE NEW ADDITION --- */}
                    <div className="flex items-center text-sm text-muted-foreground mt-4 space-x-4">
                        <div className="flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.lessons?.length || 0} Lessons</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            {/* Use the enrollmentCount property from the backend */}
                            <span>{course.enrollmentCount || 0} Students</span>
                        </div>
                    </div>
                    {/* --- END OF ADDITION --- */}

                </CardContent>
                <CardFooter className="p-4 pt-2 border-t mt-auto">
                    <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={course.instructor?.avatarUrl} />
                                <AvatarFallback>{instructorInitials}</AvatarFallback>
                            </Avatar>
                            <span className="truncate">{course.instructor?.name}</span>
                        </div>
                        <span className="font-bold text-lg text-foreground">${course.price}</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
};