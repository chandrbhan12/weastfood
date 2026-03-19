import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, Users, MapPin, Utensils } from "lucide-react";

const stats = [
  { value: 12500, suffix: "+", label: "Meals Rescued", icon: Utensils },
  { value: 340, suffix: "+", label: "Restaurant Partners", icon: TrendingUp },
  { value: 1200, suffix: "+", label: "Active Volunteers", icon: Users },
  { value: 85, suffix: "+", label: "Cities Covered", icon: MapPin },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const start = Date.now();
          const step = () => {
            const progress = Math.min((Date.now() - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <p ref={ref} className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground">
      {count.toLocaleString()}{suffix}
    </p>
  );
};

const ImpactStats = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl sm:rounded-3xl glass px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative overflow-hidden"
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-50" />
          
          {/* Glowing orbs */}
          <div className="absolute -right-20 -top-20 h-40 sm:h-60 w-40 sm:w-60 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
          <div className="absolute -left-20 -bottom-20 h-32 sm:h-48 w-32 sm:w-48 rounded-full bg-accent/5 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

          <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.08, y: -5 }}
                className="text-center cursor-default group"
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20"
                >
                  <stat.icon className="h-6 w-6" />
                </motion.div>
                <Counter target={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStats;
