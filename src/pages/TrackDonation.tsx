import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Package, Truck, CheckCircle2, Clock, Navigation, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const demoTracking = {
  id: "FD-20260301-4821",
  food: "Biryani & Curry (20 servings)",
  restaurant: "Golden Spice Kitchen",
  volunteer: "Rahul Sharma",
  volunteerPhone: "+91 98765 43210",
  pickup: "MG Road, Sector 14, Gurugram",
  dropoff: "Community Kitchen, Old Delhi",
  status: 2, // 0-3
  eta: "25 min",
  steps: [
    { label: "Donation Posted", description: "Restaurant listed surplus food", time: "10:30 AM", icon: Package },
    { label: "Volunteer Assigned", description: "Rahul accepted the pickup", time: "10:45 AM", icon: User },
    { label: "Picked Up & In Transit", description: "Food collected, on the way", time: "11:05 AM", icon: Truck },
    { label: "Delivered", description: "Food delivered to community kitchen", time: "", icon: CheckCircle2 },
  ],
};

const TrackDonation = () => {
  const [trackingId, setTrackingId] = useState("FD-20260301-4821");
  const [tracking, setTracking] = useState(demoTracking);

  const currentStep = tracking.status;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground">
            Track <span className="text-gradient-primary">Donation</span>
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground">
            Real-time tracking of your food donation delivery.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 flex gap-3 max-w-lg"
        >
          <Input
            placeholder="Enter Tracking ID (e.g. FD-20260301-4821)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="font-mono"
          />
          <Button className="glow-primary shrink-0">Track</Button>
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          {/* Left: Progress Stepper */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {/* Info Card */}
            <div className="glass rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">{tracking.id}</span>
                <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
                  <Clock className="h-3 w-3" />
                  ETA: {tracking.eta}
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg text-foreground">{tracking.food}</h3>
              <p className="text-sm text-primary/80">{tracking.restaurant}</p>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-accent" />
                  <span>{tracking.volunteer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-accent" />
                  <span>{tracking.volunteerPhone}</span>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground mb-6">Delivery Progress</h3>
              <div className="relative space-y-0">
                {tracking.steps.map((step, i) => {
                  const isCompleted = i < currentStep;
                  const isCurrent = i === currentStep;
                  const isPending = i > currentStep;
                  const Icon = step.icon;

                  return (
                    <div key={i} className="relative flex gap-4">
                      {/* Vertical line */}
                      {i < tracking.steps.length - 1 && (
                        <div className="absolute left-5 top-10 w-0.5 h-[calc(100%-10px)]">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: isCompleted ? "100%" : "0%" }}
                            transition={{ duration: 0.8, delay: i * 0.3 }}
                            className="w-full bg-primary"
                          />
                          <div className="w-full h-full bg-border absolute top-0 left-0 -z-10" />
                        </div>
                      )}

                      {/* Icon circle */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.15, type: "spring" }}
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                          isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : isCurrent
                            ? "border-primary bg-primary/20 text-primary animate-pulse"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.div>

                      {/* Text */}
                      <div className="pb-8">
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 + 0.1 }}
                          className={`font-display text-sm font-semibold ${
                            isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </motion.p>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                        {step.time && (
                          <span className="mt-1 inline-block text-xs text-primary/60 font-mono">{step.time}</span>
                        )}
                        {isCurrent && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-1 block text-xs font-semibold text-secondary"
                          >
                            ● In Progress
                          </motion.span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right: Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-2xl overflow-hidden h-full min-h-[500px] relative">
              {/* Map Header */}
              <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-background/90 to-transparent">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-primary" />
                  <span className="text-sm font-display text-foreground">Live Location</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-success/20 px-3 py-1 text-xs font-semibold text-success border border-success/30">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  Live
                </div>
              </div>

              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d56069.89710389584!2d77.0090048!3d28.5695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x390d194ddc0edc37%3A0x1b0d0b7e0b0b0b0b!2sMG%20Road%2C%20Gurugram%2C%20Haryana!3m2!1d28.4802!2d77.0266!4m5!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sOld%20Delhi%2C%20Delhi!3m2!1d28.6562!2d77.2410!5e0!3m2!1sen!2sin!4v1709251200000!5m2!1sen!2sin"
                className="w-full h-full min-h-[500px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Delivery Route Map"
              />

              {/* Route Info Overlay */}
              <div className="absolute bottom-0 inset-x-0 z-10 p-4 bg-gradient-to-t from-background/95 to-transparent">
                <div className="glass rounded-xl p-4 flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <div className="h-3 w-3 rounded-full bg-primary border-2 border-primary-foreground" />
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-secondary" />
                    <div className="h-3 w-3 rounded-full bg-secondary border-2 border-secondary-foreground" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Pickup</p>
                      <p className="text-sm text-foreground font-medium">{tracking.pickup}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Drop-off</p>
                      <p className="text-sm text-foreground font-medium">{tracking.dropoff}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-display text-lg text-primary">28 km</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackDonation;
