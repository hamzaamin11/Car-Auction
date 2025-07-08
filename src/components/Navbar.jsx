import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignInAlt } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import { AiOutlineLogout } from "react-icons/ai";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const commonDropdowns = [
    {
      id: 1,
      label: "Vehicles",
      items: [
        { to: "/finder", label: "Vehicle Finder" },
        { to: "/make", label: "Search By Make" },
        { to: "/saleslist", label: "Prices" },
        { to: "/certified", label: "Certified Cars" },
      ],
    },
    {
      id: 2,
      label: "Auctions",
      items: [
        { to: "/today", label: "Today's Auctions" },
        { to: "/calendar", label: "Auctions Calendar" },
        { to: "/join", label: "Join Auctions" },
      ],
    },
    {
      id: 3,
      label: "Services & Support",
      items: [
        { to: "/center", label: "Support Center" },
        { to: "/delivery", label: "Vehicle Delivery" },
        { to: "/news", label: "Chaudhry News" },
        { to: "/payment", label: "Payment Method" },
      ],
    },
  ];

  const sellerOnly = {
    id: 4,
    label: "Sell a Vehicle",
    items: [
      { to: "/buy", label: "We will buy your vehicle" },
      { to: "/sell", label: "Sell in auction" },
    ],
  };

  // const bidStatusDropdown = {
  //   id: 5,
  //   label: "Bid Status",
  //   items: [
  //     { to: "/my-bids", label: "My Bids" },
  //     { to: "/lots-lost", label: "Lots Lost" },
  //     { to: "/lots-won", label: "Lots Won" },
  //   ],
  // };

  const dropdowns = [
    ...commonDropdowns,
    ...(user?.role === "seller" ? [sellerOnly] : []),
  ];

  return (
    <nav className="bg-white shadow-md z-50 relative">
      <div className="flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold text-red-600 flex items-center gap-2"
        >
          <img src="/images/logo.png" alt="Logo" className="h-12" />
        </Link>

        <ul className="hidden md:flex items-center space-x-6 font-semibold relative">
          <li>
            <Link
              to="/"
              className={`hover:text-red-600 ${
                isActive("/") ? "text-red-600 font-semibold" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`hover:text-red-600 ${
                isActive("/about") ? "text-red-600 font-semibold" : ""
              }`}
            >
              About
            </Link>
          </li>

          {/* {isAuthenticated && (
            <li>
              <Link
                to="/add-vehicles"
                className={`hover:text-red-600 ${
                  isActive("/add-vehicles") ? "text-red-600 font-semibold" : ""
                }`}
              >
                Add Vehicles
              </Link>
            </li>
          )} */}

          {dropdowns.map((dropdown) => (
            <li
              key={dropdown.id}
              className="relative"
              onMouseEnter={() => setActiveDropdown(dropdown.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 font-medium hover:text-red-600 ${
                  activeDropdown === dropdown.id ? "text-red-600" : ""
                }`}
              >
                {dropdown.label}
                <RiArrowDropDownLine size={22} />
              </button>
              <ul
                className={`absolute left-0 top-full w-56 bg-white shadow-lg rounded-md py-2 z-40 transition-all duration-200 ${
                  activeDropdown === dropdown.id ? "block" : "hidden"
                }`}
              >
                {dropdown.items.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.to}
                      className="block px-4 py-2 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li>
            <Link
              to="/contact"
              className={`hover:text-red-600 ${
                isActive("/contact") ? "text-red-600 font-semibold" : ""
              }`}
            >
              Contact Us
            </Link>
          </li>
        </ul>

        <div className="hidden md:flex gap-4 relative">
          {isAuthenticated ? (
            <div
              className="relative"
              // onMouseEnter={() => setUserDropdownOpen(true)}
              // onMouseLeave={() => setUserDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 font-medium hover:text-red-600"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                Welcome,{" "}
                {user.name.length > 6
                  ? user.name.slice(0, 6) + ".."
                  : user.name}{" "}
                <RiArrowDropDownLine size={22} />
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-md z-50">
                  <div className="p-5 text-sm text-gray-700 border-b">
                    <ul className="leading-loose">
                      <li
                        className="text-base mb-2 hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Link to="/seller">Dashboard</Link>
                      </li>
                      <li
                        className="text-base mb-2 hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Link to="/seller/add-vehicles">Add Vehicles</Link>
                      </li>
                      <li
                        className="text-base mb-2 hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Link to="/seller/my-bids">My Bids</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="flex items-center hover:bg-gray-100">
                    <AiOutlineLogout className="text-red-600 ml-2" size={18} />
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left font-bold ml-2 py-2 text-sm cursor-pointer text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/register"
                className="flex items-center gap-1 hover:text-red-600"
              >
                <FaUser /> Register
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-1 hover:text-red-600"
              >
                <FaSignInAlt /> Signin
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-red-600 text-white px-6 pb-6 space-y-4">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block font-medium"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block font-medium"
          >
            Contact Us
          </Link>

          {user?.role === "seller" && (
            <Link
              to="/add-vehicles"
              onClick={() => setMenuOpen(false)}
              className="block font-medium"
            >
              Add Vehicles
            </Link>
          )}

          {dropdowns.map((dropdown) => (
            <div key={dropdown.id}>
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === dropdown.id ? null : dropdown.id
                  )
                }
                className="w-full flex justify-between items-center py-2 font-medium"
              >
                {dropdown.label}
                <RiArrowDropDownLine size={24} />
              </button>
              {activeDropdown === dropdown.id && (
                <ul className="pl-4 space-y-1 text-sm">
                  {dropdown.items.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className="block py-1 hover:translate-x-1 transition-transform"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {isAuthenticated ? (
            <div className="pt-4 border-t border-white text-sm">
              <div className="py-2">Welcome, {user.name}</div>
              <div className="py-1">ID: {user.id}</div>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left py-1 text-white hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-4 border-t border-white">
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center"
              >
                <FaUser className="mr-1" /> Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center"
              >
                <FaSignInAlt className="mr-1" /> Signin
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
