// src/pages/PrivacyPolicy.jsx

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, Eye, Database, User, Mail, Server, Cookie, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = 'Privacy Policy - SariyahTech';
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
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
            </div>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-cyan-600" />
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At <strong>SariyahTech</strong> ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our learning management platform, 
                including our website, mobile applications, and online courses (collectively, the "Service").
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Please read this Privacy Policy carefully. By using our Service, you agree to the collection and use of information 
                in accordance with this policy. If you do not agree with our policies and practices, please do not use our Service.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-cyan-600" />
                2. Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 Information You Provide</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    We collect information that you voluntarily provide when:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>Account Registration:</strong> Name, email address, password, phone number, and profile information</li>
                    <li><strong>Profile Updates:</strong> Avatar images, bio, social media links, and other profile data</li>
                    <li><strong>Course Enrollment:</strong> Course preferences, payment information, and enrollment history</li>
                    <li><strong>Course Content:</strong> Quiz responses, assignments, progress data, and completion certificates</li>
                    <li><strong>Communications:</strong> Messages, reviews, feedback, and support requests</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">2.2 Automatically Collected Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    When you use our Service, we automatically collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                    <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, course progress, and interaction patterns</li>
                    <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                    <li><strong>Cookies and Tracking:</strong> Information collected through cookies and similar tracking technologies</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">2.3 Payment Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Payment information is processed securely through our third-party payment processors. We do not store your full 
                    credit card details on our servers. Payment processors may collect billing information, transaction history, 
                    and payment method details in accordance with their own privacy policies.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-6 w-6 text-cyan-600" />
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our educational platform and courses</li>
                <li><strong>Account Management:</strong> To create and manage your account, verify your identity, and process enrollments</li>
                <li><strong>Personalization:</strong> To customize your learning experience, recommend courses, and track progress</li>
                <li><strong>Communication:</strong> To send you updates, notifications, course materials, and respond to inquiries</li>
                <li><strong>Payment Processing:</strong> To process payments, manage subscriptions, and handle refunds</li>
                <li><strong>Analytics:</strong> To analyze usage patterns, improve our Service, and develop new features</li>
                <li><strong>Security:</strong> To protect against fraud, unauthorized access, and ensure platform security</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our Terms of Service</li>
                <li><strong>Marketing:</strong> To send promotional materials (with your consent) about new courses and features</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Server className="h-6 w-6 text-cyan-600" />
                4. Information Sharing and Disclosure
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 We Do Not Sell Your Data</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Service Providers</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    We may share your information with trusted third-party service providers who assist us in:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Payment processing and transaction management</li>
                    <li>Email delivery and communication services</li>
                    <li>Cloud storage and hosting services (e.g., Cloudinary for media)</li>
                    <li>Analytics and performance monitoring</li>
                    <li>Customer support and service management</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    These service providers are contractually obligated to protect your information and use it only for the purposes 
                    we specify.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4.3 Legal Requirements</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may disclose your information if required by law, court order, or government regulation, or if we believe 
                    disclosure is necessary to protect our rights, property, or safety, or that of our users or others.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4.4 Business Transfers</h3>
                  <p className="text-gray-700 leading-relaxed">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity, 
                    subject to the same privacy protections.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-cyan-600" />
                5. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Encryption:</strong> Data transmitted to our Service is encrypted using SSL/TLS protocols</li>
                <li><strong>Password Security:</strong> Passwords are hashed using bcrypt before storage</li>
                <li><strong>Access Controls:</strong> Access to personal data is restricted to authorized personnel only</li>
                <li><strong>Secure Storage:</strong> Data is stored on secure servers with regular security updates</li>
                <li><strong>Regular Audits:</strong> We conduct regular security assessments and vulnerability testing</li>
              </ul>
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-blue-800">
                  <strong>Note:</strong> While we strive to protect your information, no method of transmission over the Internet or 
                  electronic storage is 100% secure. We cannot guarantee absolute security, but we continuously work to improve our 
                  security measures.
                </p>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Cookie className="h-6 w-6 text-cyan-600" />
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Remember your preferences and settings</li>
                <li>Maintain your login session</li>
                <li>Analyze Service usage and performance</li>
                <li>Provide personalized content and recommendations</li>
                <li>Track course progress and learning analytics</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You can control cookie preferences through your browser settings. However, disabling cookies may affect your ability 
                to use certain features of our Service.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Update or correct inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Data Portability:</strong> Request your data in a portable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Account Control:</strong> Access, modify, or delete your account through your profile settings</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us at <strong>info@sariyahtech.com</strong>. We will respond to your request 
                within 30 days.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from 
                children under 13. If you believe we have collected information from a child under 13, please contact us immediately 
                so we can delete that information.
              </p>
            </section>

            {/* International Users */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. These countries 
                may have data protection laws that differ from those in your country. By using our Service, you consent to the transfer 
                of your information to these countries.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date. We may also notify you via email or through the Service. 
                Your continued use of the Service after such changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="h-6 w-6 text-cyan-600" />
                11. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
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
              <Link to="/terms" className="text-white">View Terms of Service</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

