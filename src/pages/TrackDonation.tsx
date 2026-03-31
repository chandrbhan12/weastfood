import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Package, Truck, CheckCircle2, Clock, Navigation, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeliveryProgress from "@/components/DeliveryProgress";

const apiBaseUrl = process.env.VITE_API_URL || "http://localhost:3000";

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

const statusMap: Record<string, number> = {
  'requested': 0,
  'accepted': 1,
  'in_transit': 2,
  'completed': 3,
};

const TrackDonation = () => {
  const [trackingId, setTrackingId] = useState("");
  const [myClaims, setMyClaims] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchClaims = async () => {
      const saved = localStorage.getItem('auth_session');
      const token = saved ? JSON.parse(saved).token : null;
      if (!token) return;

      try {
        const res = await fetch(`${apiBaseUrl}/api/pickups/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          // asPartner contains claims
          const claims = json.asPartner || [];
          setMyClaims(claims);
          if (claims.length > 0) {
            setTrackingId(claims[0]._id || claims[0].id || "");
          }
        }
      } catch (e) {
        console.error('Failed to fetch claims', e);
      }
    };

    fetchClaims();
    const id = setInterval(fetchClaims, 10000); // Polling as fallback
    return () => clearInterval(id);
  }, []);

  const currentClaim = myClaims[selectedIndex] || null;

  const tracking = currentClaim ? {
    id: currentClaim.id || "N/A",
    food: currentClaim.items || "Unknown Food",
    restaurant: currentClaim. donor?.full_name || currentClaim.restaurant || "Donation Partner",
    volunteer: "Rahul Sharma (Assigned)",
    volunteerPhone: "+91 98765 43210",
    pickup: currentClaim.location || "Pickup Location",
    dropoff: "Your Location / Community Center",
    status: currentClaim.status || 1,
    eta: "25 min",
    steps: [
      { label: "Donation Posted", description: "Food listed for donation", time: "10:30 AM", icon: Package },
      { label: "Claimed & Accepted", description: "You claimed this food", time: currentClaim.claimedAt ? new Date(currentClaim.claimedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Just now", icon: User },
      { label: "In Transit", description: "Volunteer is on the way", time: "", icon: Truck },
      { label: "Delivered", description: "Food received successfully", time: "", icon: CheckCircle2 },
    ],
  } : demoTracking;

  const currentStep = tracking.status;

  const handleTrack = () => {
    const found = myClaims.findIndex(c => c.id === trackingId);
    if (found !== -1) {
      setSelectedIndex(found);
    } else {
      // If not found in claims, maybe it's a demo ID or external ID
      if (trackingId === demoTracking.id) {
        setSelectedIndex(-1); // Use demo
      }
    }
  };

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
          <Button className="glow-primary shrink-0" onClick={handleTrack}>Track</Button>
        </motion.div>

        {myClaims.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none"
          >
            {myClaims.map((claim, idx) => (
              <Button
                key={claim.id || idx}
                variant={selectedIndex === idx ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap rounded-full px-4"
                onClick={() => {
                  setSelectedIndex(idx);
                  setTrackingId(claim.id || "");
                }}
              >
                {claim.items || "Unlisted Food"}
              </Button>
            ))}
          </motion.div>
        )}

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
            <div className="glass rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Truck className="h-32 w-32" />
              </div>
              <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground mb-6">Delivery Progress</h3>
              
              <div className="flex gap-8 items-start">
                <div className="h-[300px] w-20 shrink-0">
                  <DeliveryProgress 
                    status={String(currentClaim?.status || 'requested')} 
                    orientation="vertical"
                  />
                </div>

                <div className="flex-1 pt-4 space-y-12">
                  {tracking.steps.map((step, i) => {
                    const isActive = i <= (statusMap[String(currentClaim?.status)] ?? 0);
                    const Icon = step.icon;
                    return (
                      <div key={i} className="flex flex-col">
                         <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-md ${isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                               <Icon className="h-3.5 w-3.5" />
                            </div>
                            <p className={`text-sm font-bold uppercase tracking-tighter ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                         </div>
                         <p className="text-xs text-muted-foreground mt-1 pl-11">{step.description}</p>
                         {step.time && <p className="text-[10px] text-primary/60 font-mono pl-11 mt-1">{step.time}</p>}
                      </div>
                    );
                  })}
                </div>
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
            <div className="glass rounded-3xl overflow-hidden h-full min-h-[550px] relative border border-white/10 shadow-2xl">
              {/* Map Header */}
              <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between p-6 bg-gradient-to-b from-background/95 via-background/50 to-transparent">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm font-bold font-display text-foreground uppercase tracking-widest">Live Delivery Tracker</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter">Updating every 15 seconds</p>
                </div>
                
                <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg backdrop-blur-md ${currentClaim?.status === 'in_transit' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-muted/50 text-muted-foreground border-white/10'}`}>
                  <span className={`h-2 w-2 rounded-full ${currentClaim?.status === 'in_transit' ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                  {currentClaim?.status === 'in_transit' ? 'Live Tracking Active' : 'Waiting for Pickup'}
                </div>
              </div>

              {/* Dynamic Google Maps Embed */}
              <iframe
                src={currentClaim?.currentLat && currentClaim?.currentLng 
                  ? `https://maps.google.com/maps?q=${currentClaim.currentLat},${currentClaim.currentLng}&z=16&output=embed&t=m`
                  : `https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d56069.89710389584!2d77.0090048!3d28.5695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x390d194ddc0edc37%3A0x1b0d0b7e0b0b0b0b!2sMG%20Road%2C%20Gurugram%2C%20Haryana!3m2!1d28.4802!2d77.0266!4m5!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sOld%20Delhi%2C%20Delhi!3m2!1d28.6562!2d77.2410!5e0!3m2!1sen!2sin!4v1709251200000!5m2!1sen!2sin`
                }
                className="w-full h-full min-h-[550px] border-0 grayscale-[20%] contrast-[1.1] brightness-[0.9]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Live Tracking Map"
              />

              {/* Route Info Overlay - More Premium Style */}
              <div className="absolute bottom-6 inset-x-6 z-10">
                 <div className="glass-card rounded-[2rem] p-6 border border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div className="flex items-center gap-4 flex-1 w-full">
                       <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                          <Truck className="h-6 w-6" />
                       </div>
                       <div className="overflow-hidden">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Current Status</p>
                          <p className="text-sm md:text-base font-display text-foreground font-bold truncate">
                            {currentClaim?.status === 'in_transit' ? 'On the way to your location' : currentClaim?.status === 'accepted' ? 'Volunteer preparing for pickup' : 'Waiting for assignment'}
                          </p>
                       </div>
                    </div>
                    
                    <div className="h-px md:h-12 w-full md:w-px bg-white/10" />

                    <div className="flex items-center gap-8 justify-between w-full md:w-auto">
                       <div className="text-center md:text-left">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Est. Arrival</p>
                          <div className="flex items-baseline gap-1">
                             <span className="text-xl md:text-2xl font-display font-black text-primary">12</span>
                             <span className="text-xs font-bold text-muted-foreground">MINS</span>
                          </div>
                       </div>
                       <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-secondary text-secondary-foreground rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-secondary/20"
                       >
                          Call Driver
                       </motion.button>
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
