import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  className?: string;
  gradient?: "green" | "blue" | "purple";
}

export const StatCard = ({ icon: Icon, label, value, trend, className, gradient }: StatCardProps) => {
  const gradientClasses = {
    green: "bg-gradient-to-br from-[#10b981] to-[#059669] text-white",
    blue: "bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white",
    purple: "bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white",
  };

  return (
    <Card className={cn(
      "p-4 hover:shadow-lg transition-all duration-300 hover:scale-105",
      gradient && gradientClasses[gradient],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p className={cn("text-sm", gradient ? "text-white/80" : "text-muted-foreground")}>
            {label}
          </p>
          <p className={cn("text-2xl font-bold", gradient ? "text-white" : "text-foreground")}>
            {value}
          </p>
          {trend && (
            <p className={cn("text-xs font-medium", gradient ? "text-white/90" : "text-primary")}>
              {trend}
            </p>
          )}
        </div>
        <div className={cn("p-2 rounded-lg", gradient ? "bg-white/20" : "bg-primary/10")}>
          <Icon className={cn("h-5 w-5", gradient ? "text-white" : "text-primary")} />
        </div>
      </div>
    </Card>
  );
};
