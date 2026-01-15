import { Link, useLocation } from 'react-router-dom';
import { Button } from "@heroui/react";
import { LayoutDashboard, Settings, Workflow, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Integrations', path: '/integrations', icon: Workflow },
    { name: 'Designs', path: '/designs', icon: LayoutDashboard },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const variants = {
    expanded: { width: "240px" },
    collapsed: { width: "80px" }
  };

  return (
    <motion.div 
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={variants}
      className="h-screen bg-gray-50 dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-all duration-300 relative z-20 shadow-lg"
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              Sakneen
            </motion.h1>
          )}
        </AnimatePresence>
        <Button 
          isIconOnly 
          variant="ghost" 
          onPress={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
             <div key={item.path} className="relative group">
                {/* Simplified Tooltip logic or removed for now as Tooltip v3 is complex */}
                <Link to={item.path} className="block">
                  <Button
                    className={`w-full justify-start ${isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'bg-transparent'}`}
                    variant={isActive ? "secondary" : "ghost"}
                    onPress={() => {}} // dummy
                  >
                    <item.icon size={22} />
                    {!isCollapsed && (
                      <span className="ml-2">{item.name}</span>
                    )}
                  </Button>
                </Link>
             </div>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
        {!isCollapsed && (
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
             <div className="flex flex-col">
               <span className="text-sm font-medium">User Admin</span>
               <span className="text-xs text-gray-500">admin@sakneen.com</span>
             </div>
           </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 mx-auto" />
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
