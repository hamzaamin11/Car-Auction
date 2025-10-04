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
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    fatherName: currentUser?.fatherName || "",
    cnic: currentUser?.cnic || "",
    address: currentUser?.address || "",
  });

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    // Add password change logic here (e.g., API call)
    console.log("Password change submitted:", passwordForm);
    setPasswordModalOpen(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  // Handle profile submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Add profile update logic here (e.g., API call)
    console.log("Profile update submitted:", profileForm);
    setProfileModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logOut());
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Outside click detection
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setPasswordModalOpen(false);
    setProfileModalOpen(false);
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
              ? "max-h-96 opacity-100 scale-100"
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
            onClick={() => setPasswordModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
          >
            <span className="text-sm font-semibold">Change Password</span>
          </div>
          <div
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
          >
            <span className="text-sm font-semibold">Manage Profile</span>
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

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-blur backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="px-4 py-2 bg-blue-950 text-white rounded-md "
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-blur backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Manage Profile</h2>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Father's Name
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={profileForm.fatherName}
                  onChange={handleProfileChange}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  CNIC Number
                </label>
                <input
                  type="text"
                  name="cnic"
                  value={profileForm.cnic}
                  onChange={handleProfileChange}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileForm.address}
                  onChange={handleProfileChange}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setProfileModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfileSubmit}
                  className="px-4 py-2 bg-blue-950 text-white rounded-md "
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}