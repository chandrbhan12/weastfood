import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Package, Search } from "lucide-react";
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
        const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api';
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
        const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api';
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    try {
      const saved = localStorage.getItem('auth_session');
      const token = saved ? JSON.parse(saved).token : null;
      if (!token) return toast.error('You must be logged in to delete.');
      
      const res = await fetch(`/api/pickups/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setListings(prev => prev.filter(l => l._id !== id));
        setMyDonations(prev => prev.filter(d => d._id !== id));
        toast.success('Donation deleted successfully');
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to delete donation');
      }
    } catch (e) {
      console.error('Delete failed', e);
      toast.error('Could not delete donation.');
    }
  };

  const filtered = listings.filter((item: any) => {
    // Exclude own donations from the main browse grid as they are already in the "My Donations" section
    const isOwnDonation = user && (item.donor?._id === user.id || item.donor === user.id);
    if (isOwnDonation) return false;

    const matchesSearch =
      (item.items || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.donor?.full_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || (item.type || '').toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  }); // Filtered out own donations to prevent double cards

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground tracking-tight leading-tight">
             My <span className="text-gradient-primary font-extrabold italic">Donation</span> Dashboard
          </h1>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground font-medium max-w-xl">
             Track and manage your active food contributions. Mark items as completed once they have been picked up.
          </p>
        </motion.div>

        {myDonations.length > 0 && (
          <div className="mt-12 sm:mt-16 bg-black/5 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 border border-white/10 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-foreground tracking-tight">
                  My <span className="text-gradient-primary font-extrabold italic">Donations</span> (To-Do)
                </h2>
                <p className="text-sm text-muted-foreground mt-1 text-white/40 italic">Manage and track your active food contributions.</p>
              </div>
              <Badge variant="outline" className="w-fit h-fit px-4 py-1.5 rounded-full bg-primary/10 border-primary/20 text-primary font-bold uppercase tracking-widest text-[10px]">
                {myDonations.length} Active Tasks
              </Badge>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
              {myDonations.map((item: any, i: number) => (
                <ListingCard 
                  key={item._id || i} 
                  item={item} 
                  index={i} 
                  actionLabel={item.status === 'completed' ? 'Done' : 'Mark Completed'}
                  onAction={() => markCompleted(item._id)}
                  isOwner={item.donor?._id === user?.id || item.donor === user?.id}
                  onDelete={() => handleDelete(item._id)}
                  className="bg-black/40 border-white/5 hover:bg-black/60 transition-all shadow-2xl"
                />
              ))}
            </div>
          </div>
        )}

        {/* Removed main listings section as per user request to focus on My Donations (To-Do) */}

        {filtered.length === 0 && myDonations.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground font-medium italic">No active donations or tasks found.</p>
          </div>
        )}

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
