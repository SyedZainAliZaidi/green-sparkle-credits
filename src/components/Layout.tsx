import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";
import { PWAInstallPrompt } from "./PWAInstallPrompt";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <OfflineBanner />
      <main className="pt-safe-top pb-safe-bottom px-safe-left pr-safe-right">{children}</main>
      <BottomNav />
      <PWAInstallPrompt />
    </div>
  );
};
