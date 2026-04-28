import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Building2, Layers, CreditCard, Database, Users, TrendingUp, Calendar, FileText, FilePlus, User, Settings, Bell, ExternalLink, LogOut, PanelLeftClose, PanelLeftOpen, Home as HomeIcon, Palette, Component, ChevronDown, Shield, BarChart3, Link2, Landmark } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReservationRequestsStore } from "../store/reservationRequestsStore";

// Current user matching the screenshot
const CURRENT_USER = {
  name: "Michael Robinson",
  role: "Admin",
  initials: "MR",
};
const CURRENT_USER_ID = "O001";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Track open/closed state for sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    INVENTORY: true,
    "SALES & LEADS": true,
    ADMIN: true,
    DEVELOPMENT: true,
  });

  const location = useLocation();

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionTitle]: !prev[sectionTitle] }));
  };

  const getPendingCountForUser = useReservationRequestsStore((state) => state.getPendingCountForUser);
  const pendingReservationsCount = getPendingCountForUser(CURRENT_USER_ID);

  const sidebarSections = [
    {
      title: "INVENTORY",
      items: [
        { name: "Inventory Data", path: "/inventory", icon: Database },
        { name: "Compounds", path: "/compounds", icon: Building2 },
        { name: "Unit Designs", path: "/unit-designs", icon: Layers },
        { name: "Payment Plans", path: "/payment-plans", icon: CreditCard },
        { name: "Cheques", path: "/cheques", icon: Landmark },
      ],
    },
    {
      title: "SALES & LEADS",
      items: [
        { name: "Leads", path: "/leads", icon: Users },
        { name: "Leads Summary", path: "/leads-summary", icon: TrendingUp },
        { name: "Reservations", path: "/reservation-requests", icon: Calendar, badge: pendingReservationsCount || 3 },
        { name: "Blocking Requests", path: "/blocking-requests", icon: Shield },
        { name: "Contracts", path: "/contracts", icon: FileText },
        { name: "EOIs", path: "/eois", icon: FilePlus },
      ],
    },
    {
      title: "ADMIN",
      items: [
        { name: "Users", path: "/users", icon: User },
        { name: "Teams", path: "/teams", icon: Users },
        { name: "Brokerages", path: "/brokerages", icon: Building2 },
        { name: "Reports", path: "/reports", icon: BarChart3 },
        { name: "Integrations", path: "/integrations", icon: Link2 },
        { name: "Settings", path: "/settings", icon: Settings },
      ],
    },
    {
      title: "DEVELOPMENT",
      items: [
        { name: "Designs", path: "/designs", icon: Palette },
        { name: "Components", path: "/components", icon: Component },
      ],
    },
  ];

  const sidebarVariants = {
    expanded: { width: "220px" },
    collapsed: { width: "68px" },
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div initial="expanded" animate={isCollapsed ? "collapsed" : "expanded"} variants={sidebarVariants} className="h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative z-50 flex-shrink-0">
        {/* Header */}
        <div className={`h-14 flex items-center border-b border-gray-100 flex-shrink-0 relative transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "justify-between px-4"}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
              <div className="w-7 h-7 bg-black text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                <HomeIcon size={16} />
              </div>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-bold text-sm text-gray-900 whitespace-nowrap overflow-hidden truncate">
                G Developments
              </motion.span>
            </div>
          )}

          <button onClick={() => setIsCollapsed(!isCollapsed)} className={`text-gray-500 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-all ${isCollapsed ? "w-10 h-10 flex items-center justify-center" : "flex-shrink-0"}`}>
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Sales Tool & Notification - Simplified */}
        <div className="py-2 px-3 border-b border-gray-100 flex flex-col gap-2 flex-shrink-0">
          <div className={`flex items-center ${isCollapsed ? "flex-col justify-center space-y-2" : "justify-between w-full"}`}>
            {/* Sales Tool Button */}
            <Link to="/sales">
              <Button className={`bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium h-8 text-xs ${isCollapsed ? "w-8 px-0 min-w-0 justify-center rounded-lg" : "px-2.5 rounded-full"}`} variant="ghost">
                {isCollapsed ? (
                  <ExternalLink size={16} />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <ExternalLink size={14} />
                    <span>Sales Tool</span>
                  </div>
                )}
              </Button>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button className={`h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors ${isCollapsed ? "w-8 border border-transparent" : "w-8 mr-1"}`}>
                <Bell size={16} />
              </button>
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white shadow-sm ring-1 ring-white">2</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
          {sidebarSections.map((section, idx) => (
            <div key={idx} className="group/section">
              {/* Section Header */}
              <div onClick={() => !isCollapsed && toggleSection(section.title)} className={`flex items-center mb-1 ${isCollapsed ? "justify-center" : "justify-between cursor-pointer hover:text-gray-600 px-2"} transition-colors`}>
                <AnimatePresence mode="wait">
                  {!isCollapsed ? (
                    <>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider select-none">{section.title}</span>
                      <motion.div initial={false} animate={{ rotate: openSections[section.title] ? 0 : -90 }} className="text-gray-400">
                        <ChevronDown size={14} />
                      </motion.div>
                    </>
                  ) : (
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center leading-tight select-none">
                      {section.title === "SALES & LEADS" ? (
                        <>
                          SALES
                          <br />&<br />
                          LEADS
                        </>
                      ) : (
                        section.title
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Items Container */}
              <AnimatePresence initial={false}>
                {(openSections[section.title] || isCollapsed) && (
                  <motion.div initial={!isCollapsed ? { height: 0, opacity: 0 } : undefined} animate={!isCollapsed ? { height: "auto", opacity: 1 } : undefined} exit={!isCollapsed ? { height: 0, opacity: 0 } : undefined} transition={{ duration: 0.2 }} className={`${isCollapsed ? "mt-1 space-y-1 flex flex-col items-center" : "space-y-0.5 overflow-hidden"}`}>
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));

                      const content = (
                        <Link key={item.path} to={item.path} className="block group w-full relative">
                          {/* Wrapper for styling */}
                          <div
                            className={`
                                  relative flex items-center gap-2.5 px-2 py-1.5 text-xs font-medium transition-all duration-200 rounded-lg
                                  ${isActive ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                                  ${isCollapsed ? "justify-center w-7 h-7 p-0 mx-auto" : ""}
                                `}
                          >
                            <item.icon size={isCollapsed ? 16 : 16} className={`flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"}`} strokeWidth={2} />

                            {/* Badge for Collapsed State */}
                            {isCollapsed && item.badge ? <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] flex items-center justify-center text-[9px] font-bold text-white bg-red-500 rounded-full px-0.5 border border-white z-10 shadow-sm">{item.badge}</span> : null}

                            {!isCollapsed && (
                              <div className="flex items-center justify-between flex-1 overflow-hidden ml-1">
                                <span className="truncate">{item.name}</span>
                                {item.badge ? <span className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1.5 ml-2">{item.badge}</span> : null}
                              </div>
                            )}
                          </div>
                        </Link>
                      );

                      return isCollapsed ? (
                        <Tooltip key={item.path}>
                          <TooltipTrigger asChild>
                            <div className="w-full">{content}</div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="z-[60]">
                            {item.name}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        content
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              {idx < sidebarSections.length - 1 && <div className={`h-px bg-gray-100 my-2 ${isCollapsed ? "mx-auto w-8" : "mx-4"}`} />}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-2 border-t border-gray-100 flex-shrink-0 bg-white">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-xs flex-shrink-0 group cursor-pointer hover:bg-gray-200 transition-colors border border-gray-200">{CURRENT_USER.initials}</div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="flex items-center justify-between flex-1 overflow-hidden">
                  <div className="flex flex-col min-w-0 ml-1">
                    <span className="text-xs font-bold text-gray-900 truncate leading-tight">{CURRENT_USER.name}</span>
                    <span className="text-[10px] text-gray-500 truncate leading-tight">{CURRENT_USER.role}</span>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <LogOut size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default Sidebar;
