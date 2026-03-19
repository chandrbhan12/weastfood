import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Mail, Phone, Badge, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Profile = () => {
  const { user, signOut } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [items, setItems] = useState('');
  const [locationVal, setLocationVal] = useState('');
  const socketRef = useRef<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  useEffect(() => {
    // connect socket
    try {
      const socket = io(import.meta.env.VITE_API_URL || '/');
      socketRef.current = socket;
      socket.on('connect', () => {
        console.log('connected to socket', socket.id);
      });
      
      // identify will be sent from a separate effect when `user` becomes available
      socket.on('pickupCreated', (data: any) => {
        setRequests(prev => [data, ...prev]);
      });
      socket.on('pickupAccepted', (data: any) => {
        setRequests(prev => prev.map(r => (r._id === data._id ? data : r)));
        toast({ title: 'Pickup Claimed', description: 'Your donation was claimed — thank you!' });
      });
      socket.on('pickupAcceptedByPartner', (data: any) => {
        setRequests(prev => prev.map(r => (r._id === data._id ? data : r)));
      });
      socket.on('pickupStatusUpdated', (data: any) => {
        setRequests(prev => prev.map(r => (r._id === data._id ? data : r)));
        toast({ title: 'Pickup Update', description: `Status changed to ${data.status}` });
      });
    } catch (err) {
      console.warn('Socket init failed', err);
    }

    // fetch my requests and history
    (async () => {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || '/api') + '/pickups/me', { credentials: 'include' });
        const json = await res.json();
        setRequests([...(json.asDonor || []), ...(json.asPartner || [])]);

        const hres = await fetch((import.meta.env.VITE_API_URL || '/api') + '/pickups/history', { credentials: 'include' });
        const hj = await hres.json();
        setHistory(hj || []);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // send identify when user becomes available
  useEffect(() => {
    if (socketRef.current && user?.id) {
      try {
        socketRef.current.emit('identify', user.id);
      } catch (e) {
        console.warn('identify emit failed', e);
      }
    }
  }, [user]);

  const submitRequest = async () => {
    if (!items) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '/api') + '/pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
      const res = await fetch((import.meta.env.VITE_API_URL || '/api') + `/pickups/${id}/accept`, { method: 'POST', credentials: 'include' });
      const json = await res.json();
      setRequests(prev => prev.map(r => (r._id === json._id ? json : r)));
    } catch (e) { console.error(e); }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '/api') + `/pickups/${id}/reject`, { method: 'POST', credentials: 'include' });
      const json = await res.json();
      setRequests(prev => prev.map(r => (r._id === json._id ? json : r)));
    } catch (e) { console.error(e); }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'restaurant':
        return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'volunteer':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
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
        return '🤝 Volunteer / NGO';
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

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4">
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground mt-1">Donations</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground mt-1">Recipients</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground mt-1">Impact</p>
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
          <Card className="glass border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle>Pickup Requests & History</CardTitle>
              <CardDescription>Request pickups, view status, and manage incoming requests</CardDescription>
            </CardHeader>
            <CardContent>
              {user.role === 'restaurant' && (
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-muted-foreground">Create a pickup request for NGOs / pickup partners</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input value={items} onChange={e => setItems(e.target.value)} placeholder="Items description" className="col-span-2 p-2 rounded border" />
                    <input value={locationVal} onChange={e => setLocationVal(e.target.value)} placeholder="Pickup location" className="p-2 rounded border" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={submitRequest} className="glow-primary">Request Pickup</Button>
                  </div>
                </div>
              )}

              {user.role === 'volunteer' && (
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-muted-foreground">Incoming pickup requests</p>
                  <div className="space-y-2">
                    {requests.filter(r => r.status === 'requested').map(r => (
                      <div key={r._id} className="p-3 rounded bg-muted/40 border flex items-start justify-between">
                        <div>
                          <div className="font-medium">{r.items}</div>
                          <div className="text-sm text-muted-foreground">{r.location}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleAccept(r._id)} size="sm">Accept</Button>
                          <Button variant="outline" onClick={() => handleReject(r._id)} size="sm">Reject</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <p className="text-sm font-medium mb-2">All my requests</p>
                <div className="space-y-2">
                  {requests.map(r => (
                    <div key={r._id} className="p-3 rounded bg-muted/30 border flex items-center justify-between">
                      <div>
                        <div className="font-medium">{r.items}</div>
                        <div className="text-sm text-muted-foreground">Status: {r.status}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleString?.() || r.createdAt}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Donation history</p>
                <div className="space-y-2">
                  {history.map(h => (
                    <div key={h._id} className="p-2 rounded bg-muted/10 border">
                      <div className="text-sm font-medium">{h.items}</div>
                      <div className="text-xs text-muted-foreground">{h.status} • {new Date(h.createdAt).toLocaleString?.()}</div>
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
