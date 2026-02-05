import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const location = useLocation();
  const isFullHeightPage = location.pathname.startsWith("/integrations") || location.pathname.startsWith("/reports") || location.pathname.startsWith("/payment-plans");

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full relative h-full p-4">
        <div className={`${isFullHeightPage ? "h-full" : "min-h-full"} w-full`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
