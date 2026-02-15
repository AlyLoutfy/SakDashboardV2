import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { Building2, ClipboardList, ArrowLeft, FilePlus, BarChart3, Activity, Users, Zap, Bell, User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { name: "Compounds", path: "/sales/compounds", icon: Building2, color: "from-blue-500 to-blue-600" },
  { name: "EOIs", path: "/sales/eois", icon: FilePlus, color: "from-violet-500 to-purple-600" },
  { name: "Analytics", path: "/sales/analytics", icon: BarChart3, color: "from-cyan-500 to-blue-600" },
  { name: "Sales Monitor", path: "/sales/monitor", icon: Activity, color: "from-emerald-500 to-green-600" },
  { name: "Leads", path: "/sales/leads", icon: Users, color: "from-orange-500 to-amber-600" },
  { name: "Lead Activities", path: "/sales/lead-activities", icon: Zap, color: "from-rose-500 to-pink-600" },
  { name: "Notifications", path: "/sales/notifications", icon: Bell, color: "from-amber-500 to-orange-600", badge: 2 },
  { name: "Reservations", path: "/sales/reservations", icon: ClipboardList, color: "from-teal-500 to-cyan-600" },
];

const SalesLayout = () => {
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50/30 overflow-hidden">
        {/* ─── Vertical Icon Nav (Desktop) ─── */}
        <nav className="hidden md:flex flex-col w-[68px] bg-white border-r border-slate-200/60 flex-shrink-0">
          {/* Logo / Back */}
          <div className="h-14 flex items-center justify-center border-b border-slate-100 flex-shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/integrations" className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105 transition-all">
                  <span className="text-white font-bold text-lg">S</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="z-[100]">
                Back to Dashboard
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Nav Items */}
          <div className="flex-1 flex flex-col items-center py-3 gap-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === "/sales/compounds" && location.pathname.startsWith("/sales/compounds"));

              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <NavLink to={item.path} className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group">
                      {/* Active indicator bar */}
                      {isActive && <motion.div layoutId="activeNavIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-blue-500" transition={{ type: "spring", damping: 25, stiffness: 300 }} />}
                      {/* Icon container */}
                      <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${isActive ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}>
                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        {/* Badge */}
                        {"badge" in item && item.badge && <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center text-[9px] font-bold text-white bg-red-500 rounded-full px-0.5 border-2 border-white shadow-sm">{item.badge}</span>}
                      </div>
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="z-[100] text-xs font-semibold">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* User Avatar with Menu */}
          <div className="py-3 flex flex-col items-center border-t border-slate-100 relative" ref={userMenuRef}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-105 transition-all">
                  JD
                </button>
              </TooltipTrigger>
              {!isUserMenuOpen && (
                <TooltipContent side="right" className="z-[100] text-xs font-semibold">
                  John Doe
                </TooltipContent>
              )}
            </Tooltip>

            {/* User Menu Popover */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div initial={{ opacity: 0, x: -8, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -8, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute bottom-0 left-[72px] w-52 bg-white rounded-xl border border-slate-200 shadow-xl z-[100] py-2 overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800">John Doe</p>
                    <p className="text-[11px] text-slate-500">Sales Agent</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                      <User size={14} />
                      Profile
                    </button>
                    <Link to="/integrations" onClick={() => setIsUserMenuOpen(false)} className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                      <ArrowLeft size={14} />
                      Back to Dashboard
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* ─── Mobile Bottom Nav ─── */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-1 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 5).map((item) => {
              const isActive = location.pathname === item.path || (item.path === "/sales/compounds" && location.pathname.startsWith("/sales/compounds"));
              return (
                <NavLink key={item.path} to={item.path} className="flex flex-col items-center py-2 px-1 min-w-0 flex-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-0.5 transition-all ${isActive ? "bg-blue-50 text-blue-600" : "text-slate-400"}`}>
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[9px] font-bold truncate ${isActive ? "text-blue-600" : "text-slate-400"}`}>{item.name}</span>
                </NavLink>
              );
            })}
            {/* "More" button for remaining items */}
            <NavLink to="/sales/reservations" className="flex flex-col items-center py-2 px-1 min-w-0 flex-1">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-0.5 transition-all ${["/sales/lead-activities", "/sales/reservations"].some((p) => location.pathname.startsWith(p)) ? "bg-blue-50 text-blue-600" : "text-slate-400"}`}>
                <ClipboardList size={18} strokeWidth={2} />
              </div>
              <span className="text-[9px] font-bold text-slate-400 truncate">More</span>
            </NavLink>
          </div>
        </div>

        {/* ─── Main Content ─── */}
        <main className="flex-1 w-full overflow-hidden flex flex-col">
          <div className="flex-1 w-full overflow-auto pb-16 md:pb-0">
            <Outlet />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default SalesLayout;
