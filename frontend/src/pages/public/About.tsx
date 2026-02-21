import React from 'react';
import { Target, Heart, Globe } from 'lucide-react';

export const About = () => {
    return (
        <div className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
                        Revolutionizing <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Tech Education</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        We are a team of educators, engineers, and designers passionate about making technical skills accessible to everyone through gamified, interactive learning.
                    </p>
                </div>

                {/* Mission / Vision Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <ValueCard
                        icon={<Target className="text-pink-500" size={32} />}
                        title="Our Mission"
                        description="To bridge the gap between theoretical knowledge and practical application through hands-on, verifiable skill building."
                    />
                    <ValueCard
                        icon={<Globe className="text-orange-500" size={32} />}
                        title="Global Impact"
                        description="Empowering students and institutions worldwide with tools that scale education without compromising quality."
                    />
                    <ValueCard
                        icon={<Heart className="text-pink-500" size={32} />}
                        title="Student First"
                        description="Every decision we make starts with the student experience. We believe learning should be engaging, not exhausting."
                    />
                </div>

                {/* Story Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center bg-white/5 rounded-3xl p-8 md:p-16 border border-white/5">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                        <div className="space-y-4 text-gray-400 leading-relaxed">
                            <p>
                                RollKnow started as a small project to help local coding bootcamps track student progress more effectively. The spreadsheets were getting out of hand, and we knew there had to be a better way.
                            </p>
                            <p>
                                What began as a simple tracking tool evolved into a comprehensive learning platform when we realized that gamification and instant feedback were the keys to student retention.
                            </p>
                            <p>
                                Today, we serve thousands of users, helping them unlock their potential and prove their skills to the world.
                            </p>
                        </div>
                    </div>
                    <div className="relative h-[400px] rounded-xl overflow-hidden bg-[#0A0C1B] flex items-center justify-center border border-white/10">
                        {/* Placeholder for team photo or office */}
                        <div className="text-center opacity-50">
                            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full mx-auto mb-4 animate-pulse opacity-50" />
                            <p className="text-gray-500 font-medium">Team Photo Placeholder</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ValueCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-8 rounded-2xl bg-[#0E1125] border border-white/5 hover:border-pink-500/30 transition-colors">
        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);
