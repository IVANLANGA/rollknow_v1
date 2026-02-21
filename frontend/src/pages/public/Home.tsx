import { ChevronRight, Zap, Shield, Users, Trophy, BookOpen, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-gray-300">New Era of Learning</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Master Skills Through <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 pb-2">
                            Gamified Learning
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
                        The all-in-one platform for educators to create engaging challenges and for students to master skills through practice. Join the revolution in tech education.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/app"
                            className="btn-primary-gradient px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-pink-500/25 flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                            Get Started Free <ChevronRight size={20} />
                        </a>
                        <Link
                            to="/pricing"
                            className="px-8 py-4 rounded-xl text-lg font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm transition-all flex items-center gap-2"
                        >
                            View Pricing
                        </Link>
                    </div>

                    {/* Hero Image / UI Mockup Placeholder */}
                    <div className="mt-20 relative mx-auto max-w-5xl">
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl blur opacity-30" />
                        <div className="relative rounded-2xl border border-white/10 bg-[#0E1125]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
                            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <div className="aspect-video flex items-center justify-center bg-[#0A0C1B]">
                                {/* This would be a screenshot or generated image of the app dashboard */}
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-500/20 to-orange-500/20 flex items-center justify-center mb-4">
                                        <Trophy size={40} className="text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-orange-500" style={{ stroke: 'url(#gradient-stroke)' }} strokeWidth={1.5} />
                                        {/* SVG gradient definition workaround for stroke */}
                                        <svg width="0" height="0">
                                            <linearGradient id="gradient-stroke" x1="100%" y1="100%" x2="0%" y2="0%">
                                                <stop stopColor="#F59E0B" offset="0%" />
                                                <stop stopColor="#EC4899" offset="100%" />
                                            </linearGradient>
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">Interactive Dashboard Preview</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 relative bg-[#0A0C1B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">RollKnow</span>?
                        </h2>
                        <p className="max-w-2xl mx-auto text-gray-400">
                            Transform the way you teach and learn with our comprehensive suite of tools designed for modern technical education.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Target className="w-8 h-8 text-pink-500" />}
                            title="Skill-Based Progression"
                            description="Visual skill trees allow students to track their progress and unlock new abilities as they master concepts."
                        />
                        <FeatureCard
                            icon={<Zap className="w-8 h-8 text-orange-500" />}
                            title="Instant Feedback"
                            description="Get real-time feedback on code submissions and challenges. No more waiting for manual grading."
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-pink-500" />}
                            title="Collaborative Learning"
                            description="Built-in tools for peer review, mentorship, and community engagement."
                        />
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-orange-500" />}
                            title="Secure & Reliable"
                            description="Enterprise-grade security ensures your data and intellectual property are always protected."
                        />
                        <FeatureCard
                            icon={<BookOpen className="w-8 h-8 text-pink-500" />}
                            title="Rich Content"
                            description="Support for interactive tutorials, video lessons, and hands-on coding environments."
                        />
                        <FeatureCard
                            icon={<Trophy className="w-8 h-8 text-orange-500" />}
                            title="Gamification"
                            description="Leaderboards, achievements, and badges keep students motivated and engaged."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[#0E1125]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Streamlined Workflow for <br />
                                <span className="text-pink-500">Educators & Students</span>
                            </h2>
                            <div className="space-y-8">
                                <Step
                                    number="01"
                                    title="Create Organization"
                                    description="Set up your school or bootcamp in minutes. Invite instructors and helpful staff."
                                />
                                <Step
                                    number="02"
                                    title="Design Curriculum"
                                    description="Build skill trees and challenges. define prerequisites and mastery criteria."
                                />
                                <Step
                                    number="03"
                                    title="Start Learning"
                                    description="Students join, solve challenges, and progress through the skill tree."
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full blur-xl opacity-20" />
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0A0C1B] aspect-square flex items-center justify-center p-8">
                                {/* Graphic Placeholder */}
                                <div className="grid grid-cols-2 gap-4 w-full h-full opacity-50">
                                    <div className="bg-pink-500/10 rounded-lg animate-pulse" />
                                    <div className="bg-orange-500/10 rounded-lg animate-pulse delay-75" />
                                    <div className="bg-purple-500/10 rounded-lg animate-pulse delay-150" />
                                    <div className="bg-blue-500/10 rounded-lg animate-pulse delay-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C1B] to-[#0E1125]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-t from-pink-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                        Ready to transform your <br /> learning experience?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Join thousands of students and educators already using RollKnow to master the skills of the future.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="/app" className="btn-primary-gradient px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-orange-500/20 w-full sm:w-auto">
                            Get Started Now
                        </a>
                        <Link to="/contact" className="px-8 py-4 rounded-xl text-lg font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors w-full sm:w-auto">
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Sub-components
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/30 hover:bg-white/10 transition-all group">
        <div className="w-14 h-14 rounded-xl bg-[#0E1125] flex items-center justify-center mb-6 border border-white/5 shadow-lg group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed font-light">{description}</p>
    </div>
);

const Step = ({ number, title, description }: { number: string, title: string, description: string }) => (
    <div className="flex gap-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-full border border-pink-500/30 flex items-center justify-center text-pink-500 font-bold font-mono text-lg">
            {number}
        </div>
        <div>
            <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    </div>
);
