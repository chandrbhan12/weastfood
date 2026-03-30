import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Package, Search, X } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ListingCard from "@/components/ListingCard";

const categories = ["All", "Cooked Meals", "Bakery", "Snacks", "Fresh Produce"];

const Browse = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [listings, setListings] = useState<any[]>([]);
  const location = useLocation();
  const [fetchStatus, setFetchStatus] = useState<string>('idle');
  const [preview, setPreview] = useState<string>('');
  const { user } = useAuth();
  const [myDonations, setMyDonations] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchListings = async () => {
      try {
        const saved = localStorage.getItem('auth_session');
        const token = saved ? JSON.parse(saved).token : null;
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        setFetchStatus('loading');
        const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '') + '/api';
        let res = await fetch(apiBase + '/pickups', { headers });
        if (!res.ok) {
          // try public endpoint if primary fails for any reason
          console.warn('Primary /pickups failed, status:', res.status);
          res = await fetch(apiBase + '/pickups/public');
          console.warn('Tried /pickups/public, status:', res.status);
        }
        if (!res.ok) {
          setFetchStatus(`error:${res.status}`);
          console.error('Failed to load listings, both endpoints returned non-ok');
          return;
        }
        const json = await res.json();
        setFetchStatus('ok');
        const base = json || [];
        const newListing = (location && (location.state as any)?.newListing) || null;
        if (!mounted) return;
        if (newListing) {
          setListings((prev) => [newListing, ...base]);
        } else {
          setListings(base);
        }
        setPreview(base && base.length ? (base[0].items || JSON.stringify(base[0]).slice(0,80)) : '');
      } catch (e) {
        setFetchStatus('exception');
        console.error('Failed to load listings', e);
      }
    };

    fetchListings();
    const id = setInterval(fetchListings, 6000);
    return () => { mounted = false; clearInterval(id); };
  }, []);


  // Fetch current user's donations (to-do style)
  useEffect(() => {
    let mounted = true;
    const fetchMine = async () => {
      try {
        const saved = localStorage.getItem('auth_session');
        const token = saved ? JSON.parse(saved).token : null;
        if (!token) return setMyDonations([]);
        const headers: Record<string, string> = { 'Authorization': `Bearer ${token}` };
        const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '') + '/api';
        const res = await fetch(apiBase + '/pickups/me', { headers });
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        // controller returns { asDonor, asPartner }
        setMyDonations(json.asDonor || []);
      } catch (e) {
        console.error('Failed to load my donations', e);
      }
    };

    fetchMine();
    const iid = setInterval(fetchMine, 8000);
    return () => { mounted = false; clearInterval(iid); };
  }, [user]);

  const handleClaim = async (item: any) => {
    try {
      const saved = localStorage.getItem('auth_session');
      const token = saved ? JSON.parse(saved).token : null;
      if (!token) return toast.error('Please login to claim food');

      const res = await fetch(`/api/pickups/${item._id}/accept`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });

      if (!res.ok) throw new Error("Failed to claim food");
      
      toast.success(`Food claimed successfully!`);
      // Refresh listings
      const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '') + '/api';
      const updatedRes = await fetch(apiBase + '/pickups', { 
        headers: token ? { 'Authorization': `Bearer ${token}` } : {} 
      });
      if (updatedRes.ok) {
        const json = await updatedRes.json();
        setListings(json);
      }
    } catch (error) {
      console.error("Claim error", error);
      toast.error("Failed to claim this food");
    }
  };

  const handleReject = async (item: any) => {
    try {
      const saved = localStorage.getItem('auth_session');
      const token = saved ? JSON.parse(saved).token : null;
      if (!token) return toast.error('Please login to continue');

      const res = await fetch(`/api/pickups/${item._id}/reject`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });

      if (!res.ok) throw new Error("Failed to reject food");
      
      toast.info(`Listing rejected`);
      // Refresh listings
      const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '') + '/api';
      const updatedRes = await fetch(apiBase + '/pickups', { 
        headers: token ? { 'Authorization': `Bearer ${token}` } : {} 
      });
      if (updatedRes.ok) {
        const json = await updatedRes.json();
        setListings(json);
      }
    } catch (error) {
      console.error("Reject error", error);
      toast.error("Failed to reject this food");
    }
  };

  const markCompleted = async (id: string) => {
    try {
      const saved = localStorage.getItem('auth_session');
      const token = saved ? JSON.parse(saved).token : null;
      if (!token) return toast.error('You must be logged in to update status.');
      const base = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(base + `/pickups/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'completed' }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setMyDonations((prev) => prev.map((p) => (p._id === id ? updated : p)));
      toast.success('Marked donation as completed.');
    } catch (e) {
      console.error('Status update failed', e);
      toast.error('Could not update donation status.');
    }
  };

  const filtered = listings.filter((item: any) => {
    const matchesSearch =
      (item.items || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.donor?.full_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || (item.type || '').toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Sample fallback listings to display when no real listings are available
  const sampleListings = [
    {
      _id: 'sample-1',
      items: 'Biryani & Curry (20 servings)',
      donor: { full_name: 'Golden Spice Kitchen', avatar_url: null },
      location: 'MG Road, Sector 14',
      servings: 20,
      type: 'cooked',
      image: '/listing-1.svg',
    },
    {
      _id: 'sample-2',
      items: "Assorted Breads & Pastries (15 pcs)",
      donor: { full_name: "The Baker's Dozen", avatar_url: null },
      location: 'Civil Lines, Block B',
      servings: 15,
      type: 'bakery',
      image: '/listing-2.svg',
    },
    {
      _id: 'sample-3',
      items: 'Wedding Buffet Leftovers (50 servings)',
      donor: { full_name: 'Hotel Grand Feast', avatar_url: null },
      location: 'Ring Road, Near Mall',
      servings: 50,
      type: 'cooked',
      image: '/listing-3.svg',
    },
  ];

  const itemsToRender = listings.length === 0 ? sampleListings : filtered;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground">
            Browse Available Food
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Find and claim surplus food from restaurants near you.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by food or restaurant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className="cursor-pointer text-xs sm:text-sm"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
        {myDonations.length > 0 && (
          <div className="mt-6 sm:mt-8 md:mt-10">
            <h2 className="font-display text-lg text-foreground">My Donations (To-Do)</h2>
            <div className="mt-3 space-y-3">
              {myDonations.map((item: any) => (
                <div key={item._id} className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <div className="font-medium">{item.items}</div>
                    <div className="text-xs text-muted-foreground">{item.location} • {item.servings || 0} servings</div>
                    <div className="text-xs text-muted-foreground">Status: {item.status}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status !== 'completed' && (
                      <Button size="sm" onClick={() => markCompleted(item._id)}>Mark Completed</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listings */}
        <div className="mt-6 sm:mt-8 md:mt-10">
          <div className="text-sm text-muted-foreground mb-3">Listings: {listings.length} — Filtered: {filtered.length}</div>
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {itemsToRender.map((item: any, i: number) => (
              <ListingCard key={item._id || i} item={item} index={i} onClaim={handleClaim} onReject={handleReject} userRole={user?.role} />
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground">No food listings match your search.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Browse;
