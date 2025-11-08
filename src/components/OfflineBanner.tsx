import { WifiOff } from "lucide-react";
import { useOnline } from "@/hooks/useOnline";

export const OfflineBanner = () => {
  const isOnline = useOnline();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground px-4 py-3 text-center animate-slide-down">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm font-medium">
          You're offline. Some features may be limited.
        </span>
      </div>
    </div>
  );
};
