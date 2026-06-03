import { motion, useScroll, useTransform } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(10, 10, 15, 0)", "rgba(10, 10, 15, 0.95)"]
  );

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Benefits", href: "#benefits" },
    { label: "Educators", href: "#educators" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <motion.nav
      style={{ backgroundColor }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-xl border-b border-white/10 shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <img 
              src="https://rollknow.co.za/logo.png" 
              alt="RollKnow Logo" 
              className="h-12 w-auto transition-transform group-hover:scale-105"
            />
            <div className="flex items-center">
              <span className="text-2xl font-bold tracking-wider">
                <span className="text-white">R</span>
                <span className="text-[#E042A3]">O</span>
                <span className="text-white">LL</span>
              </span>
              <span className="text-2xl font-bold tracking-wider italic">
                <span className="text-white">KN</span>
                <span className="text-[#F4C542]">O</span>
                <span className="text-white">W</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E042A3] to-[#F4C542] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E042A3] to-[#F4C542] text-white hover:shadow-lg hover:shadow-[#E042A3]/50 transition-all hover:scale-105">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pt-4 pb-2"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E042A3] to-[#F4C542] text-white">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
