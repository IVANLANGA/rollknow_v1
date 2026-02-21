import { Check } from 'lucide-react';

export const Pricing = () => {
    return (
        <div className="py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Start for free and scale as you grow. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Tier */}
                    <PricingCard
                        title="Starter"
                        price="Free"
                        description="Perfect for individuals exploring the platform."
                        features={[
                            "Access to public challenges",
                            "Basic progress tracking",
                            "Community support",
                            "Limited daily submissions"
                        ]}
                        cta="Start Learning"
                    />

                    {/* Pro Tier */}
                    <PricingCard
                        title="Pro"
                        price="$15"
                        period="/month"
                        description="For serious learners who want to master skills faster."
                        isPopular
                        features={[
                            "Unlimited submissions",
                            "Advanced analytics",
                            "Priority code review",
                            "Certificate of completion",
                            "Private mentoring sessions"
                        ]}
                        cta="Upgrade to Pro"
                    />

                    {/* Business Tier */}
                    <PricingCard
                        title="Institution"
                        price="Custom"
                        description="For schools, bootcamps and organizations."
                        features={[
                            "Custom curriculum design",
                            "White-label options",
                            "Admin dashboard",
                            "SSO Integration",
                            "Dedicated support manager"
                        ]}
                        cta="Contact Sales"
                    />
                </div>
            </div>
        </div>
    );
};

const PricingCard = ({
    title,
    price,
    period = "",
    description,
    features,
    cta,
    isPopular = false
}: {
    title: string,
    price: string,
    period?: string,
    description: string,
    features: string[],
    cta: string,
    isPopular?: boolean
}) => (
    <div className={`relative p-8 rounded-2xl flex flex-col h-full transition-transform hover:-translate-y-1 duration-300 ${isPopular
        ? 'bg-[#0E1125] border border-pink-500 shadow-2xl shadow-pink-500/10'
        : 'bg-white/5 border border-white/10 hover:bg-white/10'
        }`}>
        {isPopular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-xs font-bold text-white uppercase tracking-wider">
                Most Popular
            </div>
        )}

        <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-white">{price}</span>
                <span className="text-gray-400">{period}</span>
            </div>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>

        <div className="flex-grow mb-8 space-y-4">
            {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                    <Check size={18} className="text-pink-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                </div>
            ))}
        </div>

        <button className={`w-full py-3 rounded-lg font-semibold transition-all ${isPopular
            ? 'btn-primary-gradient shadow-lg shadow-pink-500/20'
            : 'bg-white/10 text-white hover:bg-white/20'
            }`}>
            {cta}
        </button>
    </div>
);
