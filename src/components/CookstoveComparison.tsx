import { Card } from "@/components/ui/card";
import { Flame, TrendingDown, Heart, DollarSign, X, Check } from "lucide-react";

interface ComparisonMetric {
  label: string;
  traditional: string | number;
  improved: string | number;
  icon: React.ReactNode;
  unit?: string;
}

const metrics: ComparisonMetric[] = [
  {
    label: "Efficiency",
    traditional: 10,
    improved: 50,
    icon: <Flame className="h-5 w-5" />,
    unit: "%"
  },
  {
    label: "CO₂ Emissions",
    traditional: 100,
    improved: 20,
    icon: <TrendingDown className="h-5 w-5" />,
    unit: "% baseline"
  },
  {
    label: "Health Impact",
    traditional: "High Risk",
    improved: "Low Risk",
    icon: <Heart className="h-5 w-5" />
  },
  {
    label: "Fuel Savings",
    traditional: 0,
    improved: 50,
    icon: <DollarSign className="h-5 w-5" />,
    unit: "%"
  }
];

export function CookstoveComparison() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
        Cookstove Comparison
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-2">
            <X className="h-6 w-6 text-destructive" />
          </div>
          <p className="font-semibold text-sm">Traditional</p>
          <p className="text-xs text-muted-foreground">Open Fire</p>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-2">
            <Check className="h-6 w-6 text-success" />
          </div>
          <p className="font-semibold text-sm">Improved</p>
          <p className="text-xs text-muted-foreground">Clean Cookstove</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-accent/10 text-accent">
                {metric.icon}
              </div>
              <span className="font-medium text-sm">{metric.label}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <p className="text-lg font-bold text-destructive">
                  {metric.traditional}
                  {metric.unit}
                </p>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-success/5 border border-success/20">
                <p className="text-lg font-bold text-success">
                  {metric.improved}
                  {metric.unit}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-center text-muted-foreground">
          <span className="font-semibold text-primary">Impact: </span>
          Clean cookstoves use 80% less fuel while reducing harmful emissions by up to 90%
        </p>
      </div>
    </Card>
  );
}
