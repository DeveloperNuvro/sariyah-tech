import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // For user feedback

// Page Imports
import HomePage from './pages/Home';
import CourseDetailPage from './pages/CourseDetail';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/Register';
import CheckoutPage from './pages/student/CheckoutPage';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseLessonPage from './pages/student/CourseLesson';
import OrderDetails from './pages/student/OrderDetails';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCoursePage from './pages/instructor/CreateCourse';
import EditCoursePage from './pages/instructor/EditCourse';
import AddLessonPage from './pages/instructor/AddLessonPage';
import PaymentManagementPage from './pages/admin/PaymentManagementPage';

// Route Protection
import { ProtectedRoute, StudentRoute, InstructorRoute, AdminRoute } from './routes/ProtectedRoute';
import Header from './components/layouts/Header';
import ManageQuizPage from './pages/instructor/ManageQuizPage';
import QuizResultsPage from './pages/instructor/QuizResultsPage';
import CategoryManagement from './pages/admin/CategoryManagement';
import InstructorRegisterPage from './pages/auth/InstructorRegisterPage';
import CoursesPage from './pages/CoursesPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import LessonManagement from './pages/admin/LessonManagement';
import ReviewManagement from './pages/admin/ReviewManagement';
import OrderManagement from './pages/admin/OrderManagement';
import ProfileSettings from './pages/ProfileSettings';


function App() {

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      {/* A Header component would go here */}
      <Header />
      <main>
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
          <Route path="/orders/:orderId" element={<StudentRoute><OrderDetails /></StudentRoute>} />

          {/* Profile Settings - Available to all authenticated users */}
          <Route path="/profile/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />

          {/* Instructor & Admin Routes */}
          <Route path="/dashboard/instructor" element={<InstructorRoute><InstructorDashboard /></InstructorRoute>} />
          <Route path="/instructor/courses/create" element={<InstructorRoute><CreateCoursePage /></InstructorRoute>} />
          <Route path="/instructor/courses/:courseId/edit" element={<InstructorRoute><EditCoursePage /></InstructorRoute>} />
          <Route path="/instructor/courses/:courseId/add-lesson" element={<InstructorRoute><AddLessonPage /></InstructorRoute>} />
          <Route path="/instructor/lesson/:lessonId/quiz" element={<InstructorRoute><ManageQuizPage /></InstructorRoute>} />
          <Route path="/instructor/course/:id/quiz-results" element={<InstructorRoute><QuizResultsPage /></InstructorRoute>} />
          <Route path="/instructor/lesson/:id/quiz-results" element={<InstructorRoute><QuizResultsPage /></InstructorRoute>} />
          {/* Admin Only Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/courses" element={<AdminRoute><CourseManagement /></AdminRoute>} />
          <Route path="/admin/lessons" element={<AdminRoute><LessonManagement /></AdminRoute>} />
          <Route path="/admin/reviews" element={<AdminRoute><ReviewManagement /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
          <Route path="/admin/payments" element={<AdminRoute><PaymentManagementPage /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><CategoryManagement /></AdminRoute>} />
          {/* A 404 Not Found component would go here */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </main>
      {/* A Footer component would go here */}
    </Router>
  );
}

export default App;