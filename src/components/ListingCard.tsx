import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Package, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Props = {
  item: any;
  index?: number;
  onClaim?: (item: any) => void;
  actionLabel?: string;
  onAction?: (item: any) => void;
  onDelete?: (item: any) => void;
  isOwner?: boolean;
  className?: string;
};

const ListingCard = ({ item, index = 0, onClaim, actionLabel, onAction, onDelete, isOwner, className = "" }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      whileHover={{ y: -8 }}
      className={`group rounded-3xl bg-black/80 backdrop-blur-xl border border-white/10 p-6 cursor-pointer relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/20 ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {isOwner && onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(item); }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm group/trash"
          title="Delete Donation"
        >
          <Trash2 className="h-4 w-4 group-hover/trash:scale-110 transition-transform" />
        </button>
      )}

      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <Badge className="capitalize bg-primary/20 text-primary hover:bg-primary/30 border-0 font-bold w-fit tracking-wider text-[10px]">
            {item.type || 'other'}
          </Badge>
          {item.status && (
            <Badge variant="outline" className={`text-[9px] uppercase tracking-widest border-0 font-black px-2 py-0.5 rounded-full ${
              item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 
              item.status === 'accepted' ? 'bg-amber-500/20 text-amber-400' : 
              'bg-blue-500/20 text-blue-400'
            }`}>
              {item.status.replace('_', ' ')}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {item.status === 'requested' || !item.status ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          ) : null}
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            <Clock className="h-3 w-3" />
            {item.servings ? `${item.servings} Servings` : '—'}
          </span>
        </div>
      </div>

      <h3 className="mt-5 font-display text-2xl text-white tracking-tight group-hover:text-primary transition-colors">
        {item.items}
      </h3>

      <div className="mt-6 flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
        <Avatar className="h-10 w-10 border-2 border-white/10 shadow-sm">
          {item.donor?.avatar_url ? <AvatarImage src={item.donor.avatar_url} /> : <AvatarFallback className="bg-primary/10 text-primary font-black">{(item.donor?.full_name || 'U').slice(0,2).toUpperCase()}</AvatarFallback>}
        </Avatar>
        <div className="overflow-hidden">
          <div className="text-sm font-bold truncate text-white/90">{item.donor?.full_name || 'Unknown Donor'}</div>
          <div className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-black">Verified Donor</div>
        </div>
      </div>

      <div className="mt-5 relative group/img overflow-hidden rounded-2xl">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.items}
          className="w-full h-44 object-cover shadow-inner transition-transform duration-700 group-hover/img:scale-110"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-white/50 font-medium">
        <MapPin className="h-3.5 w-3.5 text-primary/60" />
        <span className="truncate">{item.location}</span>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button 
          className="mt-6 w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all border-0" 
          size="sm" 
          disabled={item.status === 'completed'}
          onClick={(e) => {
            e.stopPropagation();
            if (onAction) return onAction(item);
            if (onClaim) return onClaim(item);
            toast.success('Check Profile for updates');
          }}
        >
          {item.status === 'completed' ? null : <Package className="mr-2 h-4 w-4" />}
          {actionLabel || 'Claim This Food'}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ListingCard;
