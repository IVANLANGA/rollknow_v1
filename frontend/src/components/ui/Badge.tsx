import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'success' | 'warning' | 'error' | 'research' | 'collaboration' | 'creation';
    className?: string;
    size?: 'sm' | 'md';
}

export const Badge = ({ children, variant = 'default', className, size = 'md' }: BadgeProps) => {
    const variants = {
        default: 'bg-white/10 text-white',
        outline: 'border border-white/20 text-gray-300',
        success: 'bg-green-500/20 text-green-400 border border-green-500/20',
        warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20',
        error: 'bg-red-500/20 text-red-400 border border-red-500/20',
        research: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20',
        collaboration: 'bg-teal-500/20 text-teal-400 border border-teal-500/20',
        creation: 'bg-purple-500/20 text-purple-400 border border-purple-500/20',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span className={twMerge(clsx('inline-flex items-center rounded-full font-medium', variants[variant], sizes[size], className))}>
            {children}
        </span>
    );
};
