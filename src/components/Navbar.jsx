import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignInAlt,
  FaUserCircle,
} from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "./Redux/UserSlice";
import logoImage from "../../src/assets/wheellogo.png";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { currentUser } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Ref banaya dropdown ke liye
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const dispatch = useDispatch();

  const commonDropdowns = [
    {
      id: 1,
      label: "Vehicles",
      items: [
        { to: "/finder", label: "Vehicle Finder" },
        { to: "/saleslist", label: "Search By Make" },
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
  ];

  const sellerOnly = {
    id: 4,
    label: "Sell a Vehicle",
    items: [
      { to: "/buy", label: "We will buy your vehicle" },
      { to: "/sell", label: "Sell in auction" },
    ],
  };

  const dropdowns = [
    ...commonDropdowns,
    ...(user?.role === "seller" ? [sellerOnly] : []),
  ];

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logOut());
  };

  // ✅ Click outside close logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md z-50 relative">
      <div className="flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold text-red-600 flex items-center gap-2"
        >
          <img src={logoImage} alt="Logo" className="h-12 pt-4 lg:pt-0 " />
        </Link>
        <ul className="hidden md:flex items-center space-x-4 font-semibold relative">
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

          <li className="space-x-6">
            <Link
              to="/partner"
              className={`hover:text-red-600 ${
                isActive("/partner") ? "text-red-600 font-semibold" : ""
              }`}
            >
              Become a Partner
            </Link>

            <Link
              to="/suggestion"
              className={`hover:text-red-600 ${
                isActive("/suggestion") ? "text-red-600 font-semibold" : ""
              }`}
            >
              Suggestions
            </Link>

            <Link
              to="/contact"
              className={`hover:text-red-600 ${
                isActive("/contact") ? "text-red-600 font-semibold" : ""
              }`}
            >
              Contact Us
            </Link>
          </li>

          <li>
            {currentUser?.role === "customer" ? null : (
              <button
                onClick={() => navigate("/sellerIntro")}
                className="bg-red-600 text-white font-bold px-2 py-1.5 rounded hover:cursor-pointer"
              >
                Post an Ad
              </button>
            )}
          </li>
        </ul>
        {/* ✅ Dropdown with outside click close */}
        <div className="hidden md:flex gap-4 relative" ref={dropdownRef}>
          {currentUser ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <FaUserCircle
                  size={40}
                  className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300"
                />
              </button>

              <div
                className={`absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                  dropdownOpen
                    ? "max-h-40 opacity-100 scale-100"
                    : "max-h-0 opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm text-gray-600">Signed in as</p>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {currentUser?.name || "--"}
                  </p>
                </div>
                <div
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                >
                  <AiOutlineLogout size={20} />
                  <span className="text-sm font-semibold">Logout</span>
                </div>
              </div>
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

          <Link
            to="/suggestion"
            onClick={() => setMenuOpen(false)}
            className="block font-medium"
          >
            Suggestion
          </Link>

          <Link
            to="/partner"
            onClick={() => setMenuOpen(false)}
            className="block font-medium"
          >
            Become A Partner
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
