import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Star } from "lucide-react";

type Donor = {
  _id?: string;
  full_name: string;
  points: number;
  avatar_url?: string | null;
};

const TopDonorsModern = () => {
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || '/api') + '/pickups/top-donors');
        if (!res.ok) throw new Error('Fetch failed');
        const json = await res.json();
        
        if (json && json.length > 0) {
          setDonors(json.slice(0, 3));
        } else {
          // Fallback mock data if DB is empty
          setDonors([
            { full_name: "John Doe", points: 1540, avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
            { full_name: "Sarah Miller", points: 1280, avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
            { full_name: "Project Hope", points: 950, avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" }
          ]);
        }
      } catch (e) {
        console.error('Failed to load top donors', e);
        // Fallback mock data on error
        setDonors([
          { full_name: "Elite Donor", points: 1500, avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
          { full_name: "Community Hero", points: 1200, avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
          { full_name: "Food Rescuer", points: 900, avatar_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop" }
        ]);
      }
    };
    fetchDonors();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 1: return <Medal className="h-6 w-6 text-slate-300" />;
      case 2: return <Medal className="h-6 w-6 text-amber-600" />;
      default: return <Star className="h-6 w-6 text-primary" />;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return "from-yellow-400/20 to-yellow-600/5 border-yellow-500/30 shadow-yellow-500/10";
      case 1: return "from-slate-300/20 to-slate-500/5 border-slate-400/30 shadow-slate-400/10";
      case 2: return "from-amber-600/20 to-amber-800/5 border-amber-700/30 shadow-amber-700/10";
      default: return "from-primary/20 to-primary/5 border-primary/30 shadow-primary/10";
    }
  };

  return (
    <section id="top-donors" className="py-24 sm:py-32 relative overflow-hidden bg-background">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Trophy className="h-3.5 w-3.5" />
            Elite Contributors
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground tracking-tight mb-6"
          >
            Top <span className="text-gradient-primary font-extrabold italic">Donor</span> Leaderboard
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto"
          >
            Recognizing the champions who lead the way in food preservation and community support.
          </motion.p>
        </div>

        {!donors.length ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {donors.map((donor, i) => (
              <motion.div
                key={donor._id || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ y: -12 }}
                className="relative"
              >
                {/* Card Decoration */}
                <div className={`absolute inset-x-4 -bottom-2 h-12 bg-gradient-to-t ${getRankColor(i)} blur-xl opacity-40 group-hover:opacity-60 transition-opacity`} />
                
                <Card className={`glass-card overflow-hidden border-2 transition-all duration-500 bg-gradient-to-br ${getRankColor(i)} backdrop-blur-md group`}>
                  <CardContent className="p-10 flex flex-col items-center text-center">
                    {/* Rank Badge */}
                    <div className="absolute top-6 right-6 flex items-center justify-center p-2 rounded-xl bg-background/40 backdrop-blur-sm border border-white/10 shadow-lg">
                      {getRankIcon(i)}
                    </div>

                    {/* Avatar Section */}
                    <div className="relative mb-8 pt-4">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: [0, 2, 0, -2, 0]
                        }}
                        transition={{ 
                          duration: 5, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="relative p-1.5 rounded-full bg-gradient-to-tr from-primary via-primary/50 to-transparent shadow-2xl"
                      >
                        <Avatar className="h-32 w-32 border-4 border-background h-32 w-32">
                          {donor.avatar_url ? (
                            <AvatarImage src={donor.avatar_url} alt={donor.full_name} className="object-cover" />
                          ) : (
                            <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-black">
                              {(donor.full_name || 'U').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </motion.div>
                      
                      {/* Floating Glow */}
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl -z-10 group-hover:bg-primary/40 transition-colors" />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl font-display font-bold text-foreground leading-tight">
                        {donor.full_name}
                      </h3>
                      
                      <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-background/30 backdrop-blur-sm border border-white/5">
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Contribution Impact</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-display font-black text-gradient-primary">
                            {donor.points.toLocaleString()}
                          </span>
                          <span className="text-sm font-bold text-primary/70">PTS</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer Decoration */}
                    <div className="mt-8 pt-6 border-t border-white/5 w-full">
                      <div className="flex justify-between items-center text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                        <span>Certified Donor</span>
                        <span>{i === 0 ? "Gold Tier" : i === 1 ? "Silver Tier" : "Bronze Tier"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-8" />
          <p className="text-sm text-muted-foreground">Join the elite contributors. Donate food and climb the leaderboard.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default TopDonorsModern;
