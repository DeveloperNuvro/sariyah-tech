// src/pages/instructor/CreateCoursePage.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createCourse } from '../../features/courses/courseSlice';
import toast from 'react-hot-toast';

// Shadcn/UI Components & Icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, UploadCloud, X } from "lucide-react";
import { fetchAllCategories } from '@/features/categories/categorySlice';

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
        <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
                <Button asChild variant="outline" size="icon">
                    <Link to="/dashboard/instructor">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Dashboard</span>
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create a New Course</h1>
                    <p className="text-muted-foreground">Fill in the details to launch your next course.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Main Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Course Title</Label>
                                    <Input id="title" name="title" placeholder="e.g., The Ultimate Guide to React" value={formData.title} onChange={handleInputChange} required disabled={isLoading} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Course Description</Label>
                                    <Textarea id="description" name="description" placeholder="Describe what students will learn in your course." value={formData.description} onChange={handleInputChange} required rows={5} disabled={isLoading} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price ($)</Label>
                                        <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="e.g., 29.99" value={formData.price} onChange={handleInputChange} required disabled={isLoading} />
                                    </div>
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            // Disable the dropdown if there are no categories or if they are loading
                                            disabled={categoryStatus === 'loading' || categories.length === 0}
                                        >
                                            <option value="" disabled>
                                                {/* --- DYNAMIC OPTION TEXT --- */}
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

                                        {/* --- HELPER TEXT FOR ADMINS --- */}
                                        {categories.length === 0 && categoryStatus === 'succeeded' && (
                                            <p className="mt-2 text-sm text-gray-500">
                                                An Admin must create a category first. Go to the
                                                <Link to="/admin/categories" className="text-blue-600 hover:underline"> Category Management</Link> page.
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="level">Difficulty Level</Label>
                                        <Select name="level" value={formData.level} onValueChange={(value) => handleSelectChange('level', value)} required disabled={isLoading}>
                                            <SelectTrigger id="level"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="beginner">Beginner</SelectItem>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Thumbnail Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="thumbnail-upload">Course Thumbnail</Label>
                                {thumbnailPreview ? (
                                    <div className="relative group">
                                        <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-auto aspect-video rounded-md object-cover" />
                                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleRemoveThumbnail}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Label htmlFor="thumbnail-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                                        </div>
                                        <Input id="thumbnail-upload" name="thumbnail" type="file" accept="image/*" onChange={handleFileChange} required className="sr-only" />
                                    </Label>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button type="submit" size="lg" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Course...
                                </>
                            ) : (
                                'Create Course'
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </main>
    );
};

export default CreateCoursePage;