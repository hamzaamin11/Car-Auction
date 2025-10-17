import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AdminLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Fixed Topbar */}
      <div className="fixed top-0 left-0 right-0 h-16 z-50">
        <Topbar />
      </div> 

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16 h-full">
        {/* Sidebar - Fixed width */}
        <div className="w-64 flex-shrink-0 border-r bg-white hidden md:block">
          <Sidebar />
        </div>

        {/* Content Area - Flexible width */}
        <main className="flex-1 overflow-y-auto lg:p-6 py:6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;