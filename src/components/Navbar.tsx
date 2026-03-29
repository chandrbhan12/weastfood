import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, LogOut, User, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);


  const links = [
    { to: "/", label: "Home" },
    ...(user?.role === 'volunteer' || user?.role === 'ngo' ? [{ to: "/dashboard", label: "Dashboard" }] : []),
    { to: "/browse", label: "Browse Food" },
    { to: "/add-food", label: "Donate Food" },
    { to: "/track", label: "Track Delivery" },
    { to: "/#top-donors", label: "Top Donors" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const saved = localStorage.getItem('auth_session');
        const token = saved ? JSON.parse(saved).token : null;
        if (!token) return;

        const res = await fetch('/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          
          // Trigger toast for new unread messages
          const currentUnreadIds = new Set(notifications.filter((n: any) => !n.isRead).map((n: any) => n._id));
          const newUnread = data.filter((n: any) => !n.isRead && !currentUnreadIds.has(n._id));
          
          if (newUnread.length > 0) {
            newUnread.forEach((n: any) => {
              toast(n.title, {
                description: n.message,
                icon: <Bell className="h-4 w-4 text-primary" />,
              });
            });
          }
          
          setNotifications(data);
        }
      } catch (e) {
        console.error("Failed to load notifications", e);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user, notifications.length]);

  const handleMarkAllRead = async () => {
    try {
      const saved = localStorage.getItem('auth_session');
      const token = saved ? JSON.parse(saved).token : null;
      if (!token) return;

      const res = await fetch('/api/notifications/all/read', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read");
      }
    } catch (e) {
      console.error("Mark all read failed", e);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      {/* Top ambient glow line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-[0_8px_20px_-6px_rgba(20,184,166,0.5)]"
          >
            <Heart className="h-5 w-5 text-primary-foreground fill-current" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">FoodLink</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 leading-none">V2 Premium</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                isActive(link.to)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {/* Notification bell always visible on desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded hover:bg-muted/40" onClick={() => { if (!user) navigate('/login'); }}>
                <Bell className="h-5 w-5 text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-destructive rounded-full">{unreadCount}</span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 glass border-white/10 shadow-2xl p-0 overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold uppercase tracking-widest text-foreground">Notifications</div>
                  <Badge className="bg-primary/20 text-primary border-0 font-bold">{unreadCount} new</Badge>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map(n => (
                      <div key={n._id || n.id} className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}>
                        <div className="flex gap-3">
                           <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-primary animate-pulse' : 'bg-transparent'}`} />
                           <div>
                              <div className="text-sm font-bold text-foreground leading-tight">{n.title}</div>
                              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</div>
                              <div className="text-[10px] text-muted-foreground/60 mt-2 font-mono">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-3 bg-white/5 border-t border-white/5 flex items-center justify-center">
                  <button 
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors" 
                    onClick={handleMarkAllRead}
                  >
                    Mark all current as read
                  </button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2.5 rounded-full glass px-4 py-2 transition-all hover:border-primary/30"
                >
                  <Avatar className="h-7 w-7">
                    {user?.avatar_url ? (
                      <AvatarImage src={user.avatar_url} />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        {getInitials(user?.full_name || user?.email || "U")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">
                    {user?.full_name || user?.email?.split('@')[0] || "User"}
                  </span>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass">
                <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground text-xs">
                  <User className="h-3 w-3" />
                  {user?.role === "restaurant" ? "🧑‍🍳 Restaurant" : "🤝 Volunteer"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" className="glow-primary" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-border glass px-4 py-4 md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {links.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all block ${
                      isActive(link.to)
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-3 flex gap-2">
                {user ? (
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between rounded-lg glass px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                            {getInitials(profile?.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{profile?.full_name || "User"}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="rounded-lg glass px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Notifications</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 glass border-primary/20" asChild>
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button size="sm" className="flex-1 glow-primary" asChild>
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
