import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaGavel,
  FaUsers,
  FaHistory,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { FiHelpCircle } from "react-icons/fi";

const Sidebar = () => {
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
        { name: "Vehicle List", path: "/admin/vehicles" },
        { name: "For Approval Vehicles", path: "/admin/approval" },
        { name: "Vehicle Brand List", path: "/admin/addbrand" },
        { name: "Vehicle Model List", path: "/admin/addmodel" },
        { name: "Vehicle Series List", path: "/admin/addseries" },
        { name: "City List", path: "/admin/city" },

        // { name: "View Details", path: "/admin/vehicle-details" },
      ],
    },
    {
      name: "Auctions",
      icon: <FaGavel />,
      children: [
        { name: "Live Auctions", path: "/admin/live-auctions" },
        { name: "Upcoming Auctions", path: "/admin/upcoming-auctions" },
      ],
    },
    {
      name: "Bids",
      icon: <FaHistory />,
      children: [{ name: "Bid History", path: "/admin/bid-history" }],
    },
    {
      name: "Users",
      path: "/admin/manage-users",
      icon: <FaUsers />,
    },

    {
      name: "Support Center",
      icon: <FiHelpCircle />,
      children: [
        { name: "Suggestions", path: "/admin/suggestionlist" },
        { name: "Partnership Opportunities", path: "/admin/becomepartnerlist" },
        { name: "Get in Touch", path: "/admin/contactlist" },
      ],
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 mt-8">
        Admin Panel
      </h2>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div className="mb-2">
                <div className="flex items-center px-4 py-3 text-gray-600">
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <div className="ml-8 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `block px-3 py-2 text-sm rounded-md ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-100"
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
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-md ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
