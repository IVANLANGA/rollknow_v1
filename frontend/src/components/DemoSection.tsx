import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Play, Monitor, Smartphone } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function DemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative py-32 px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#6b2d8f] via-[#a855f7] to-[#22d3ee] rounded-full blur-[150px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-6">
            <span className="bg-gradient-to-r from-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">
              See RollKnow in Action
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience how NFC dice and game mechanics transform learning
          </p>
        </motion.div>

        {/* Video placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-16"
        >
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-[#6b2d8f]/30">
            {/* Video thumbnail */}
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1762279389042-9439bfb6c155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwdGVjaG5vbG9neSUyMGFic3RyYWN0fGVufDF8fHx8MTc2NDE0MDYwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="RollKnow demo video"
              className="w-full h-full object-cover"
            />

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm group hover:bg-black/30 transition-all cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#6b2d8f] to-[#a855f7] rounded-full blur-2xl opacity-50" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-[#6b2d8f] to-[#a855f7] flex items-center justify-center shadow-2xl">
                  <Play className="w-10 h-10 text-white ml-1" fill="white" />
                </div>
              </motion.div>
            </div>

            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#a855f7] via-[#22d3ee] to-[#a855f7] opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
          </div>
        </motion.div>

        {/* Device mockups */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Desktop mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Monitor className="w-6 h-6 text-[#a855f7]" />
                <h3 className="text-xl text-white">Desktop Experience</h3>
              </div>
              
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a24]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1648747067003-0e4660db791f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZWR1Y2F0aW9uJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjQwNTI1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Desktop interface"
                  className="w-full h-full object-cover opacity-80"
                />
                
                {/* Interface overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-sm text-white">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span>Live Session</span>
                  </div>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
                  Full dashboard with analytics
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
                  Real-time student engagement tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
                  LMS integration panel
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Mobile mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Smartphone className="w-6 h-6 text-[#22d3ee]" />
                <h3 className="text-xl text-white">Mobile Experience</h3>
              </div>
              
              <div className="relative max-w-[300px] mx-auto">
                <div className="aspect-[9/19] rounded-[2.5rem] overflow-hidden border-[8px] border-white/20 bg-[#1a1a24] shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1654366698665-e6d611a9aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGxlYXJuaW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2NDA0NzY1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Mobile interface"
                    className="w-full h-full object-cover opacity-70"
                  />
                  
                  {/* Interface overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-8 left-4 right-4">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                      <p className="text-sm text-white">Tap to roll dice</p>
                      <div className="mt-2 flex gap-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6b2d8f] to-[#a855f7]" />
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22d3ee] to-[#a855f7]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                  NFC dice scanning
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                  Instant boon notifications
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                  Progress tracking on-the-go
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
