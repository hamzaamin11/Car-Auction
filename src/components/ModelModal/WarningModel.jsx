import { useState } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";

export const WarningModal = ({ onClose }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // simple handlers for demo purposes
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    cnic: "",
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    mobileNumber: "",
    dateOfBirth: "",
  });

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = () => {
    alert("Profile details saved!");
    setProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-[450px] p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-semibold"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-3">Guest Member</h2>

        {/* Message */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Oops, we hit a snag. Unfortunately, you cannot bid on vehicles until
          you complete your information details. Please click below to update
          your profile.
        </p>

        {/* Upgrade Button */}
        <button
          onClick={() => setProfileModalOpen(true)}
          className="bg-blue-950 text-white font-medium px-4 py-2 rounded-md transition-all"
        >
          Update Information 
        </button>
      </div>

      {/* Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-semibold"
            >
              ✕
            </button>

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
                  className="absolute bottom-0 right-0 bg-blue-950 text-white p-2 rounded-full cursor-pointer hover:bg-blue-900 transition-colors"
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
              <div className="text-center mt-2 text-lg font-bold text-gray-800">
                {currentUser?.name}
              </div>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="p-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CNIC
                </label>
                <input
                  type="tel"
                  name="cnic"
                  value={profileForm.cnic}
                  onChange={handleProfileChange}
                  placeholder="00000-0000000-0"
                  maxLength={15}
                  className="p-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900"
                />
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
                  className="p-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={profileForm.mobileNumber}
                  onChange={handleProfileChange}
                  placeholder="+92-300-1234567"
                  maxLength={15}
                  className="p-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            {/* Email - full width */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="p-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* Username - full width */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={profileForm.username}
                readOnly
                className="p-2.5 w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="px-5 py-2.5 bg-red-600 text-white rounded-md "
              >
                Cancel
              </button>
              <button
                onClick={handleProfileSubmit}
                className="px-5 py-2.5 bg-blue-950 text-white rounded-md "
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
