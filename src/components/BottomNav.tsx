import { Home, Upload, BarChart3, Users } from "lucide-react";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";
import { useHaptic } from "@/hooks/useHaptic";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/upload", icon: Upload, label: "Upload" },
  { to: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { to: "/community", icon: Users, label: "Community" },
];

export const BottomNav = () => {
  const { triggerLight } = useHaptic();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom" role="navigation" aria-label="Main navigation">
      <div className="flex justify-around items-center h-16 max-w-screen-lg mx-auto px-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={triggerLight}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-base min-w-[60px] min-h-[48px] text-muted-foreground hover:text-foreground hover:bg-muted/50 active:scale-95 data-[active]:text-primary data-[active]:bg-primary/10"
              activeClassName="text-primary bg-primary/10"
              aria-label={`${item.label} navigation`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="text-[11px] font-medium leading-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
