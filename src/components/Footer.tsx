import { Link } from "react-router-dom";
import { useState } from "react";
import { Heart, Github, Twitter, Youtube } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <footer className="border-t border-border relative overflow-hidden">
      {/* Gradient line at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-12 sm:py-14 md:py-16">
        <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary glow-primary"
              >
                <Heart className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <span className="font-display text-xl text-foreground group-hover:text-primary transition-colors">FoodLink</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Connecting surplus food with those who need it most. Together we can end food waste and hunger.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm text-foreground uppercase tracking-wider">Platform</h4>
            <ul className="mt-4 space-y-3">
              {[
                { label: "Browse Food", to: "/browse" },
                { label: "Donate Food", to: "/add-food" },
                { label: "How It Works", to: "/how-it-works" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm text-foreground uppercase tracking-wider">Community</h4>
            <ul className="mt-4 space-y-3">
              {["For Restaurants", "For Volunteers", "For NGOs"].map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => setOpen(open === item ? null : item)}
                    className="w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </button>

                  {open === item && (
                    <div className="mt-2 rounded-md border border-border bg-card p-3 text-sm text-foreground">
                      {item === "For Restaurants" && (
                        <div>
                          <p className="mb-2">Partner with FoodLink to donate surplus safely and easily.</p>
                          <Link to="/add-food" className="text-primary hover:underline">Get started</Link>
                        </div>
                      )}
                      {item === "For Volunteers" && (
                        <div>
                          <p className="mb-2">Volunteer to pick up and deliver food to those in need.</p>
                          <Link to="/browse" className="text-primary hover:underline">Find opportunities</Link>
                        </div>
                      )}
                      {item === "For NGOs" && (
                        <div>
                          <p className="mb-2">Connect with restaurants and volunteers to scale your impact.</p>
                          <Link to="/how-it-works" className="text-primary hover:underline">Learn more</Link>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm text-foreground uppercase tracking-wider">Support</h4>
            <ul className="mt-4 space-y-3">
              {["Contact Us", "FAQ", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 md:mt-14 border-t border-border pt-6 sm:pt-8 flex flex-col gap-4 md:flex-row items-center justify-between">
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} FoodLink. Made with ❤️ for a hunger-free world.
          </p>
          <div className="flex items-center gap-4">
            <motion.a whileHover={{ scale: 1.2, y: -2 }} href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube className="h-4 sm:h-5 w-4 sm:w-5" />
            </motion.a>
            <motion.a whileHover={{ scale: 1.2, y: -2 }} href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-4 sm:h-5 w-4 sm:w-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
