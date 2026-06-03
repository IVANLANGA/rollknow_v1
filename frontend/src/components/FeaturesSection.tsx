import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Zap, Dices, LayoutDashboard, Scale } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Dynamic Classroom Engagement",
    description: "Students roll physical dice → instructors trigger interactive boons that transform passive learning into active participation.",
    gradient: "from-[#E042A3] to-[#F4C542]",
  },
  {
    icon: Dices,
    title: "NFC-Enabled Dice",
    description: "Each dice face links to digital rules and rewards. Simply tap to activate game mechanics in your classroom.",
    gradient: "from-[#F4C542] to-[#E042A3]",
  },
  {
    icon: LayoutDashboard,
    title: "Instructor Dashboard",
    description: "Real-time controls, dice editing, session creation. Complete oversight with intuitive management tools.",
    gradient: "from-[#6b2d8f] to-[#E042A3]",
  },
  {
    icon: Scale,
    title: "Fair, Transparent Reward Logic",
    description: "Rarity weights ensure balanced gameplay: Common, Rare, Epic, and Legendary tiers with clear probability distributions.",
    gradient: "from-[#22d3ee] to-[#F4C542]",
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="features" ref={ref} className="relative py-32 px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a1f] to-[#0a0a0f]" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
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
              <span className="text-sm bg-gradient-to-r from-[#E042A3] to-[#F4C542] bg-clip-text text-transparent">
                What is RollKnow?
              </span>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-6xl mb-6">
            <span className="bg-gradient-to-r from-[#E042A3] to-[#F4C542] bg-clip-text text-transparent">
              Transform Your Classroom
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive game-enhanced learning platform that bridges physical interaction with digital engagement
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                {/* Top gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r ${feature.gradient}`} />
                
                {/* Icon */}
                <div className="mb-6 relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-20 blur-2xl rounded-full`} />
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-xl mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Corner shine */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional info card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#E042A3]/10 via-[#F4C542]/10 to-[#E042A3]/10 backdrop-blur-sm border border-white/10"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl mb-4 text-white">
              Seamless Integration, Powerful Results
            </h3>
            <p className="text-gray-300 leading-relaxed">
              RollKnow works with your existing LMS through secure middleware, ensuring data privacy 
              while delivering engaging, measurable learning outcomes that educators and students love.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
