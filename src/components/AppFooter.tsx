import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Satellite, Zap, Shield } from "lucide-react";

export function AppFooter() {
  return (
    <Card className="mt-8 p-6 bg-gradient-to-br from-background to-muted/30 border-t-2 border-pakistan-green/20">
      <div className="space-y-4">
        {/* Main Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-success/10">
                <Satellite className="h-4 w-4 text-success" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">NASA POWER Data</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-success/10">
                <Zap className="h-4 w-4 text-success" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">AI Verified</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-success/10">
                <Shield className="h-4 w-4 text-success" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Blockchain Secured</p>
          </div>
        </div>

        <Separator />

        {/* Helpful Hints */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground">💡 Helpful Tips:</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-success">•</span>
              <span>Works offline - syncs when connected</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">•</span>
              <span>Upload during good lighting for best results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">•</span>
              <span>Optimized for 3G speeds & Pakistani mobile networks</span>
            </li>
          </ul>
        </div>

        <Separator />

        {/* Footer Info */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm font-semibold text-foreground">Built for Pakistan</p>
            <span className="text-2xl" role="img" aria-label="Pakistan flag">🇵🇰</span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Supporting Prime Minister's Clean Green Pakistan Initiative
          </p>
          
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Powered by NASA POWER • ElevenLabs • Replicate AI
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © 2025 EcoCredits Pakistan. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
