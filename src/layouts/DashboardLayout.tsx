import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-black overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full relative h-full">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
