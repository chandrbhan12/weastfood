import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Package, MapPin, Clock, CheckCircle2, Truck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ListingCard from "@/components/ListingCard";
import DeliveryProgress from "@/components/DeliveryProgress";

const NGODashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    nearbyRequests: 0,
    totalToday: 0,
    activePickups: 0,
    completedDeliveries: 0,
  });
  const [nearbyRequests, setNearbyRequests] = useState<any[]>([]);
  const [activePickups, setActivePickups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const saved = localStorage.getItem('auth_session');
      const token = saved ? JSON.parse(saved).token : null;
      if (!token) return;

      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Stats
      const statsRes = await fetch('/api/pickups/stats', { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch All Requests (for nearby)
      const allRes = await fetch('/api/pickups', { headers });
      if (allRes.ok) {
        const allData = await allRes.json();
        setNearbyRequests(allData.filter((r: any) => r.status === 'requested'));
      }

      // Fetch My Requests (for active)
      const myRes = await fetch('/api/pickups/me', { headers });
      if (myRes.ok) {
        const myData = await myRes.json();
        setActivePickups(myData.asPartner?.filter((r: any) => ['accepted', 'in_transit'].includes(r.status)) || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      toast.error("Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  };

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
      
      toast.success(`Food claimed! Check "My Active Pickups"`);
      fetchDashboardData();
    } catch (error) {
      console.error("Claim error", error);
      toast.error("Failed to claim this food");
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Live Location Tracking Effect
  useEffect(() => {
    const inTransit = activePickups.filter(p => p.status === 'in_transit');
    if (inTransit.length === 0) return;

    let watchId: any = null;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const saved = localStorage.getItem('auth_session');
          const token = saved ? JSON.parse(saved).token : null;
          
          for (const pickup of inTransit) {
            try {
              await fetch(`/api/pickups/${pickup._id}/location`, {
                method: 'POST',
                headers: { 
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ lat: latitude, lng: longitude }),
              });
            } catch (err) {
              console.warn("Location update failed", err);
            }
          }
        },
        (err) => console.error("Geo watch error", err),
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [activePickups]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const saved = localStorage.getItem('auth_session');
      const token = saved ? JSON.parse(saved).token : null;
      
      const res = await fetch(`/api/pickups/${id}/status`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display text-foreground">NGO Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.full_name}. Here's what's happening today.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Nearby Requests", value: stats.nearbyRequests, icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Total Today", value: stats.totalToday, icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
            { label: "Active Pickups", value: stats.activePickups, icon: Truck, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Completed", value: stats.completedDeliveries, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
          ].map((stat, i) => (
            <Card key={i} className="glass">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Active Pickups */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-display flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              My Active Pickups
            </h2>
            {activePickups.length === 0 ? (
              <Card className="glass border-dashed">
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No active pickups. Claim some food to get started!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activePickups.map((pickup) => (
                  <Card key={pickup._id} className="glass overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{pickup.items}</CardTitle>
                        <Badge variant="outline">{pickup.status.replace('_', ' ')}</Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {pickup.location}
                      </CardDescription>
                      <div className="mt-4 px-2">
                        <DeliveryProgress status={pickup.status} size="sm" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="mt-4 flex flex-col gap-2">
                        {pickup.status === 'accepted' && (
                          <Button size="sm" onClick={() => updateStatus(pickup._id, 'in_transit')} className="w-full">
                            Mark as Picked Up
                          </Button>
                        )}
                        {pickup.status === 'in_transit' && (
                          <Button size="sm" onClick={() => updateStatus(pickup._id, 'completed')} className="w-full bg-green-600 hover:bg-green-700">
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Nearby Food Requests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Nearby Food Requests
              </h2>
              <Button variant="ghost" size="sm" onClick={() => window.location.href='/browse'}>View All</Button>
            </div>
            {nearbyRequests.length === 0 ? (
              <Card className="glass border-dashed">
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-primary/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Everything's claimed!</h3>
                  <p className="text-muted-foreground mt-1">Check back soon for new donations in your area.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyRequests.map((request, i) => (
                  <ListingCard key={request._id} item={request} index={i} onClaim={handleClaim} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NGODashboard;
