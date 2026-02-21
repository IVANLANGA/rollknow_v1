import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export const MySubmissions = () => {
    const [activeTab, setActiveTab] = useState<'Active' | 'Pending' | 'Completed'>('Active');

    const tabs = [
        { id: 'Active', label: 'Active', icon: PlayCircle },
        { id: 'Pending', label: 'Pending Review', icon: Clock },
        { id: 'Completed', label: 'Completed', icon: CheckCircle },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Submissions</h1>
                <p className="text-gray-400">Track your progress and review instructor feedback.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-white/5 rounded-full w-fit border border-white/5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={clsx(
                            'flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all',
                            activeTab === tab.id
                                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/25'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {activeTab === 'Active' && (
                    <Card className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="research" size="sm">Research</Badge>
                                <span className="text-gray-500 text-sm">Started Jan 12, 2026</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Advanced Guard Retention</h3>
                            <div className="flex items-center text-yellow-500 text-sm font-bold">
                                <span className="mr-1">★</span> 500 XP
                            </div>
                        </div>
                        <Link to="/app/challenges/1">
                            <Button className="w-full md:w-auto min-w-[140px]">Continue</Button>
                        </Link>
                    </Card>
                )}

                {activeTab === 'Pending' && (
                    <div className="text-center py-12 text-gray-500">No pending submissions.</div>
                )}

                {activeTab === 'Completed' && (
                    <div className="text-center py-12 text-gray-500">No completed submissions yet.</div>
                )}
            </div>
        </div>
    );
};
