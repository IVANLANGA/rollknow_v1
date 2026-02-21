import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wsService } from '../../services/websocket';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Dices, ArrowLeft, Users } from 'lucide-react';
import type { DiceRoll } from '../../types';

export const RollSessionDetail = () => {
    const { id } = useParams();
    const [isConnected, setIsConnected] = useState(false);
    const [rolls, setRolls] = useState<DiceRoll[]>([]);
    const [isRolling, setIsRolling] = useState(false);
    const [result, setResult] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            wsService.connect(id);
            setIsConnected(true);

            wsService.on('dice_rolled', (data: DiceRoll) => {
                setRolls(prev => [data, ...prev]);
                if (data.user_name === 'You') { // Logic to identify self needs user ID compare in real app
                    setResult(data.value);
                    setIsRolling(false);
                }
            });
        }

        return () => {
            wsService.disconnect();
            setIsConnected(false);
        };
    }, [id]);

    const handleRoll = () => {
        setIsRolling(true);
        // Simulate immediately for UI, wait for socket for real data
        setTimeout(() => {
            const val = Math.ceil(Math.random() * 20); // D20
            setResult(val);
            setIsRolling(false);
            setRolls(prev => [{
                id: Date.now().toString(),
                user_name: 'You',
                value: val,
                timestamp: new Date().toISOString()
            }, ...prev]);
            wsService.rollDice(); // Send to server
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 text-center">
            <div className="flex items-center justify-between pointer-events-none">
                <Link to="/app/sessions" className="text-gray-400 hover:text-white flex items-center text-sm pointer-events-auto transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sessions
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-500 font-bold text-xs tracking-wider uppercase">Live Session</span>
                </div>
            </div>

            <div className="text-left">
                <h1 className="text-4xl font-bold text-white mb-2">Morning Flow Session</h1>
            </div>

            <Card className="py-20 flex flex-col items-center justify-center bg-[#151932] border-white/5 relative overflow-hidden shadow-2xl">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className={`w-40 h-40 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-6xl text-white font-bold mb-8 shadow-2xl backdrop-blur-sm transition-all duration-500 ${isRolling ? 'animate-bounce' : ''}`}>
                    {result ? result : <Dices className="w-16 h-16 text-gray-500" />}
                </div>

                <h2 className="text-3xl font-bold text-white mb-8">
                    {result ? `You rolled a ${result}!` : 'Ready to Roll?'}
                </h2>

                <Button
                    className="w-64 h-16 text-xl font-bold rounded-full shadow-lg shadow-pink-500/20 bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90 transition-all transform hover:scale-105"
                    onClick={handleRoll}
                    disabled={isRolling}
                >
                    {isRolling ? 'ROLLING...' : 'ROLL DICE'}
                </Button>
            </Card>

            {/* Participants / History Area (Placeholder) */}
            <div className="pt-8 border-t border-white/5">
                <h3 className="text-gray-400 text-sm uppercase font-bold tracking-wider mb-4">Live Activity</h3>
                <div className="space-y-3">
                    {rolls.length === 0 ? (
                        <p className="text-gray-600 italic">Waiting for rolls...</p>
                    ) : (
                        rolls.map((roll) => (
                            <div key={roll.id} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
                                        {roll.user_name.charAt(0)}
                                    </div>
                                    <span className="text-white font-medium">{roll.user_name}</span>
                                </div>
                                <span className="text-pink-400 font-bold">Rolled {roll.value}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
