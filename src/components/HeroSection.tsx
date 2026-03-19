import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center noise-bg">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Volunteers distributing food"
          className="h-full w-full object-cover opacity-100 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5" />
      </div>

      {/* Animated orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[15%] top-[20%] hidden h-64 w-64 rounded-full bg-primary/5 blur-3xl md:block"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] bottom-[15%] hidden h-48 w-48 rounded-full bg-accent/10 blur-3xl md:block"
      />
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[30%] bottom-[25%] hidden h-32 w-32 rounded-full bg-secondary/8 blur-2xl md:block"
      />

      {/* Orbiting particle */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
        <motion.div
          className="h-2 w-2 rounded-full bg-primary animate-orbit"
          style={{ filter: "drop-shadow(0 0 6px hsl(174 72% 50%))" }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-24 md:py-36 z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              Reducing food waste, feeding communities
              <Zap className="h-3.5 w-3.5 text-secondary" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="mt-8 font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl 2xl:text-8xl leading-tight text-foreground tracking-tight"
          >
            Every Meal{" "}
            <span className="text-gradient-primary">Matters.</span>
            <br />
            <motion.span
              className="text-secondary inline-block"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Share the Extra.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-black max-w-xl"
          >
            FoodLink connects restaurants with surplus food to volunteers and
            NGOs who deliver it to people in need.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 sm:mt-10 flex flex-col gap-3 sm:gap-4 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base shadow-lg glow-primary px-6 sm:px-8 h-10 sm:h-12" asChild>
                <Link to="/add-food">
                  Donate Food <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto glass text-sm sm:text-base text-foreground border-primary/30 hover:border-primary/60 hover:glow-primary px-6 sm:px-8 h-10 sm:h-12"
                asChild
              >
                <Link to="/browse">Find Food Near You</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Tech-style grid lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-muted-foreground/50 text-xs sm:text-sm"
          >
            <div className="h-0.5 sm:h-px w-full sm:flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <span className="font-display text-foreground/80 whitespace-nowrap">12,500+ meals rescued</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="h-10 w-6 rounded-full border-2 border-primary/40 flex items-start justify-center p-1.5">
          <motion.div
            className="h-2 w-2 rounded-full bg-primary"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ filter: "drop-shadow(0 0 4px hsl(174 72% 50%))" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
