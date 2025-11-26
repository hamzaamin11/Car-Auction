import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Settings, User, Lock } from "lucide-react";

import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignInAlt,
  FaUserCircle,
  FaCarSide,
  FaHeart,
} from "react-icons/fa";
import { UserPlus, LogIn } from "lucide-react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { authSuccess, logOut } from "./Redux/UserSlice";
import logoImage from "../../src/assets/wheellogo.png";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";
import Swal from "sweetalert2";

const getInitialProfileForm = (user) => ({
  name: user?.name || "",
  gender: user?.gender || "",
  dateOfBirth: user?.dateOfBirth || "",
  country: user?.country || "Pakistan",
  city: user?.city || "",
  username: user?.name || "",
  email: user?.email || "",
  mobileNumber: user?.contact || "",
  cnic: user?.cnic || "",
  role: user?.role || "",
});

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { currentUser } = useSelector((state) => state.auth);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);

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
  const [showLive, setShowLive] = useState([]);

  // Separate states for image file and preview
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState(
    getInitialProfileForm(currentUser)
  );

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

  // Handle image upload with separate file and preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCNICChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 5 && value.length <= 12) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    } else if (value.length > 12) {
      value =
        value.slice(0, 5) +
        "-" +
        value.slice(5, 12) +
        "-" +
        value.slice(12, 13);
    }

    setProfileForm({ ...profileForm, cnic: value });
  };

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.startsWith("92")) {
      value = "+" + value;
    } else if (!value.startsWith("+92")) {
      value = "+92" + value;
    }

    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 6 && value.length <= 10) {
      value =
        value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6);
    } else if (value.length > 10) {
      value =
        value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 15);
    }

    setProfileForm({ ...profileForm, mobileNumber: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountrySelect = (country) => {
    setProfileForm((prev) => ({ ...prev, country }));
    setCountrySearch(country);
    setShowCountryDropdown(false);
  };

  const handleCitySelect = (city) => {
    setProfileForm((prev) => ({ ...prev, city: city.cityName }));
    setCitySearch(city.cityName);
    setShowCityDropdown(false);
  };

  const handleLiveVehicle = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/todayAuction`);
      console.log(res.data);
      setShowLive(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenderSelect = (gender) => {
    setProfileForm((prev) => ({ ...prev, gender: gender.toLowerCase() }));
    setGenderSearch(gender);
    setShowGenderDropdown(false);
  };

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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

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

      if (imageFile) {
        formData.append("image", imageFile);
      }

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

      dispatch(authSuccess(res.data));

      if (res.data.image || res.data.imageUrl || res.data.profileImage) {
        setImagePreview(
          res.data.image || res.data.imageUrl || res.data.profileImage
        );
      }

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
        text: error.response.data.error,
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

  useEffect(() => {
    if (profileModalOpen) {
      setProfileForm(getInitialProfileForm(currentUser));

      setCountrySearch(currentUser?.country || "Pakistan");
      setCitySearch(currentUser?.city || "");
      setGenderSearch(
        currentUser?.gender
          ? currentUser.gender.charAt(0).toUpperCase() +
              currentUser.gender.slice(1)
          : ""
      );

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
    handleLiveVehicle();
  }, []);

  useEffect(() => {
    handleGetAllCity();
  }, []);

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

  useEffect(() => {
    setDropdownOpen(false);
    setPasswordModalOpen(false);
    setProfileModalOpen(false);
  }, [location]);

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
      label: "Inventory",
      items: [
        { to: "/finder", label: "Vehicle Finder" },
        { to: "/saleslist", label: "Search By Makes" },
        { to: "/certified", label: "Certified Cars" },
        { to: "/search", label: "Search List" },
        { to: "/wishlist", label: "Wish List" },
        { to: "/alert", label: "Vehicle Alert" },
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

  const dropdowns = [
    ...commonDropdowns,
    ...(currentUser?.role === "seller" ? [] : []),
  ];

  return (
    <nav className="bg-white shadow-md z-50 relative">
      <div className="flex items-center justify-between text-white px-3 p-2 border-b bg-blue-950 border-gray-300 text-xs lg:text-base">
        <span className="text-white  ">
          WheelBidz First Online Cars Auction Platform in Pakistan
        </span>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/wishlist"
            className="relative flex items-center gap-2 text-white hover:text-red-600 transition-all duration-300"
            title="View Wishlist"
          >
            <span>Wishlist</span>
          </Link>

          {currentUser ? null : (
            <div className="lg:flex items-center gap-3 hidden ">
              |
              <Link
                to="/register"
                className="flex items-center gap-1 hover:text-red-600 font-semiboldbold"
              >
                Register
              </Link>
              |
              <Link
                to="/login"
                className="flex items-center gap-1 hover:text-red-600 mr-2"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center px-2 py-4">
        <Link
          to="/"
          className="text-xl font-bold text-red-600 flex items-center gap-2 "
        >
          <img src={logoImage} alt="Logo" className="h-12 pt-4 lg:pt-0 " />
        </Link>
        <ul className="hidden md:flex items-center gap-0 font-base relative">
          {/* Home */}
          <li>
            <Link
              to="/"
              className={`px-5 text-[14px] hover:text-blue-900 ${
                isActive("/") ? "text-blue-950 font-semibold" : ""
              }`}
            >
              Home
            </Link>
          </li>

          {/* Empty li (About removed) */}
          <li></li>

          {/* Dropdown Menus */}
          {dropdowns.map((dropdown) => (
            <li
              key={dropdown.id}
              className="relative"
              onMouseEnter={() => setActiveDropdown(dropdown.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center mr-4 font-medium text-[14px] hover:text-blue-900 ${
                  activeDropdown === dropdown.id ? "text-blue-950" : ""
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
                      className="block px-4 py-1 text-[14px] hover:bg-blue-50 hover:text-blue-950 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          {/* Partner / Work / Contact */}
          <li className="flex items-center gap-3 ml-1">
            <Link
              to="/partner"
              className={`text-[14px] hover:text-blue-900 ${
                isActive("/partner") ? "text-red-950 font-semibold" : ""
              }`}
            >
              Become a Partner
            </Link>

            <Link
              to="/work"
              className={`text-[14px] mx-2 hover:text-blue-900 ${
                isActive("/work") ? "text-blue-950 font-semibold" : ""
              }`}
            >
              How it works
            </Link>

            <Link
              to="/contact"
              className={`text-[14px]  hover:text-blue-900 ${
                isActive("/contact") ? "text-blue-950 font-semibold" : ""
              }`}
            >
              Contact Us
            </Link>
          </li>

          {/* Sell Now */}
          <li>
            {currentUser?.role === "customer" ? null : (
              <button
                onClick={() => navigate("/sellerIntro")}
                className="ml-2 px-2 py-1.5 bg-red-600 text-white font-bold rounded hover:cursor-pointer"
              >
                Sell Now
              </button>
            )}
          </li>

          {/* LIVE badge */}
          <li>
            {showLive.some((item) => item.auctionStatus === "live") && (
              <Link
                to="/today"
                className="relative ml-2 flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white font-bold rounded transition-all overflow-hidden"
              >
                <span className="absolute inset-0 rounded-full bg-red-500/50"></span>

                <span className="relative z-10">LIVE</span>
              </Link>
            )}
          </li>

          {/* UPDATED PROFILE DROPDOWN - Image on Left + Equal Height */}
          <div className="hidden md:flex pl-2 relative" ref={dropdownRef}>
            {currentUser && (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-3 focus:outline-none group"
                >
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
                      className="w-10 h-10 object-cover rounded-full border-2 border-gray-300 group-hover:border-red-600 transition"
                    />
                  ) : (
                    <FaUserCircle
                      size={40}
                      className="text-gray-700 group-hover:text-blue-950 transition"
                    />
                  )}
                </button>

                <div
                  className={`absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg transition-all duration-200 overflow-hidden ${
                    dropdownOpen
                      ? "opacity-100 scale-100 visible"
                      : "opacity-0 scale-95 invisible"
                  }`}
                >
                  {/* User Info - Image Left, Name & Role Right */}
                  <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-4">
                    <div className="flex-shrink-0">
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
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
                        />
                      ) : (
                        <FaUserCircle size={56} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                      <p className="text-base font-semibold text-gray-900 truncate leading-tight">
                        {currentUser?.name
                          ? currentUser.name.charAt(0).toUpperCase() +
                            currentUser.name.slice(1)
                          : "--"}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                        {currentUser?.role || "--"}
                      </p>
                    </div>
                  </div>

                  {/* Account Settings */}
                  <div
                    onClick={() => setAccountSettingsOpen(!accountSettingsOpen)}
                    className="px-4 py-3 flex items-center gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition font-medium"
                  >
                    <Settings size={18} className="text-gray-500" />
                    Account Settings
                  </div>

                  {/* Nested Options */}
                  {accountSettingsOpen && (
                    <div className="bg-gray-50 border-t border-gray-200">
                      <div
                        onClick={() => {
                          setProfileModalOpen(true);
                          setDropdownOpen(false);
                          setAccountSettingsOpen(false);
                        }}
                        className="px-8 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        Manage Profile
                      </div>
                      <div
                        onClick={() => {
                          setPasswordModalOpen(true);
                          setDropdownOpen(false);
                          setAccountSettingsOpen(false);
                        }}
                        className="px-8 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        Change Password
                      </div>
                    </div>
                  )}

                  {/* Logout */}
                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 font-semibold hover:bg-gray-100 cursor-pointer transition border-t border-gray-200"
                  >
                    <AiOutlineLogout size={20} />
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </ul>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-red-600 text-white px-6 pb-6 space-y-2 text-[14px]">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block font-medium"
          >
            Home
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block font-medium text-[14px]"
          >
            Contact Us
          </Link>

          <Link
            to="/partner"
            onClick={() => setMenuOpen(false)}
            className="block font-medium text-[14px]"
          >
            Become A Partner
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="block font-medium text-[14px]"
          >
            WishList
          </Link>

          {currentUser?.role === "customer" ? null : (
            <button
              onClick={() => navigate("/sellerIntro")}
              className=" text-white  hover:cursor-pointer text-[14px]"
            >
              Sell Now
            </button>
          )}

          {showLive.some((item) => item.auctionStatus === "live") && (
            <Link
              to="/today"
              className="relative flex items-center gap-2  text-white rounded transition-all overflow-hidden"
            >
              <span className="absolute inset-0 rounded-full "></span>
              <span className="relative z-10">LIVE</span>
            </Link>
          )}
          {currentUser?.role === "seller" && (
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
                className="w-full flex justify-between items-center font-medium text-[14px]"
              >
                {dropdown.label}
                <RiArrowDropDownLine size={24} />
              </button>
              {activeDropdown === dropdown.id && (
                <ul className="pl-4 text-sm">
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
            <div className="pt-2 border-t border-white text-sm">
              <div className="flex items-center gap-2 mb-4">
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
                <span>
                  {" "}
                  <div className="text-white text-xs">
                    {currentUser?.role || "--"}
                  </div>
                  {currentUser?.name || "--"}
                </span>
              </div>
              <button
                onClick={() => setAccountSettingsOpen(!accountSettingsOpen)}
                className="block w-full text-left py-0 text-white font-base hover:underline"
              >
                Account Settings
              </button>

              {accountSettingsOpen && (
                <div className="ml-4 mt-1">
                  <button
                    onClick={() => {
                      setProfileModalOpen(true);
                      setMenuOpen(false);
                      setAccountSettingsOpen(false);
                    }}
                    className="block w-full text-left py-0 text-white hover:underline"
                  >
                    Manage Profile
                  </button>

                  <button
                    onClick={() => {
                      setPasswordModalOpen(true);
                      setMenuOpen(false);
                      setAccountSettingsOpen(false);
                    }}
                    className="block w-full text-left py-0 text-white hover:underline"
                  >
                    Change Password
                  </button>
                </div>
              )}

              <button className="block w-full text-left py-1 text-white hover:underline">
                {" "}
              </button>
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="flex gap-1 w-full text-left  text-white hover:underline"
              >
                <AiOutlineLogout size={20} />
                <span className="text-sm font-semibold">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col  pt-4 border-t border-white font-semibold">
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center"
              >
                Signin
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-blur backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
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
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 text-white bg-red-600 rounded-md"
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
        <div className="fixed inset-0 bg-blur backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              My Profile
            </h2>

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
                  className="absolute bottom-0 right-0 bg-blue-950 text-white p-2 rounded-full cursor-pointer hover:bg-blue-950 transition-colors"
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

              <div className="text-center mt-1 text-lg font-bold text-gray-800">
                {currentUser.name}
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                    required
                  />
                </div>

                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    CNIC
                  </label>
                  <input
                    type="tel"
                    placeholder="00000-0000000-0"
                    name="cnic"
                    value={profileForm?.cnic}
                    onChange={handleCNICChange}
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                    required
                    maxLength={15}
                  />
                </div>

                <div className=" relative" ref803={genderDropdownRef}>
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
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
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
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

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
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
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
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
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

                <div className="">
                  <label className="block text-sm font-medium text-gray-700 ">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileForm.username}
                    onChange={handleProfileChange}
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-100"
                    readOnly
                  />
                </div>
              </div>

              <div className="my-3">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="flex flex-col lg:flex-row gap-2">
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={profileForm.mobileNumber}
                    onChange={handleMobileChange}
                    placeholder="+92-300-1234567"
                    className="p-2.5 flex-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                    maxLength={15}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="px-6 py-2.5 text-white hover:opacity-95 rounded-md border border-gray-300 bg-red-600 hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProfileSubmit}
                  className="px-4 py-2 bg-blue-950 text-white rounded-md hover:cursor-pointer"
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