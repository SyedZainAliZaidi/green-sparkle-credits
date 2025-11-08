import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SkeletonLoader } from "./SkeletonLoader";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface SolarData {
  average: string;
  rating: string;
  monthlyData: Array<{ month: string; value: number }>;
  location: string;
}

export function SolarPotentialCard() {
  const [data, setData] = useState<SolarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolarData = async () => {
      try {
        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        const { data: solarData, error: functionError } = await supabase.functions.invoke('climate-data', {
          body: {
            type: 'solar',
            latitude,
            longitude
          }
        });

        if (functionError) throw functionError;
        
        setData(solarData);
      } catch (err) {
        console.error('Error fetching solar data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch solar data');
      } finally {
        setLoading(false);
      }
    };

    fetchSolarData();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <SkeletonLoader />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-destructive">
        <div className="flex items-center gap-2 text-destructive">
          <Sun className="h-5 w-5" />
          <p className="text-sm">Unable to load solar data: {error}</p>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const getBadgeVariant = (rating: string) => {
    switch (rating) {
      case 'Excellent':
        return 'default';
      case 'Good':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sun className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Solar Potential</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{data.location}</span>
            </div>
          </div>
        </div>
        <Badge variant={getBadgeVariant(data.rating)}>
          {data.rating}
        </Badge>
      </div>

      <div className="mb-4">
        <div className="text-4xl font-bold text-primary mb-1">
          {data.average}
          <span className="text-lg text-muted-foreground ml-1">kWh/m²/day</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Your region has {data.rating.toLowerCase()} solar potential!
        </p>
      </div>

      <div className="h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.monthlyData}>
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 10 }} 
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tick={{ fontSize: 10 }} 
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground">
        Data source: <span className="font-medium">NASA POWER</span>
      </p>
    </Card>
  );
}
