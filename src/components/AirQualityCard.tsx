import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wind } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SkeletonLoader } from "./SkeletonLoader";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface AirQualityData {
  pm25: string;
  quality: string;
  qualityColor: string;
  trendData: Array<{ day: number; value: number }>;
  location: string;
}

export function AirQualityCard() {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAirQualityData = async () => {
      try {
        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        const { data: aqData, error: functionError } = await supabase.functions.invoke('climate-data', {
          body: {
            type: 'airquality',
            latitude,
            longitude
          }
        });

        if (functionError) throw functionError;
        
        setData(aqData);
      } catch (err) {
        console.error('Error fetching air quality data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch air quality data');
      } finally {
        setLoading(false);
      }
    };

    fetchAirQualityData();
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
          <Wind className="h-5 w-5" />
          <p className="text-sm">Unable to load air quality data: {error}</p>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const getQualityColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'yellow':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'orange':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'red':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wind className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Air Quality</h3>
            <p className="text-xs text-muted-foreground">{data.location}</p>
          </div>
        </div>
        <Badge className={cn(getQualityColorClass(data.qualityColor))}>
          {data.quality}
        </Badge>
      </div>

      <div className="mb-4">
        <div className="text-4xl font-bold mb-1">
          {data.pm25}
          <span className="text-lg text-muted-foreground ml-1">μg/m³</span>
        </div>
        <p className="text-xs text-muted-foreground">PM2.5 Level</p>
      </div>

      <div className="h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.trendData}>
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              label={{ value: 'Last 7 days', position: 'insideBottom', offset: -5, fontSize: 10 }}
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
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 rounded-lg bg-primary/5 mb-3">
        <p className="text-sm text-foreground">
          💚 Clean cookstoves reduce PM2.5 by <span className="font-bold">65%</span>
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        Data source: <span className="font-medium">OpenAQ</span>
      </p>
    </Card>
  );
}
