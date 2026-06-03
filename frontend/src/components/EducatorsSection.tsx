import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Quote, GraduationCap } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Professor of Computer Science",
    university: "North-West University",
    quote: "RollKnow changed how my class participates. Students are more engaged than ever, and I can see real-time data on their progress.",
    avatar: "SM",
    color: "#E042A3",
  },
  {
    name: "Prof. James Chen",
    role: "Head of Information Systems",
    university: "University of Cape Town",
    quote: "The gamification elements are brilliant. My students actually look forward to lectures now, and retention rates have improved significantly.",
    avatar: "JC",
    color: "#F4C542",
  },
  {
    name: "Dr. Amara Okafor",
    role: "Senior Lecturer in Data Science",
    university: "Stellenbosch University",
    quote: "Integration with our LMS was seamless. The analytics dashboard gives me insights I never had before about student engagement patterns.",
    avatar: "AO",
    color: "#6b2d8f",
  },
  {
    name: "Prof. Michael van der Berg",
    role: "Educational Technology Lead",
    university: "University of Johannesburg",
    quote: "This is the future of classroom engagement. The NFC dice make learning tactile and fun while maintaining academic rigor.",
    avatar: "MB",
    color: "#22d3ee",
  },
  {
    name: "Dr. Priya Naidoo",
    role: "Associate Professor of Business",
    university: "University of Pretoria",
    quote: "My students are more motivated and collaborative. The boon system creates healthy competition while fostering teamwork.",
    avatar: "PN",
    color: "#ec4899",
  },
  {
    name: "Prof. David Thompson",
    role: "Chair of Education Innovation",
    university: "Rhodes University",
    quote: "RollKnow bridges the gap between traditional teaching and modern engagement techniques. It's research-backed and pedagogically sound.",
    avatar: "DT",
    color: "#f59e0b",
  },
];

export function EducatorsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="educators" ref={ref} className="relative py-32 px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#E042A3] rounded-full blur-[128px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#F4C542] rounded-full blur-[128px]"
        />
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
              <GraduationCap className="w-4 h-4 text-[#E042A3]" />
              <span className="text-sm text-gray-300">Educator Testimonials</span>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-6xl mb-6">
            <span className="text-white">Loved by</span>{" "}
            <span className="bg-gradient-to-r from-[#E042A3] to-[#F4C542] bg-clip-text text-transparent">
              Educators
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Hear from professors and lecturers who are transforming their classrooms with RollKnow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                {/* Quote icon */}
                <div className="absolute -top-3 -left-3 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E042A3] to-[#F4C542] flex items-center justify-center shadow-xl">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Quote */}
                <div className="mb-6 pt-4">
                  <p className="text-gray-300 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${testimonial.color}, ${testimonial.color}dd)`,
                    }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white mb-0.5">{testimonial.name}</p>
                    <p className="text-sm text-gray-400 mb-0.5">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.university}</p>
                  </div>
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                  style={{ background: testimonial.color }}
                />

                {/* Corner decoration */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid md:grid-cols-4 gap-8"
        >
          {[
            { value: "500+", label: "Active Educators" },
            { value: "15K+", label: "Engaged Students" },
            { value: "98%", label: "Would Recommend" },
            { value: "50+", label: "Universities" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-[#E042A3] to-[#F4C542] bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
