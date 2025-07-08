import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";


export default function Topbar() {
  const [adminName, setAdminName] = useState('');
  const [adminId, setAdminId] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAdminName(localStorage.getItem('adminName') || '');
    setAdminId(localStorage.getItem('adminId') || '');
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-md px-4 py-3 md:px-6 flex items-center justify-between">
      {/* Logo and title */}
      <div className="flex items-center gap-3">
        <Link to="/">
        <img src="/images/logo.png" alt="Logo" className="h-14 w-14 object-contain sm:h-14 sm:w-24" />
        </Link>
        {/* <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          Admin Dashboard
        </h1> */}
      </div>

      {/* Profile dropdown */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 focus:outline-none"
        >
          <FaUserCircle className="text-2xl text-gray-700" />
          <span className="hidden sm:inline-block text-sm font-medium text-gray-700">{adminName}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white  rounded shadow-md z-50">
            <div className="p-5 text-sm text-gray-700 border-b">
              {/* <p><strong>ID:</strong> {adminId}</p> */}
              <ul className="leading-loose">
                 <li className="text-base border-b-1 border-gray-100 mb-2"><Link to="/admin">Dashboard</Link></li>
                 <li className="text-base border-b-1 border-gray-100 mb-2"><Link to="/admin/vehicles">Manage Vehicles</Link></li>
                 <li className="text-base border-b-1 border-gray-100 mb-2"><Link to="/admin/live-auctions">Live Auctions</Link></li>
                 <li className="text-base"><Link to="/admin/manage-users">Mange Users</Link></li>
                 
              </ul>
                      
            </div>
            <div className="flex items-center">
              <AiOutlineLogout className="text-red-600 ml-2" size={18}/>
            <button
              onClick={handleLogout}
              className="w-full text-left font-bold ml-2 py-2 text-sm cursor-pointer text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
