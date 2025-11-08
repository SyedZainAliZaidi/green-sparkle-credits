import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapMarker {
  lat: number;
  lng: number;
  co2Reduction: number;
}

export function ImpactMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [zoom, setZoom] = useState(2);

  // Mock data for demonstration
  const markers: MapMarker[] = [
    { lat: 1.2921, lng: 36.8219, co2Reduction: 45 }, // Kenya
    { lat: 20.5937, lng: 78.9629, co2Reduction: 120 }, // India
    { lat: 9.145, lng: 40.4897, co2Reduction: 30 }, // Ethiopia
    { lat: 15.5007, lng: 32.5599, co2Reduction: 25 }, // Sudan
    { lat: -6.369028, lng: 34.888822, co2Reduction: 35 }, // Tanzania
  ];

  useEffect(() => {
    // Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        // Default to Kenya if location unavailable
        setUserLocation({ lat: 1.2921, lng: 36.8219 });
      }
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !userLocation) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = 'hsl(var(--muted))';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Simple world map background (simplified continents)
    ctx.fillStyle = 'hsl(var(--background))';
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 1;

    // Convert lat/lng to canvas coordinates
    const latLngToXY = (lat: number, lng: number) => {
      const x = ((lng + 180) * rect.width) / 360;
      const y = ((90 - lat) * rect.height) / 180;
      return { x, y };
    };

    // Draw heat map circles for CO2 reduction
    markers.forEach(marker => {
      const pos = latLngToXY(marker.lat, marker.lng);
      const radius = Math.sqrt(marker.co2Reduction) * zoom;

      // Heat map gradient
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
      gradient.addColorStop(0, 'hsla(var(--primary), 0.4)');
      gradient.addColorStop(0.5, 'hsla(var(--primary), 0.2)');
      gradient.addColorStop(1, 'hsla(var(--primary), 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(pos.x - radius, pos.y - radius, radius * 2, radius * 2);

      // Draw marker pin
      ctx.fillStyle = 'hsl(var(--primary))';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'hsl(var(--background))';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw user location with special marker
    const userPos = latLngToXY(userLocation.lat, userLocation.lng);
    ctx.fillStyle = 'hsl(var(--destructive))';
    ctx.beginPath();
    ctx.arc(userPos.x, userPos.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'hsl(var(--background))';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pulse ring around user location
    ctx.strokeStyle = 'hsl(var(--destructive))';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(userPos.x, userPos.y, 12, 0, Math.PI * 2);
    ctx.stroke();

  }, [userLocation, zoom, markers]);

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Global Impact</h3>
            <p className="text-xs text-muted-foreground">CO₂ Reduction Map</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoom(prev => Math.min(prev + 0.5, 5))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoom(prev => Math.max(prev - 0.5, 1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Active Users</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 rounded-full bg-gradient-to-r from-primary/40 to-transparent" />
          <span className="text-muted-foreground">CO₂ Impact</span>
        </div>
      </div>
    </Card>
  );
}
