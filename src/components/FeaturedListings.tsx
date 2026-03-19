import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Package, ArrowRight, Flame } from "lucide-react";
import { motion } from "framer-motion";

const listings = [
  {
    id: 1,
    restaurant: "Golden Spice Kitchen",
    food: "Biryani & Curry (20 servings)",
    location: "MG Road, Sector 14",
    expires: "2 hours",
    type: "Cooked Meals",
    urgent: true,
    image: "/image.png",
  },
  {
    id: 2,
    restaurant: "The Baker's Dozen",
    food: "Assorted Breads & Pastries (15 pcs)",
    location: "Civil Lines, Block B",
    expires: "4 hours",
    type: "Bakery",
    urgent: false,
    image: "/image1.jpg",
  },
  {
    id: 3,
    restaurant: "Hotel Grand Feast",
    food: "Wedding Buffet Leftovers (50 servings)",
    location: "Ring Road, Near Mall",
    expires: "1 hour",
    type: "Cooked Meals",
    urgent: true,
    image: "/image3.jpg",
  },
];

const FeaturedListings = () => {
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
          {listings.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group rounded-2xl glass p-6 cursor-pointer relative overflow-hidden transition-all hover:card-hover-shadow"
            >
              {/* Top glow effect on hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between relative z-10">
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20"
                >
                  {item.type}
                </motion.span>
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  {item.urgent ? (
                    <span className="flex items-center gap-1 text-secondary">
                      <Flame className="h-3 w-3 animate-pulse" />
                      Urgent · {item.expires}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-warning">
                      <Clock className="h-3 w-3" />
                      {item.expires} left
                    </span>
                  )}
                </span>
              </div>

              <h3 className="mt-5 font-display text-xl text-card-foreground group-hover:text-primary transition-colors">
                {item.food}
              </h3>
              <p className="mt-1.5 text-sm font-medium text-primary/80">
                {item.restaurant}
              </p>

              <div className="mt-4">
                <img
                  src={item.image}
                  alt={item.food}
                  className="w-full h-40 rounded-md object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                />
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                {item.location}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="mt-6 w-full glow-primary" size="sm" asChild>
                  <Link to="/browse">
                    <Package className="mr-2 h-4 w-4" />
                    Claim This Food
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
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
