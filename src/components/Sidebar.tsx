import { Link, useLocation } from "react-router-dom";
import { Button } from "@heroui/react";
import { LayoutDashboard, Settings, Workflow, Menu, X, FileSpreadsheet, Palette, CreditCard, Building2, ClipboardList } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReservationRequestsStore } from "../store/reservationRequestsStore";

// Current user ID - in a real app this would come from auth context
const CURRENT_USER_ID = "O001"; // Sara Mostafa from Operations - has pending items

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Get pending count for current user
  const getPendingCountForUser = useReservationRequestsStore((state) => state.getPendingCountForUser);
  const pendingReservationsCount = getPendingCountForUser(CURRENT_USER_ID);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Integrations", path: "/integrations", icon: Workflow },
    { name: "Reports", path: "/reports", icon: FileSpreadsheet },
    { name: "Payment Plans", path: "/payment-plans", icon: CreditCard },
    { name: "Unit Blocking", path: "/blocking-requests", icon: Building2 },
    { name: "Reservations", path: "/reservation-requests", icon: ClipboardList, badge: pendingReservationsCount },
    { name: "Designs", path: "/designs", icon: Palette },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const variants = {
    expanded: { width: "220px" },
    collapsed: { width: "72px" },
  };

  return (
    <motion.div initial="expanded" animate={isCollapsed ? "collapsed" : "expanded"} variants={variants} className="h-[calc(100vh-2rem)] my-4 ml-4 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl flex flex-col transition-all duration-300 relative z-20 shadow-xl shadow-gray-200/50">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-lg font-bold text-emerald-600">
              Sakneen
            </motion.h1>
          )}
        </AnimatePresence>
        <Button isIconOnly variant="ghost" onPress={() => setIsCollapsed(!isCollapsed)} className="ml-auto text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          {isCollapsed ? <Menu size={18} /> : <X size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 mt-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <Link key={item.path} to={item.path} className="block">
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                <div className="relative">
                  <item.icon size={20} className={isActive ? "text-emerald-600" : "text-gray-400"} />
                  {/* Badge for collapsed state */}
                  {isCollapsed && item.badge && item.badge > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">{item.badge > 9 ? "9+" : item.badge}</span>}
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="flex items-center justify-between flex-1 overflow-hidden">
                      <span className="whitespace-nowrap">{item.name}</span>
                      {/* Badge for expanded state */}
                      {item.badge && item.badge > 0 && <span className="min-w-[20px] h-[20px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1.5 ml-2">{item.badge > 99 ? "99+" : item.badge}</span>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex-shrink-0 shadow-md" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-gray-800 truncate">Sara Mostafa</span>
                <span className="text-xs text-gray-400 truncate">Operations</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
