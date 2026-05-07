import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  BarChart3,
  Palette,
  Lightbulb,
  Trophy,
  Bot,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "Planner", icon: FileText },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/brand-kit", label: "Brand Kit", icon: Palette },
  { to: "/inspiration", label: "Inspiration", icon: Lightbulb },
  { to: "/challenges", label: "Challenges", icon: Trophy },
  { to: "/agent", label: "AI Agent", icon: Bot },
];

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeOnSmallScreens = () => {
    if (window.innerWidth < 768) setIsCollapsed(true);
  };

  return (
    <>
      {!isCollapsed && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setIsCollapsed(true)}
          className="fixed inset-0 z-50 hidden bg-black/50 backdrop-blur-sm max-md:block"
        />
      )}
      <aside
        className={`sticky top-0 h-screen min-h-screen flex flex-col bg-sidebar-bg border-r border-sidebar-border shrink-0 transition-[width] duration-300 ease-out z-[60] ${
          isCollapsed ? "w-[72px]" : "w-[240px] max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:shadow-2xl max-md:shadow-black/50"
        }`}
      >
      <div
        className={`flex items-center h-14 ${
          isCollapsed ? "justify-center" : "justify-between gap-3"
        } px-4 border-b border-sidebar-border lg:border-none`}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-heading font-semibold text-lg tracking-tight truncate">
              crflow.
            </span>
          </div>
        )}
        <button
          type="button"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setIsCollapsed((current) => !current)}
          className="p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
        >
          {isCollapsed ? (
            <ChevronsRight className="w-5 h-5" strokeWidth={2.2} />
          ) : (
            <ChevronsLeft className="w-5 h-5" strokeWidth={2.2} />
          )}
        </button>
      </div>

      <nav className={`flex-1 space-y-1.5 ${isCollapsed ? "px-3 mt-6" : "px-3 mt-4"}`}>
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={closeOnSmallScreens}
              title={isCollapsed ? label : undefined}
              className={`flex items-center rounded-lg text-sm font-medium transition-colors ${
                isCollapsed
                  ? "justify-center px-2 py-2.5"
                  : "gap-3 px-3 py-2.5"
              } ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className={`${isCollapsed ? "px-3" : "px-3"} pb-4 mt-auto`}>
        <NavLink
          to="/settings"
          onClick={closeOnSmallScreens}
          title={isCollapsed ? "Settings" : undefined}
          className={`flex items-center rounded-lg text-sm font-medium transition-colors ${
            isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
          } ${
            location.pathname === "/settings"
              ? "bg-primary/15 text-primary"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
          }`}
        >
          <Settings className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} />
          {!isCollapsed && <span className="truncate">Settings</span>}
        </NavLink>

        <div className="my-4 h-px bg-sidebar-border" />

        <div className={`flex items-center rounded-lg transition-all ${isCollapsed ? "justify-center" : "gap-3 px-3 py-2 bg-sidebar-accent/50"}`}>
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-heading text-xs font-semibold shrink-0 border border-border/50">
            CK
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-heading truncate">Clinton K.</p>
              <p className="text-[10px] text-muted-foreground truncate">Pro Plan</p>
            </div>
          )}
        </div>
      </div>
      </aside>
    </>
  );
}
