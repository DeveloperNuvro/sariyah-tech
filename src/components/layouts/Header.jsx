// src/components/Header.jsx

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Shadcn UI & Icons
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  BookMarked, 
  LogOut, 
  LayoutDashboard, 
  User, 
  ShieldCheck, 
  Settings, 
  BookCopy, 
  Star, 
  ShoppingCart,
  Sparkles,
  Zap,
  Crown,
  GraduationCap,
  BookOpen,
  Home,
  Search,
  Bell,
  ChevronDown,
  X
} from 'lucide-react';

// Your Redux logout action
import { logoutUser } from '@/features/auth/authSlice';

import DarkLogo from "../../assets/images/DarkLogo.png"
// Enhanced Logo component with animations
const Logo = ({ isMobile = false }) => (
    <Link to="/" className={`flex items-center group ${isMobile ? 'gap-2' : 'gap-3'}`}>
        <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="relative"
        >
            <img 
                src={DarkLogo} 
                className={`transition-all duration-300 group-hover:drop-shadow-lg ${
                    isMobile ? 'w-8 h-8' : 'w-12 h-12'
                }`} 
            />
            <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
        </motion.div>
        <div className={`${isMobile ? 'block' : 'hidden sm:block'}`}>
            <h1 className={`font-bold bg-gradient-to-r from-white via-cyan-100 to-pink-100 bg-clip-text text-transparent ${
                isMobile ? 'text-sm' : 'text-xl'
            }`}>
                SariyahTech
            </h1>
            {!isMobile && (
                <p className="text-xs text-cyan-200/80 font-medium">Learn. Grow. Excel.</p>
            )}
        </div>
    </Link>
);

// Enhanced navigation links with better icons and styling
const getRoleBasedNavLinks = (role) => {
    switch (role) {
        case 'student':
            return [
                { to: "/dashboard/my-courses", text: "My Courses", icon: <GraduationCap className="h-4 w-4" />, color: "from-blue-500 to-cyan-500" }
            ];
        case 'instructor':
            return [
                { to: "/dashboard/instructor", text: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, color: "from-purple-500 to-pink-500" }
            ];
        case 'admin':
            return [
                { to: "/admin/dashboard", text: "Dashboard", icon: <Crown className="h-4 w-4" />, color: "from-yellow-500 to-orange-500" },
                { to: "/admin/users", text: "Users", icon: <User className="h-4 w-4" />, color: "from-green-500 to-emerald-500" },
                { to: "/admin/courses", text: "Courses", icon: <BookOpen className="h-4 w-4" />, color: "from-blue-500 to-indigo-500" },
                { to: "/admin/orders", text: "Orders", icon: <ShoppingCart className="h-4 w-4" />, color: "from-orange-500 to-red-500" },
                { to: "/admin/categories", text: "Categories", icon: <BookMarked className="h-4 w-4" />, color: "from-purple-500 to-violet-500" },
            ];
        default:
            return [];
    }
};

// Main navigation links for all users
const getMainNavLinks = () => [
    { to: "/", text: "Home", icon: <Home className="h-4 w-4" />, color: "from-cyan-500 to-blue-500" },
    { to: "/courses", text: "Courses", icon: <BookOpen className="h-4 w-4" />, color: "from-pink-500 to-rose-500" },
];

const UserNav = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logoutUser())
            .unwrap()
            .then(() => {
                toast.success('Logged out successfully');
                navigate('/login');
            })
            .catch((err) => {
                toast.error(err || 'Failed to log out');
            });
    };

    const userInitials = user.name.split(' ').map(n => n[0]).join('') || 'U';
    const roleLinks = getRoleBasedNavLinks(user.role);

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Crown className="h-3 w-3" />;
            case 'instructor': return <GraduationCap className="h-3 w-3" />;
            case 'student': return <User className="h-3 w-3" />;
            default: return <User className="h-3 w-3" />;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'from-yellow-500 to-orange-500';
            case 'instructor': return 'from-purple-500 to-pink-500';
            case 'student': return 'from-blue-500 to-cyan-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                >
                    <Button 
                        variant="ghost" 
                        className="relative h-10 md:h-12 w-auto px-0 md:px-3 pr-0 md:pr-3 rounded-full hover:bg-white/10 transition-all duration-300 group md:mr-0"
                    >
                        <div className="flex items-center gap-0 md:gap-3">
                            <div className="relative">
                                <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-white/30 group-hover:border-white/50 transition-all duration-300">
                        <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className={`bg-gradient-to-br ${getRoleColor(user.role)} text-white font-semibold text-xs md:text-sm`}>
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                                <motion.div
                                    className={`absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r ${getRoleColor(user.role)} rounded-full flex items-center justify-center`}
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {getRoleIcon(user.role)}
                                </motion.div>
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors">
                                    {user.name.split(' ')[0]}
                                </p>
                                <p className="text-xs text-cyan-200/80 capitalize">
                                    {user.role}
                                </p>
                            </div>
                            <ChevronDown 
                                className={`hidden md:block h-3 w-3 md:h-4 md:w-4 text-white/70 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                            />
                        </div>
                </Button>
                </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-72 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-3 mt-2" 
                align="end" 
                forceMount
            >
                <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-16 w-16 border-3 border-white/30 shadow-lg">
                            <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className={`bg-gradient-to-br ${getRoleColor(user.role)} text-white font-bold text-lg`}>
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${getRoleColor(user.role)} rounded-full flex items-center justify-center border-2 border-white`}>
                                {getRoleIcon(user.role)}
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <div>
                                <p className="text-lg font-bold leading-none text-gray-900">{user.name}</p>
                                <p className="text-sm leading-none text-gray-600 mt-1">{user.email}</p>
                            </div>
                            <Badge className={`w-fit bg-gradient-to-r ${getRoleColor(user.role)} text-white border-0 shadow-lg`}>
                                <div className="flex items-center gap-1">
                                    {getRoleIcon(user.role)}
                                    <span className="capitalize font-semibold">{user.role}</span>
                                </div>
                            </Badge>
                        </div>
                    </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                
                <div className="space-y-1">
                    {roleLinks.map((link, index) => (
                        <motion.div
                            key={link.to}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                    <DropdownMenuItem 
                        asChild
                                className="hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 hover:text-blue-700 rounded-xl transition-all duration-300 cursor-pointer group"
                    >
                                <Link to={link.to} className="flex items-center gap-3 p-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${link.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                            {link.icon}
                                    </div>
                                    <span className="font-medium">{link.text}</span>
                        </Link>
                    </DropdownMenuItem>
                        </motion.div>
                ))}
                </div>

                <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                
                <DropdownMenuItem 
                    asChild
                    className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:text-purple-700 rounded-xl transition-all duration-300 cursor-pointer group"
                >
                    <Link to="/profile/settings" className="flex items-center gap-3 p-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white group-hover:scale-110 transition-transform duration-300">
                            <Settings className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Profile Settings</span>
                    </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-red-300 to-transparent" />
                
                <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-600 focus:text-red-600 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 rounded-xl transition-all duration-300 cursor-pointer group"
                >
                    <div className="flex items-center gap-3 p-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white group-hover:scale-110 transition-transform duration-300">
                            <LogOut className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Log out</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const Header = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const mainNavLinks = getMainNavLinks();
    const roleLinks = isAuthenticated ? getRoleBasedNavLinks(user.role) : [];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleSearchInput = (e) => {
        setSearchQuery(e.target.value);
    };

    const NavLinkComponent = ({ link, onClick }) => (
        <NavLink
            to={link.to}
            onClick={onClick}
            className={({ isActive }) =>
                `group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                }`
            }
        >
            <motion.div
                className={`p-2 rounded-lg bg-gradient-to-r ${link.color} text-white`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                {link.icon}
            </motion.div>
            <span className="font-medium">{link.text}</span>
            {({ isActive }) => isActive && (
                <motion.div
                    className="absolute inset-0 bg-white/20 rounded-xl"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
        </NavLink>
    );

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                scrolled
                    ? 'bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl'
                    : 'bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-md border-b border-white/10'
            }`}
        >
            <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex h-16 md:h-18 items-center justify-between lg:justify-start">
                
                {/* --- LEFT SIDE (Logo + Desktop Nav) --- */}
                <div className="flex items-center">
                    {/* --- MOBILE LOGO (visible on mobile) --- */}
                    <div className="lg:hidden">
                        <Logo isMobile={true} />
                    </div>
                    
                    {/* --- DESKTOP NAVIGATION --- */}
                    <div className="mr-6 hidden lg:flex items-center">
                        <Logo />
                        <nav className="flex items-center space-x-2 ml-8">
                            {mainNavLinks.map((link, index) => (
                                <motion.div
                                    key={link.to}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <NavLinkComponent link={link} />
                                </motion.div>
                            ))}
                            {roleLinks.map((link, index) => (
                                <motion.div
                                    key={link.to}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (mainNavLinks.length + index) * 0.1 }}
                                >
                                    <NavLinkComponent link={link} />
                                </motion.div>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* --- RIGHT SIDE (Mobile Menu + Actions) --- */}
                <div className="flex items-center space-x-2">
                    {/* --- MOBILE NAVIGATION (SHEET) --- */}
                    <div className="lg:hidden">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-white hover:text-cyan-400 hover:bg-white/10 transition-all duration-300 h-8 w-8"
                                    >
                                        <Menu className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                            </SheetTrigger>
                        <SheetContent 
                            side="left" 
                            className="p-0 w-full max-w-sm bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-r border-white/20 flex flex-col h-full"
                        >
                            {/* Mobile Header */}
                            <div className="px-6 py-4 border-b border-white/10 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <Logo isMobile={true} />
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsSheetOpen(false)}
                                            className="text-white hover:text-cyan-400 hover:bg-white/10 h-8 w-8"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Mobile Search */}
                            <div className="px-6 py-4 border-b border-white/10 flex-shrink-0">
                                <form onSubmit={handleSearch} className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={searchQuery}
                                        onChange={handleSearchInput}
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm"
                                    />
                                </form>
                            </div>

                            {/* Mobile Navigation Links */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
                                <div className="space-y-3">
                                    {/* Main Navigation */}
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                                            Main Menu
                                        </h3>
                                        {mainNavLinks.map((link, index) => (
                                            <motion.div
                                                key={link.to}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <NavLink
                                                    to={link.to}
                                                    onClick={() => setIsSheetOpen(false)}
                                                    className={({ isActive }) =>
                                                        `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                                            isActive
                                                                ? 'bg-white/20 text-white shadow-lg'
                                                                : 'text-white/80 hover:text-white hover:bg-white/10'
                                                        }`
                                                    }
                                                >
                                                    <motion.div
                                                        className={`p-2 rounded-lg bg-gradient-to-r ${link.color} text-white`}
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                    >
                                                        {link.icon}
                                                    </motion.div>
                                                    <span className="font-medium text-base">{link.text}</span>
                                                </NavLink>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Role-based Navigation */}
                                    {roleLinks.length > 0 && (
                                        <div className="space-y-2 pt-4">
                                            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
                                                {user?.role === 'admin' ? 'Admin Panel' : 
                                                 user?.role === 'instructor' ? 'Instructor Tools' : 
                                                 'My Learning'}
                                            </h3>
                                            {roleLinks.map((link, index) => (
                                                <motion.div
                                                    key={link.to}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: (mainNavLinks.length + index) * 0.1 }}
                                                >
                                                    <NavLink
                                                        to={link.to}
                                                        onClick={() => setIsSheetOpen(false)}
                                                        className={({ isActive }) =>
                                                            `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                                                isActive
                                                                    ? 'bg-white/20 text-white shadow-lg'
                                                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                                            }`
                                                        }
                                                    >
                                                        <motion.div
                                                            className={`p-2 rounded-lg bg-gradient-to-r ${link.color} text-white`}
                                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                        >
                                                            {link.icon}
                                                        </motion.div>
                                                        <span className="font-medium text-base">{link.text}</span>
                                    </NavLink>
                                                </motion.div>
                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Footer */}
                            {isAuthenticated && (
                                <div className="px-6 py-4 border-t border-white/10 flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-white/30">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-pink-500 text-white font-semibold">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-white">{user.name}</p>
                                            <p className="text-xs text-white/60 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>

                    {/* --- SEARCH BAR (DESKTOP) --- */}
                    <div className="hidden lg:flex flex-1 items-center justify-center max-w-md mx-8">
                        <motion.div
                            className="relative w-full"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <form onSubmit={handleSearch} className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={handleSearchInput}
                                    className="w-full pl-10 pr-12 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm"
                                />
                                <motion.div
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="h-6 w-6 p-0 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white border-0"
                                    >
                                        <Search className="h-3 w-3" />
                                    </Button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </div>

                    {/* --- RIGHT SIDE ACTIONS --- */}
                    <div className="flex items-center space-x-1 md:space-x-3">
                    {isAuthenticated ? (
                        <>
                            {/* Notification Bell */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative"
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:text-cyan-400 hover:bg-white/10 transition-all duration-300 relative h-8 w-8 md:h-10 md:w-10"
                                >
                                    <Bell className="h-4 w-4 md:h-5 md:w-5" />
                                    <motion.div
                                        className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </Button>
                            </motion.div>
                        <UserNav />
                        </>
                    ) : (
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button 
                                    variant="ghost" 
                                    asChild 
                                    className="text-white hover:text-cyan-400 hover:bg-white/10 transition-all duration-300 px-3 md:px-6 py-2 text-sm md:text-base"
                                >
                                    <Link to="/login">Login</Link>
                                </Button>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button 
                                    asChild 
                                    className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white border-0 px-3 md:px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
                                >
                                    <Link to="/register" className="flex items-center gap-1 md:gap-2">
                                        <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
                                        <span className="hidden sm:inline">Get Started</span>
                                        <span className="sm:hidden">Start</span>
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;