import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '@/features/courses/courseSlice';
import { fetchAllCategories } from '@/features/categories/categorySlice';
import { CourseCard } from '@/components/CourseCard';
import { CourseCardSkeleton } from '@/components/CourseCardSkeleton';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ListFilter, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const CoursesPage = () => {
    const dispatch = useDispatch();
    const { courses, status: courseStatus } = useSelector((state) => state.courses);
    const { categories } = useSelector((state) => state.categories);

    // State for filtering and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        dispatch(fetchAllCourses());
        dispatch(fetchAllCategories());
    }, [dispatch]);

    const filteredAndSortedCourses = React.useMemo(() => {
        let filtered = courses
            .filter(course => 
                course.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(course =>
                selectedCategory === 'all' ? true : course.category?._id === selectedCategory
            );

        if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        }

        return filtered;
    }, [courses, searchTerm, selectedCategory, sortBy]);

    const isLoading = courseStatus === 'loading';

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Our Full Course Catalog</h1>
                <p className="mt-4 text-lg text-muted-foreground">Find the perfect course to kickstart your learning journey.</p>
            </header>

            {/* Filter and Sort Controls */}
<Card className="mb-8 p-4 bg-muted border sticky top-[65px] z-40">
                    <CardContent className="p-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search for a course..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {/* Category Filter */}
                            <div className="flex items-center gap-2">
                                <ListFilter className="h-5 w-5 text-muted-foreground" />
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger><SelectValue placeholder="Filter by category" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(cat => (
                                            <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Sort By */}
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             {/* Results Count */}
                            <div className="text-right text-sm text-muted-foreground hidden lg:block">
                                Found {filteredAndSortedCourses.length} {filteredAndSortedCourses.length === 1 ? 'course' : 'courses'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, index) => <CourseCardSkeleton key={index} />)
                ) : filteredAndSortedCourses.length > 0 ? (
                    filteredAndSortedCourses.map((course) => (
                        <CourseCard key={course._id} course={course} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-muted-foreground">No courses match your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default CoursesPage;