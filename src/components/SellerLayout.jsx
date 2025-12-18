import { Outlet } from "react-router-dom";
import SellerSidebar from "../../src/components/SellerSidebar"; // Make sure path is correct
import Topbar from "../admin/components/Topbar";

const SellerLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Fixed Topbar */}
      <Topbar />

      {/* Main flex area: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - Visible only on lg+ */}
        <aside className="w-64 flex-shrink-0 hidden lg:block border-r border-gray-200 bg-white overflow-y-auto">
          <SellerSidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* IMPORTANT: Render SellerSidebar again for mobile */}
      {/* This handles the hamburger menu and mobile sliding sidebar */}
      <div className="lg:hidden">
        <SellerSidebar />
      </div>
    </div>
  );
};

export default SellerLayout;