import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0E1125]/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-all">
                            R
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Roll<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Know</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-white ${location.pathname === link.path ? 'text-white' : 'text-gray-400'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <a
                            href="/app"
                            className="btn-primary-gradient px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-lg shadow-pink-500/20"
                        >
                            Launch App <ChevronRight size={16} />
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0E1125] border-b border-white/10 animate-in slide-in-from-top-5">
                    <div className="px-4 py-6 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-base font-medium py-2 ${location.pathname === link.path ? 'text-white' : 'text-gray-400'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <a
                            href="/app"
                            className="btn-primary-gradient px-5 py-3 rounded-lg text-center mt-2 flex items-center justify-center gap-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Launch App <ChevronRight size={16} />
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};
