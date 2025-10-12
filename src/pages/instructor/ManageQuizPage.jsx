import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createQuizForLesson } from '@/features/quiz/quizSlice';
import toast from 'react-hot-toast';

// Shadcn/UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles,
  Trophy,
  BookOpen,
  Loader2
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

const ManageQuizPage = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [questions, setQuestions] = useState([
        { question: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleQuestionChange = (qIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[qIndex][event.target.name] = event.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = event.target.value;
        setQuestions(newQuestions);
    };
    
    const handleCorrectAnswerChange = (qIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = event.target.value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
    };

    const removeQuestion = (qIndex) => {
        if (questions.length <= 1) {
            toast.error("A quiz must have at least one question.");
            return;
        }
        const newQuestions = questions.filter((_, index) => index !== qIndex);
        setQuestions(newQuestions);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        // Basic validation
        for (const q of questions) {
            if (!q.question.trim() || q.options.some(opt => !opt.trim()) || !q.correctAnswer.trim()) {
                toast.error("Please fill out all fields for every question.");
                setIsLoading(false);
                return;
            }
            if (!q.options.includes(q.correctAnswer)) {
                toast.error(`The correct answer for "${q.question}" must be one of the options.`);
                setIsLoading(false);
                return;
            }
        }

        const quizData = { questions };
        dispatch(createQuizForLesson({ lessonId, quizData }))
            .unwrap()
            .then(() => {
                toast.success("Quiz created/updated successfully!");
                navigate(-1); // Go back to the previous page
            })
            .catch(err => {
                toast.error(`Failed to save quiz: ${err}`);
                setIsLoading(false);
            });
    };

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
                                <Trophy className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Manage Quiz
                            </h1>
                        </div>
                        <p className="text-gray-600">Create and manage quiz questions for your lesson</p>
                    </div>
                </motion.div>

                <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-8"
                    variants={animationVariants.container}
                    initial="hidden"
                    animate="show"
                >
                    <AnimatePresence>
                        {questions.map((q, qIndex) => (
                            <motion.div
                                key={qIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: qIndex * 0.1 }}
                            >
                                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 relative">
                                    <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-200/50">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                                <HelpCircle className="w-5 h-5 text-purple-600" />
                                                Question {qIndex + 1}
                                            </CardTitle>
                                            {questions.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeQuestion(qIndex)}
                                                    className="bg-red-500 hover:bg-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent className="p-8 space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor={`question-${qIndex}`} className="flex items-center gap-2 text-gray-700 font-semibold">
                                                <BookOpen className="w-4 h-4 text-purple-600" />
                                                Question Text
                                            </Label>
                                            <Input
                                                id={`question-${qIndex}`}
                                                name="question"
                                                value={q.question}
                                                onChange={(e) => handleQuestionChange(qIndex, e)}
                                                placeholder="Enter your question here..."
                                                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-lg py-3"
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="flex items-center gap-2 text-gray-700 font-semibold">
                                                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                                                Answer Options
                                            </Label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {q.options.map((opt, oIndex) => (
                                                    <div key={oIndex} className="space-y-2">
                                                        <Label htmlFor={`option-${qIndex}-${oIndex}`} className="text-sm text-gray-600">
                                                            Option {oIndex + 1}
                                                        </Label>
                                                        <Input
                                                            id={`option-${qIndex}-${oIndex}`}
                                                            type="text"
                                                            value={opt}
                                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                                                            placeholder={`Option ${oIndex + 1}`}
                                                            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                            required
                                                            disabled={isLoading}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`correct-${qIndex}`} className="flex items-center gap-2 text-gray-700 font-semibold">
                                                <Trophy className="w-4 h-4 text-purple-600" />
                                                Correct Answer
                                            </Label>
                                            <Select
                                                name="correctAnswer"
                                                value={q.correctAnswer}
                                                onValueChange={(value) => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[qIndex].correctAnswer = value;
                                                    setQuestions(newQuestions);
                                                }}
                                                required
                                                disabled={isLoading}
                                            >
                                                <SelectTrigger id={`correct-${qIndex}`} className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                                                    <SelectValue placeholder="Select the correct option" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                                    {q.options.map((opt, oIndex) => (
                                                        opt.trim() && (
                                                            <SelectItem 
                                                                key={oIndex} 
                                                                value={opt}
                                                                className="text-gray-900 hover:bg-gray-100"
                                                            >
                                                                {opt}
                                                            </SelectItem>
                                                        )
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <motion.div 
                        className="flex justify-between items-center mt-8"
                        variants={animationVariants.fadeInUp}
                    >
                        <Button
                            type="button"
                            onClick={addQuestion}
                            variant="outline"
                            className="border-2 border-cyan-400/20 hover:bg-cyan-400/10 text-cyan-700 hover:text-cyan-800"
                            disabled={isLoading}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Another Question
                        </Button>
                        
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 transition-all duration-300"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Saving Quiz...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Save Quiz
                                </>
                            )}
                        </Button>
                    </motion.div>
                </motion.form>
            </main>
        </div>
    );
};

export default ManageQuizPage;