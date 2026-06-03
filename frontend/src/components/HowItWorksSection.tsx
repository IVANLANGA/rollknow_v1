import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Dices, Zap, CheckCircle, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Dices,
    title: "Students Roll the Dice",
    description: "Physical NFC-enabled dice are rolled by students during class activities",
    color: "#E042A3",
  },
  {
    icon: Zap,
    title: "System Detects the Result",
    description: "NFC reader instantly captures the dice face and transmits data to the platform",
    color: "#F4C542",
  },
  {
    icon: CheckCircle,
    title: "Instructor Approves/Modifies",
    description: "Educators review the outcome and can apply modifiers or special conditions",
    color: "#6b2d8f",
  },
  {
    icon: Sparkles,
    title: "Boons Apply Instantly",
    description: "Rewards are automatically synced to your LMS, updating student profiles in real-time",
    color: "#22d3ee",
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="how-it-works" ref={ref} className="relative py-32 px-8 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#E042A3]/20 to-[#F4C542]/20 rounded-full blur-[150px]" />
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
            <div className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-sm text-gray-300">Simple Process</span>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-6xl mb-6 text-white">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From dice roll to digital reward in four seamless steps
          </p>
        </motion.div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-20 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#E042A3] via-[#F4C542] to-[#22d3ee] opacity-30" />

            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Step card */}
                  <div className="relative group">
                    {/* Number circle */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl shadow-2xl border-4 border-[#0a0a0f]"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                        }}
                      >
                        {index + 1}
                      </div>
                    </div>

                    <div className="pt-8 p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 min-h-[320px] flex flex-col">
                      {/* Icon */}
                      <div className="mb-6">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                          style={{
                            background: `linear-gradient(135deg, ${step.color}33, ${step.color}11)`,
                          }}
                        >
                          <step.icon className="w-7 h-7" style={{ color: step.color }} />
                        </div>
                      </div>

                      <h3 className="text-xl mb-3 text-white">{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed flex-1">
                        {step.description}
                      </p>

                      {/* Glow effect */}
                      <div
                        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"
                        style={{ background: step.color }}
                      />
                    </div>
                  </div>

                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                      className="absolute top-20 -right-4 z-10"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Flow */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="flex gap-6">
                {/* Step number and line */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                    }}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-full mt-4 bg-gradient-to-b from-white/20 to-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}33, ${step.color}11)`,
                      }}
                    >
                      <step.icon className="w-6 h-6" style={{ color: step.color }} />
                    </div>
                    <h3 className="text-lg mb-2 text-white">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
