import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, Users, MapPin, Utensils } from "lucide-react";

const stats = [
  { value: 12500, suffix: "+", label: "Meals Rescued", icon: Utensils, color: "text-primary" },
  { value: 340, suffix: "+", label: "Restaurant Partners", icon: TrendingUp, color: "text-secondary" },
  { value: 1200, suffix: "+", label: "Active Volunteers", icon: Users, color: "text-accent" },
  { value: 85, suffix: "+", label: "Cities Covered", icon: MapPin, color: "text-success" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = target;
      const duration = 2000;
      let startTimestamp: number | null = null;
      
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-display font-black tracking-tighter">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const ImpactStats = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative group flex flex-col items-center md:items-start text-center md:text-left"
              >
                <div className={`p-4 rounded-2xl bg-muted/30 border border-border/50 mb-6 group-hover:bg-muted/50 transition-all duration-300 ${stat.color}`}>
                   <Icon className="h-7 w-7" />
                </div>
                
                <h3 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-2">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </h3>
                
                <p className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-muted-foreground to-muted-foreground/50">
                  {stat.label}
                </p>

                {/* Decorative Element */}
                <div className="mt-6 h-1 w-12 bg-gradient-to-r from-primary/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 md:mt-32 p-1 relative rounded-[2rem] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 animate-gradient" />
          <div className="relative glass rounded-[1.9rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h4 className="text-2xl md:text-3xl font-display mb-4 leading-tight">Join the movement and help us rescue the next 10,000 meals.</h4>
              <p className="text-muted-foreground text-sm md:text-base">Every contribution, no matter how small, makes a lasting impact on someone's life.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-foreground text-background rounded-2xl font-bold text-sm md:text-base shadow-xl hover:bg-foreground/90 transition-all"
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStats;
