import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { updateCourse, fetchMyCourses } from '../../features/courses/courseSlice';
import { getAllCoursesAdmin } from '../../features/admin/adminSlice';
import { 
  BookOpen, 
  Upload, 
  Save, 
  ArrowLeft,
  DollarSign,
  Tag,
  FileText,
  Image,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

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
  }
};

const EditCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const { instructorCourses, status } = useSelector((state) => state.courses);
  const { courses: adminCourses } = useSelector((state) => state.admin);
  const { categories } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    objectives: '',
    prerequisites: '',
    thumbnail: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Find the course to edit - check both instructor and admin courses
  const course = instructorCourses.find(c => c._id === courseId) || 
                 adminCourses.find(c => c._id === courseId);

  // Fetch courses if not already loaded
  useEffect(() => {
    if (user?.role === 'admin' && adminCourses.length === 0) {
      dispatch(getAllCoursesAdmin());
    } else if (user?.role === 'instructor' && instructorCourses.length === 0) {
      dispatch(fetchMyCourses());
    }
  }, [dispatch, user?.role, instructorCourses.length, adminCourses.length]);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        shortDescription: course.shortDescription || '',
        description: course.description || '',
        price: course.price || '',
        discountPrice: course.discountPrice || '',
        category: course.category?._id || '',
        objectives: course.objectives || '',
        prerequisites: course.prerequisites || '',
        thumbnail: course.thumbnail || ''
      });
    }
  }, [course]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Course title is required');
      return;
    }
    
    if (!formData.shortDescription.trim()) {
      toast.error('Short description is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      toast.error('Valid price is required');
      return;
    }
    
    if (formData.discountPrice && formData.discountPrice >= formData.price) {
      toast.error('Discount price must be less than regular price');
      return;
    }

    setIsLoading(true);
    
    try {
      // Filter out empty strings and undefined values
      const filteredFormData = {};
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== '' && value !== null && value !== undefined) {
          filteredFormData[key] = value;
        }
      });

      await dispatch(updateCourse({ 
        courseId, 
        courseData: filteredFormData 
      })).unwrap();
      toast.success('Course updated successfully!');
      navigate('/dashboard/instructor');
    } catch (error) {
      toast.error(error || 'Failed to update course');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' && !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </main>
      </div>
    );
  }

  if (!course && (instructorCourses.length > 0 || adminCourses.length > 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/instructor')}
              className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl h-12 px-6 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
              <p className="text-gray-600 mb-4">
                The course you're trying to edit doesn't exist or you don't have permission to edit it.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600 mb-2"><strong>Debug Info:</strong></p>
                <p className="text-sm text-gray-600">Course ID: {courseId}</p>
                <p className="text-sm text-gray-600">User Role: {user?.role}</p>
                <p className="text-sm text-gray-600">Available Courses: {instructorCourses.length + adminCourses.length}</p>
              </div>
              <Button 
                onClick={() => navigate('/dashboard/instructor')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl h-12 px-8 font-semibold"
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          variants={animationVariants.fadeInUp}
          initial="hidden"
          animate="show"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/instructor')}
            className="border-2 border-cyan-400/20 hover:bg-cyan-400/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Edit Course
            </h1>
            <p className="text-gray-600 text-lg">
              Update your course information
            </p>
          </div>
        </motion.div>

        {/* Edit Course Form */}
        <motion.div 
          variants={animationVariants.fadeInUp}
          initial="hidden"
          animate="show"
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-gray-200/50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Sparkles className="w-5 h-5 text-cyan-600" />
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Course Title *
                    </Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Enter course title..."
                        value={formData.title}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Category *
                    </Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Select value={formData.category} onValueChange={handleSelectChange}>
                        <SelectTrigger className="pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          {categories.map((category) => (
                            <SelectItem 
                              key={category._id} 
                              value={category._id}
                              className="text-gray-900 hover:bg-gray-100"
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <Label htmlFor="shortDescription" className="text-sm font-medium text-gray-700">
                    Short Description *
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Textarea
                      id="shortDescription"
                      name="shortDescription"
                      placeholder="Brief description of your course..."
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 resize-none"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Full Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Full Description *
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Detailed description of your course..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 resize-none"
                      rows={6}
                      required
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                      Price (৳) *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountPrice" className="text-sm font-medium text-gray-700">
                      Discount Price (৳)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="discountPrice"
                        name="discountPrice"
                        type="number"
                        placeholder="0"
                        value={formData.discountPrice}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Objectives */}
                <div className="space-y-2">
                  <Label htmlFor="objectives" className="text-sm font-medium text-gray-700">
                    Course Objectives
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Textarea
                      id="objectives"
                      name="objectives"
                      placeholder="What will students learn from this course?"
                      value={formData.objectives}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 resize-none"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="space-y-2">
                  <Label htmlFor="prerequisites" className="text-sm font-medium text-gray-700">
                    Prerequisites
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Textarea
                      id="prerequisites"
                      name="prerequisites"
                      placeholder="What should students know before taking this course?"
                      value={formData.prerequisites}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 resize-none"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Thumbnail URL */}
                <div className="space-y-2">
                  <Label htmlFor="thumbnail" className="text-sm font-medium text-gray-700">
                    Thumbnail URL
                  </Label>
                  <div className="relative">
                    <Image className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="thumbnail"
                      name="thumbnail"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.thumbnail}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Course
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default EditCourse;
