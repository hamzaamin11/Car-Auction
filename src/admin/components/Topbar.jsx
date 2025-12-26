import React, { useEffect, useRef, useState } from "react";
import { FaTachometerAlt, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { authSuccess, logOut } from "../../components/Redux/UserSlice";
import logo from "../../assets/wheellogo.png";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import { Settings } from "lucide-react";
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

export default function Topbar() {
  const { currentUser } = useSelector((state) => state?.auth);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileForm, setProfileForm] = useState(
    getInitialProfileForm(currentUser)
  );
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  console.log("Current User in Topbar:", currentUser);
  console.log("User Image:", currentUser?.image);
  console.log("User ImageUrl:", currentUser?.imageUrl);
  console.log("Image Preview State:", imagePreview);

  // Options
  const countries = ["Pakistan"];
  const cities = [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Gujranwala",
    "Peshawar",
    "Quetta",
    "Sialkot",
    "Hyderabad",
  ];
  const genders = ["Male", "Female", "Other"];

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );
  const filteredGenders = genders.filter((g) =>
    g.toLowerCase().includes(genderSearch.toLowerCase())
  );

  // Handlers (unchanged)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
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
    setProfileForm((prev) => ({ ...prev, city }));
    setCitySearch(city);
    setShowCityDropdown(false);
  };

  const handleGenderSelect = (gender) => {
    setProfileForm((prev) => ({ ...prev, gender: gender.toLowerCase() }));
    setGenderSearch(gender);
    setShowGenderDropdown(false);
  };

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("92")) value = "+" + value;
    else if (!value.startsWith("+92")) value = "+92" + value;

    if (value.length > 3 && value.length <= 6)
      value = value.slice(0, 3) + "-" + value.slice(3);
    else if (value.length > 6 && value.length <= 10)
      value =
        value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6);
    else if (value.length > 10)
      value =
        value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 15);

    setProfileForm({ ...profileForm, mobileNumber: value });
  };

  const handleCNICChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5 && value.length <= 12)
      value = value.slice(0, 5) + "-" + value.slice(5);
    else if (value.length > 12)
      value =
        value.slice(0, 5) +
        "-" +
        value.slice(5, 12) +
        "-" +
        value.slice(12, 13);
    setProfileForm({ ...profileForm, cnic: value });
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
      await axios.put(`${BASE_URL}/updatePassword/${currentUser?.id}`, {
        password: passwordForm.newPassword,
      });
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
    setLoading(true);
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
      if (imageFile) formData.append("image", imageFile);

      const res = await axios.put(
        `${BASE_URL}/admin/updateRegisterUsers/${currentUser?.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch(authSuccess(res.data));
      if (res.data.image || res.data.imageUrl) {
        setImagePreview(res.data.image || res.data.imageUrl);
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
      await Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Failed to update profile.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logOut());
    setDropdownOpen(false);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    if (currentUser?.image || currentUser?.imageUrl) {
      setImagePreview(currentUser.image || currentUser.imageUrl);
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
      setImagePreview(currentUser?.image || currentUser?.imageUrl || "");
      setImageFile(null);
    }
  }, [profileModalOpen, currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setPasswordModalOpen(false);
    setProfileModalOpen(false);
  }, [location]);

  return (
    <header className="bg-white shadow-md px-4 py-3 md:px-6 flex items-center justify-between relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 ">
        <Link
          to={currentUser?.role === "admin" ? "/admin" : "/seller/dashboard"}
        >
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-12 sm:h-14 sm:w-24 object-contain md:block hidden"
          />
        </Link>
      </div>

      {/* Profile Section - Image on Left */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none"
        >
          {currentUser?.image || currentUser?.imageUrl ? (
            <img
              src={currentUser.image || currentUser.imageUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 hover:border-blue-950 transition"
            />
          ) : (
            <FaUserCircle
              size={40}
              className="text-gray-700 hover:text-blue-950 transition"
            />
          )}
        </button>

        {/* Modern Dropdown - Image on Left */}
        <div
          className={`absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
            dropdownOpen
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible"
          }`}
        >
          {/* Header with Image on Left */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 flex items-center gap-4">
            <div className="flex-shrink-0">
              {currentUser?.image || currentUser?.imageUrl ? (
                <img
                  src={currentUser.image || currentUser.imageUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <FaUserCircle size={64} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-900 leading-tight">
                {currentUser?.name
                  ? currentUser.name.charAt(0).toUpperCase() +
                    currentUser.name.slice(1)
                  : "User"}
              </p>
              <p className="text-sm text-gray-600 uppercase tracking-wider mt-1 font-medium">
                {currentUser?.role || "Role"}
              </p>
            </div>
          </div>

          {/* Account Settings */}
          <div className="px-6 py-4 flex items-center gap-3 text-gray-700 hover:bg-gray-100 cursor-pointer transition-all">
            <Settings size={18} className="text-gray-600" />
            <Link
              to={`${
                currentUser.role === "admin"
                  ? "/admin/accountsetting"
                  : "/seller/accountsetting"
              }`}
              className="font-semibold"
            >
              Account Settings
            </Link>
          </div>

          {/* Submenu */}
          {accountSettingsOpen && (
            <div className="bg-gray-50 border-t border-gray-200">
              <div
                onClick={() => {
                  setProfileModalOpen(true);
                  setAccountSettingsOpen(false);
                  setDropdownOpen(false);
                }}
                className="px-12 py-3 text-gray-700 hover:bg-gray-200 cursor-pointer transition-all text-sm font-medium"
              >
                Manage Profile
              </div>
              <div
                onClick={() => {
                  setPasswordModalOpen(true);
                  setAccountSettingsOpen(false);
                  setDropdownOpen(false);
                }}
                className="px-12 py-3 text-gray-700 hover:bg-gray-200 cursor-pointer transition-all text-sm font-medium"
              >
                Change Password
              </div>
            </div>
          )}

          {/* Logout */}
          <div
            onClick={handleLogout}
            className="px-6 py-5 flex items-center gap-3 text-red-600 font-bold hover:bg-red-50 cursor-pointer transition-all border-t border-gray-200"
          >
            <AiOutlineLogout size={22} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-6">
              Change Password
            </h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-950 text-white rounded-lg hover:bg-blue-900"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal - Unchanged */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-blur-sm backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              My Profile
            </h2>
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
                  className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full cursor-pointer transition-colors"
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

            {/* Rest of the form - 100% unchanged */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm?.name}
                    onChange={handleProfileChange}
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                    required
                  />
                </div>
                <div>
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
                <div className="relative" ref={genderDropdownRef}>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileForm.dateOfBirth}
                    onChange={handleProfileChange}
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div className="relative" ref={countryDropdownRef}>
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
                <div className="relative" ref={cityDropdownRef}>
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
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">
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
              <div className="mb-4">
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
                <input
                  type="tel"
                  name="mobileNumber"
                  value={profileForm.mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="+92-300-1234567"
                  className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                  maxLength={15}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="px-6 py-2.5 text-white bg-red-600 rounded-md hover:opacity-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleProfileSubmit}
                  className="px-6 py-2.5 bg-blue-950 text-white rounded-md"
                >
                  {loading ? "Loading..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
