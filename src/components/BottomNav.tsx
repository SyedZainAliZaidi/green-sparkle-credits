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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border pb-safe-bottom">
      <div className="flex justify-around items-center h-16 max-w-screen-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={triggerLight}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[4rem] min-h-[44px] text-muted-foreground hover:text-foreground data-[active]:text-primary"
              activeClassName="text-primary"
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
