import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, MapPin, AlertCircle } from "lucide-react";
import { getSolarDataForCity, PAKISTAN_CITIES, SolarData } from "@/lib/nasaData";
import { SkeletonLoader } from "./SkeletonLoader";

export function SolarPotentialCard() {
  const [data, setData] = useState<SolarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('Islamabad');
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    fetchSolarData(selectedCity);
  }, [selectedCity]);

  const fetchSolarData = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);

      const solarData = await getSolarDataForCity(cityName);
      
      if (!solarData) {
        setUsingFallback(true);
      }
      
      setData(solarData);
    } catch (err) {
      console.error('Error fetching solar data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch solar data');
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeVariant = (rating: string): "default" | "secondary" | "outline" => {
    switch (rating) {
      case 'Excellent':
        return 'default';
      case 'Good':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 bg-muted rounded-lg animate-skeleton" />
            <div className="flex-1">
              <div className="h-5 w-32 bg-muted rounded animate-skeleton mb-2" />
              <div className="h-3 w-24 bg-muted rounded animate-skeleton" />
            </div>
          </div>
          <div className="h-12 w-48 bg-muted rounded animate-skeleton" />
          <div className="h-4 w-full bg-muted rounded animate-skeleton" />
        </div>
      </Card>
    );
  }

  if (error && !data) {
    return (
      <Card className="p-6 border-destructive/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive mb-1">Unable to load solar data</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-background to-primary/5 border-primary/20 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-success/10">
            <Sun className="h-6 w-6 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">☀ Solar Potential</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>🇵🇰 Pakistan</span>
            </div>
          </div>
        </div>
        <Badge 
          variant={getBadgeVariant(data.solarPotential)}
          className="bg-success/10 text-success border-success/20"
        >
          {data.solarPotential}
        </Badge>
      </div>

      {/* City Selector */}
      <div className="mb-4">
        <label className="text-xs text-muted-foreground mb-2 block">Select City</label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a city" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(PAKISTAN_CITIES).map((city) => (
              <SelectItem key={city} value={city}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  {city}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Solar Irradiance Display */}
      <div className="mb-4">
        <div className="text-5xl font-bold text-success mb-2">
          {data.solarIrradiance}
          <span className="text-lg text-muted-foreground ml-2">kWh/m²/day</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {data.recommendation}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border/50 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Data from <span className="font-semibold text-foreground">NASA POWER</span>
        </p>
        {usingFallback && (
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <AlertCircle className="h-3 w-3" />
            <span>Using offline data</span>
          </div>
        )}
      </div>
    </Card>
  );
}
