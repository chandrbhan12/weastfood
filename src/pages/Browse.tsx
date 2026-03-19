import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Package, Search } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const allListings = [
  { id: 1, restaurant: "Golden Spice Kitchen", food: "Biryani & Curry (20 servings)", location: "MG Road, Sector 14", expires: "2 hours", type: "Cooked Meals", servings: 20, image: "/image.png" },
  { id: 2, restaurant: "The Baker's Dozen", food: "Assorted Breads & Pastries (15 pcs)", location: "Civil Lines, Block B", expires: "4 hours", type: "Bakery", servings: 15, image: "/image1.jpg" },
  { id: 3, restaurant: "Hotel Grand Feast", food: "Wedding Buffet Leftovers (50 servings)", location: "Ring Road, Near Mall", expires: "1 hour", type: "Cooked Meals", servings: 50, image: "/image2.jpg" },
  { id: 4, restaurant: "Fresh Bites Café", food: "Sandwiches & Wraps (12 pcs)", location: "Park Street, Lane 3", expires: "3 hours", type: "Snacks", servings: 12, image: "/image3.jpg" },
  { id: 5, restaurant: "Mama's Kitchen", food: "Dal, Rice & Roti (30 servings)", location: "Old Town, Main Road", expires: "2.5 hours", type: "Cooked Meals", servings: 30, image: "/image4.jpg" },
  { id: 6, restaurant: "Fruit Valley Store", food: "Mixed Fruits (10 kg)", location: "Market Square", expires: "6 hours", type: "Fresh Produce", servings: 25, image: "/image5.jpg" },
];

const categories = ["All", "Cooked Meals", "Bakery", "Snacks", "Fresh Produce"];

const Browse = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = allListings.filter((item) => {
    const matchesSearch =
      item.food.toLowerCase().includes(search.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

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

        {/* Listings */}
        <div className="mt-6 sm:mt-8 md:mt-10 grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-6 transition-shadow hover:card-hover-shadow"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{item.type}</Badge>
                <span className="flex items-center gap-1 text-xs text-warning">
                  <Clock className="h-3 w-3" />
                  {item.expires} left
                </span>
              </div>

              <h3 className="mt-4 font-display text-lg text-card-foreground">{item.food}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{item.restaurant}</p>

              <div className="mt-4">
                <img
                  src={item.image}
                  alt={item.food}
                  loading="lazy"
                  onError={(e) => {
                    // fall back to bundled SVG placeholders when the JPG is missing
                    const fallback = `/listing-${((item.id - 1) % 6) + 1}.svg`;
                    // @ts-ignore - DOMImage
                    e.currentTarget.src = fallback;
                  }}
                  className="w-full h-32 rounded-md object-cover"
                />
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.location}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" />
                  {item.servings} servings
                </span>
              </div>

              <Button
                className="mt-5 w-full"
                size="sm"
                onClick={() => {
                  toast.success(`"${item.food}" claimed successfully!`, {
                    description: `Contact ${item.restaurant} for pickup at ${item.location}.`,
                  });
                }}
              >
                Claim This Food
              </Button>
            </motion.div>
          ))}
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
