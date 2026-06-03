import { Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react";

export function Footer() {
  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#" },
      { label: "Demo", href: "#" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "Research Paper", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Blog", href: "#" },
    ],
    company: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Support", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "POPIA Compliance", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  };

  return (
    <footer className="relative py-16 px-8 border-t border-white/10 bg-[#0a0a0f]">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6 group">
              <img 
                src="https://rollknow.co.za/logo.png" 
                alt="RollKnow Logo" 
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
              <div className="flex items-center">
                <span className="text-xl tracking-wider">
                  <span className="text-white">R</span>
                  <span className="text-[#E042A3]">O</span>
                  <span className="text-white">LL</span>
                </span>
                <span className="text-xl tracking-wider italic">
                  <span className="text-white">KN</span>
                  <span className="text-[#F4C542]">O</span>
                  <span className="text-white">W</span>
                </span>
              </div>
            </a>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Game-enhanced learning platform revolutionizing classroom engagement 
              with NFC-enabled dice and real-time LMS integration.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#E042A3]/50 transition-all group"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#E042A3]/50 transition-all group"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#E042A3]/50 transition-all group"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#E042A3]/50 transition-all group"
              >
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#F4C542] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    {link.href.startsWith('http') && (
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#F4C542] transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    {link.href.startsWith('http') && (
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#F4C542] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#F4C542] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © 2025 RollKnow. Research project at North-West University.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Made with</span>
              <span className="inline-block animate-pulse text-[#E042A3]">♥</span>
              <span>for educators</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
