// src/components/Header.jsx

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
import { Menu, BookMarked, LogOut, LayoutDashboard, User, ShieldCheck, Settings, BookCopy, Star, ShoppingCart } from 'lucide-react';

// Your Redux logout action
import { logoutUser } from '@/features/auth/authSlice';


import DarkLogo from "../../assets/images/DarkLogo.png"
// A reusable Logo component for consistency
const Logo = () => (
    <Link to="/" className="flex items-center gap-2">
        <img src={DarkLogo} style={{width: 50, height: 50}} />
    </Link>
);

// A helper to generate navigation links based on user role
const getRoleBasedNavLinks = (role) => {
    switch (role) {
        case 'student':
            return [{ to: "/dashboard/my-courses", text: "My Courses", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> }];
        case 'instructor':
            return [{ to: "/dashboard/instructor", text: "Instructor Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> }];
        case 'admin':
            return [
                { to: "/admin/dashboard", text: "Admin Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
                { to: "/admin/users", text: "Manage Users", icon: <User className="mr-2 h-4 w-4" /> },
                { to: "/admin/courses", text: "Manage Courses", icon: <BookCopy className="mr-2 h-4 w-4" /> },
                { to: "/admin/lessons", text: "Manage Lessons", icon: <BookMarked className="mr-2 h-4 w-4" /> },
                { to: "/admin/reviews", text: "Manage Reviews", icon: <Star className="mr-2 h-4 w-4" /> },
                { to: "/admin/orders", text: "Manage Orders", icon: <ShoppingCart className="mr-2 h-4 w-4" /> },
                { to: "/admin/categories", text: "Manage Categories", icon: <Settings className="mr-2 h-4 w-4" /> },
            ];
        default:
            return [];
    }
};

const UserNav = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10 transition-colors">
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-pink-500 text-white font-semibold">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-64 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl p-2" 
                align="end" 
                forceMount
            >
                <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-gray-200">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-pink-500 text-white font-semibold">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-semibold leading-none text-gray-900">{user.name}</p>
                            <p className="text-xs leading-none text-gray-600">{user.email}</p>
                            <span className="text-xs bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-2 py-1 rounded-full w-fit">
                                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                {roleLinks.map(link => (
                    <DropdownMenuItem 
                        key={link.to} 
                        asChild
                        className="hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 hover:text-blue-700 rounded-lg transition-all duration-300 cursor-pointer"
                    >
                        <Link to={link.to} className="flex items-center gap-2 p-2">
                            {link.icon}
                            <span>{link.text}</span>
                        </Link>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuItem 
                    asChild
                    className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:text-purple-700 rounded-lg transition-all duration-300 cursor-pointer"
                >
                    <Link to="/profile/settings" className="flex items-center gap-2 p-2">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-gradient-to-r from-transparent via-red-300 to-transparent" />
                <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-600 focus:text-red-600 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 rounded-lg transition-all duration-300 cursor-pointer"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const Header = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const navLinkClass = ({ isActive }) => `transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`;
    const roleLinks = isAuthenticated ? getRoleBasedNavLinks(user.role) : [];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex h-16 items-center">
                
                {/* --- DESKTOP NAVIGATION --- */}
                <div className="mr-4 hidden md:flex">
                    <Logo />
                    <nav className="flex items-center space-x-6 text-sm font-medium ml-6">
                        <NavLink to="/courses" className="text-white hover:text-cyan-400 transition-colors duration-300">Courses</NavLink>
                        {roleLinks.map(link => <NavLink key={link.to} to={link.to} className="text-white hover:text-cyan-400 transition-colors duration-300">{link.text}</NavLink>)}
                    </nav>
                </div>

                {/* --- MOBILE NAVIGATION (SHEET) --- */}
                <div className="md:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild><Button variant="ghost" size="icon" className="text-white hover:text-cyan-400"><Menu className="h-6 w-6" /></Button></SheetTrigger>
                        <SheetContent side="left" className="p-0 pt-6 w-72 bg-gradient-to-b from-indigo-900 to-purple-900">
                            <div className="px-6 mb-4"><Logo /></div>
                            <div className="flex flex-col space-y-1 p-4">
                                <NavLink to="/courses" className={navLinkClass} onClick={() => setIsSheetOpen(false)}><Button variant="ghost" className="w-full justify-start text-base text-white hover:text-cyan-400">Courses</Button></NavLink>
                                {roleLinks.map(link => (
                                    <NavLink key={link.to} to={link.to} className={navLinkClass} onClick={() => setIsSheetOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start text-base text-white hover:text-cyan-400">{link.icon} {link.text}</Button>
                                    </NavLink>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    {isAuthenticated ? (
                        <UserNav />
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" asChild className="text-white hover:text-cyan-400 hover:bg-white/10"><Link to="/login">Login</Link></Button>
                            <Button asChild className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white border-0"><Link to="/register">Register</Link></Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;