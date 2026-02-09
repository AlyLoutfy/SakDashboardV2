import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const location = useLocation();
  const isFullHeightPage = location.pathname.startsWith("/integrations") || location.pathname.startsWith("/reports") || location.pathname.startsWith("/payment-plans");

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 w-full relative h-full overflow-hidden flex flex-col">
        <div className="w-full h-full flex-1 overflow-hidden relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
