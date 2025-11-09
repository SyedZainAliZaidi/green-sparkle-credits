import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import { AppHeader } from "./AppHeader";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <AppHeader />
      <OfflineBanner />
      <main className="pt-safe-top pb-24 px-4 w-full max-w-full">{children}</main>
      <BottomNav />
      <PWAInstallPrompt />
    </div>
  );
};
