import { motion } from "framer-motion";
import { UtensilsCrossed, Bell, Truck, HeartHandshake } from "lucide-react";

const steps = [
  {
    icon: UtensilsCrossed,
    title: "Post Surplus Food",
    description: "Restaurants and businesses list their extra food with details like quantity and location.",
    color: "bg-primary/10 text-primary",
    borderColor: "border-primary/20",
  },
  {
    icon: Bell,
    title: "Instant Notification",
    description: "Local volunteers and NGO partners receive immediate alerts on their devices.",
    color: "bg-secondary/10 text-secondary",
    borderColor: "border-secondary/20",
  },
  {
    icon: Truck,
    title: "Rapid Pickup",
    description: "A verified volunteer claims the request and picks up the food within minutes.",
    color: "bg-accent/10 text-accent",
    borderColor: "border-accent/20",
  },
  {
    icon: HeartHandshake,
    title: "Direct Delivery",
    description: "The food is delivered directly to community centers, shelters, or individuals in need.",
    color: "bg-success/10 text-success",
    borderColor: "border-success/20",
  },
];

const HowItWorks = ({ showHeader = true }) => {
  return (
    <section className="py-24 md:py-32 relative bg-background/50">
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-20 md:mb-28">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-muted text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4"
            >
              The Ecosystem
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground"
            >
              How <span className="text-gradient-primary">FoodLink</span> Works
            </motion.h2>
          </div>
        )}

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Connector Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-secondary/50 to-transparent md:-translate-x-1/2" />

          <div className="space-y-20 md:space-y-32">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className={`relative flex items-center gap-8 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Icon Circle */}
                  <div className="absolute left-8 md:left-1/2 h-16 w-16 rounded-full glass flex items-center justify-center z-20 md:-translate-x-1/2 border-2 border-background shadow-xl">
                    <div className={`h-12 w-12 rounded-full ${step.color} flex items-center justify-center ${step.borderColor} border`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Content Box */}
                  <div className={`flex-1 pl-20 md:pl-0 ${isEven ? 'md:pr-24 text-left md:text-right' : 'md:pl-24 text-left'}`}>
                    <div className="inline-block px-3 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
                      Step {i + 1}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display text-foreground mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-md ml-auto mr-auto md:ml-0 md:mr-0 inline-block">
                      {step.description}
                    </p>
                  </div>

                  {/* Spacer for symmetrical layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
