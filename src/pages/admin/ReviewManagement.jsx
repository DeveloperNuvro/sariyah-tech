import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  getAllReviewsAdmin, 
  deleteReviewAdmin 
} from '../../features/admin/adminSlice';
import { 
  Star, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Eye, 
  User,
  BookOpen,
  Calendar,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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

const ReviewManagement = () => {
  const dispatch = useDispatch();
  const { reviews, reviewsTotal, reviewsPage, reviewsPages, status } = useSelector((state) => state.admin);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      ...(searchTerm && { search: searchTerm }),
      ...(ratingFilter && { rating: ratingFilter })
    };
    dispatch(getAllReviewsAdmin(params));
  }, [dispatch, currentPage, searchTerm, ratingFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRatingFilter = (value) => {
    setRatingFilter(value === 'all' ? '' : value);
    setCurrentPage(1);
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    
    try {
      await dispatch(deleteReviewAdmin(selectedReview._id)).unwrap();
      toast.success('Review deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedReview(null);
    } catch (error) {
      toast.error(error || 'Failed to delete review');
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingBadgeColor = (rating) => {
    if (rating >= 4) return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    if (rating >= 3) return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
    return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
  };

  if (status === 'loading' && reviews.length === 0) {
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
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Review Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage all course reviews and ratings
            </p>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          className="mb-8"
          variants={animationVariants.fadeInUp}
          initial="hidden"
          animate="show"
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{reviewsTotal}</p>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="mb-8"
          variants={animationVariants.fadeInUp}
          initial="hidden"
          animate="show"
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search reviews by content..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <Select value={ratingFilter || 'all'} onValueChange={handleRatingFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Ratings</SelectItem>
                    <SelectItem value="5" className="text-gray-900 hover:bg-gray-100">5 Stars</SelectItem>
                    <SelectItem value="4" className="text-gray-900 hover:bg-gray-100">4 Stars</SelectItem>
                    <SelectItem value="3" className="text-gray-900 hover:bg-gray-100">3 Stars</SelectItem>
                    <SelectItem value="2" className="text-gray-900 hover:bg-gray-100">2 Stars</SelectItem>
                    <SelectItem value="1" className="text-gray-900 hover:bg-gray-100">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews Table */}
        <motion.div variants={animationVariants.fadeInUp}>
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
            <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-gray-200/50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                Reviews ({reviewsTotal})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Review
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                      {reviews.map((review, index) => (
                        <motion.tr
                          key={review._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {review.student?.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{review.student?.name}</p>
                                <p className="text-sm text-gray-600">{review.student?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-purple-500" />
                              <span className="text-gray-900">{review.course?.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {getRatingStars(review.rating)}
                              </div>
                              <Badge className={`${getRatingBadgeColor(review.rating)} ml-2`}>
                                {review.rating}/5
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <p className="text-sm text-gray-900 line-clamp-2">
                                {review.comment || 'No comment provided'}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl p-2 min-w-[200px]">
                                <DropdownMenuItem 
                                  onClick={() => setSelectedReview(review)}
                                  className="hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 hover:text-red-700 rounded-lg transition-all duration-300 cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        {reviewsPages > 1 && (
          <motion.div 
            className="flex justify-center mt-8"
            variants={animationVariants.fadeInUp}
            initial="hidden"
            animate="show"
          >
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-2 border-yellow-400/20 hover:bg-yellow-400/10"
              >
                Previous
              </Button>
              <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                Page {currentPage} of {reviewsPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, reviewsPages))}
                disabled={currentPage === reviewsPages}
                className="border-2 border-yellow-400/20 hover:bg-yellow-400/10"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl rounded-2xl">
          <AlertDialogHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-white" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">
              Delete Review?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 leading-relaxed">
              This action cannot be undone. This will permanently delete the review by
              <span className="font-semibold text-gray-900"> "{selectedReview?.student?.name}"</span>
              for the course
              <span className="font-semibold text-gray-900"> "{selectedReview?.course?.title}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 pt-4">
            <AlertDialogCancel className="border-gray-300 hover:bg-gray-50 transition-colors duration-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteReview}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold transition-all duration-300"
            >
              Delete Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReviewManagement;
