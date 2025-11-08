import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  type?: "stat" | "card" | "image" | "chart" | "list";
}

export const SkeletonLoader = ({ className, type = "card" }: SkeletonLoaderProps) => {
  if (type === "stat") {
    return (
      <Card className={cn("p-4 sm:p-5 shadow-card", className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-3 w-20 bg-muted rounded animate-skeleton" />
            <div className="h-8 w-16 bg-muted rounded animate-skeleton" style={{ animationDelay: "150ms" }} />
            <div className="h-2 w-24 bg-muted rounded animate-skeleton" style={{ animationDelay: "300ms" }} />
          </div>
          <div className="p-2 rounded-button bg-muted w-9 h-9 animate-skeleton" style={{ animationDelay: "450ms" }} />
        </div>
      </Card>
    );
  }

  if (type === "image") {
    return (
      <Card className={cn("overflow-hidden shadow-card", className)}>
        <div className="aspect-square bg-muted animate-skeleton" />
        <div className="p-2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-2 w-12 bg-muted rounded animate-skeleton" style={{ animationDelay: "150ms" }} />
            <div className="h-3 w-8 bg-muted rounded animate-skeleton" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </Card>
    );
  }

  if (type === "chart") {
    return (
      <Card className={cn("p-4 sm:p-6 shadow-card", className)}>
        <div className="h-4 w-32 bg-muted rounded mb-4 animate-skeleton" />
        <div className="h-48 sm:h-64 bg-muted rounded animate-skeleton" style={{ animationDelay: "150ms" }} />
      </Card>
    );
  }

  if (type === "list") {
    return (
      <Card className={cn("p-4 shadow-card", className)}>
        <div className="space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-full flex-shrink-0 animate-skeleton" style={{ animationDelay: `${i * 150}ms` }} />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="h-4 w-32 bg-muted rounded animate-skeleton" style={{ animationDelay: `${i * 150 + 100}ms` }} />
                <div className="h-3 w-24 bg-muted rounded animate-skeleton" style={{ animationDelay: `${i * 150 + 200}ms` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-4 shadow-card", className)}>
      <div className="space-y-3">
        <div className="h-4 w-3/4 bg-muted rounded animate-skeleton" />
        <div className="h-4 w-full bg-muted rounded animate-skeleton" style={{ animationDelay: "150ms" }} />
        <div className="h-4 w-2/3 bg-muted rounded animate-skeleton" style={{ animationDelay: "300ms" }} />
      </div>
    </Card>
  );
};
