import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  emoji: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  emoji,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <Card className="p-8 sm:p-12 text-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="relative">
          <div className="p-6 rounded-full bg-muted/50">
            <Icon className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="absolute -top-2 -right-2 text-3xl sm:text-4xl" aria-hidden="true">{emoji}</div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            size="lg"
            className="mt-4 hover:scale-105 transition-transform min-h-[48px]"
            aria-label={actionLabel}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};
