import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  type?: "stat" | "card" | "image" | "chart";
}

export const SkeletonLoader = ({ className, type = "card" }: SkeletonLoaderProps) => {
  if (type === "stat") {
    return (
      <Card className={cn("p-4 animate-pulse", className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-8 w-16 bg-muted rounded" />
            <div className="h-2 w-24 bg-muted rounded" />
          </div>
          <div className="p-2 rounded-lg bg-muted w-9 h-9" />
        </div>
      </Card>
    );
  }

  if (type === "image") {
    return (
      <Card className={cn("overflow-hidden animate-pulse", className)}>
        <div className="aspect-square bg-muted" />
        <div className="p-2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-2 w-12 bg-muted rounded" />
            <div className="h-3 w-8 bg-muted rounded" />
          </div>
        </div>
      </Card>
    );
  }

  if (type === "chart") {
    return (
      <Card className={cn("p-6 animate-pulse", className)}>
        <div className="h-4 w-32 bg-muted rounded mb-4" />
        <div className="h-64 bg-muted rounded" />
      </Card>
    );
  }

  return (
    <Card className={cn("p-4 animate-pulse", className)}>
      <div className="space-y-3">
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
      </div>
    </Card>
  );
};
