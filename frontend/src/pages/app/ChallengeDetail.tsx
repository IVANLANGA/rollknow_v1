import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gamificationService } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, CheckCircle, Target, Clock, Zap } from 'lucide-react';
import type { Challenge } from '../../types';

export const ChallengeDetail = () => {
    const { id } = useParams();

    const { data: challenge } = useQuery({
        queryKey: ['challenge', id],
        queryFn: () => gamificationService.getChallengeById(id!),
        initialData: {
            id: '1',
            title: 'Quantum Mechanics Basics',
            description: 'Research the fundamental principles of quantum mechanics and explain the double-slit experiment.',
            rarity: 'Common',
            skill_tree: 'Research',
            estimated_hours: 2,
            xp_reward: 100,
            objectives: [
                'Define wave-particle duality',
                'Explain superposition',
                'Summarize the observer effect'
            ],
            success_criteria: [
                '500-word essay',
                'Accurate diagrams'
            ],
            status: 'available'
        } as Challenge
    });

    if (!challenge) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Link to="/app/challenges" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Catalogue
            </Link>

            <div className="flex gap-3 mb-2">
                <Badge variant="default" className="uppercase tracking-wider text-xs px-3">{challenge.rarity}</Badge>
                <Badge variant="research" className="text-xs px-3">{challenge.skill_tree}</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{challenge.title}</h1>

            <Card className="bg-white/5 border-white/10 p-8">
                <p className="text-lg text-gray-300 leading-relaxed">
                    {challenge.description}
                </p>
            </Card>

            {/* Objectives */}
            <Card>
                <div className="flex items-center gap-2 mb-6 text-pink-500">
                    <Target className="w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">Objectives</h2>
                </div>
                <div className="space-y-4">
                    {challenge.objectives.map((obj, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-pink-500 font-bold border border-white/10">
                                {i + 1}
                            </div>
                            <p className="text-gray-300 pt-1">{obj}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Success Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <div className="flex items-center gap-2 mb-6 text-green-400">
                        <CheckCircle className="w-6 h-6" />
                        <h2 className="text-xl font-bold text-white">Success Criteria</h2>
                    </div>
                    <div className="space-y-3">
                        {challenge.success_criteria.map((crit, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-gray-300">{crit}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Rewards and Action */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-[#0E1125] to-[#1a1f3d] border-white/10">
                        <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-4">Rewards</h3>
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex items-center gap-2 text-yellow-500 font-bold text-3xl">
                                <Zap className="w-8 h-8 fill-yellow-500" />
                                {challenge.xp_reward} XP
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="w-4 h-4" />
                                {challenge.estimated_hours} Hours
                            </div>
                        </div>
                    </Card>

                    <Button size="lg" className="w-full text-lg shadow-xl shadow-pink-500/20 py-4">
                        Accept Challenge
                    </Button>
                </div>
            </div>
        </div>
    );
};
