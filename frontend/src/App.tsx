import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { BenefitsSection } from "./components/BenefitsSection";
import { RaritySection } from "./components/RaritySection";
import { IntegrationsSection } from "./components/IntegrationsSection";
import { EducatorsSection } from "./components/EducatorsSection";
import { FAQSection } from "./components/FAQSection";
import { CTAFooterSection } from "./components/CTAFooterSection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <RaritySection />
      <IntegrationsSection />
      <EducatorsSection />
      <FAQSection />
      <CTAFooterSection />
      <Footer />
    </div>
  );
}
