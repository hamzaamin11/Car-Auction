import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaGavel,
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaUserCircle,
} from "react-icons/fa";

const SellerSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({
    Vehicles: true,
    Auctions: false,
    Inspection: false,
  });
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/seller/dashboard",
      icon: <FaTachometerAlt />,
      end: true,
    },
    {
      name: "Vehicles",
      icon: <FaCar />,
      children: [
        { name: "Vehicle List", path: "/seller/addVehicle" },
        { name: "Un-Sold Vehicle", path: "/seller/unsold" },
        { name: "Sold Vehicles", path: "/seller/pastvehicle" },
      ],
    },
    {
      name: "Auctions",
      icon: <FaGavel />,
      children: [
        { name: "Live Auctions", path: "/seller/live-auctions" },
        { name: "Upcoming Auctions", path: "/seller/upcoming-auctions" },
        // { name: "Auction History", path: "/seller/my-bids" },
      ],
    },
    {
      name: "Inspection",
      icon: <FaSearch />,
      children: [{ name: "Upload Documents", path: "/seller/inspection" }],
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleExpand = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const isChildActive = (children) => {
    return children.some((child) => child.path === location.pathname);
  };

  const sidebarContent = (
    <div className="w-64 h-full bg-white text-gray-800 flex flex-col border-r border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow">
            <FaUserCircle className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Seller Panel</h2>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isExpanded = expandedItems[item.name];
            const hasActiveChild = item.children
              ? isChildActive(item.children)
              : false;
            const isActive = location.pathname === item.path;

            return (
              <div key={item.name} className="mb-1">
                {item.children ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 ${
                        hasActiveChild
                          ? "bg-blue-50 text-blue-900 border-l-3 border-blue-900"
                          : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`mr-3 text-lg transition-colors ${
                            hasActiveChild ? "text-blue-900" : "text-gray-500"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <FaChevronDown
                        className={`text-xs transition-all duration-200 ${
                          isExpanded
                            ? "rotate-180 text-blue-900"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="ml-10 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive =
                            location.pathname === child.path;
                          return (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              onClick={closeMobileMenu}
                              className={({ isActive }) =>
                                `block px-3 py-2.5 text-sm rounded transition-colors ${
                                  isActive || isChildActive
                                    ? "text-blue-900 bg-blue-50 font-medium pl-4 border-l-2 border-blue-900"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 pl-4"
                                }`
                              }
                            >
                              <div className="flex items-center">
                                <FaChevronRight className="mr-2 text-xs" />
                                {child.name}
                              </div>
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    end={item.end}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-900 border-l-3 border-blue-900 font-medium"
                          : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      }`
                    }
                  >
                    <span
                      className={`mr-3 text-lg transition-colors ${
                        isActive ? "text-blue-900" : "text-gray-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </NavLink>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="">
        <div className="ml-3">
          <div className="flex items-center">
            <span className="text-xs text-gray-500">Developed by</span>
            <span className="text-red-500 text-lg mx-1">♥</span>
            <span className="text-xs font-bold text-blue-900">
              Technic Mentors
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-white text-gray-800 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  );
};

export default SellerSidebar;
