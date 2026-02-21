import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { gamificationService } from '../../services/api';
import { Flame, Star, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
    // Use data from API or fallback to mock if API fails/is mocked
    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: gamificationService.getProfile,
        // Provide initial mock data for visualization if backend isn't running
        initialData: {
            id: '1',
            name: 'Scholar',
            level: 5,
            xp: 1250,
            next_level_xp: 2000,
            current_streak: 3,
            longest_streak: 12,
            skills: {
                research: 65,
                collaboration: 40,
                creation: 80
            }
        }
    });

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">{profile?.name || 'Scholar'}</span>!
                    </h1>
                    <p className="text-gray-400">Ready to continue your learning journey?</p>
                </div>
                <Link to="/app/challenges">
                    <Button size="lg" className="w-full md:w-auto">
                        Explore Challenges <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* XP Progress Card */}
                <Card className="col-span-1 md:col-span-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/20">
                                    {profile?.level}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Current Level</h3>
                                    <p className="text-sm text-gray-400">Scholar</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-white">{profile?.xp}</span>
                                <span className="text-gray-400 mx-1">/</span>
                                <span className="text-gray-400">{profile?.next_level_xp} XP</span>
                            </div>
                        </div>

                        <ProgressBar value={profile?.xp || 0} max={profile?.next_level_xp || 100} height="lg" showLabel />

                        <p className="mt-4 text-sm text-gray-400">
                            You're <span className="text-white font-medium">{profile ? profile.next_level_xp - profile.xp : 0} XP</span> away from Level {profile ? profile.level + 1 : 1}. Keep it up!
                        </p>
                    </div>
                </Card>

                {/* Streak Card */}
                <Card className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                        <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{profile?.current_streak} Days</h3>
                    <p className="text-gray-400 text-sm">Current Streak</p>
                    <div className="mt-4 text-xs bg-white/5 rounded-full px-3 py-1 text-gray-400">
                        Best: <span className="text-white">{profile?.longest_streak} days</span>
                    </div>
                </Card>
            </div>

            {/* Skill Proficiency */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Skill Proficiency</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card hoverEffect>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded bg-indigo-500/20 text-indigo-400">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-white">Research</h3>
                        </div>
                        <ProgressBar value={profile?.skills.research || 0} max={100} className="mb-2" />
                        <span className="text-sm text-gray-400">{profile?.skills.research}% Mastery</span>
                    </Card>

                    <Card hoverEffect>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded bg-teal-500/20 text-teal-400">
                                <Star className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-white">Collaboration</h3>
                        </div>
                        <ProgressBar value={profile?.skills.collaboration || 0} max={100} className="mb-2" />
                        <span className="text-sm text-gray-400">{profile?.skills.collaboration}% Mastery</span>
                    </Card>

                    <Card hoverEffect>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded bg-purple-500/20 text-purple-400">
                                <Flame className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-white">Creation</h3>
                        </div>
                        <ProgressBar value={profile?.skills.creation || 0} max={100} className="mb-2" />
                        <span className="text-sm text-gray-400">{profile?.skills.creation}% Mastery</span>
                    </Card>
                </div>
            </div>
        </div>
    );
};
