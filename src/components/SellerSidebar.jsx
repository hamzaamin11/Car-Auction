import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaGavel,
  FaUsers,
  FaHistory,
} from "react-icons/fa";

const SellerSidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/seller/dashboard", // Matches index route
      icon: <FaTachometerAlt />,
      end: true,
    },
    {
      name: "Vehicles",
      icon: <FaCar />,
      children: [
        { name: "Vehicle List ", path: "/seller/addVehicle" }, // Matches <AddAdminVehicle />
        // { name: "Add Prices", path: "/seller/vehicle-prices" }, // Matches <SellerVehiclePrices />
        // { name: "Add Specs", path: "/seller/vehicle-spects" }, // Matches <SellerVehicleSpects />
        // { name: "View Details", path: "/seller/vehicle-details" }, // Matches <SellerVehicleDetails />
      ],
    },
    {
      name: "Auctions",
      icon: <FaGavel />,
      children: [
        { name: "Live Auctions", path: "/seller/live-auctions" }, // Matches <SellerLiveAuctions />
        { name: "Upcoming Auctions", path: "/seller/upcoming-auctions" }, 
          { name: "Auction History", path: "/seller/my-bids" },// Matches <UpcomingAuctions />
      ],
    },
    // {
    //   name: "My Bids",
    //   icon: <FaHistory />,
    //   children: [
    //     { name: "Bid Hsitory", path: "/seller/my-bids" }, // Matches <MyBids />
    //     //   { name: "Lots Lost", path: "/seller/lots-lost" },  // Matches <LotsLost />
    //     //   { name: "Lots Won", path: "/seller/lots-won" },  // Matches <LotsWon />
    //   ],
    // },
    // Add more groups as needed
  ];

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 mt-8">
        Seller Panel
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

export default SellerSidebar;
