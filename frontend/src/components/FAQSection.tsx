import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is a boon?",
    answer: "A boon is a game-based reward given to students when they roll the dice. Boons can include bonus points, assignment extensions, wildcards for topics, or other learning advantages. Each boon has a rarity level (Common, Rare, Epic, or Legendary) that determines its value and probability.",
  },
  {
    question: "How do rarity weights work?",
    answer: "Rarity weights determine the probability of receiving different types of boons. Common boons have a 60% chance, Rare 25%, Epic 12%, and Legendary 3%. This creates a balanced system that keeps students engaged while maintaining fairness. Instructors can customize these weights based on their needs.",
  },
  {
    question: "Do students need accounts?",
    answer: "Yes, students need accounts to track their progress, boons earned, and engagement metrics. However, the signup process is simple and can be integrated with your institution's existing authentication system (SSO). Student data is encrypted and handled according to POPIA and GDPR standards.",
  },
  {
    question: "Can I import/export sessions?",
    answer: "Absolutely! You can export session data as CSV or JSON files for record-keeping or analysis. You can also import pre-configured sessions, dice configurations, and boon libraries from other instructors or previous terms, making setup quick and easy.",
  },
  {
    question: "What LMS platforms are supported?",
    answer: "RollKnow supports any LMS platform that implements LTI 1.3 standards, including Canvas, Moodle, Brightspace (D2L), Blackboard, Sakai, and many others. Our flexible integration architecture ensures compatibility with both major platforms and custom institutional systems.",
  },
  {
    question: "How does the NFC technology work?",
    answer: "Each dice face contains an NFC chip with a unique identifier. When students roll the dice and place it near an NFC reader (smartphone or dedicated reader), the system instantly recognizes the result and triggers the corresponding game mechanics. No manual input needed!",
  },
  {
    question: "Is my student data secure?",
    answer: "Yes, security is our top priority. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We're compliant with POPIA, GDPR, and FERPA regulations. Student data is never shared with third parties, and you maintain full control over your institution's information.",
  },
  {
    question: "Can I customize the boons and rewards?",
    answer: "Completely! The RollKnow dashboard allows instructors to create custom boons, set rarity levels, define rewards, and configure game rules to match their teaching style and course requirements. You have full control over the reward system.",
  },
  {
    question: "What if a student doesn't have a smartphone?",
    answer: "While smartphones provide the best experience, they're not required. Instructors can use dedicated NFC readers or manually input dice results through the dashboard. We also provide loaner devices for institutions that want to ensure every student can participate.",
  },
  {
    question: "How much does RollKnow cost?",
    answer: "We offer tiered pricing based on institution size and needs. Academic institutions receive special educational pricing. Contact our sales team for a custom quote, or start with our free trial to test RollKnow with up to 30 students for one semester.",
  },
  {
    question: "Can I see analytics and reports?",
    answer: "Yes! The instructor dashboard includes comprehensive analytics: student engagement rates, dice roll frequency, boon distribution, participation patterns, and learning outcome correlations. Export reports in multiple formats for departmental review or research.",
  },
  {
    question: "What kind of training is provided?",
    answer: "We provide comprehensive onboarding including video tutorials, documentation, live training sessions, and dedicated support. Most instructors are comfortable using RollKnow within 15-20 minutes. We also offer train-the-trainer programs for larger institutional deployments.",
  },
];

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" ref={ref} className="relative py-32 px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a1f] to-[#0a0a0f]" />

      <div className="relative z-10 max-w-4xl mx-auto">
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
              <span className="text-sm text-gray-300">Got Questions?</span>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-6xl mb-6 text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about RollKnow
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div
                className={`rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border transition-all duration-300 ${
                  openIndex === index ? "border-white/20" : "border-white/10"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 flex items-center justify-between text-left group"
                >
                  <span className="text-white pr-8 group-hover:text-white/80 transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-white" />
                    ) : (
                      <Plus className="w-5 h-5 text-white" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="pt-4 border-t border-white/10">
                          <p className="text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-center"
        >
          <h3 className="text-2xl mb-4 text-white">Still Have Questions?</h3>
          <p className="text-gray-300 mb-6">
            Our support team is here to help. Get in touch with us for personalized assistance.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:shadow-lg transition-all hover:scale-105">
              Contact Support
            </button>
            <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all">
              Schedule a Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
