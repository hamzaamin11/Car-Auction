import { MdClose } from "react-icons/md";

export const UserDetailModal = ({ isOpen, closeModal, userDetail }) => {
  if (!isOpen || !userDetail) return null;

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-start justify-center pt-20">
      <div className="bg-white md:w-[60%] lg:w-[50%] w-full max-w-2xl rounded-lg shadow-lg p-6 relative max-h-[80vh] overflow-auto border">
        {/* Close Icon */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-rose-600"
        >
          <MdClose size={24} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          User Details
        </h2>
        {userDetail.images && userDetail.images.length > 0 && (
          <div className="flex flex-col items-center mb-4">
            <img
              src={userDetail.images[0]}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-gray-100 shadow-md"
            />
          </div>
        )}
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Personal Information
              </h3>
              <div className="space-y-2 text-sm text-gray-800">
                <p>
                  <span className="font-bold">Username:</span>{" "}
                  {userDetail.username?.charAt(0).toUpperCase() +
                    userDetail.username?.slice(1) || "--"}
                </p>
                <p>
                  <span className="font-bold">Name:</span>{" "}
                  {userDetail.name?.charAt(0).toUpperCase() +
                    userDetail.name?.slice(1) || "--"}
                </p>
                <p>
                  <span className="font-bold">Email:</span>{" "}
                  {userDetail.email || "--"}
                </p>
                <p>
                  <span className="font-bold">Contact:</span>{" "}
                  {userDetail.contact || "--"}
                </p>
                <p>
                  <span className="font-bold">CNIC:</span>{" "}
                  {userDetail.cnic || "--"}
                </p>
                <p>
                  <span className="font-bold">Gender:</span>{" "}
                  {userDetail.gender?.charAt(0).toUpperCase() +
                    userDetail.gender?.slice(1) || "--"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Demographics */}
            <div>
              <div className="space-y-2 text-sm text-gray-800">
                <p>
                  <span className="font-bold">Date of Birth:</span>{" "}
                  {userDetail?.dateOfBirth &&
                    userDetail.dateOfBirth
                      .slice(0, 10)
                      .split("-")
                      .reverse()
                      .join("-")}
                </p>
                <p>
                  <span className="font-bold">Country:</span>{" "}
                  {userDetail.country?.charAt(0).toUpperCase() +
                    userDetail.country?.slice(1) || "--"}
                </p>
                <p>
                  <span className="font-bold">City:</span>{" "}
                  {userDetail.city?.charAt(0).toUpperCase() +
                    userDetail.city?.slice(1) || "--"}
                </p>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Account Information
              </h3>
              <div className="space-y-2 text-sm text-gray-800">
                <p>
                  <span className="font-bold">Role:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      userDetail.role === "seller"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {userDetail.role?.toUpperCase() || "--"}
                  </span>
                </p>
                <p>
                  <span className="font-bold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      userDetail.status === "Y"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {userDetail.status === "Y" ? "ACTIVE" : "INACTIVE"}
                  </span>
                </p>

                <p>
                  <span className="font-bold">Registration Date:</span>{" "}
                  {userDetail?.date &&
                    userDetail.date.slice(0, 10).split("-").reverse().join("-")}
                </p>
              </div>
            </div>

            {/* Address (if exists) */}
            {userDetail.address && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Address
                </h3>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded border">
                  {userDetail.address}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
