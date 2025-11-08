import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  className?: string;
}

export const LoadingOverlay = ({ 
  isVisible, 
  message = "Processing...", 
  progress,
  className 
}: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm animate-fade-in flex items-center justify-center",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 max-w-sm mx-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/10 to-success/10 border-2 border-primary/20">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">{message}</p>
          
          {progress !== undefined && (
            <div className="space-y-2 w-64">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-success transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
