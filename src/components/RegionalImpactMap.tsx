import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { useHaptic } from "@/hooks/useHaptic";

interface RegionData {
  name: string;
  submissions: number;
  co2Reduced: number;
  position: { x: string; y: string };
}

const regions: RegionData[] = [
  { name: "East Africa", submissions: 842, co2Reduced: 3.2, position: { x: "58%", y: "55%" } },
  { name: "West Africa", submissions: 623, co2Reduced: 2.4, position: { x: "48%", y: "52%" } },
  { name: "Southern Africa", submissions: 435, co2Reduced: 1.6, position: { x: "55%", y: "72%" } },
  { name: "Central Africa", submissions: 312, co2Reduced: 1.2, position: { x: "52%", y: "58%" } },
  { name: "North Africa", submissions: 278, co2Reduced: 1.0, position: { x: "52%", y: "40%" } },
];

export function RegionalImpactMap() {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const { triggerLight } = useHaptic();

  const handleRegionClick = (region: RegionData) => {
    triggerLight();
    setSelectedRegion(region);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Regional Impact</h3>
      
      <div className="relative w-full aspect-video bg-muted/30 rounded-lg overflow-hidden mb-4">
        {/* Simplified Africa Map SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Africa continent outline - simplified */}
          <path
            d="M 48,25 L 52,25 L 55,28 L 58,32 L 60,38 L 62,45 L 63,52 L 62,58 L 60,65 L 57,70 L 54,75 L 50,78 L 46,75 L 43,70 L 40,65 L 38,58 L 37,52 L 38,45 L 40,38 L 42,32 L 45,28 Z"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
        </svg>

        {/* Region markers */}
        {regions.map((region, index) => (
          <button
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: region.position.x, top: region.position.y }}
            onClick={() => handleRegionClick(region)}
          >
            <div className="relative">
              <div className={`w-4 h-4 rounded-full bg-primary animate-pulse ${
                selectedRegion?.name === region.name ? 'ring-4 ring-primary/30' : ''
              }`} />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg border">
                  {region.name}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Region Details */}
      {selectedRegion && (
        <div className="bg-muted/50 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">{selectedRegion.name}</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Submissions</p>
              <p className="text-lg font-bold">{selectedRegion.submissions}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">CO₂ Reduced</p>
              <p className="text-lg font-bold text-success">{selectedRegion.co2Reduced}t</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
