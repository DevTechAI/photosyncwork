
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { GetStartedSection } from "@/components/home/GetStartedSection";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dustyBlue-whisper to-warmWhite">
      <HeroSection />
      <AboutSection />
      <WhyChooseUsSection />
      <GetStartedSection />
      <Footer />
    </div>
  );
}
