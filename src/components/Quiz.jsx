import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitQuizAnswers } from '@/features/quiz/quizSlice';

const Quiz = ({ lessonId, onQuizComplete }) => {
    const dispatch = useDispatch();
    const { currentQuiz, currentQuizResult, status } = useSelector((state) => state.quizzes);
    
    // State to hold the student's selected answers: { questionId: answer }
    const [selectedAnswers, setSelectedAnswers] = useState({});

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

    // --- RENDER QUIZ RESULTS ---
    if (currentQuizResult) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Quiz Results</h2>
                <p className="text-lg">Your Score: 
                    <span className="font-bold"> {currentQuizResult.score} / {currentQuizResult.totalQuestions} ({currentQuizResult.percentage.toFixed(0)}%)</span>
                </p>
                <div className="space-y-6 mt-4">
                    {currentQuizResult.results.map((result, index) => (
                        <div key={result.questionId} className={`p-4 rounded-lg ${result.isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border`}>
                            <p className="font-semibold">{index + 1}. {result.question}</p>
                            <p className="mt-2">Your answer: <span className={!result.isCorrect ? 'text-red-600 font-bold' : ''}>{result.yourAnswer}</span></p>
                            {!result.isCorrect && (
                                <p>Correct answer: <span className="text-green-600 font-bold">{result.correctAnswer}</span></p>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={onQuizComplete} className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Close</button>
            </div>
        );
    }

    // --- RENDER QUIZ QUESTIONS ---
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">{currentQuiz.questions.length}-Question Quiz</h2>
            {currentQuiz.questions.map((q, index) => (
                <div key={q._id} className="p-4 border rounded-md bg-gray-800">
                    <p className="font-semibold mb-4">{index + 1}. {q.question}</p>
                    <div className="space-y-2">
                        {q.options.map((option, oIndex) => (
                            <label key={oIndex} className="flex items-center p-2 rounded hover:bg-gray-900 cursor-pointer">
                                <input
                                    type="radio"
                                    name={q._id}
                                    value={option}
                                    checked={selectedAnswers[q._id] === option}
                                    onChange={() => handleAnswerChange(q._id, option)}
                                    className="mr-3"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <button 
                onClick={handleSubmit} 
                disabled={status === 'loading'}
                className="mt-6 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
                {status === 'loading' ? 'Submitting...' : 'Submit Answers'}
            </button>
        </div>
    );
};

export default Quiz;