import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaGavel,
  FaUsers,
  FaHistory,
  FaSearch,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { FiHelpCircle } from "react-icons/fi";
import { IoIosSettings } from "react-icons/io";

const Sidebar = () => {
  const { pathName } = useLocation();

  {
    location.pathname === "/admin"
      ? "bg-blue-950 text-white"
      : "text-white hover:bg-gray-100";
  }

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
        { name: "Awaiting Approval", path: "/admin/awaiting" },
        { name: "Vehicle Makes List", path: "/admin/addbrand" },
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
        { name: "Auction Event", path: "/admin/auctionevent" },
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
      name: "Configuration",
      icon: <IoIosSettings />,
      children: [
        { name: "Account Configuration", path: "/admin/configuration" },
      ],
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
        { name: "Subcribe Users", path: "/admin/subcribeuser" },
      ],
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 bg-blue-950 ">
      <h2 className="text-2xl font-bold mb-6 text-white mt-8">Admin Panel</h2>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div className="mb-2">
                <div className="flex items-center px-4 py-3 text-white">
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
                            ? "text-blue-950 bg-white"
                            : "text-white hover:underline"
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
                      ? "text- blue-950 bg-white"
                      : "text-white hover:underline"
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
