import { Outlet, NavLink, Link } from "react-router-dom";
import { Home, ClipboardList, ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SalesLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Header Navigation */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back + Logo */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Link to="/integrations" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors flex-shrink-0">
                <ArrowLeft size={18} />
                <span className="text-sm hidden sm:inline">Dashboard</span>
              </Link>
              <div className="w-px h-6 bg-slate-200 hidden sm:block" />
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                <span className="text-white font-bold text-base sm:text-lg">S</span>
              </div>
              <div className="hidden xs:block min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate">Sales Tool</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Reservation Management</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/sales/unit" className={({ isActive }) => `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}>
                <Home size={18} />
                Unit Details
              </NavLink>
              <NavLink to="/sales/reservations" className={({ isActive }) => `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}>
                <ClipboardList size={18} />
                My Reservations
              </NavLink>
            </nav>

            {/* Right: User Avatar + Mobile Menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/20">JD</div>

              {/* Mobile Menu Button */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden">
                <nav className="flex flex-col gap-1 pt-3 mt-3 border-t border-slate-100">
                  <NavLink to="/sales/unit" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}>
                    <Home size={20} />
                    Unit Details
                  </NavLink>
                  <NavLink to="/sales/reservations" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}>
                    <ClipboardList size={20} />
                    My Reservations
                  </NavLink>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-hidden">
        <div className="h-full w-full overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SalesLayout;
