import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, Link } from 'react-router-dom';
import { fetchScoresForCourse, fetchScoresForLesson, clearScores } from '../../features/quizScores/quizScoreSlice';

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
    
    if (status === 'loading') {
        return <p className="text-center mt-8">Loading results...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/dashboard/instructor" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
            <h1 className="text-3xl font-bold mb-6">Quiz Results</h1>
            
            {scores.length === 0 ? (
                <p>No quiz submissions found for this {isByCourse ? 'course' : 'lesson'} yet.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Email</th>
                                {isByCourse && ( // Only show Lesson column if viewing results for a whole course
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lesson</th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {scores.map(score => (
                                <tr key={score._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{score.student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{score.student.email}</td>
                                    {isByCourse && (
                                        <td className="px-6 py-4 whitespace-nowrap">{score.lesson.title}</td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{score.score.toFixed(0)}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(score.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default QuizResultsPage;