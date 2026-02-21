import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Microscope, Users, Palette, Lock, Crown, GraduationCap, Star } from 'lucide-react';
import clsx from 'clsx';

const Tiers = [
    { id: 'master', name: 'Master', points: '500+', icon: Crown, bonus: '+50% XP bonus', locked: true },
    { id: 'expert', name: 'Expert', points: '300-499', icon: GraduationCap, bonus: '+30% XP bonus', locked: true },
    { id: 'adept', name: 'Adept', points: '150-299', icon: Star, bonus: '+20% XP bonus', locked: false, current: true },
    { id: 'apprentice', name: 'Apprentice', points: '0-149', icon: Star, bonus: 'Base XP', locked: false, completed: true },
];

export const SkillTrees = () => {
    const [activeTab, setActiveTab] = useState<'Research' | 'Collaboration' | 'Creation'>('Research');

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Skill Mastery</h1>
                <p className="text-gray-400">Your specialization determines bonuses, unlocks, and abilities</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center border-b border-white/10">
                {[
                    { name: 'Research', icon: Microscope },
                    { name: 'Collaboration', icon: Users },
                    { name: 'Creation', icon: Palette }
                ].map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name as any)}
                        className={clsx(
                            'px-8 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2',
                            activeTab === tab.name
                                ? 'border-pink-500 text-white'
                                : 'border-transparent text-gray-500 hover:text-gray-300'
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Hero Tree Header */}
            <div className="flex items-center gap-4">
                <div className={clsx("p-3 rounded-lg bg-white/5 border border-white/10",
                    activeTab === 'Research' ? 'text-indigo-400' :
                        activeTab === 'Collaboration' ? 'text-teal-400' : 'text-purple-400'
                )}>
                    {activeTab === 'Research' && <Microscope className="w-6 h-6" />}
                    {activeTab === 'Collaboration' && <Users className="w-6 h-6" />}
                    {activeTab === 'Creation' && <Palette className="w-6 h-6" />}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">{activeTab} Tree</h2>
                    <p className="text-sm text-gray-400">Adept • 187 points</p>
                </div>
            </div>

            {/* Vertical Timeline */}
            <div className="relative space-y-6 pl-4">
                {/* Connecting Line */}
                <div className="absolute left-[3.25rem] top-8 bottom-12 w-0.5 bg-gradient-to-b from-pink-500 to-white/10 -z-10" />

                {Tiers.map((tier) => (
                    <div key={tier.id} className="relative">
                        <Card
                            className={clsx(
                                "relative ml-16 transition-all border group",
                                tier.current
                                    ? "border-pink-500 bg-[#0E1125] shadow-[0_0_30px_-10px_rgba(236,72,153,0.3)]"
                                    : "border-white/5 hover:border-white/10 bg-[#0E1125]",
                                tier.locked && "opacity-60 grayscale"
                            )}
                        >
                            {/* Connector Dot on Left */}
                            <div className={clsx(
                                "absolute -left-[3.25rem] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 flex items-center justify-center z-10 bg-[#0E1125]",
                                tier.current ? "border-pink-500 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]" :
                                    tier.completed ? "border-pink-500 text-pink-500" : "border-white/10 text-gray-600"
                            )}>
                                {tier.completed || tier.current ? <div className="w-2.5 h-2.5 rounded-full bg-pink-500" /> : <div className="w-2 h-2 rounded-full bg-gray-700" />}
                            </div>

                            <div className="flex items-start gap-5">
                                <div className={clsx(
                                    "p-3 rounded-xl flex-shrink-0 transition-colors",
                                    tier.id === 'master' ? 'text-yellow-500 bg-yellow-500/10' :
                                        tier.id === 'expert' ? 'text-purple-400 bg-purple-500/10' :
                                            'text-blue-400 bg-blue-500/10'
                                )}>
                                    <tier.icon className="w-6 h-6" />
                                </div>

                                <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className={clsx("text-lg font-bold", tier.current ? "text-white" : "text-gray-300")}>{tier.name}</h3>
                                        {tier.locked && <Lock className="w-4 h-4 text-gray-600" />}
                                    </div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{tier.points} POINTS</p>
                                    <p className="text-gray-400 text-sm">{tier.bonus}</p>

                                    {tier.current && (
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs mb-2 font-medium">
                                                <span className="text-pink-400">187 / 299 XP</span>
                                                <span className="text-gray-400">63%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-pink-500 to-orange-500 w-[63%] shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};
