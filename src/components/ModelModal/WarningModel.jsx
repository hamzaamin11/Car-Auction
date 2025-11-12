import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import Swal from "sweetalert2";
import { authSuccess } from "../../components/Redux/UserSlice";

/* ... formatters ... */
const formatCNIC = (value) => {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 5 && digits.length <= 12) {
    digits = digits.slice(0, 5) + "-" + digits.slice(5);
  } else if (digits.length > 12) {
    digits = digits.slice(0, 5) + "-" + digits.slice(5, 12) + "-" + digits.slice(12, 13);
  }
  return digits;
};

const formatMobile = (value) => {
  let digits = value.replace(/\D/g, "");
  if (!digits.startsWith("92")) digits = "92" + digits;
  if (digits.length > 2) digits = "+" + digits;
  if (digits.length > 6 && digits.length <= 10) {
    digits = digits.slice(0, 6) + "-" + digits.slice(6);
  } else if (digits.length > 10) {
    digits = digits.slice(0, 6) + "-" + digits.slice(6, 10) + "-" + digits.slice(10, 15);
  }
  return digits;
};

export const WarningModal = ({ onClose }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // ---------- NEW: disable body scroll ----------
  useEffect(() => {
    if (profileModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [profileModalOpen]);
  // -------------------------------------------

  // ... all the existing state / refs / lists / filters stay unchanged ...

  // Searchable dropdown states
  const [genderSearch, setGenderSearch] = useState("");
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const genderDropdownRef = useRef(null);

  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef(null);

  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityDropdownRef = useRef(null);

  // Constant lists
  const genders = ["Male", "Female", "Other"];
  const countries = ["Pakistan"];
  const cities = [
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
    "Multan", "Gujranwala", "Peshawar", "Quetta", "Sialkot", "Hyderabad",
  ];

  // Filter functions
  const filteredGenders = genders.filter((g) =>
    g.toLowerCase().includes(genderSearch.toLowerCase())
  );
  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: "", cnic: "", username: "", email: "", mobileNumber: "",
    dateOfBirth: "", gender: "", country: "Pakistan", city: "", role: "",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (profileModalOpen && currentUser) {
      setProfileForm({
        name: currentUser.name || "",
        cnic: currentUser.cnic || "",
        username: currentUser.name || "",
        email: currentUser.email || "",
        mobileNumber: currentUser.contact || "",
        dateOfBirth: currentUser.dateOfBirth || "",
        gender: currentUser.gender || "",
        country: currentUser.country || "Pakistan",
        city: currentUser.city || "",
        role: currentUser.role || "",
      });

      setGenderSearch(
        currentUser.gender
          ? currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1)
          : ""
      );
      setCountrySearch(currentUser.country || "Pakistan");
      setCitySearch(currentUser.city || "");

      setImagePreview(
        currentUser.image || currentUser.imageUrl || currentUser.profileImage || ""
      );
      setImageFile(null);
    }
  }, [profileModalOpen, currentUser]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(e.target)) {
        setShowGenderDropdown(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setShowCountryDropdown(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers (unchanged)
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleCNICChange = (e) => {
    setProfileForm((prev) => ({ ...prev, cnic: formatCNIC(e.target.value) }));
  };
  const handleMobileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, mobileNumber: formatMobile(e.target.value) }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };
  const handleGenderSelect = (gender) => {
    setProfileForm((prev) => ({ ...prev, gender: gender.toLowerCase() }));
    setGenderSearch(gender);
    setShowGenderDropdown(false);
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

      await Swal.fire({
        title: "Success!",
        text: "Profile updated successfully!",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });

      setProfileModalOpen(false);
      onClose?.();
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

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-blur flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-[450px] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-red-600 text-xl font-semibold"
        >
          X
        </button>

        <h2 className="text-2xl font-semibold mb-3">Guest Member</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Oops, we hit a snag. Unfortunately, you cannot bid on vehicles until
          you complete your information details. Please click below to update
          your profile.
        </p>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => setProfileModalOpen(true)}
            className="bg-blue-950 text-white font-medium px-4 py-2 rounded-md"
          >
            Update Information
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-blur  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto relative">
           

            <h2 className="text-2xl font-semibold mb-6 text-center">My Profile</h2>

            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUserCircle size={128} className="text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  id="profileImageInput2"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="profileImageInput2"
                  className="absolute bottom-0 right-0 bg-blue-950 text-white p-2 rounded-full cursor-pointer"
                  title="Change profile picture"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
              </div>
              <div className="text-center mt-2 text-lg font-bold text-gray-800">
                {currentUser?.name}
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600">
                Picture can be changed. Select an image to update your profile picture.
              </p>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ... all form fields stay exactly the same ... */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">CNIC</label>
                <input
                  type="text"
                  name="cnic"
                  value={profileForm.cnic}
                  onChange={handleCNICChange}
                  placeholder="00000-0000000-0"
                  maxLength={15}
                  className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                  required
                />
              </div>

              {/* Searchable Gender */}
              <div className="relative" ref={genderDropdownRef}>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
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
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileForm.dateOfBirth}
                  onChange={handleProfileChange}
                  className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              {/* Searchable Country */}
              <div className="relative" ref={countryDropdownRef}>
                <label className="block text-sm font-medium text-gray-700">Country</label>
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

              {/* Searchable City */}
              <div className="relative" ref={cityDropdownRef}>
                <label className="block text-sm font-medium text-gray-700">City</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={profileForm.mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="+92-300-1234567"
                  maxLength={15}
                  className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={profileForm.username}
                readOnly
                className="p-2.5 w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="px-5 py-2.5 bg-red-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileSubmit}
                disabled={loading}
                className="px-5 py-2.5 bg-blue-950 text-white rounded-md disabled:opacity-70"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};