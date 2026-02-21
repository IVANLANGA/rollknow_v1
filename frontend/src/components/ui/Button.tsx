import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0E1125] disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'btn-primary-gradient shadow-lg shadow-pink-500/20',
        secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/5',
        outline: 'border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white',
        ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-8 py-3 text-lg',
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};
