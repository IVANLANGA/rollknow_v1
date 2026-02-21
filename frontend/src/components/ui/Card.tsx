import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const Card = ({ children, className, hoverEffect = false, ...props }: CardProps) => {
    return (
        <div
            className={twMerge(
                clsx(
                    'glass-card p-6 transition-all duration-300',
                    hoverEffect && 'hover:bg-white/10 hover:shadow-lg hover:-translate-y-1',
                    className
                )
            )}
            {...props}
        >
            {children}
        </div>
    );
};
