import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { submitQuizAnswers, fetchQuizResult } from '@/features/quiz/quizSlice';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles,
  Loader2,
  ArrowRight
} from "lucide-react";

const Quiz = ({ lessonId, onQuizComplete }) => {
    const dispatch = useDispatch();
    const { currentQuiz, currentQuizResult, status } = useSelector((state) => state.quizzes);
    
    // State to hold the student's selected answers: { questionId: answer }
    const [selectedAnswers, setSelectedAnswers] = useState({});

    // Check for existing quiz result when component loads
    useEffect(() => {
        if (lessonId) {
            dispatch(fetchQuizResult(lessonId));
        }
    }, [lessonId, dispatch]);

    const handleAnswerChange = (questionId, answer) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = () => {
        const answersPayload = Object.entries(selectedAnswers).map(([questionId, answer]) => ({
            questionId,
            answer,
        }));
        
        if (answersPayload.length !== currentQuiz.questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        dispatch(submitQuizAnswers({ lessonId, answers: answersPayload }));
    };

    // Show loading state while checking for existing results
    if (status === 'loading' && !currentQuizResult) {
        return (
            <motion.div 
                className="flex items-center justify-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Quiz</h3>
                        <p className="text-gray-600">Checking for existing results...</p>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    // --- RENDER QUIZ RESULTS ---
    if (currentQuizResult) {
        const percentage = currentQuizResult.percentage.toFixed(0);
        const isPassing = percentage >= 70;
        
        return (
            <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Results Header */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                                isPassing 
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                                    : 'bg-gradient-to-br from-orange-500 to-red-500'
                            }`}>
                                {isPassing ? (
                                    <Trophy className="w-10 h-10 text-white" />
                                ) : (
                                    <Award className="w-10 h-10 text-white" />
                                )}
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Quiz Complete!
                        </CardTitle>
                        <div className="mt-4">
                            <Badge className={`text-lg px-4 py-2 ${
                                isPassing 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                            }`}>
                                {percentage}% - {isPassing ? 'Excellent!' : 'Keep Learning!'}
                            </Badge>
                        </div>
                        <p className="text-gray-600 mt-2">
                            You scored {currentQuizResult.score} out of {currentQuizResult.totalQuestions} questions
                        </p>
                        <div className="mt-4">
                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                                Quiz Completed
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Submitted on {new Date(currentQuizResult.submittedAt).toLocaleDateString()}
                        </p>
                    </CardHeader>
                </Card>

                {/* Question Results */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        Question Review
                    </h3>
                    {currentQuizResult.results.map((result, index) => (
                        <motion.div
                            key={result.questionId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`border-2 ${
                                result.isCorrect 
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                                    : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200'
                            }`}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            result.isCorrect 
                                                ? 'bg-green-500' 
                                                : 'bg-red-500'
                                        }`}>
                                            {result.isCorrect ? (
                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-3">
                                                {index + 1}. {result.question}
                                            </p>
                                            <div className="space-y-2">
                                                <p className="text-sm">
                                                    <span className="font-medium text-gray-700">Your answer:</span>{' '}
                                                    <span className={`font-semibold ${
                                                        result.isCorrect ? 'text-green-700' : 'text-red-700'
                                                    }`}>
                                                        {result.yourAnswer}
                                                    </span>
                                                </p>
                                                {!result.isCorrect && (
                                                    <p className="text-sm">
                                                        <span className="font-medium text-gray-700">Correct answer:</span>{' '}
                                                        <span className="font-semibold text-green-700">
                                                            {result.correctAnswer}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center pt-4">
                    <Button 
                        onClick={onQuizComplete}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3"
                    >
                        <ArrowRight className="mr-2 h-5 w-5" />
                        Continue Learning
                    </Button>
                </div>
            </motion.div>
        );
    }

    // --- RENDER QUIZ QUESTIONS (only if no existing result) ---
    if (!currentQuizResult && currentQuiz) {
        return (
        <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Quiz Header */}
            <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        {currentQuiz.questions.length}-Question Quiz
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                        Answer all questions to complete the quiz
                    </p>
                </CardHeader>
            </Card>

            {/* Questions */}
            <div className="space-y-6">
                {currentQuiz.questions.map((q, index) => (
                    <motion.div
                        key={q._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-200/50">
                                <CardTitle className="flex items-center gap-3 text-gray-900">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    {q.question}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    {q.options.map((option, oIndex) => (
                                        <motion.label 
                                            key={oIndex} 
                                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                                selectedAnswers[q._id] === option
                                                    ? 'border-cyan-500 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-md'
                                                    : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50'
                                            }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <input
                                                type="radio"
                                                name={q._id}
                                                value={option}
                                                checked={selectedAnswers[q._id] === option}
                                                onChange={() => handleAnswerChange(q._id, option)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                                                selectedAnswers[q._id] === option
                                                    ? 'border-cyan-500 bg-cyan-500'
                                                    : 'border-gray-300'
                                            }`}>
                                                {selectedAnswers[q._id] === option && (
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                            <span className={`font-medium ${
                                                selectedAnswers[q._id] === option
                                                    ? 'text-cyan-700'
                                                    : 'text-gray-700'
                                            }`}>
                                                {option}
                                            </span>
                                        </motion.label>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Submit Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Button 
                    onClick={handleSubmit} 
                    disabled={status === 'loading' || Object.keys(selectedAnswers).length !== currentQuiz.questions.length}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Trophy className="mr-2 h-5 w-5" />
                            Submit Quiz
                        </>
                    )}
                </Button>
            </motion.div>
        </motion.div>
        );
    }

    // --- FALLBACK: No quiz available ---
    return (
        <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 max-w-md mx-auto">
                <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quiz Available</h3>
                    <p className="text-gray-600">
                        This lesson doesn't have a quiz yet.
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Quiz;