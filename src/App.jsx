import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Lazy load pages for code splitting and better performance
const HomePage = lazy(() => import('./pages/Home'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetail'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/Register'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const CheckoutPage = lazy(() => import('./pages/student/CheckoutPage'));
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const CourseLessonPage = lazy(() => import('./pages/student/CourseLesson'));
const OrderDetails = lazy(() => import('./pages/student/OrderDetails'));
const InstructorDashboard = lazy(() => import('./pages/instructor/InstructorDashboard'));
const CreateCoursePage = lazy(() => import('./pages/instructor/CreateCourse'));
const EditCoursePage = lazy(() => import('./pages/instructor/EditCourse'));
const AddLessonPage = lazy(() => import('./pages/instructor/AddLessonPage'));
const PaymentManagementPage = lazy(() => import('./pages/admin/PaymentManagementPage'));

// Route Protection
import { ProtectedRoute, StudentRoute, InstructorRoute, AdminRoute } from './routes/ProtectedRoute';
import Header from './components/layouts/Header';

// Lazy load remaining pages
const ManageQuizPage = lazy(() => import('./pages/instructor/ManageQuizPage'));
const QuizResultsPage = lazy(() => import('./pages/instructor/QuizResultsPage'));
const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement'));
const InstructorRegisterPage = lazy(() => import('./pages/auth/InstructorRegisterPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const CourseManagement = lazy(() => import('./pages/admin/CourseManagement'));
const LessonManagement = lazy(() => import('./pages/admin/LessonManagement'));
const ReviewManagement = lazy(() => import('./pages/admin/ReviewManagement'));
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'));
const DigitalOrdersAdminPage = lazy(() => import('./pages/admin/DigitalOrders'));
const ProductsList = lazy(() => import('./pages/admin/ProductsList'));
const ProductCreate = lazy(() => import('./pages/admin/ProductCreate'));
const ProductEdit = lazy(() => import('./pages/admin/ProductEdit'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const DigitalOrderDetails = lazy(() => import('./pages/DigitalOrderDetails'));
const MyDigitalOrders = lazy(() => import('./pages/MyDigitalOrders'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Projects = lazy(() => import('./pages/Projects'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const BlogsList = lazy(() => import('./pages/admin/BlogsList'));
const BlogCreate = lazy(() => import('./pages/admin/BlogCreate'));
const BlogEdit = lazy(() => import('./pages/admin/BlogEdit'));

// Import beautiful page loader
import PageLoader from './components/PageLoader';


function App() {

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/instructor" element={<InstructorRegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/course/:slug" element={<CourseDetailPage />} />
              <Route path="/courses" element={<CoursesPage />} />
          {/* Digital shop routes */}
          <Route path="/shop" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/digital-orders/:orderId" element={<ProtectedRoute><DigitalOrderDetails /></ProtectedRoute>} />
          <Route path="/dashboard/digital-orders" element={<ProtectedRoute><MyDigitalOrders /></ProtectedRoute>} />
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
          <Route path="/admin/digital-orders" element={<AdminRoute><DigitalOrdersAdminPage /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ProductsList /></AdminRoute>} />
          <Route path="/admin/products/new" element={<AdminRoute><ProductCreate /></AdminRoute>} />
          <Route path="/admin/products/:id/edit" element={<AdminRoute><ProductEdit /></AdminRoute>} />
          <Route path="/admin/blogs" element={<AdminRoute><BlogsList /></AdminRoute>} />
          <Route path="/admin/blogs/new" element={<AdminRoute><BlogCreate /></AdminRoute>} />
          <Route path="/admin/blogs/:id/edit" element={<AdminRoute><BlogEdit /></AdminRoute>} />
          <Route path="/admin/payments" element={<AdminRoute><PaymentManagementPage /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><CategoryManagement /></AdminRoute>} />
          {/* A 404 Not Found component would go here */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;