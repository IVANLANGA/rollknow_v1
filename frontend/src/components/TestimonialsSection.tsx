import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Star, GraduationCap, UserCircle, Award } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Computer Science Student",
    avatar: UserCircle,
    rating: 5,
    text: "RollKnow completely transformed how I engage with course material. The gamification makes learning fun, and I actually look forward to class now!",
    gradient: "from-[#a855f7] to-[#ec4899]",
  },
  {
    name: "Dr. Michael Chen",
    role: "Senior Lecturer, Information Systems",
    avatar: GraduationCap,
    rating: 5,
    text: "The analytics and LMS integration are phenomenal. I can track student engagement in real-time and adjust my teaching approach accordingly.",
    gradient: "from-[#22d3ee] to-[#a855f7]",
  },
  {
    name: "Alex Martinez",
    role: "Third Year Business Analytics",
    avatar: UserCircle,
    rating: 5,
    text: "The NFC dice are amazing! It's like playing a game but you're actually learning. My grades have improved significantly since using RollKnow.",
    gradient: "from-[#6b2d8f] to-[#22d3ee]",
  },
  {
    name: "Prof. Emily Thompson",
    role: "Department Head, Educational Technology",
    avatar: Award,
    rating: 5,
    text: "RollKnow represents the future of educational technology. The research-backed approach ensures it's not just engaging, but pedagogically sound.",
    gradient: "from-[#ec4899] to-[#a855f7]",
  },
  {
    name: "James Williams",
    role: "Graduate Student, Data Science",
    avatar: UserCircle,
    rating: 5,
    text: "The boons system is genius! It motivates me to participate more in class discussions and complete assignments early.",
    gradient: "from-[#a855f7] to-[#6b2d8f]",
  },
  {
    name: "Dr. Lance Bunt",
    role: "MSc Supervisor, North-West University",
    avatar: Award,
    rating: 5,
    text: "This project exemplifies innovative research in educational technology. The DSR methodology and theoretical grounding make it a significant contribution to the field.",
    gradient: "from-[#22d3ee] to-[#6b2d8f]",
    featured: true,
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="relative py-32 px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#a855f7] rounded-full blur-[128px] opacity-20" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#22d3ee] rounded-full blur-[128px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl mb-6">
            <span className="bg-gradient-to-r from-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">
              What People Are Saying
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Hear from students, lecturers, and education experts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative ${testimonial.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#6b2d8f]/20">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#a855f7] fill-[#a855f7]" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-gray-300 leading-relaxed mb-6">"{testimonial.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center`}>
                    <testimonial.avatar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>

                {/* Featured badge */}
                {testimonial.featured && (
                  <div className="absolute -top-3 -right-3 px-4 py-2 rounded-full bg-gradient-to-r from-[#6b2d8f] to-[#a855f7] text-sm text-white shadow-lg">
                    Supervisor
                  </div>
                )}

                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
