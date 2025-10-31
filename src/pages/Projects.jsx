import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Lucide React Icons
import {
  Code,
  Smartphone,
  Globe,
  Bot,
  Database,
  Cloud,
  Lock,
  Zap,
  Rocket,
  CheckCircle,
  Mail,
  Phone,
  User,
  FileText,
  Send,
  Sparkles,
  Layers,
  Palette,
  Cpu,
  Server
} from 'lucide-react';

// Animation variants
const animationVariants = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  },
  fadeInUp: {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  scaleIn: {
    hidden: { scale: 0.95, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  }
};

// Services data
const services = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Software Development",
    description: "Custom software solutions tailored to your business needs. We build scalable applications using modern technologies.",
    color: "from-blue-500 to-cyan-500",
    features: ["Full-stack Development", "API Integration", "Performance Optimization"]
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android. Beautiful, fast, and user-friendly apps.",
    color: "from-purple-500 to-pink-500",
    features: ["iOS & Android", "React Native", "App Store Optimization"]
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Website Development",
    description: "Responsive, modern websites that look great on all devices. From simple landing pages to complex web applications.",
    color: "from-green-500 to-emerald-500",
    features: ["Responsive Design", "SEO Optimized", "Fast Loading"]
  },
  {
    icon: <Bot className="w-8 h-8" />,
    title: "AI Agent Development",
    description: "Intelligent AI agents and chatbots that automate tasks, enhance customer experience, and boost productivity.",
    color: "from-orange-500 to-red-500",
    features: ["Chatbots", "AI Automation", "Machine Learning"]
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Database Solutions",
    description: "Robust database architecture and management systems to handle your data efficiently and securely.",
    color: "from-indigo-500 to-blue-500",
    features: ["Database Design", "Data Migration", "Performance Tuning"]
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Cloud Services",
    description: "Cloud infrastructure setup, migration, and management. Scalable, secure, and cost-effective solutions.",
    color: "from-teal-500 to-cyan-500",
    features: ["AWS/Azure/GCP", "Cloud Migration", "DevOps"]
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Cybersecurity",
    description: "Protect your business with comprehensive security solutions. Penetration testing, security audits, and more.",
    color: "from-red-500 to-pink-500",
    features: ["Security Audits", "Penetration Testing", "Data Protection"]
  },
  {
    icon: <Server className="w-8 h-8" />,
    title: "Backend Development",
    description: "Robust backend systems and APIs. Scalable server architecture that powers your applications.",
    color: "from-gray-500 to-slate-500",
    features: ["RESTful APIs", "Microservices", "Server Management"]
  }
];

const Projects = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    projectIdea: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Our Services - SariyahTech';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprehensive validation
    const name = formData.clientName?.trim() || '';
    const email = formData.clientEmail?.trim() || '';
    const phone = formData.clientPhone?.trim() || '';
    const idea = formData.projectIdea?.trim() || '';

    // Required fields validation
    if (!name || !email || !phone || !idea) {
      toast.error('Please fill in all fields');
      return;
    }

    // Name validation
    if (name.length < 2 || name.length > 100) {
      toast.error('Name must be between 2 and 100 characters');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone validation
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      toast.error('Please enter a valid phone number with 7-15 digits');
      return;
    }

    // Project idea validation
    if (idea.length < 10 || idea.length > 5000) {
      toast.error('Project idea must be between 10 and 5000 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8900'}/api/project-inquiry`,
        formData
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Thank you for your inquiry! We\'ll get back to you soon.');
        setFormData({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          projectIdea: ''
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to submit inquiry. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-white/90 text-sm font-medium">Transform Your Ideas into Reality</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-pink-100 bg-clip-text text-transparent">
              Our Services
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
              We provide comprehensive technology solutions to help your business thrive in the digital world.
              From custom software to AI agents, we've got you covered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={animationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={animationVariants.scaleIn}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white border-0 px-4 py-1">
              Get In Touch
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
              Have a Project in Mind?
            </h2>
            <p className="text-gray-600 text-lg">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-white to-gray-50 border-0">
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label htmlFor="clientName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-cyan-600" />
                        Full Name *
                      </label>
                      <Input
                        id="clientName"
                        name="clientName"
                        type="text"
                        placeholder="John Doe"
                        value={formData.clientName}
                        onChange={handleChange}
                        required
                        className="h-12 bg-white border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label htmlFor="clientEmail" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-cyan-600" />
                        Email Address *
                      </label>
                      <Input
                        id="clientEmail"
                        name="clientEmail"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.clientEmail}
                        onChange={handleChange}
                        required
                        className="h-12 bg-white border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label htmlFor="clientPhone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-cyan-600" />
                      Phone Number *
                    </label>
                    <Input
                      id="clientPhone"
                      name="clientPhone"
                      type="tel"
                      placeholder="+1234567890"
                      value={formData.clientPhone}
                      onChange={handleChange}
                      required
                      className="h-12 bg-white border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Project Idea Field */}
                  <div className="space-y-2">
                    <label htmlFor="projectIdea" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-600" />
                      Project Idea *
                    </label>
                    <Textarea
                      id="projectIdea"
                      name="projectIdea"
                      placeholder="Tell us about your project idea, requirements, timeline, and any other details..."
                      value={formData.projectIdea}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="bg-white border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white border-0 text-base font-semibold transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Send className="w-5 h-5" />
                          </motion.div>
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-5 h-5" />
                          Send Inquiry
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Rocket className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Let's bring your vision to life with cutting-edge technology and expert development.
            </p>
            <Button
              as="a"
              href="#contact-form"
              className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white border-0 px-8 py-6 text-lg font-semibold transition-all duration-300"
            >
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;

