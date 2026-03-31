import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Mail, Phone, Heart, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";

const apiBaseUrl = process.env.VITE_API_URL || "http://localhost:3000";

const Profile = () => {
  const { user, signOut } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [items, setItems] = useState('');
  const [locationVal, setLocationVal] = useState('');
  
  const navigate = useNavigate();

  const [latestPoints, setLatestPoints] = useState(user?.points || 0);

  useEffect(() => {
    // fetch my requests and history
    if (!user) return;
    (async () => {
      try {
        const saved = localStorage.getItem('auth_session');
        const token = saved ? JSON.parse(saved).token : null;
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${apiBaseUrl}/api/pickups/me`, { headers });
        if (res.ok) {
          const json = await res.json();
          setRequests([...(json.asDonor || []), ...(json.asPartner || [])]);
        }

        const hres = await fetch(`${apiBaseUrl}/api/pickups/history`, { headers });
        if (hres.ok) {
          const hj = await hres.json();
          setHistory(hj || []);
        }

        // Fetch latest user points
        const ures = await fetch(`${apiBaseUrl}/api/auth/me`, { headers });
        if (ures.ok) {
          const ud = await ures.json();
          setLatestPoints(ud.points || ud.user?.points || 0);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex items-center justify-center py-16 sm:py-20 md:py-24 px-4">
          <Card className="w-full max-w-md glass border-primary/10">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl">Access Denied</CardTitle>
              <CardDescription className="text-sm sm:text-base">Please login to view your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/login")} className="w-full glow-primary text-sm sm:text-base">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };



  // No socket usage: identification/emits are disabled

  const submitRequest = async () => {
    if (!items) return;
    try {
      const saved = localStorage.getItem('auth_session');
      const token = saved ? JSON.parse(saved).token : null;
      const res = await fetch(`${apiBaseUrl}/api/pickups`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items, location: locationVal }),
      });
      const json = await res.json();
      setRequests(prev => [json, ...prev]);
      setItems('');
      setLocationVal('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      const saved = localStorage.getItem('auth_session');
      const token = saved ? JSON.parse(saved).token : null;
      const res = await fetch(`${apiBaseUrl}/api/pickups/${id}/accept`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setRequests(prev => prev.map(r => (r._id === json._id ? json : r)));
    } catch (e) { console.error(e); }
  };

  const handleReject = async (id: string) => {
    try {
      const saved = localStorage.getItem('auth_session');
      const token = saved ? JSON.parse(saved).token : null;
      const res = await fetch(`${apiBaseUrl}/api/pickups/${id}/reject`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setRequests(prev => prev.map(r => (r._id === json._id ? json : r)));
    } catch (e) { console.error(e); }
  };

  const markCompleted = async (id: string) => {
    try {
      const saved = localStorage.getItem('auth_session');
      const token = saved ? JSON.parse(saved).token : null;
      if (!token) return toast.error('You must be logged in to update status.');
      const res = await fetch(`${apiBaseUrl}/api/pickups/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'completed' }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setRequests(prev => prev.map(p => (p._id === id ? updated : p)));
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
      if (!token) return toast.error('Please login.');
      
      const res = await fetch(`${apiBaseUrl}/api/pickups/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setRequests(prev => prev.filter(r => r._id !== id));
        toast.success('Donation deleted successfully');
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to delete');
      }
    } catch (e) {
      console.error('Delete failed', e);
      toast.error('Could not delete donation.');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'restaurant':
        return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'volunteer':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'ngo':
        return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'admin':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'restaurant':
        return '🧑‍🍳 Restaurant / Food Donor';
      case 'volunteer':
        return '🤝 Volunteer';
      case 'ngo':
        return '🏢 NGO / Organization';
      case 'admin':
        return '👨‍💼 Administrator';
      default:
        return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 sm:py-10 md:py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-2xl"
        >
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display text-foreground mb-2">My Profile</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your FoodLink account</p>
          </div>

          {/* Profile Card */}
          <Card className="glass border-primary/10 shadow-2xl mb-6 sm:mb-8">
            <CardHeader className="pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative flex-shrink-0"
                  >
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary/30">
                      <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
                      <AvatarFallback className="bg-primary/10 text-base sm:text-lg font-bold">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-green-500 border-2 border-background" />
                  </motion.div>
                  <div className="flex-1 sm:flex-none">
                    <CardTitle className="text-lg sm:text-2xl">{user.full_name}</CardTitle>
                    <div className="mt-2 flex gap-2">
                      <Badge className={`${getRoleBadgeColor(user.role)} border text-xs sm:text-sm`}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6">
              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">Email Address</p>
                  <p className="text-sm sm:text-base text-foreground font-medium">{user.email}</p>
                </div>
              </div>

              {/* Phone */}
              {user.phone && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Phone Number</p>
                    <p className="text-sm sm:text-base text-foreground font-medium">{user.phone || "Not provided"}</p>
                  </div>
                </div>
              )}

              {/* Role */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">Account Type</p>
                  <p className="text-sm sm:text-base text-foreground font-medium">{getRoleLabel(user.role)}</p>
                </div>
              </div>

              {/* Points Display - Only for Restaurant Donors */}
              {user.role === 'restaurant' && (
                <div className="flex justify-center pt-4">
                   <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-4 bg-background/50 border border-primary/20 rounded-full px-6 py-2 shadow-lg backdrop-blur-md"
                   >
                      <div className="relative">
                         <img src="/xp_icon.svg" alt="XP" className="h-10 w-10 sm:h-12 sm:w-12 drop-shadow-md" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-3xl sm:text-4xl font-bold text-foreground leading-none">
                            {latestPoints}
                         </span>
                         <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Total Points</span>
                      </div>
                   </motion.div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-2xl font-bold text-primary">{history.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Donations</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-2xl font-bold text-primary">{requests.filter(r => r.pickupPartner).length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Pickups</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-border/50">
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Home
                </Button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto w-full max-w-2xl"
        >
          <Card className="glass border-primary/10 shadow-xl overflow-hidden">
            <CardHeader className="bg-white/10 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Your Active Tasks</CardTitle>
                  <CardDescription>Track and manage your ongoing donations and pickups</CardDescription>
                </div>
                <Badge className="bg-primary/20 text-primary border-0 font-bold">
                  {requests.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Request Form for Donors */}
              {user.role === 'restaurant' && (
                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors" />
                  <div className="relative z-10">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                       <Package className="h-4 w-4" /> Post New Food
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        value={items} 
                        onChange={e => setItems(e.target.value)} 
                        placeholder="What food are you donating?" 
                        className="flex-1 bg-black/20 border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground/40 text-white transition-all font-medium" 
                      />
                      <input 
                        value={locationVal} 
                        onChange={e => setLocationVal(e.target.value)} 
                        placeholder="Pickup location" 
                        className="sm:w-1/3 bg-black/20 border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground/40 text-white transition-all font-medium" 
                      />
                      <Button onClick={submitRequest} className="glow-primary px-6 h-12 rounded-xl text-xs font-bold uppercase tracking-widest">
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of Active Task Cards */}
              <div className="space-y-4">
                {requests.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-white/20 rounded-3xl">
                    <Package className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground font-medium italic">No active tasks right now.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {requests.map((r, i) => (
                      <ListingCard 
                        key={r._id || i} 
                        item={r} 
                        index={i} 
                        actionLabel={
                          user.role === 'restaurant' ? (r.status === 'completed' ? 'Done' : 'Mark Completed') : 
                          (r.status === 'requested' ? 'Accept Pickup' : 'Done')
                        }
                        onAction={() => {
                          if (user.role === 'restaurant' && r.status !== 'completed') return markCompleted(r._id);
                          if (user.role !== 'restaurant' && r.status === 'requested') return handleAccept(r._id);
                        }}
                        isOwner={r.donor?._id === user?.id || r.donor === user?.id}
                        onDelete={() => handleDelete(r._id)}
                        className="bg-black/40 border-white/5 shadow-2xl"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* History Section (Simplified) */}
              <div className="pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">History Archive</h3>
                   <span className="text-xs text-muted-foreground/60">{history.length} items logged</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {history.map(h => (
                    <div key={h._id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <Heart className="h-4 w-4 text-emerald-500 fill-current opacity-40" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">{h.items}</div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                            {new Date(h.createdAt).toLocaleDateString()} • {h.status}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase border-emerald-500/20 text-emerald-500/60 font-black">
                        COMPLETED
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
