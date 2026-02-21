import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-[#0A0C1B] border-t border-white/5 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/20">
                                R
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Roll<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Know</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            The next-generation learning platform for the digital age. Gamified, interactive, and designed for educators and students alike.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Twitter size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Github size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Linkedin size={16} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/#features" className="hover:text-pink-500 transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-pink-500 transition-colors">Pricing</Link></li>
                            <li><Link to="/#how-it-works" className="hover:text-pink-500 transition-colors">How it works</Link></li>
                            <li><a href="/app" className="hover:text-pink-500 transition-colors">Launch App</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/about" className="hover:text-pink-500 transition-colors">About Us</Link></li>
                            <li><a href="#" className="hover:text-pink-500 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-pink-500 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-pink-500 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-pink-500 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-pink-500 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-pink-500 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} RollKnow. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
