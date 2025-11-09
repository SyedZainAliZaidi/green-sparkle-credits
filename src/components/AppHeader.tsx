import { Leaf } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-screen-lg mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-success to-pakistan-green">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-success to-pakistan-green bg-clip-text text-transparent">
                  EcoCredits
                </h1>
                <span className="text-xl" role="img" aria-label="Pakistan flag">🇵🇰</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-none">
                Pakistan's Carbon Credit Platform
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Built for Pakistan</span>
          <span className="text-base" role="img" aria-label="Pakistan">🇵🇰</span>
        </div>
      </div>
    </header>
  );
}
