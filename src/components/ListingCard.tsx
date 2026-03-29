import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Package } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Props = {
  item: any;
  index?: number;
  onClaim?: (item: any) => void;
};

const ListingCard = ({ item, index = 0, onClaim }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      whileHover={{ y: -8 }}
      className="group rounded-2xl glass p-6 cursor-pointer relative overflow-hidden transition-all hover:card-hover-shadow"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between relative z-10">
        <Badge className="capitalize bg-orange-400 text-orange-900">{item.type || 'other'}</Badge>
        <span className="flex items-center gap-1.5 text-xs font-medium text-warning">
          <Clock className="h-3 w-3" />
          {item.servings ? `${item.servings} servings` : '—'}
        </span>
      </div>

      <h3 className="mt-5 font-display text-xl text-card-foreground group-hover:text-primary transition-colors">{item.items}</h3>

      <div className="mt-2 flex items-center gap-3">
        <Avatar className="h-9 w-9">
          {item.donor?.avatar_url ? <AvatarImage src={item.donor.avatar_url} /> : <AvatarFallback>{(item.donor?.full_name || 'U').slice(0,2).toUpperCase()}</AvatarFallback>}
        </Avatar>
        <div>
          <div className="text-sm font-medium">{item.donor?.full_name || 'Unknown'}</div>
          <div className="text-xs text-muted-foreground">Donor</div>
          {item.notes && (
            <div className="mt-1 text-xs text-muted-foreground max-w-xs">{item.notes}</div>
          )}
          {!item.notes && (item.restaurant || item.contact) && (
            <div className="mt-1 text-xs text-muted-foreground max-w-xs">
              {item.restaurant && <span className="font-medium">{item.restaurant}</span>}
              {item.restaurant && item.contact && <span className="mx-1">•</span>}
              {item.contact && <span>{item.contact}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.items}
          className="w-full h-40 rounded-md object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
        />
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 text-accent" />
        {item.location}
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button className="mt-6 w-full glow-primary" size="sm" onClick={() => {
          if (onClaim) return onClaim(item);
          toast.success('Claim requested — check Profile for updates');
        }}>
          <Package className="mr-2 h-4 w-4" />
          Claim This Food
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ListingCard;
