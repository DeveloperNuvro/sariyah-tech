// src/pages/instructor/CreateCoursePage.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createCourse } from '../../features/courses/courseSlice';
import toast from 'react-hot-toast';

// Shadcn/UI Components & Icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Loader2, 
  UploadCloud, 
  X, 
  BookOpen, 
  Sparkles,
  DollarSign,
  Tag,
  BarChart3,
  Globe,
  Image as ImageIcon
} from "lucide-react";
import { fetchAllCategories } from '@/features/categories/categorySlice';

// Animation variants
const animationVariants = {
  container: { 
    hidden: { opacity: 0 }, 
    show: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.2 
      } 
    } 
  },
  fadeInUp: { 
    hidden: { y: 30, opacity: 0 }, 
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    } 
  },
  scaleIn: { 
    hidden: { scale: 0.95, opacity: 0 }, 
    show: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    } 
  }
};

const CreateCoursePage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        level: 'beginner',
        language: 'English',
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status } = useSelector((state) => state.courses);
    const { categories, status: categoryStatus } = useSelector((state) => state.categories); // <-- Get categories from state

    // Fetch categories when the component loads
    useEffect(() => {
        dispatch(fetchAllCategories());
    }, [dispatch]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        } else {
            toast.error("Please select a valid image file.");
        }
    };

    const handleRemoveThumbnail = () => {
        setThumbnail(null);
        setThumbnailPreview('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.category) {
            toast.error('Please select a course category.');
            return;
        }
        if (!thumbnail) {
            toast.error('Course thumbnail is required.');
            return;
        }

        const courseData = new FormData();
        Object.keys(formData).forEach(key => courseData.append(key, formData[key]));
        courseData.append('thumbnail', thumbnail);

        dispatch(createCourse(courseData))
            .unwrap()
            .then(() => {
                toast.success('Course created successfully!');
                navigate('/dashboard/instructor');
            })
            .catch((err) => {
                toast.error(`Failed to create course: ${err.message || 'Server error'}`);
            });
    };

    const isLoading = status === 'loading';

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/5 to-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <motion.div 
                    className="flex items-center gap-4 mb-8"
                    variants={animationVariants.fadeInUp}
                    initial="hidden"
                    animate="show"
                >
                    <Button asChild variant="outline" size="icon" className="border-2 border-cyan-400/20 hover:bg-cyan-400/10">
                        <Link to="/dashboard/instructor">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back to Dashboard</span>
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
                                Create New Course
                            </h1>
                        </div>
                        <p className="text-gray-600">Fill in the details to launch your next amazing course</p>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <motion.div
                        variants={animationVariants.container}
                        initial="hidden"
                        animate="show"
                    >
                        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column: Main Details */}
                                    <motion.div 
                                        className="lg:col-span-2 space-y-6"
                                        variants={animationVariants.fadeInUp}
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="flex items-center gap-2 text-gray-700 font-semibold">
                                                <BookOpen className="w-4 h-4 text-cyan-600" />
                                                Course Title
                                            </Label>
                                            <Input 
                                                id="title" 
                                                name="title" 
                                                placeholder="e.g., The Ultimate Guide to React Development" 
                                                value={formData.title} 
                                                onChange={handleInputChange} 
                                                required 
                                                disabled={isLoading}
                                                className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 text-lg py-3"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="description" className="flex items-center gap-2 text-gray-700 font-semibold">
                                                <Sparkles className="w-4 h-4 text-cyan-600" />
                                                Course Description
                                            </Label>
                                            <Textarea 
                                                id="description" 
                                                name="description" 
                                                placeholder="Describe what students will learn in your course. Be detailed and engaging!" 
                                                value={formData.description} 
                                                onChange={handleInputChange} 
                                                required 
                                                rows={6} 
                                                disabled={isLoading}
                                                className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="price" className="flex items-center gap-2 text-gray-700 font-semibold">
                                                    <DollarSign className="w-4 h-4 text-cyan-600" />
                                                    Price (৳)
                                                </Label>
                                                <Input 
                                                    id="price" 
                                                    name="price" 
                                                    type="number" 
                                                    min="0" 
                                                    step="0.01" 
                                                    placeholder="e.g., 2999" 
                                                    value={formData.price} 
                                                    onChange={handleInputChange} 
                                                    required 
                                                    disabled={isLoading}
                                                    className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="category" className="flex items-center gap-2 text-gray-700 font-semibold">
                                                    <Tag className="w-4 h-4 text-cyan-600" />
                                                    Category
                                                </Label>
                                                <select
                                                    id="category"
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                                                    disabled={categoryStatus === 'loading' || categories.length === 0}
                                                >
                                                    <option value="" disabled>
                                                        {categoryStatus === 'loading'
                                                            ? 'Loading categories...'
                                                            : categories.length === 0
                                                                ? 'No categories available'
                                                                : '-- Select a Category --'
                                                        }
                                                    </option>
                                                    {categories.map(cat => (
                                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                {categories.length === 0 && categoryStatus === 'succeeded' && (
                                                    <p className="text-sm text-gray-500">
                                                        An Admin must create a category first. Go to the
                                                        <Link to="/admin/categories" className="text-cyan-600 hover:underline ml-1"> Category Management</Link> page.
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="level" className="flex items-center gap-2 text-gray-700 font-semibold">
                                                    <BarChart3 className="w-4 h-4 text-cyan-600" />
                                                    Difficulty Level
                                                </Label>
                                                <Select name="level" value={formData.level} onValueChange={(value) => handleSelectChange('level', value)} required disabled={isLoading}>
                                                    <SelectTrigger id="level" className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                                        <SelectItem value="beginner" className="text-gray-900 hover:bg-gray-100">Beginner</SelectItem>
                                                        <SelectItem value="intermediate" className="text-gray-900 hover:bg-gray-100">Intermediate</SelectItem>
                                                        <SelectItem value="advanced" className="text-gray-900 hover:bg-gray-100">Advanced</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="language" className="flex items-center gap-2 text-gray-700 font-semibold">
                                                    <Globe className="w-4 h-4 text-cyan-600" />
                                                    Language
                                                </Label>
                                                <Select name="language" value={formData.language} onValueChange={(value) => handleSelectChange('language', value)} required disabled={isLoading}>
                                                    <SelectTrigger id="language" className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                                        <SelectItem value="English" className="text-gray-900 hover:bg-gray-100">English</SelectItem>
                                                        <SelectItem value="Bengali" className="text-gray-900 hover:bg-gray-100">Bengali</SelectItem>
                                                        <SelectItem value="Hindi" className="text-gray-900 hover:bg-gray-100">Hindi</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Right Column: Thumbnail Upload */}
                                    <motion.div 
                                        className="space-y-4"
                                        variants={animationVariants.scaleIn}
                                    >
                                        <Label htmlFor="thumbnail-upload" className="flex items-center gap-2 text-gray-700 font-semibold">
                                            <ImageIcon className="w-4 h-4 text-cyan-600" />
                                            Course Thumbnail
                                        </Label>
                                        {thumbnailPreview ? (
                                            <div className="relative group">
                                                <img 
                                                    src={thumbnailPreview} 
                                                    alt="Thumbnail Preview" 
                                                    className="w-full h-auto aspect-video rounded-xl object-cover border-2 border-gray-200" 
                                                />
                                                <Button 
                                                    type="button" 
                                                    variant="destructive" 
                                                    size="icon" 
                                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600" 
                                                    onClick={handleRemoveThumbnail}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Label 
                                                htmlFor="thumbnail-upload" 
                                                className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-cyan-50 hover:to-pink-50 hover:border-cyan-400 transition-all duration-300 group"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                                        <UploadCloud className="w-8 h-8 text-white" />
                                                    </div>
                                                    <p className="mb-2 text-sm text-gray-600 font-semibold">
                                                        <span className="text-cyan-600">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">PNG, JPG, or WEBP (Max 5MB)</p>
                                                </div>
                                                <Input 
                                                    id="thumbnail-upload" 
                                                    name="thumbnail" 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={handleFileChange} 
                                                    required 
                                                    className="sr-only" 
                                                />
                                            </Label>
                                        )}
                                    </motion.div>
                                </div>
                            </CardContent>
                            
                            <CardFooter className="flex justify-end p-8 pt-0">
                                <Button 
                                    type="submit" 
                                    size="lg" 
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-semibold px-8 py-3 transition-all duration-300"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Creating Course...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            Create Course
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </form>
            </main>
        </div>
    );
};

export default CreateCoursePage;