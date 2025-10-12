import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createQuizForLesson } from '@/features/quiz/quizSlice'; // Assuming you created this
import toast from 'react-hot-toast';

const ManageQuizPage = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [questions, setQuestions] = useState([
        { question: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);

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
        // Basic validation
        for (const q of questions) {
            if (!q.question.trim() || q.options.some(opt => !opt.trim()) || !q.correctAnswer.trim()) {
                toast.error("Please fill out all fields for every question.");
                return;
            }
            if (!q.options.includes(q.correctAnswer)) {
                toast.error(`The correct answer for "${q.question}" must be one of the options.`);
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
            .catch(err => toast.error(`Failed to save quiz: ${err}`));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/dashboard/instructor" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
            <h1 className="text-3xl font-bold mb-6">Manage Quiz</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-white p-6 border rounded-lg shadow-sm relative">
                        <h3 className="text-lg font-semibold mb-4">Question {qIndex + 1}</h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Question Text</label>
                            <input
                                type="text"
                                name="question"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(qIndex, e)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {q.options.map((opt, oIndex) => (
                                <div key={oIndex}>
                                    <label className="block text-sm font-medium text-gray-700">Option {oIndex + 1}</label>
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mb-4">
                             <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                             <select
                                name="correctAnswer"
                                value={q.correctAnswer}
                                onChange={(e) => handleCorrectAnswerChange(qIndex, e)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                             >
                                <option value="" disabled>Select the correct option</option>
                                {q.options.map((opt, oIndex) => (
                                    opt.trim() && <option key={oIndex} value={opt}>{opt}</option>
                                ))}
                             </select>
                        </div>
                        
                        <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-semibold"
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <div className="flex justify-between items-center mt-8">
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Add Another Question
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                    >
                        Save Quiz
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageQuizPage;