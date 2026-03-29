import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-premium.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-background noise-bg pt-16">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Impactful Food Recue Platform
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] tracking-tight text-foreground">
              Share the <br />
              <span className="text-gradient-primary">Abundance.</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              FoodLink bridges the gap between surplus bounty and those in need. 
              Join thousands of restaurants and volunteers making a daily difference.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold shadow-2xl glow-primary" asChild>
                <Link to="/add-food">
                  Donate Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-bold glass-card" asChild>
                <Link to="/browse">Find Food</Link>
              </Button>
            </div>

            {/* Impact Ticker */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 pt-8 border-t border-border/50 w-full"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-bold">Current Community Impact</p>
              <div className="flex flex-wrap gap-8 items-center">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Heart className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-xl font-bold font-display">12.5k+</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Meals Saved</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <Users className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-xl font-bold font-display">850+</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Active Volunteers</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <ShieldCheck className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-xl font-bold font-display">320+</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">NGO Partners</p>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="relative"
          >
            {/* Main Image with sophisticated masking */}
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.5)] aspect-[4/5] lg:aspect-auto">
              <img 
                src={heroImage} 
                alt="Community volunteers" 
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>

            {/* Floating UI Elements */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 glass p-4 rounded-2xl shadow-2xl z-20 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <Heart className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="text-sm font-bold">New Donation!</p>
                  <p className="text-[10px] text-muted-foreground">Fresh Pasta • 5 mins ago</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl shadow-2xl z-20 hidden lg:block max-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Live Impact</span>
              </div>
              <p className="text-xs text-muted-foreground">Every donation directly reaches families in need within hours.</p>
            </motion.div>

            {/* Background Decorative Circles */}
            <div className="absolute -top-12 -left-12 h-64 w-64 bg-primary/20 blur-[120px] rounded-full -z-10" />
            <div className="absolute -bottom-12 -right-12 h-64 w-64 bg-secondary/10 blur-[120px] rounded-full -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
