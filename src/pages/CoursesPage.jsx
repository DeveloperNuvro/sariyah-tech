import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchAllCourses } from '@/features/courses/courseSlice';
import { fetchAllCategories } from '@/features/categories/categorySlice';
import { CourseCard } from '@/components/CourseCard';
import { CourseCardSkeleton } from '@/components/CourseCardSkeleton';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ListFilter, Search, BookOpen, Sparkles, Filter, X } from 'lucide-react';

// Animation variants
const animationVariants = {
    container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } },
    fadeInUp: { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } },
    scaleIn: { hidden: { scale: 0.95, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } },
};

const CoursesPage = () => {
    const dispatch = useDispatch();
    const { courses, status: courseStatus } = useSelector((state) => state.courses);
    const { categories } = useSelector((state) => state.categories);

    // State for filtering and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        dispatch(fetchAllCourses());
        dispatch(fetchAllCategories());
    }, [dispatch]);

    const filteredAndSortedCourses = React.useMemo(() => {
        // Create a copy of the courses array to avoid mutating the original
        let filtered = [...(courses || [])];
        
        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(course => 
                course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(course =>
                course.category?._id === selectedCategory
            );
        }

        // Apply sorting (now safe since we have a copy)
        if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'price-asc') {
            filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === 'price-desc') {
            filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        }

        return filtered;
    }, [courses, searchTerm, selectedCategory, sortBy]);

    const isLoading = courseStatus === 'loading';
    const hasActiveFilters = searchTerm || selectedCategory !== 'all' || sortBy !== 'newest';

    // Debug logging
    console.log('Courses data:', courses);
    console.log('Filtered courses:', filteredAndSortedCourses);
    console.log('Loading state:', isLoading);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSortBy('newest');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 max-w-7xl relative z-10">
                    <motion.div 
                        className="text-center mb-16"
                        initial="hidden"
                        animate="show"
                        variants={animationVariants.container}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400/10 to-pink-400/10 border border-cyan-400/20 text-cyan-600 text-sm font-medium mb-6"
                            variants={animationVariants.fadeInUp}
                        >
                            <Sparkles className="w-4 h-4" />
                            Complete Course Catalog
                        </motion.div>
                        
                        <motion.h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900"
                            variants={animationVariants.fadeInUp}
                        >
                            Explore Our{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500">
                                Course Library
                            </span>
                        </motion.h1>
                        
                        <motion.p 
                            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                            variants={animationVariants.fadeInUp}
                        >
                            Discover hundreds of courses designed by industry experts. From beginner to advanced, 
                            find the perfect learning path to advance your career.
                        </motion.p>
                    </motion.div>

                    {/* Enhanced Search and Filters */}
                    <motion.div 
                        className="max-w-4xl mx-auto"
                        initial="hidden"
                        animate="show"
                        variants={animationVariants.fadeInUp}
                    >
                        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
                            <CardContent className="p-6">
                                {/* Main Search Bar */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                                    <Input
                                        placeholder="Search courses, categories, or skills..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-12 pr-4 py-4 text-lg border-2 border-cyan-400/20 focus:border-pink-400/40 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Filter Toggle Button */}
                                <div className="flex items-center justify-between mb-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 border-cyan-400/20 hover:bg-cyan-400/10"
                                    >
                                        <Filter className="w-4 h-4" />
                                        Filters
                                        {hasActiveFilters && (
                                            <Badge variant="secondary" className="ml-2 bg-cyan-100 text-cyan-700">
                                                Active
                                            </Badge>
                                        )}
                                    </Button>
                                    
                                    {hasActiveFilters && (
                                        <Button
                                            variant="ghost"
                                            onClick={clearFilters}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </div>

                                {/* Advanced Filters */}
                                {showFilters && (
                                    <motion.div 
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Category Filter */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Category</label>
                                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                                <SelectTrigger className="border-cyan-400/20 focus:border-pink-400/40 bg-white text-gray-900">
                                                    <SelectValue placeholder="All Categories" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                                    <SelectItem value="all" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">All Categories</SelectItem>
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat._id} value={cat._id} className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Sort Filter */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Sort By</label>
                                            <Select value={sortBy} onValueChange={setSortBy}>
                                                <SelectTrigger className="border-cyan-400/20 focus:border-pink-400/40 bg-white text-gray-900">
                                                    <SelectValue placeholder="Sort by" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                                    <SelectItem value="newest" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Newest First</SelectItem>
                                                    <SelectItem value="price-asc" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Price: Low to High</SelectItem>
                                                    <SelectItem value="price-desc" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Price: High to Low</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Results Info */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <BookOpen className="w-4 h-4" />
                                        <span>
                                            Found <span className="font-semibold text-cyan-600">{filteredAndSortedCourses.length}</span> courses
                                        </span>
                                    </div>
                                    
                                    {hasActiveFilters && (
                                        <div className="flex items-center gap-2 text-xs">
                                            {searchTerm && (
                                                <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                                                    Search: "{searchTerm}"
                                                </Badge>
                                            )}
                                            {selectedCategory !== 'all' && (
                                                <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                                                    {categories.find(c => c._id === selectedCategory)?.name}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Course Grid Section */}
            <section className="container mx-auto px-4 pb-20 max-w-7xl">
                {/* Course Count and View Options */}
                <motion.div 
                    className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {hasActiveFilters ? 'Filtered Results' : 'All Courses'}
                        </h2>
                        <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
                            {filteredAndSortedCourses.length} courses
                        </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Showing all available courses</span>
                    </div>
                </motion.div>

                {isLoading ? (
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        initial="hidden"
                        animate="show"
                        variants={animationVariants.container}
                    >
                        {Array.from({ length: 12 }).map((_, index) => (
                            <motion.div key={index} variants={animationVariants.fadeInUp}>
                                <CourseCardSkeleton />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : courses && courses.length > 0 && filteredAndSortedCourses.length > 0 ? (
                    <>
                        {/* Course Grid */}
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            initial="hidden"
                            animate="show"
                            variants={animationVariants.container}
                        >
                            {filteredAndSortedCourses.map((course, index) => (
                                <motion.div 
                                    key={course._id} 
                                    variants={animationVariants.fadeInUp}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <CourseCard course={course} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Load More Section (if needed) */}
                        {filteredAndSortedCourses.length >= 12 && (
                            <motion.div 
                                className="text-center mt-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg p-8">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <BookOpen className="w-8 h-8 text-cyan-500" />
                                        <h3 className="text-xl font-semibold text-gray-900">Explore More Learning</h3>
                                    </div>
                                    <p className="text-gray-600 mb-6">
                                        You've seen {filteredAndSortedCourses.length} courses. Keep exploring to find your perfect learning path!
                                    </p>
                                    <Button 
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        variant="outline"
                                        className="border-cyan-400/20 hover:bg-cyan-400/10"
                                    >
                                        Back to Top
                                    </Button>
                                </Card>
                            </motion.div>
                        )}
                    </>
                ) : courses && courses.length === 0 ? (
                    <motion.div 
                        className="text-center py-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-600 mb-2">No courses available</h3>
                        <p className="text-gray-500 mb-6">There are currently no courses in our catalog. Check back soon!</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        className="text-center py-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-600 mb-2">No courses found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search terms or filters</p>
                        <Button 
                            onClick={clearFilters}
                            variant="outline"
                            className="border-cyan-400/20 hover:bg-cyan-400/10"
                        >
                            Clear All Filters
                        </Button>
                    </motion.div>
                )}
            </section>
        </div>
    );
};

export default CoursesPage;