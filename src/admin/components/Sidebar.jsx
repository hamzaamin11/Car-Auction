import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaCar, FaGavel, FaUsers, FaHistory } from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/admin", 
      icon: <FaTachometerAlt />,
      end: true
    },
    {
      name: "Vehicles",
      icon: <FaCar />,
      children: [
        { name: "Add Vehicle", path: "/admin/vehicles" },
        // { name: "Manage Vehicles", path: "/admin/manage-vehicles" },
        { name: "Add Prices", path: "/admin/vehicle-prices" },
        { name: "Add Specs", path: "/admin/vehicle-spects" },
        { name: "View Details", path: "/admin/vehicle-details" },
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
      children: [
        { name: "Bid History", path: "/admin/bid-history" },
      ],
    },
    { 
      name: "Users", 
      path: "/admin/manage-users", 
      icon: <FaUsers /> 
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 mt-8">Admin Panel</h2>
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
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-600 hover:bg-gray-100'
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
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
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