import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { useRef } from "react";

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <motion.div style={{ y }} className="absolute inset-0">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#1a0f2e] to-[#0a0a0f]" />
        
        {/* Floating orbs */}
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
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E042A3] rounded-full blur-[128px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F4C542] rounded-full blur-[128px]"
        />
        
        {/* Particle effects */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Light streaks */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                top: `${20 + i * 15}%`,
                width: "200px",
                left: `-200px`,
              }}
              animate={{
                x: ["0vw", "100vw"],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-6xl mx-auto px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#E042A3] to-[#F4C542] animate-pulse" />
            <span className="text-sm text-gray-300">Next-Generation Learning Platform</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl leading-tight"
          >
            <span className="block text-white mb-4">Game-Enhanced Learning</span>
            <span className="block bg-gradient-to-r from-[#E042A3] via-[#F4C542] to-[#E042A3] bg-clip-text text-transparent">
              for Modern Classrooms.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            RollKnow turns learning into an adventure with <span className="text-[#E042A3]">NFC-enabled dice</span>, 
            dynamic boons, and <span className="text-[#F4C542]">real-time engagement</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-wrap gap-4 justify-center pt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E042A3] to-[#F4C542] text-white shadow-2xl shadow-[#E042A3]/50 hover:shadow-[#E042A3]/70 transition-all flex items-center gap-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#F4C542] to-[#E042A3] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">Get Started</span>
              <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-[#E042A3]/50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              <span>Explore Demo</span>
            </motion.button>
          </motion.div>

          {/* Floating dice visual */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="pt-16"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotateX: [0, 10, 0],
                rotateY: [0, 10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative inline-block"
            >
              {/* Dice glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#E042A3] via-[#F4C542] to-[#E042A3] opacity-50 blur-3xl animate-pulse" />
              
              {/* Dice representation */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                <div className="grid grid-cols-3 gap-2 p-4">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="w-3 h-3 rounded-full bg-gradient-to-br from-[#E042A3] to-[#F4C542]"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-gray-500">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-[#E042A3] to-[#F4C542]"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
