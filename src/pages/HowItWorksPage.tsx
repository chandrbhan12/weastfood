import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, HeartHandshake, Shield } from "lucide-react";

const roles = [
  {
    icon: Building,
    title: "For Restaurants",
    description: "Register your restaurant, post surplus food details, and set pickup windows. It's fast, free, and rewarding.",
    cta: "Start Donating",
    to: "/add-food",
  },
  {
    icon: HeartHandshake,
    title: "For Volunteers & NGOs",
    description: "Browse available food near you, accept pickup requests, and deliver meals to communities in need.",
    cta: "Browse Food",
    to: "/browse",
  },
  {
    icon: Shield,
    title: "For Admins",
    description: "Monitor all food posts, manage users, and ensure food safety standards are maintained across the platform.",
    cta: "Learn More",
    to: "/",
  },
];

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HowItWorks />

      <section className="py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground">Your Role in FoodLink</h2>
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 grid gap-6 sm:gap-7 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg sm:rounded-xl border border-border bg-card p-5 sm:p-6 md:p-8"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10">
                  <role.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="mt-3 sm:mt-4 md:mt-5 font-display text-base sm:text-lg md:text-xl text-card-foreground">{role.title}</h3>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">{role.description}</p>
                <Button variant="ghost" className="mt-3 sm:mt-4 md:mt-5 text-primary text-xs sm:text-sm h-9 sm:h-10" asChild>
                  <Link to={role.to}>
                    {role.cta} <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
