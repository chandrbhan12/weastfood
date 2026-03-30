import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Donor = {
  _id?: string;
  full_name: string;
  points: number;
  avatar_url?: string | null;
};

const TopDonors = () => {
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || '/api') + '/api/pickups/top-donors');
        if (!res.ok) return;
        const json = await res.json();
        setDonors(json || []);
      } catch (e) {
        console.error('Failed to load top donors', e);
      }
    })();
  }, []);

  if (!donors.length) return null;

  return (
    <section className="py-8 sm:py-10">
      <div className="container mx-auto px-4">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Top Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {donors.map((d, i) => (
                <div key={d._id || i} className="flex items-center gap-3 p-3 rounded-md bg-muted/10">
                  <Avatar className="h-12 w-12">
                    {d.avatar_url ? <AvatarImage src={d.avatar_url} /> : <AvatarFallback>{(d.full_name || 'U').slice(0,2).toUpperCase()}</AvatarFallback>}
                  </Avatar>
                  <div>
                    <div className="font-medium">{d.full_name}</div>
                    <div className="text-xs text-muted-foreground">{d.points} points</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TopDonors;
