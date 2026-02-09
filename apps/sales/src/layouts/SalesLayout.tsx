import { Outlet, NavLink } from "react-router-dom";
import { Home, ClipboardList } from "lucide-react";

const SalesLayout = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Header Navigation */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">Sales Tool</h1>
                <p className="text-xs text-slate-500">Reservation Management</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center gap-1">
              <NavLink to="/unit" className={({ isActive }) => `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}>
                <Home size={18} />
                Unit Details
              </NavLink>
              <NavLink to="/reservations" className={({ isActive }) => `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}>
                <ClipboardList size={18} />
                My Reservations
              </NavLink>
            </nav>

            {/* User Avatar Placeholder */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-emerald-500/20">JD</div>
            </div>
          </div>
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
