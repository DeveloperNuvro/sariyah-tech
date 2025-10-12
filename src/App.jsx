import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './features/auth/authSlice';
import { Toaster } from 'react-hot-toast'; // For user feedback

// Page Imports
import HomePage from './pages/Home';
import CourseDetailPage from './pages/CourseDetail';
import LoginPage from './pages/auth/loginPage';
import RegisterPage from './pages/auth/Register';
import CheckoutPage from './pages/student/CheckoutPage';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseLessonPage from './pages/student/CourseLesson';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCoursePage from './pages/instructor/CreateCourse';
import AddLessonPage from './pages/instructor/AddLessonPage';
import PaymentManagementPage from './pages/admin/PaymentManagementPage';

// Route Protection
import { StudentRoute, InstructorRoute, AdminRoute } from './routes/ProtectedRoute';
import Header from './components/layouts/Header';
import ManageQuizPage from './pages/instructor/ManageQuizPage';
import QuizResultsPage from './pages/instructor/QuizResultsPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import InstructorRegisterPage from './pages/auth/InstructorRegisterPage';
import CoursesPage from './pages/CoursesPage';

function App() {

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      {/* A Header component would go here */}
      <Header />
      <main style={{ padding: '20px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/instructor" element={<InstructorRegisterPage />} />
          <Route path="/course/:slug" element={<CourseDetailPage />} />
              <Route path="/courses" element={<CoursesPage />} />
          {/* Student Routes */}
          <Route path="/checkout/:courseId" element={<StudentRoute><CheckoutPage /></StudentRoute>} />
          <Route path="/dashboard/my-courses" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
          <Route path="/learn/:courseId" element={<StudentRoute><CourseLessonPage /></StudentRoute>} />

          {/* Instructor & Admin Routes */}
          <Route path="/dashboard/instructor" element={<InstructorRoute><InstructorDashboard /></InstructorRoute>} />
          <Route path="/instructor/courses/create" element={<InstructorRoute><CreateCoursePage /></InstructorRoute>} />
          <Route path="/instructor/courses/:courseId/add-lesson" element={<InstructorRoute><AddLessonPage /></InstructorRoute>} />
          <Route path="/instructor/lesson/:lessonId/quiz" element={<InstructorRoute><ManageQuizPage /></InstructorRoute>} />
          <Route path="/instructor/course/:id/quiz-results" element={<InstructorRoute><QuizResultsPage /></InstructorRoute>} />
          <Route path="/instructor/lesson/:id/quiz-results" element={<InstructorRoute><QuizResultsPage /></InstructorRoute>} />
          {/* Admin Only Routes */}
          <Route path="/admin/payments" element={<AdminRoute><PaymentManagementPage /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><CategoryManagementPage /></AdminRoute>} />
          {/* A 404 Not Found component would go here */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </main>
      {/* A Footer component would go here */}
    </Router>
  );
}

export default App;