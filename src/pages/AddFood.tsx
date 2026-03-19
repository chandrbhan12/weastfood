import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

const AddFood = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Food listing posted successfully!", {
        description: "Volunteers will be notified about your donation.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-2xl"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary">
              <UtensilsCrossed className="h-5 sm:h-6 w-5 sm:w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl text-foreground">Donate Food</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Post your surplus food for volunteers to pick up.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 space-y-5 sm:space-y-6">
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="restaurant">Restaurant Name</Label>
                <Input id="restaurant" placeholder="e.g. Golden Spice Kitchen" required className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input id="contact" type="tel" placeholder="+91 98765 43210" required className="text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="food">Food Description</Label>
              <Textarea id="food" placeholder="Describe the food items available..." rows={3} required className="text-sm" />
            </div>

            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="quantity">Servings</Label>
                <Input id="quantity" type="number" placeholder="e.g. 20" min={1} required className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Food Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cooked">Cooked Meals</SelectItem>
                    <SelectItem value="bakery">Bakery</SelectItem>
                    <SelectItem value="snacks">Snacks</SelectItem>
                    <SelectItem value="produce">Fresh Produce</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Available Until</Label>
                <Input id="expiry" type="time" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Pickup Location</Label>
              <Input id="location" placeholder="Full address for pickup" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" placeholder="Any special instructions for pickup..." rows={2} />
            </div>

            <Button type="submit" size="lg" className="w-full text-base" disabled={loading}>
              {loading ? "Posting..." : "Post Food Listing"}
            </Button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default AddFood;
