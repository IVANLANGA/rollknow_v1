import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Clock, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RollSessions = () => {
    return (
        <div className="space-y-8">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">Roll Session</h1>
                <p className="text-gray-400">Join active sessions, roll the dice, and unlock your next quest.</p>
            </div>

            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <UsersIcon className="w-5 h-5 text-pink-500" /> Available Sessions
                </h2>

                <div className="space-y-4">
                    <Card className="flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white-[0.07] transition-colors">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">Morning Flow Session</h3>
                                <Badge variant="success" size="sm" className="uppercase tracking-wider font-bold">Active</Badge>
                            </div>
                            <p className="text-gray-400 mb-2">Focus on guard retention and transitions.</p>
                        </div>
                        <Link to="/app/sessions/1">
                            <Button className="w-full md:w-auto min-w-[140px]">Join Session <ChevronRight className="w-4 h-4 ml-1" /></Button>
                        </Link>
                    </Card>

                    <Card className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-80">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">Technique Workshop</h3>
                                <Badge variant="default" className="text-blue-400 bg-blue-500/20 border-blue-500/20 uppercase text-xs font-bold">Upcoming</Badge>
                            </div>
                            <p className="text-gray-400 mb-2">Deep dive into back takes and control.</p>
                            <div className="flex items-center text-sm text-blue-400">
                                <Clock className="w-3 h-3 mr-1.5" /> Starts at 2:00 PM
                            </div>
                        </div>
                        <Button variant="secondary" disabled className="w-full md:w-auto min-w-[140px]">Wait for Start</Button>
                    </Card>

                    <Card className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-50">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">Friday Night Rolls</h3>
                                <Badge variant="outline" className="uppercase text-xs font-bold">Completed</Badge>
                            </div>
                            <p className="text-gray-400 mb-2">Live rolling and situational sparring.</p>
                        </div>
                        <Button variant="secondary" disabled className="w-full md:w-auto min-w-[140px]">View Summary</Button>
                    </Card>
                </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10">
                <div className="flex items-center gap-3 text-pink-500 mb-4">
                    <TargetIcon className="w-5 h-5" />
                    <h3 className="font-bold text-white">Your Progress</h3>
                </div>
                <div className="flex justify-between text-sm text-gray-400 uppercase tracking-wider font-bold mb-2">
                    <span>Level 5 Scholar</span>
                    <span>1,250 / 2,000 XP</span>
                </div>
                <ProgressBar value={1250} max={2000} height="md" />
            </div>
        </div>
    );
};

const UsersIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);
