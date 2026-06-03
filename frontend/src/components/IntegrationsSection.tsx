import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Lock, Zap, CheckCircle } from "lucide-react";

const integrations = [
  {
    name: "Canvas LMS",
    description: "Full integration with Instructure Canvas",
    logo: "C",
    color: "#6366f1",
  },
  {
    name: "Moodle",
    description: "Seamless connection to Moodle platform",
    logo: "M",
    color: "#f59e0b",
  },
  {
    name: "Brightspace",
    description: "Compatible with D2L Brightspace",
    logo: "D2L",
    color: "#10b981",
  },
  {
    name: "Blackboard",
    description: "Works with Blackboard Learn",
    logo: "B",
    color: "#8b5cf6",
  },
  {
    name: "Sakai",
    description: "Integration with Sakai CLE",
    logo: "S",
    color: "#ec4899",
  },
  {
    name: "LTI 1.3",
    description: "Any LTI 1.3 compliant system",
    logo: "LTI",
    color: "#06b6d4",
  },
];

const features = [
  {
    icon: Lock,
    title: "Secure Middleware",
    description: "Enterprise-grade encryption and data protection",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description: "Instant updates across all platforms",
  },
  {
    icon: CheckCircle,
    title: "Easy Setup",
    description: "Deploy in minutes with guided configuration",
  },
];

export function IntegrationsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative py-32 px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a1f] to-[#0a0a0f]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-6"
          >
            <div className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-sm text-gray-300">Seamless Integration</span>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-6xl mb-6 text-white">
            Works With Your LMS
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Works with your existing LMS through secure middleware
          </p>
        </motion.div>

        {/* Integration cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 text-center">
                {/* Logo/Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div
                      className="absolute inset-0 blur-2xl opacity-30 rounded-full"
                      style={{ background: integration.color }}
                    />
                    <div
                      className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${integration.color}, ${integration.color}dd)`,
                      }}
                    >
                      {integration.logo}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl mb-3 text-white">{integration.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {integration.description}
                </p>

                {/* Connected badge */}
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-gray-400">Supported</span>
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                  style={{ background: integration.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-white/80" />
              </div>
              <div>
                <h4 className="text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom info card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl mb-4 text-white">Custom Integration Needed?</h3>
            <p className="text-gray-300 mb-6">
              Our team can help integrate RollKnow with your specific learning management system. 
              Contact us to discuss your requirements.
            </p>
            <button className="px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-lg transition-all hover:scale-105">
              Contact Integration Team
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
