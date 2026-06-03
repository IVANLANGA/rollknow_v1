import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Users, Brain, FileCheck, Layers } from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Increased Participation",
    description: "Game mechanics naturally encourage students to engage more actively in class discussions and activities.",
    stats: "+65%",
    color: "#E042A3",
  },
  {
    icon: Brain,
    title: "Adaptive Learning",
    description: "Personalized boons and challenges adapt to individual student needs and learning paces.",
    stats: "Dynamic",
    color: "#F4C542",
  },
  {
    icon: FileCheck,
    title: "Clear Audit Trails",
    description: "Complete transparency with detailed logs of all dice rolls, boons awarded, and learning outcomes.",
    stats: "100%",
    color: "#6b2d8f",
  },
  {
    icon: Layers,
    title: "Seamless LMS Integration",
    description: "Works with any LTI 1.3 compliant LMS through secure middleware. No complex setup required.",
    stats: "Plug & Play",
    color: "#22d3ee",
  },
];

export function BenefitsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="benefits" ref={ref} className="relative py-32 px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a1f] to-[#0a0a0f]" />

      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#E042A3] rounded-full blur-[128px]"
      />

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
              <span className="text-sm bg-gradient-to-r from-[#E042A3] to-[#F4C542] bg-clip-text text-transparent">
                Impact & Results
              </span>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-6xl mb-6">
            <span className="text-white">Why This</span>{" "}
            <span className="bg-gradient-to-r from-[#E042A3] to-[#F4C542] bg-clip-text text-transparent">
              Matters
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real benefits that transform learning experiences for students and educators
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="relative h-full p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                  style={{
                    background: `linear-gradient(90deg, ${benefit.color}, ${benefit.color}80)`,
                  }}
                />

                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div
                        className="absolute inset-0 blur-2xl opacity-30 rounded-full"
                        style={{ background: benefit.color }}
                      />
                      <div
                        className="relative w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${benefit.color}33, ${benefit.color}11)`,
                        }}
                      >
                        <benefit.icon className="w-8 h-8" style={{ color: benefit.color }} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl text-white">{benefit.title}</h3>
                      <div
                        className="px-4 py-1.5 rounded-full text-sm border"
                        style={{
                          background: `${benefit.color}11`,
                          borderColor: `${benefit.color}33`,
                          color: benefit.color,
                        }}
                      >
                        {benefit.stats}
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                  style={{ background: benefit.color }}
                />

                {/* Corner decoration */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 relative"
        >
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#E042A3]/20 via-[#F4C542]/20 to-[#E042A3]/20 backdrop-blur-sm border border-white/10 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h3 className="text-2xl md:text-3xl text-white">
                Ready to Transform Your Classroom?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Join hundreds of educators who are already using RollKnow to create 
                more engaging, effective, and memorable learning experiences.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <button className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#E042A3] to-[#F4C542] text-white hover:shadow-lg hover:shadow-[#E042A3]/50 transition-all hover:scale-105">
                  Start Free Trial
                </button>
                <button className="px-8 py-3 rounded-2xl bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
