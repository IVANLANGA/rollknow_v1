import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Sparkles } from "lucide-react";

const rarityTiers = [
  {
    rarity: "Common",
    color: "#60a5fa",
    example: "Wildcard Topic",
    description: "Standard rewards for regular participation",
    probability: "60%",
    glow: false,
  },
  {
    rarity: "Rare",
    color: "#f59e0b",
    example: "Participation Boost",
    description: "Enhanced rewards for consistent engagement",
    probability: "25%",
    glow: false,
  },
  {
    rarity: "Epic",
    color: "#a855f7",
    example: "Bonus Assignment Points",
    description: "Premium rewards for exceptional performance",
    probability: "12%",
    glow: false,
  },
  {
    rarity: "Legendary",
    gradient: "linear-gradient(135deg, #fbbf24, #10b981)",
    color: "#fbbf24",
    example: "Final Exam Advantage",
    description: "Ultimate rewards for outstanding achievement",
    probability: "3%",
    glow: true,
  },
];

export function RaritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative py-32 px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#a855f7] rounded-full blur-[128px]" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#f59e0b] rounded-full blur-[128px]" />
        </div>
      </div>

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
            <div className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F4C542]" />
              <span className="text-sm text-gray-300">Reward System</span>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-6xl mb-6">
            <span className="text-white">Boons &</span>{" "}
            <span className="bg-gradient-to-r from-[#E042A3] to-[#F4C542] bg-clip-text text-transparent">
              Rarity Tiers
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A balanced reward system with clear probability distributions and exciting outcomes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rarityTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateY: -10 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative h-full">
                {/* Card */}
                <div className="relative h-full p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden">
                  {/* Rarity badge */}
                  <div className="absolute top-4 right-4">
                    <div
                      className="px-3 py-1 rounded-full text-xs border"
                      style={{
                        background: tier.gradient || `${tier.color}22`,
                        borderColor: `${tier.color}44`,
                        color: tier.color,
                      }}
                    >
                      {tier.probability}
                    </div>
                  </div>

                  {/* Rarity title */}
                  <div className="mb-6 pt-2">
                    <h3
                      className="text-2xl mb-1"
                      style={{
                        background: tier.gradient || tier.color,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {tier.rarity}
                    </h3>
                    <div className="h-1 w-16 rounded-full" style={{ background: tier.gradient || tier.color }} />
                  </div>

                  {/* Example boon */}
                  <div className="mb-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4" style={{ color: tier.color }} />
                      <span className="text-sm text-gray-400">Example Boon</span>
                    </div>
                    <p className="text-white">{tier.example}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    {tier.description}
                  </p>

                  {/* Decorative elements */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  
                  {/* Glow effect for legendary */}
                  {tier.glow && (
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 rounded-3xl blur-xl"
                      style={{ background: tier.gradient }}
                    />
                  )}

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ background: tier.gradient || tier.color }}
                  />
                </div>

                {/* Extra glow for legendary */}
                {tier.glow && (
                  <div className="absolute -inset-2 rounded-3xl opacity-20 blur-2xl -z-10" style={{ background: tier.gradient }} />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10"
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl mb-2 bg-gradient-to-r from-[#E042A3] to-[#F4C542] bg-clip-text text-transparent">100+</div>
                <p className="text-sm text-gray-400">Available Boons</p>
              </div>
              <div>
                <div className="text-3xl mb-2 bg-gradient-to-r from-[#E042A3] to-[#F4C542] bg-clip-text text-transparent">Fair</div>
                <p className="text-sm text-gray-400">Probability System</p>
              </div>
              <div>
                <div className="text-3xl mb-2 bg-gradient-to-r from-[#E042A3] to-[#F4C542] bg-clip-text text-transparent">Custom</div>
                <p className="text-sm text-gray-400">Instructor-Defined Rewards</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
