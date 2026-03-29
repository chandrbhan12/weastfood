import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, User, Phone } from "lucide-react";

const InitialAuthPrompt: React.FC = () => {
  const { user, loading, login, signup } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("volunteer");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (loading || user) {
      setOpen(false);
      return;
    }
    
    // Show the auth prompt after a 10-second delay to be less intrusive
    const timer = setTimeout(() => {
      setOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [user, loading]);

  // prevent closing the dialog while unauthenticated (mandating login after 10s)
  const handleOpenChange = (v: boolean) => {
    if (!v && !user) {
      setOpen(true);
      return;
    }
    setOpen(v);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoadingAction(true);
    try {
      await login(email, password);
      toast({ title: "Logged in", description: "Welcome back!" });
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message || "Please try again", variant: "destructive" });
    }
    setLoadingAction(false);
  };

  const handleSignup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoadingAction(true);
    try {
      await signup(email, password, fullName, phone, role);
      toast({ title: "Account created", description: "You are now logged in." });
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message || "Please try again", variant: "destructive" });
    }
    setLoadingAction(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-full max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent shadow-none"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 0.4, ease: "easeOut" }} 
          className="w-full bg-background/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: branding / illustration */}
            <div className="hidden md:flex flex-col justify-center items-start p-6 rounded-lg bg-gradient-to-br from-primary/5 via-accent/3 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary glow-primary">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Welcome to FoodLink</h3>
                  <p className="text-sm text-muted-foreground">Donate surplus food or help deliver to those in need.</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p className="mb-2">Quick features:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Request pickups and manage donations</li>
                  <li>Join as a volunteer or food donor</li>
                  <li>Real-time updates (when enabled)</li>
                </ul>
              </div>
            </div>

            {/* Right: form */}
            <div className="p-8 md:p-12 bg-background/40 backdrop-blur-xl relative z-10">
              <DialogHeader className="px-0 pt-0 text-left">
                <DialogTitle className="text-2xl md:text-3xl font-display tracking-tight leading-tight">
                   {mode === "login" ? "Sign in to " : "Create your "} 
                   <span className="text-gradient-primary">Account</span>
                </DialogTitle>
                <DialogDescription className="text-sm md:text-base text-muted-foreground/80 mt-2 font-medium">
                   {mode === "login" ? "Welcome back! Access your dashboard." : "Join the FoodLink community and save meals."}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <div className="flex gap-2 justify-center md:justify-start mb-4">
                  <button onClick={() => setMode("login")} className={`px-4 py-2 rounded-md text-sm font-medium ${mode === "login" ? "bg-primary text-white" : "bg-muted/10 text-foreground"}`}>Log In</button>
                  <button onClick={() => setMode("signup")} className={`px-4 py-2 rounded-md text-sm font-medium ${mode === "signup" ? "bg-primary text-white" : "bg-muted/10 text-foreground"}`}>Sign Up</button>
                </div>

                {mode === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label className="text-sm">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="text-xs text-muted-foreground">Don't have an account? <button type="button" onClick={() => setMode('signup')} className="text-primary font-semibold">Sign up</button></div>
                      <div className="w-full md:w-auto">
                        <Button type="submit" className="w-full md:w-auto glow-primary" disabled={loadingAction}>{loadingAction ? 'Logging in...' : 'Log In'}</Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <Label className="text-sm">Full name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" name="role" value="volunteer" checked={role === 'volunteer'} onChange={() => setRole('volunteer')} />
                        <span className="text-sm">Volunteer</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" name="role" value="restaurant" checked={role === 'restaurant'} onChange={() => setRole('restaurant')} />
                        <span className="text-sm">Restaurant</span>
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="glow-primary w-full md:w-auto" disabled={loadingAction}>{loadingAction ? 'Creating account...' : 'Sign Up'}</Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default InitialAuthPrompt;
