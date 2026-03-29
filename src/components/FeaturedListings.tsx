import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ListingCard from "@/components/ListingCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const FeaturedListings = () => {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchListings = async () => {
      try {
        const saved = localStorage.getItem('auth_session');
        const token = saved ? JSON.parse(saved).token : null;
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        let res = await fetch((import.meta.env.VITE_API_URL || '/api') + '/pickups', { headers });
        if (!res.ok && res.status === 401) {
          res = await fetch((import.meta.env.VITE_API_URL || '/api') + '/pickups/public');
        }
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        setListings(json.slice(0, 6));
      } catch (e) {
        console.error('Failed to load featured listings', e);
      }
    };

    fetchListings();
    const id = setInterval(fetchListings, 8000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  if (!listings.length) return null;

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground tracking-tight"
            >
              Available <span className="text-gradient-primary">Right Now</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-2 sm:mt-3 text-muted-foreground text-sm sm:text-base md:text-lg"
            >
              Fresh food waiting to be rescued. Claim before it expires!
            </motion.p>
          </div>
          <motion.div whileHover={{ x: 5 }}>
            <Button variant="ghost" className="hidden text-primary sm:flex text-sm md:text-base" asChild>
              <Link to="/browse">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 grid gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((item: any, i: number) => (
            <ListingCard key={item._id || i} item={item} index={i} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Button variant="outline" className="glass border-primary/30" asChild>
            <Link to="/browse">
              View All Listings <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
