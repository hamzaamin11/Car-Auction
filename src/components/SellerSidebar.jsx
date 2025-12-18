import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaCar, FaGavel, FaSearch, FaBars, FaTimes } from "react-icons/fa";

const SellerSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      ],
    },
    {
      name: "Auctions",
      icon: <FaGavel />,
      children: [
        { name: "Live Auctions", path: "/seller/live-auctions" },
        { name: "Upcoming Auctions", path: "/seller/upcoming-auctions" },
        { name: "Auction History", path: "/seller/my-bids" },
      ],
    },
    {
      name: "Inspection",
      icon: <FaSearch />,
      children: [
        { name: "Upload Documents", path: "/seller/inspection" },
      ],
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="w-64 h-full bg-blue-950 text-white flex flex-col">
      <div className="p-6 border-b border-blue-900">
        <h2 className="text-2xl font-bold">Seller Panel</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div className="space-y-1">
                <div className="flex items-center px-4 py-3 text-white opacity-90">
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span className="font-semibold">{item.name}</span>
                </div>
                <div className="ml-10 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm rounded-lg transition-colors ${
                          isActive
                            ? "bg-white text-blue-950 font-semibold"
                            : "hover:bg-blue-800"
                        }`
                      }
                    >
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                to={item.path}
                end={item.end}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-white text-blue-950 font-semibold"
                      : "hover:bg-blue-800"
                  }`
                }
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                <span className="font-semibold">{item.name}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Hamburger Button - Visible only on mobile (< lg) */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-gray-100 text-blue-950 rounded-lg shadow-xl"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
      </button>

      {/* Desktop Sidebar - Visible only on lg+ */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Menu - Only rendered on < lg */}
      <div className="lg:hidden">
        {/* Wrapper with conditional classes */}
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Dark Overlay */}
          <div
            className="absolute inset-0 bg-white"
            onClick={closeMobileMenu}
          />

          {/* Sliding Sidebar */}
          <aside
            className={`absolute inset-y-0 left-0 transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {sidebarContent}
          </aside>
        </div>
      </div>
    </>
  );
};

export default SellerSidebar;