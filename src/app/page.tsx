
import { CtaSection } from "@/components/home/cta";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-yellow-50/20 via-white to-orange-50/20 dark:from-gray-950 dark:via-black dark:to-gray-900">
      <Hero />
      <Features />
      <HowItWorks />
      <CtaSection />
      <Footer />
    </div>
  );
}