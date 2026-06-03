import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useRef } from "react";
import { BookOpen, Target, Users, TrendingUp } from "lucide-react";

const researchPoints = [
  {
    icon: BookOpen,
    title: "DSR 3-Cycle Model",
    description: "Design Science Research methodology ensures rigorous academic foundation with relevance, rigor, and design cycles.",
  },
  {
    icon: Target,
    title: "PIAA, PADA, PNDA Principles",
    description: "Principle of Invention and Adaptation (PIAA), Principle of Abstraction and Design Articulation (PADA), and Principle of Non-Determinism (PNDA) guide our approach.",
  },
  {
    icon: Users,
    title: "User Survey & Analysis",
    description: "Comprehensive user surveys with students and lecturers provide empirical evidence for effectiveness.",
  },
  {
    icon: TrendingUp,
    title: "Log Analysis & Metrics",
    description: "Real-time analytics and engagement tracking validate learning outcomes and student progress.",
  },
];

export function ResearchSection() {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const isInView = useInView(rightRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="relative py-32 px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6b2d8f]/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left panel - sticky */}
          <motion.div
            ref={leftRef}
            style={{ y: leftY }}
            className="lg:sticky lg:top-32"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl mb-6">
                <span className="bg-gradient-to-r from-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">
                  Grounded in Design Science Research
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                RollKnow is built on a foundation of rigorous academic research, combining multiple theoretical frameworks.
              </p>

              {/* Research frameworks */}
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <h4 className="text-lg text-white mb-2">Self-Determination Theory (SDT)</h4>
                  <p className="text-gray-400">Enhances intrinsic motivation through autonomy, competence, and relatedness.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <h4 className="text-lg text-white mb-2">Technology Acceptance Model (TAM)</h4>
                  <p className="text-gray-400">Ensures ease of use and perceived usefulness drive adoption.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <h4 className="text-lg text-white mb-2">Design Science Research (DSR)</h4>
                  <p className="text-gray-400">Systematic approach to creating innovative IT artifacts.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right panel - scrolling content */}
          <div ref={rightRef} className="space-y-8">
            {researchPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative"
              >
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-[#a855f7]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#a855f7]/20">
                  {/* Icon */}
                  <div className="flex items-start gap-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7] to-[#22d3ee] opacity-20 blur-xl rounded-full" />
                      <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#6b2d8f] to-[#a855f7] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <point.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl mb-3 text-white">{point.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{point.description}</p>
                    </div>
                  </div>

                  {/* Accent line */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#a855f7] to-[#22d3ee] rounded-l-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}

            {/* Citation card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-[#6b2d8f]/20 to-transparent border border-[#a855f7]/30"
            >
              <p className="text-gray-300 italic mb-4">
                "Game-based learning interventions have been shown to increase student engagement by up to 65% while improving knowledge retention and academic performance."
              </p>
              <p className="text-sm text-gray-500">— Educational Technology Research, 2024</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
