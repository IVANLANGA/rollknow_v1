import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight, BookOpen, Rocket, FileText } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-32 px-8 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#6b2d8f] via-[#a855f7] to-[#22d3ee] rounded-full blur-[150px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center space-y-12"
        >
          {/* Main CTA */}
          <div className="space-y-6">
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-6xl"
            >
              <span className="bg-gradient-to-r from-white via-[#a855f7] to-white bg-clip-text text-transparent">
                Join the Future of Learning
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Be part of the educational revolution. Transform your classroom with game-based learning and NFC technology.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-6 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-2xl overflow-hidden"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#6b2d8f] via-[#a855f7] to-[#22d3ee] animate-gradient" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#6b2d8f] via-[#a855f7] to-[#22d3ee] opacity-0 group-hover:opacity-100 blur transition-opacity" />
              
              {/* Glow border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#22d3ee] p-[2px] opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-full h-full rounded-2xl bg-transparent" />
              </div>
              
              <span className="relative flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5" />
                View Research
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-[#a855f7]/50 transition-all flex items-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Pilot RollKnow
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-[#a855f7]/50 transition-all flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Read the MSc Proposal
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12"
          >
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl mb-2 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">65%</div>
              <p className="text-sm text-gray-400">Engagement Increase</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl mb-2 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">500+</div>
              <p className="text-sm text-gray-400">Active Students</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-4xl mb-2 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">95%</div>
              <p className="text-sm text-gray-400">Satisfaction Rate</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
