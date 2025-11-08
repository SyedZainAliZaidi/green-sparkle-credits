import { Download, X } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export const PWAInstallPrompt = () => {
  const { showPrompt, installPWA, dismissPrompt } = usePWAInstall();

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 animate-slide-up">
      <Card className="p-4 shadow-lg border-primary/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Install EcoCredit
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Add to your home screen for quick access and offline support
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={installPWA}
                className="flex-1"
              >
                Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={dismissPrompt}
              >
                Maybe Later
              </Button>
            </div>
          </div>
          <button
            onClick={dismissPrompt}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
};
