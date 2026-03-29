import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import ImpactStats from "@/components/ImpactStats";
import FeaturedListings from "@/components/FeaturedListings";
import TopDonors from "@/components/TopDonors";
import TopDonatedFood from "@/components/TopDonatedFood";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div className="space-y-0">
        <HowItWorks />
        <ImpactStats />
      </div>
      <FeaturedListings />
      <TopDonatedFood />
      <Footer />
    </div>
  );
};

export default Index;
