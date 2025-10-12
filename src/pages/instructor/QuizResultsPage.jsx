import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchScoresForCourse, fetchScoresForLesson, clearScores } from '../../features/quizScores/quizScoreSlice';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Trophy, 
  Users, 
  TrendingUp, 
  Award, 
  Sparkles,
  BarChart3,
  Calendar,
  Mail,
  BookOpen,
  Target
} from "lucide-react";

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

// Enhanced stat cards with gradients and animations
const StatCard = ({ title, value, icon, gradient, delay = 0 }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
  >
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-hidden relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  </motion.div>
);

const QuizResultsPage = () => {
    const dispatch = useDispatch();
    const { scores, status } = useSelector((state) => state.quizScores);
    const { id } = useParams(); // This will be either courseId or lessonId
    const location = useLocation();

    // Determine if we're fetching by course or by lesson from the URL path
    const isByCourse = location.pathname.includes('/course/');

    useEffect(() => {
        if (isByCourse) {
            dispatch(fetchScoresForCourse(id));
        } else {
            dispatch(fetchScoresForLesson(id));
        }
        // Cleanup on unmount
        return () => dispatch(clearScores());
    }, [id, isByCourse, dispatch]);

    // Computed values for stats
    const totalSubmissions = scores.length;
    const averageScore = scores.length > 0 ? (scores.reduce((sum, score) => sum + score.score, 0) / scores.length).toFixed(1) : 0;
    const passingScore = scores.filter(score => score.score >= 70).length;
    const failingScore = scores.filter(score => score.score < 70).length;
    
    if (status === 'loading') {
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
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
                    <Button asChild variant="outline" size="icon" className="border-2 border-cyan-400/20 hover:bg-cyan-400/10">
                        <Link to="/dashboard/instructor">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back to Dashboard</span>
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Quiz Results
                            </h1>
                        </div>
                        <p className="text-gray-600">
                            {isByCourse ? 'Course' : 'Lesson'} performance analytics and student scores
                        </p>
                    </div>
                </motion.div>

                {scores.length === 0 ? (
                    <motion.div 
                        className="text-center py-16"
                        variants={animationVariants.fadeInUp}
                        initial="hidden"
                        animate="show"
                    >
                        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 max-w-md mx-auto">
                            <CardContent className="p-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Trophy className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quiz Submissions Yet</h3>
                                <p className="text-gray-600">
                                    No students have taken the quiz for this {isByCourse ? 'course' : 'lesson'} yet.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={animationVariants.container}
                        initial="hidden"
                        animate="show"
                    >
                        {/* Stats Section */}
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                            variants={animationVariants.container}
                        >
                            <StatCard
                                title="Total Submissions"
                                value={totalSubmissions}
                                icon={<Users className="w-5 h-5" />}
                                gradient="from-cyan-500 to-blue-500"
                                delay={0.1}
                            />
                            <StatCard
                                title="Average Score"
                                value={`${averageScore}%`}
                                icon={<TrendingUp className="w-5 h-5" />}
                                gradient="from-green-500 to-emerald-500"
                                delay={0.2}
                            />
                            <StatCard
                                title="Passing Students"
                                value={passingScore}
                                icon={<Award className="w-5 h-5" />}
                                gradient="from-purple-500 to-pink-500"
                                delay={0.3}
                            />
                            <StatCard
                                title="Need Improvement"
                                value={failingScore}
                                icon={<Target className="w-5 h-5" />}
                                gradient="from-orange-500 to-red-500"
                                delay={0.4}
                            />
                        </motion.div>

                        {/* Results Table */}
                        <motion.div variants={animationVariants.fadeInUp}>
                            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-200/50">
                                    <CardTitle className="flex items-center gap-2 text-gray-900">
                                        <Sparkles className="w-5 h-5 text-purple-600" />
                                        Student Performance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4" />
                                                            Student
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4" />
                                                            Email
                                                        </div>
                                                    </th>
                                                    {isByCourse && (
                                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            <div className="flex items-center gap-2">
                                                                <BookOpen className="w-4 h-4" />
                                                                Lesson
                                                            </div>
                                                        </th>
                                                    )}
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center gap-2">
                                                            <Trophy className="w-4 h-4" />
                                                            Score
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            Date
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                <AnimatePresence>
                                                    {scores.map((score, index) => (
                                                        <motion.tr
                                                            key={score._id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="hover:bg-gray-50/50 transition-colors"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                                        {score.student.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <span className="font-medium text-gray-900">{score.student.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                                {score.student.email}
                                                            </td>
                                                            {isByCourse && (
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <Badge variant="outline" className="border-cyan-200 text-cyan-700">
                                                                        {score.lesson.title}
                                                                    </Badge>
                                                                </td>
                                                            )}
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <Badge className={`${
                                                                    score.score >= 70 
                                                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                                                                        : score.score >= 50
                                                                        ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'
                                                                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                                                                }`}>
                                                                    {score.score.toFixed(0)}%
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                                {new Date(score.createdAt).toLocaleDateString()}
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
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default QuizResultsPage;