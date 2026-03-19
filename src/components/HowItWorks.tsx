import { motion } from "framer-motion";
import { UtensilsCrossed, Bell, Truck, HeartHandshake } from "lucide-react";

const steps = [
  {
    icon: UtensilsCrossed,
    title: "Restaurant Posts Food",
    description: "Restaurants list leftover food with quantity, pickup time, and location.",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Bell,
    title: "Volunteers Get Notified",
    description: "Nearby volunteers and NGOs receive alerts about available food.",
    color: "from-accent/20 to-accent/5",
  },
  {
    icon: Truck,
    title: "Food is Picked Up",
    description: "A volunteer accepts the request and picks up the food on time.",
    color: "from-secondary/20 to-secondary/5",
  },
  {
    icon: HeartHandshake,
    title: "Delivered to Those in Need",
    description: "Fresh food reaches hungry people instead of going to waste.",
    color: "from-success/20 to-success/5",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground tracking-tight"
          >
            How <span className="text-gradient-primary">FoodLink</span> Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 sm:mt-4 max-w-xl text-muted-foreground text-sm sm:text-base md:text-lg"
          >
            A simple 4-step process to rescue surplus food and feed communities.
          </motion.p>
        </div>

        <div className="mt-12 sm:mt-16 md:mt-20 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="relative text-center group cursor-default"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 + 0.5, duration: 0.6 }}
                  className="absolute left-[60%] top-10 hidden h-px w-[80%] bg-gradient-to-r from-primary/30 to-transparent md:block origin-left"
                />
              )}
              
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} border border-primary/10 backdrop-blur-sm`}
              >
                <step.icon className="h-8 w-8 text-primary" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground shadow-lg">
                  {i + 1}
                </span>
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity glow-primary" />
              </motion.div>
              
              <h3 className="mt-6 font-display text-lg text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
