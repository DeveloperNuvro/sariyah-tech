// src/pages/TermsOfService.jsx

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Shield, Users, CreditCard, BookOpen, Award, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsOfService = () => {
  useEffect(() => {
    document.title = 'Terms of Service - SariyahTech';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 md:p-12"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
                Terms of Service
              </h1>
            </div>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-cyan-600" />
                1. Agreement to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to <strong>SariyahTech</strong> ("we," "our," or "us"). By accessing or using our learning management platform, 
                including our website, mobile applications, and online courses (collectively, the "Service"), you agree to be bound 
                by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                These Terms apply to all users of the Service, including students, instructors, administrators, and visitors. 
                By creating an account, enrolling in a course, or using any feature of our platform, you acknowledge that you have 
                read, understood, and agree to be bound by these Terms.
              </p>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-cyan-600" />
                2. Account Registration and Security
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 Account Creation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To access certain features of our Service, you must register for an account. When you register, you agree to:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700 ml-4">
                    <li>Provide accurate, current, and complete information about yourself</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Verify your email address as required for account activation</li>
                    <li>Maintain the security of your password and account credentials</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                    <li>Accept responsibility for all activities that occur under your account</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">2.2 Account Types</h3>
                  <p className="text-gray-700 leading-relaxed">
                    SariyahTech offers three types of accounts:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700 ml-4">
                    <li><strong>Student Accounts:</strong> For individuals who enroll in and take courses</li>
                    <li><strong>Instructor Accounts:</strong> For educators who create and publish courses (subject to approval)</li>
                    <li><strong>Admin Accounts:</strong> For platform administrators</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-800 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>You are responsible for maintaining the confidentiality of your account credentials. SariyahTech will not be 
                    liable for any loss or damage arising from unauthorized access to your account.</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Course Enrollment and Access */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-cyan-600" />
                3. Course Enrollment and Access
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1 Course Access</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Upon successful enrollment and payment (if applicable), you will receive lifetime access to the course content, 
                    subject to these Terms. However, we reserve the right to remove or modify course content at any time.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2 Course Materials</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All course materials, including videos, documents, quizzes, and other content, are provided for your personal, 
                    non-commercial use. You may not:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700 ml-4">
                    <li>Copy, reproduce, or distribute course materials to third parties</li>
                    <li>Share your account credentials with others</li>
                    <li>Record, download, or screen-capture course content for redistribution</li>
                    <li>Use course materials to create competing products or services</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">3.3 Certificates</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Certificates of completion are issued upon successful completion of course requirements as determined by the instructor. 
                    Certificates are provided for verification purposes and do not constitute professional certification or accreditation unless 
                    explicitly stated.
                  </p>
                </div>
              </div>
            </section>

            {/* Payments and Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-cyan-600" />
                4. Payments, Pricing, and Refunds
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Pricing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Course prices are displayed in the course description and may vary. We reserve the right to change prices at any time. 
                    Prices are charged in the currency displayed on the platform.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Payment Processing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All payments are processed securely through our payment partners. By making a purchase, you agree to provide accurate 
                    payment information and authorize us to charge your payment method for the total amount.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4.3 Refund Policy</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Refund requests must be submitted within 30 days of purchase. Refunds may be granted at our sole discretion if:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700 ml-4">
                    <li>You have not accessed more than 20% of the course content</li>
                    <li>You have not received a certificate of completion</li>
                    <li>The course does not meet the description provided</li>
                    <li>Technical issues prevent you from accessing the course</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Refunds will be processed to the original payment method within 5-10 business days.
                  </p>
                </div>
              </div>
            </section>

            {/* Instructor Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="h-6 w-6 text-cyan-600" />
                5. Instructor Terms
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 Instructor Responsibilities</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you are an instructor, you agree to:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700 ml-4">
                    <li>Provide accurate course descriptions and learning objectives</li>
                    <li>Deliver high-quality educational content</li>
                    <li>Respond to student questions and provide support</li>
                    <li>Maintain professional conduct in all interactions</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2 Intellectual Property</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You retain ownership of the content you create and upload to SariyahTech. However, by uploading content, you grant 
                    us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content on our platform 
                    for educational purposes.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">5.3 Revenue Share</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Instructor revenue sharing terms will be specified in a separate instructor agreement. Revenue is typically calculated 
                    as a percentage of course sales, minus transaction fees.
                  </p>
                </div>
              </div>
            </section>

            {/* Prohibited Conduct */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Conduct</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Engage in fraudulent or deceptive practices</li>
                <li>Interfere with the Service's operation or security</li>
                <li>Collect user information without authorization</li>
                <li>Use automated systems to access the Service without permission</li>
              </ul>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account at any time, with or without notice, for violation of these Terms 
                or for any other reason we deem necessary. Upon termination, your right to access the Service will immediately cease. 
                You may terminate your account at any time by contacting our support team.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, SariyahTech shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, 
                goodwill, or other intangible losses resulting from your use of the Service.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through 
                the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> info@sariyahtech.com</p>
                <p className="text-gray-700 mt-2"><strong>Website:</strong> www.sariyahtech.com</p>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white">
              <Link to="/privacy" className="text-white">View Privacy Policy</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;

