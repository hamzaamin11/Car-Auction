import { Outlet } from "react-router-dom";
import SellerSidebar from "../../src/components/SellerSidebar"

const SellerLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="flex flex-1 h-full">
        {/* Sidebar - Fixed width */}
        <div className="w-64 flex-shrink-0 border-r bg-white">
          <SellerSidebar />
        </div>
        
        {/* Content Area - Flexible width */}
        <main className="flex-1 overflow-y-auto ">
          <Outlet /> {/* This will render matched routes */}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout