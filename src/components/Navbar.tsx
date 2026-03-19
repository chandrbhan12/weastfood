import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, LogOut, User, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [optIn, setOptIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('notify_opt_in') === 'true';
    } catch (e) {
      return false;
    }
  });
  const socketRef = useRef<any>(null);
  const unreadCount = notifications.length;

  useEffect(() => {
    // if user opted in, create socket and listen for targeted events
    if (!user || !optIn) return;

    // dynamically import to avoid loading on server
    import('socket.io-client').then(({ io }) => {
      const socket = io(import.meta.env.VITE_API_URL || '/');
      socketRef.current = socket;
      socket.on('connect', () => {
        if (user?.id) socket.emit('identify', user.id);
      });

      socket.on('pickupAccepted', (data: any) => {
        setNotifications((prev) => [{ id: data._id || Date.now(), title: 'Pickup Claimed', body: 'Your donation was claimed', data }, ...prev]);
      });
      socket.on('pickupStatusUpdated', (data: any) => {
        setNotifications((prev) => [{ id: data._id || Date.now(), title: 'Pickup Update', body: `Status: ${data.status}`, data }, ...prev]);
      });
    });

    return () => {
      try {
        socketRef.current?.disconnect();
        socketRef.current = null;
      } catch (e) {}
    };
  }, [user, optIn]);

  useEffect(() => {
    try {
      localStorage.setItem('notify_opt_in', optIn ? 'true' : 'false');
    } catch (e) {}
  }, [optIn]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/browse", label: "Browse Food" },
    { to: "/add-food", label: "Donate Food" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/track", label: "Track" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border glass">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md glow-primary"
          >
            <Heart className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="font-display text-xl text-foreground group-hover:text-primary transition-colors">FoodLink</span>
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
            <DropdownMenuContent align="end" className="w-80 glass">
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Notifications</div>
                  <div className="text-xs text-muted-foreground">{unreadCount} new</div>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="text-xs text-muted-foreground">No notifications</div>
                  )}
                  {notifications.map(n => (
                    <div key={n.id} className="p-2 rounded hover:bg-muted/30 cursor-pointer" onClick={() => { /* no-op for now */ }}>
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.body}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input id="notif-opt" type="checkbox" checked={optIn} onChange={() => setOptIn(v => !v)} className="h-4 w-4" />
                    <label htmlFor="notif-opt" className="text-xs">Enable notifications</label>
                  </div>
                  <button className="text-xs text-muted-foreground" onClick={() => setNotifications([])}>Mark all read</button>
                </div>
              </div>
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
                        <div className="flex items-center gap-2">
                          <Bell className="h-5 w-5" />
                          <div className="text-sm font-medium">Notifications</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input id="mobile-notif-opt" type="checkbox" checked={optIn} onChange={() => setOptIn(v => !v)} className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">{notifications.length === 0 ? 'No notifications' : `${notifications.length} unread`}</div>
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
