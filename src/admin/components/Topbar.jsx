import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../components/Redux/UserSlice";
import logo from "../../assets/wheellogo.png";

export default function Topbar() {
  const { currentUser } = useSelector((state) => state?.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // ✅ dropdown ka ref

  const navigate = useNavigate();
  const location = useLocation(); // ✅ route change detect karne ke liye
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logOut());
    setDropdownOpen(false); // ✅ logout ke baad bhi close
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // ✅ Outside click detection
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Route change hone par dropdown close
  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  return (
    <header className="bg-white shadow-md px-4 py-3 md:px-6 flex items-center justify-between relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link to={currentUser?.role === "admin" ? "/admin" : "/"}>
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-12 sm:h-14 sm:w-24 object-contain"
          />
        </Link>
      </div>

      {/* Profile section */}
      <div className="relative" ref={dropdownRef}>
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
    </header>
  );
}
