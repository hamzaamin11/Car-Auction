import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { authSuccess, logOut } from "./Redux/UserSlice";
import logoImage from "../../src/assets/wheellogo.png";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { currentUser } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cities, setCities] = useState([]);

  const dropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const genderDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Searchable dropdown states
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [genderSearch, setGenderSearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  // ✅ FIXED: Separate states for image file and preview
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    gender: currentUser?.gender || "",
    dateOfBirth: currentUser?.dateOfBirth || "",
    country: currentUser?.country || "Pakistan",
    city: currentUser?.city || "",
    username: currentUser?.name || "",
    email: currentUser?.email || "",
    mobileNumber: currentUser?.contact || "",
    cnic: currentUser?.cnic || "",
    role: currentUser?.role || "",
  });

  // Options lists
  const countries = ["Pakistan"];
  const genders = ["Male", "Female", "Other"];

  const handleGetAllCity = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`);
      setCities(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter functions
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredCities = cities.filter((city) =>
    city?.cityName?.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredGenders = genders.filter((gender) =>
    gender.toLowerCase().includes(genderSearch.toLowerCase())
  );

  // ✅ FIXED: Handle image upload with separate file and preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the actual file for upload
    setImageFile(file);

    // Create preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

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

  // Handle country selection
  const handleCountrySelect = (country) => {
    setProfileForm((prev) => ({ ...prev, country }));
    setCountrySearch(country);
    setShowCountryDropdown(false);
  };

  // Handle city selection
  const handleCitySelect = (city) => {
    setProfileForm((prev) => ({ ...prev, city: city.cityName }));
    setCitySearch(city.cityName);
    setShowCityDropdown(false);
  };

  // Handle gender selection
  const handleGenderSelect = (gender) => {
    setProfileForm((prev) => ({ ...prev, gender: gender.toLowerCase() }));
    setGenderSearch(gender);
    setShowGenderDropdown(false);
  };

  // Handle password submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      await Swal.fire({
        title: "Error!",
        text: "New password and confirm password do not match!",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
      return;
    }
    try {
      const res = await axios.put(
        `${BASE_URL}/updatePassword/${currentUser?.id}`,
        {
          password: passwordForm.newPassword,
        }
      );
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      await Swal.fire({
        title: "Success!",
        text: "Password changed successfully!",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
      setPasswordModalOpen(false);
    } catch (error) {
      console.log(error);
      await Swal.fire({
        title: "Error!",
        text: "Failed to change password. Please try again.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  // ✅ FIXED: Handle profile submission with actual file upload
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append all text fields
      formData.append("name", profileForm.name);
      formData.append("gender", profileForm.gender);
      formData.append("dateOfBirth", profileForm.dateOfBirth);
      formData.append("country", profileForm.country);
      formData.append("city", profileForm.city);
      formData.append("username", profileForm.username);
      formData.append("email", profileForm.email);
      formData.append("contact", profileForm.mobileNumber);
      formData.append("role", profileForm.role);
      formData.append("cnic", profileForm.cnic);

      // ✅ Append the actual file if user selected a new one
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Send request
      const res = await axios.put(
        `${BASE_URL}/admin/updateRegisterUsers/${currentUser?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Profile updated:", res.data);

      // ✅ Update Redux state with new user data
      dispatch(authSuccess(res.data));

      // ✅ Update image preview with new URL from backend
      if (res.data.image || res.data.imageUrl || res.data.profileImage) {
        setImagePreview(
          res.data.image || res.data.imageUrl || res.data.profileImage
        );
      }

      // ✅ Clear the file state
      setImageFile(null);

      await Swal.fire({
        title: "Success!",
        text: "Profile updated successfully!",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
      setProfileModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      await Swal.fire({
        title: "Error!",
        text: "Failed to update profile. Please try again.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logOut());
    setDropdownOpen(false);
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // ✅ FIXED: Update imagePreview when currentUser changes (after login or profile update)
  useEffect(() => {
    if (
      currentUser?.image ||
      currentUser?.imageUrl ||
      currentUser?.profileImage
    ) {
      setImagePreview(
        currentUser?.image || currentUser?.imageUrl || currentUser?.profileImage
      );
    }
  }, [currentUser]);

  // ✅ FIXED: Initialize search fields and image preview when modal opens
  useEffect(() => {
    if (profileModalOpen) {
      setCountrySearch(profileForm.country);
      setCitySearch(profileForm.city);
      setGenderSearch(
        profileForm.gender
          ? profileForm.gender.charAt(0).toUpperCase() +
              profileForm.gender.slice(1)
          : ""
      );
      // Reset image preview to current user's image when modal opens
      setImagePreview(
        currentUser?.image ||
          currentUser?.imageUrl ||
          currentUser?.profileImage ||
          ""
      );
      setImageFile(null);
    }
  }, [profileModalOpen, currentUser]);

  useEffect(() => {
    handleGetAllCity();
  }, []);

  // Outside click detection for all dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setShowCountryDropdown(false);
      }
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setShowCityDropdown(false);
      }
      if (
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(event.target)
      ) {
        setShowGenderDropdown(false);
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

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (passwordModalOpen || profileModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [passwordModalOpen, profileModalOpen]);

  const isActive = (path) => location.pathname === path;

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

  return (
    <nav className="bg-white shadow-md z-50 relative">
      <div className="flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold text-red-600 flex items-center gap-2"
        >
          <img src={logoImage} alt="Logo" className="h-12 pt-4 lg:pt-0" />
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
        {/* Profile Dropdown */}
        <div className="hidden md:flex gap-4 relative" ref={dropdownRef}>
          {currentUser ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 focus:outline-none group"
              >
                {/* ✅ FIXED: Show actual profile image or fallback to icon */}
                {currentUser?.image ||
                currentUser?.imageUrl ||
                currentUser?.profileImage ? (
                  <img
                    src={
                      currentUser?.image ||
                      currentUser?.imageUrl ||
                      currentUser?.profileImage
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 group-hover:border-red-600 transition-colors duration-300"
                  />
                ) : (
                  <FaUserCircle
                    size={40}
                    className="text-gray-700 group-hover:text-red-600 transition-colors duration-300"
                  />
                )}
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
                  onClick={() => {
                    setPasswordModalOpen(true);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                >
                  <span className="text-sm font-semibold">Change Password</span>
                </div>
                <div
                  onClick={() => {
                    setProfileModalOpen(true);
                    setDropdownOpen(false);
                  }}
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

          {currentUser ? (
            <div className="pt-4 border-t border-white text-sm">
              <div className="flex items-center gap-2 mb-4">
                {/* ✅ FIXED: Show profile image in mobile menu */}
                {currentUser?.image ||
                currentUser?.imageUrl ||
                currentUser?.profileImage ? (
                  <img
                    src={
                      currentUser?.image ||
                      currentUser?.imageUrl ||
                      currentUser?.profileImage
                    }
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={32} className="text-white" />
                )}
                <span>Signed in as {currentUser?.name || "--"}</span>
              </div>
              <button
                onClick={() => {
                  setPasswordModalOpen(true);
                  setMenuOpen(false);
                }}
                className="block w-full text-left py-1 text-white hover:underline"
              >
                Change Password
              </button>
              <button
                onClick={() => {
                  setProfileModalOpen(true);
                  setMenuOpen(false);
                }}
                className="block w-full text-left py-1 text-white hover:underline"
              >
                Manage Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
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

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-blur backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
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
                  className="px-4 py-2 bg-blue-950 text-white rounded-md"
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
        <div className="fixed inset-0 bg-blur backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={128} className="text-gray-400" />
                  )}
                </div>

                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="profileImageInput"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                  title="Change profile picture"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
              </div>

              {/* Name below image */}
              <div className="text-center mt-1 text-lg font-bold text-gray-800">
                {currentUser.name}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
              <p className="text-sm text-red-600">
                Picture can be changed. Select an image to update your profile
                picture
              </p>
            </div>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="">
                  <label className="block text-sm font-medium text-gray-700 ">
                    CNIC
                  </label>
                  <input
                    type="tel"
                    name="cnic"
                    value={profileForm.cnic}
                    placeholder=""
                    onChange={handleProfileChange}
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength={15}
                  />
                </div>

                {/* Gender - Searchable */}
                <div className=" relative" ref={genderDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={genderSearch}
                    onChange={(e) => {
                      setGenderSearch(e.target.value);
                      setShowGenderDropdown(true);
                    }}
                    onFocus={() => setShowGenderDropdown(true)}
                    placeholder="Search or select gender"
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {showGenderDropdown && filteredGenders.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredGenders.map((gender) => (
                        <div
                          key={gender}
                          onClick={() => handleGenderSelect(gender)}
                          className="p-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          {gender}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileForm.dateOfBirth}
                    onChange={handleProfileChange}
                    placeholder="DD-MM-YYYY"
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Country - Searchable */}
                <div className=" relative" ref={countryDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                      setShowCountryDropdown(true);
                    }}
                    onFocus={() => setShowCountryDropdown(true)}
                    placeholder="Search or select country"
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {showCountryDropdown && filteredCountries.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredCountries.map((country) => (
                        <div
                          key={country}
                          onClick={() => handleCountrySelect(country)}
                          className="p-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          {country}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* City - Searchable */}
                <div className=" relative" ref={cityDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => {
                      setCitySearch(e.target.value);
                      setShowCityDropdown(true);
                    }}
                    onFocus={() => setShowCityDropdown(true)}
                    placeholder="Search or select city"
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {showCityDropdown && filteredCities.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredCities.map((city) => (
                        <div
                          key={city}
                          onClick={() => handleCitySelect(city)}
                          className="p-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          {city.cityName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Username */}
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 ">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileForm.username}
                    onChange={handleProfileChange}
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    readOnly
                  />
                </div>
              </div>

              {/* Email - Full Width */}
              <div className="my-3">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Mobile Number - Full Width */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 ">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={profileForm.mobileNumber}
                    onChange={handleProfileChange}
                    placeholder="+9200000000000"
                    className="p-2.5 flex-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={13}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-md border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProfileSubmit}
                  className="px-4 py-2 bg-blue-950 text-white rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
