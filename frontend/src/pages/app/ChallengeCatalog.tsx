import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { gamificationService } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, Clock, Zap, Lock } from 'lucide-react';
import type { Challenge } from '../../types';

export const ChallengeCatalog = () => {
    const [filter, setFilter] = useState<string>('All');
    const [search, setSearch] = useState('');

    const { data: challenges, isLoading } = useQuery({
        queryKey: ['challenges'],
        queryFn: () => gamificationService.getChallenges(),
        initialData: [
            {
                id: '1',
                title: 'Quantum Mechanics Basics',
                description: 'Research the fundamental principles of quantum mechanics and explain the double-slit experiment.',
                rarity: 'Common',
                skill_tree: 'Research',
                estimated_hours: 2,
                xp_reward: 100,
                objectives: [],
                success_criteria: [],
                status: 'available'
            },
            {
                id: '2',
                title: 'Collaborative Art Mural',
                description: "Work with 2 other students to design a digital mural representing 'Future of Education'.",
                rarity: 'Uncommon',
                skill_tree: 'Collaboration',
                estimated_hours: 5,
                xp_reward: 350,
                objectives: [],
                success_criteria: [],
                status: 'available'
            },
            {
                id: '3',
                title: 'Build a React Component',
                description: 'Create a reusable button component with 3 variants.',
                rarity: 'Legendary',
                skill_tree: 'Creation',
                estimated_hours: 8,
                xp_reward: 800,
                objectives: [],
                success_criteria: [],
                status: 'locked'
            },
            {
                id: '4',
                title: 'Historical Analysis: Rome',
                description: 'Analyze the fall of the Roman Empire and its economic causes.',
                rarity: 'Uncommon',
                skill_tree: 'Research',
                estimated_hours: 4,
                xp_reward: 250,
                objectives: [],
                success_criteria: [],
                status: 'available'
            }
        ] as Challenge[]
    });

    const filteredChallenges = challenges?.filter(c => {
        const matchesFilter = filter === 'All' || c.rarity === filter;
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'Legendary': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
            case 'Rare': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
            case 'Uncommon': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
            default: return 'text-gray-300 border-gray-500/30 bg-gray-500/10';
        }
    };

    const getSkillBadgeVariant = (skill: string) => {
        switch (skill) {
            case 'Research': return 'research';
            case 'Collaboration': return 'collaboration';
            case 'Creation': return 'creation';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">Challenge Catalogue</h1>
                <p className="text-gray-400">Browse available quests to improve your skills and earn rewards.</p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search challenges..."
                        className="w-full bg-[#0E1125]/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {['All', 'Common', 'Uncommon', 'Legendary'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filter === f
                                ? 'bg-white text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredChallenges?.map((challenge) => (
                    <Link key={challenge.id} to={`/app/challenges/${challenge.id}`}>
                        <Card hoverEffect className="h-full flex flex-col relative group overflow-hidden">
                            {challenge.status === 'locked' && (
                                <div className="absolute inset-0 bg-[#0E1125]/80 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center">
                                    <Lock className="w-12 h-12 text-gray-500 mb-2" />
                                    <span className="font-bold text-gray-400 tracking-widest">LOCKED</span>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded border uppercase tracking-wider ${getRarityColor(challenge.rarity)}`}>
                                    {challenge.rarity}
                                </span>
                                <Badge variant={getSkillBadgeVariant(challenge.skill_tree)}>
                                    {challenge.skill_tree}
                                </Badge>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-orange-500 transition-colors">
                                {challenge.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-6 flex-grow">
                                {challenge.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center text-gray-400 text-sm">
                                    <Clock className="w-4 h-4 mr-1.5" />
                                    {challenge.estimated_hours} hours
                                </div>
                                <div className="flex items-center text-yellow-500 font-bold text-sm">
                                    <Zap className="w-4 h-4 mr-1.5 fill-yellow-500" />
                                    {challenge.xp_reward} XP
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};
