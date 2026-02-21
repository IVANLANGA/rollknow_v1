import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sword, GitGraph, Dices, FileText, User } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
    // Mock user for display - in real app, fetch from auth context
    const user = {
        name: "Scholar",
        level: 5,
        avatar: null
    };

    const navItems = [
        { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
        { name: 'Challenges', path: '/app/challenges', icon: Sword },
        { name: 'Skill Trees', path: '/app/skill-trees', icon: GitGraph },
        { name: 'Roll Sessions', path: '/app/sessions', icon: Dices },
        { name: 'My Submissions', path: '/app/submissions', icon: FileText },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0E1125]/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <img
                            src="https://rollknow.co.za/logo.png"
                            alt="RollKnow Logo"
                            className="h-10 w-auto"
                        />
                        <span className="text-xl font-bold text-white tracking-tight">
                            RollKnow
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        clsx(
                                            'px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors',
                                            isActive
                                                ? 'bg-white/10 text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        )
                                    }
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-medium text-white">{user.name}</span>
                            <span className="text-xs text-orange-400">Level {user.level}</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
