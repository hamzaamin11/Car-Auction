import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaGavel,
  FaUsers,
  FaSearch,
  FaMoneyBillAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import { IoIosSettings } from "react-icons/io";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({
    Vehicles: true,
    Auctions: false,
    Inspection: false,
    Configuration: false,
    "Support Center": false,
  });
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaTachometerAlt />,
      end: true,
    },
    {
      name: "Vehicles",
      icon: <FaCar />,
      children: [
        { name: "Approved Vehicles", path: "/admin/vehicles" },
        { name: "Pending Vehicles", path: "/admin/approval" },
        { name: "Awaiting Approval", path: "/admin/awaiting" },
        { name: "Un-Sold Vehicles", path: "/admin/unsold" },
        { name: "Sold Vehicles", path: "/admin/pastvehicle" },
      ],
    },
    {
      name: "Auctions",
      icon: <FaGavel />,
      children: [
        // { name: "Auction Event", path: "/admin/auctionevent" },
        { name: "Event Auction", path: "/admin/eventauction" },
        { name: "Assign Event", path: "/admin/assignevent" },
        { name: "Live Auctions", path: "/admin/live-auctions" },
        { name: "Upcoming Auctions", path: "/admin/upcoming-auctions" },
        { name: "Auction History", path: "/admin/bid-history" },
      ],
    },
    {
      name: "Inspection",
      icon: <FaSearch />,
      children: [
        { name: "Upload Documents", path: "/admin/uploaddocs" },
        { name: "Vehicle Inspection", path: "/admin/inspection" },
      ],
    },
    {
      name: "Users",
      path: "/admin/manage-users",
      icon: <FaUsers />,
    },

    {
      name: "Account",
      path: "/admin/account",
      icon: <FaMoneyBillAlt />,
    },
    {
      name: "Support Center",
      icon: <FiHelpCircle />,
      children: [
        { name: "Suggestions", path: "/admin/suggestionlist" },
        { name: "Partnership Opportunities", path: "/admin/becomepartnerlist" },
        { name: "Get in Touch", path: "/admin/contactlist" },
        { name: "Subscribe Users", path: "/admin/subcribeuser" },
      ],
    },
    {
      name: "Configuration",
      icon: <IoIosSettings />,
      children: [
        { name: "Configure Commission ", path: "/admin/configuration" },
        { name: "Makes", path: "/admin/addbrand" },
        { name: "Models", path: "/admin/addmodel" },
        { name: "Series", path: "/admin/addseries" },
        { name: "Citites", path: "/admin/city" },
      ],
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
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-500 mt-1">Vehicle Management System</p>
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
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                        hasActiveChild
                          ? "bg-blue-50 text-blue-900 border-l-4 border-blue-900"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`mr-3 text-lg ${
                            hasActiveChild ? "text-blue-900" : "text-gray-500"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <FaChevronDown
                        className={`text-xs transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        } ${
                          hasActiveChild ? "text-blue-900" : "text-gray-400"
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="ml-9 space-y-1">
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
                                    ? "text-blue-900 bg-blue-50 font-medium"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`
                              }
                            >
                              <div className="flex items-center">
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
                      `flex items-center px-3 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-900 border-l-4 border-blue-900 font-medium"
                          : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      }`
                    }
                  >
                    <span
                      className={`mr-3 text-lg ${
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
      <div className="ml-3">
        <div className="flex items-center">
          <span className="text-xs text-gray-500 ">Developed by</span>
          <span className="text-red-500 text-lg mx-1 ">♥</span>
          <span className="text-xs font-bold text-blue-00">
            Technic Mentors
          </span>
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
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
