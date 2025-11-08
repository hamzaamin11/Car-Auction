import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { authSuccess, logOut } from "../../components/Redux/UserSlice";
import logo from "../../assets/wheellogo.png";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import Swal from "sweetalert2";

export default function Topbar() {
  const { currentUser } = useSelector((state) => state?.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
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
  const [loading, setLoading] = useState(false);

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
    image: currentUser?.image || "",
    role: currentUser?.role,
    cnic: currentUser?.cnic || "",
  });

  // Separate state for image file and preview
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  console.log("Current User in Topbar:", currentUser);
  console.log("User Image:", currentUser?.image);
  console.log("User ImageUrl:", currentUser?.imageUrl);
  console.log("Image Preview State:", imagePreview);

  // Options lists
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

  // Filter functions
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredGenders = genders.filter((gender) =>
    gender.toLowerCase().includes(genderSearch.toLowerCase())
  );

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the actual file for upload
    setImageFile(file);

    // Create preview
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
    setProfileForm((prev) => ({ ...prev, city }));
    setCitySearch(city);
    setShowCityDropdown(false);
  };

  // Handle gender selection
  const handleGenderSelect = (gender) => {
    setProfileForm((prev) => ({ ...prev, gender: gender.toLowerCase() }));
    setGenderSearch(gender);
    setShowGenderDropdown(false);
  };

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // remove all non-digits

    // Ensure the number always starts with +92
    if (value.startsWith("92")) {
      value = "+" + value;
    } else if (!value.startsWith("+92")) {
      value = "+92" + value;
    }

    // Format it like +92-300-1234567
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
      console.log("res =>", res.data);
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

  // Handle profile submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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

      // Append the actual file if user selected a new one
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

      // Update Redux state with new user data
      dispatch(authSuccess(res.data));

      // Update image preview with new URL from backend
      if (res.data.image || res.data.imageUrl) {
        setImagePreview(res.data.image || res.data.imageUrl);
      }

      // Clear the file state
      setImageFile(null);

      await Swal.fire({
        title: "Success!",
        text: "Profile updated successfully!",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
      setLoading(false);
      setProfileModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);

      await Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.error ||
          "Failed to update profile. Please try again.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
      setLoading(false);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logOut());
    setDropdownOpen(false);
  };

  const handleCNICChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // remove all non-numeric characters

    // Add dashes automatically
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

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Update imagePreview when currentUser changes (after login or profile update)
  useEffect(() => {
    if (currentUser?.image || currentUser?.imageUrl) {
      setImagePreview(currentUser?.image || currentUser?.imageUrl);
    }
  }, [currentUser]);

  // Initialize search fields and image preview when modal opens
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
      setImagePreview(currentUser?.image || currentUser?.imageUrl || "");
      setImageFile(null);
    }
  }, [profileModalOpen, currentUser]);

  // Outside click detection for all dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Close profile dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      // Close country dropdown
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setShowCountryDropdown(false);
      }
      // Close city dropdown
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setShowCityDropdown(false);
      }
      // Close gender dropdown
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

  return (
    <header className="bg-white shadow-md px-4 py-3 md:px-6 flex items-center justify-between relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link
          to={currentUser?.role === "admin" ? "/admin" : "/seller/dashboard"}
        >
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
          {/* Show actual profile image or fallback to icon */}
          {currentUser?.image || currentUser?.imageUrl ? (
            <img
              src={currentUser?.image || currentUser?.imageUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 group-hover:border-blue-950 transition-colors duration-300"
            />
          ) : (
            <FaUserCircle
              size={40}
              className="text-gray-700 group-hover:text-red-600 transition-colors duration-300"
            />
          )}
        </button>

        <div
          className={`absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg transition-all duration-200 ease-in-out ${
            dropdownOpen
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible"
          }`}
        >
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm text-black">Signed in as</p>
            <p className="text-sm font-normal text-gray-700 truncate">
              <div className="text-gray-500 text-xs ">
                {currentUser?.role || "--"}
              </div>
              {currentUser?.name || "--"}{" "}
            </p>
          </div>
          <div
            onClick={() => setPasswordModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200 "
          >
            <span className="text-sm font-normal">Change Password</span>
          </div>
          <div
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
          >
            <span className="text-sm font-normal">Manage Profile </span>
          </div>
          <div
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
          >
            <AiOutlineLogout size={20} />
            <span className="text-sm font-semibold">Logout</span>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-blur-sm backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div>
              {/* <div className="mb-4">
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
              </div> */}
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
                  className="px-4 py-2 text-white  bg-red-600 hover:opacity-95 rounded-md"
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
        <div className="fixed inset-0 bg-blur-sm backdrop-blur-md flex items-center justify-center z-50">
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
                  className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full cursor-pointer  transition-colors"
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

            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-2">
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
                    value={profileForm?.name}
                    onChange={handleProfileChange}
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength={15}
                  />
                </div>

                {/* Gender - Searchable */}
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
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Username */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">
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
              <div className="mb-4">
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
                    className="p-2.5 flex-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={15}
                  />
                </div>
              </div>

              {/* Action Buttons */}
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
                  disabled={loading}
                  onClick={handleProfileSubmit}
                  className="px-4 py-2 bg-blue-950 text-white rounded-md hover:cursor-pointer"
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
