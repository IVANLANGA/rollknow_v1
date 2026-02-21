import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
    value: number;
    max: number;
    className?: string;
    height?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const ProgressBar = ({ value, max, className, height = 'md', showLabel = false }: ProgressBarProps) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const heights = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    };

    return (
        <div className={twMerge(clsx('w-full', className))}>
            {showLabel && (
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{value} / {max} XP</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={clsx('w-full bg-white/5 rounded-full overflow-hidden', heights[height])}>
                <div
                    className="h-full bg-gradient-to-r from-pink-500 to-orange-500 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
