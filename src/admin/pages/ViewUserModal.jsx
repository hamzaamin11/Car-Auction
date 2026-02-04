import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import {
  MdClose,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdPerson,
  MdBadge,
  MdHome,
  MdCalendarToday,
  MdVerified,
  MdCopyAll,
} from "react-icons/md";
import { FaUserTag, FaMapMarkerAlt } from "react-icons/fa";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import UserContext from "../../context/UserContext";
import UserImage from "../../assets/Avatar.png";

const ViewUserModal = ({ isOpen, closeModal }) => {
  const { userbyId } = useContext(UserContext);

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
    alert(`Copied: ${text}`);
  };

  return (
    <Transition appear show={!!isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        {/* Animated background */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-400"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0  backdrop-blur-sm " />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-3 md:p-6 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-400"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all border">
                {/* Modern Header with gradient */}
                <div className="relative bg-blue-900 p-4 rounded-t-3xl">
                  <div className="relative flex justify-between items-center z-10">
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-3xl font-bold text-white"
                      >
                        User Profile
                      </Dialog.Title>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-white hover:bg-red-500 bg-red-600 p-2 rounded-2xl transition-all duration-300 hover:scale-110"
                      title="Close"
                    >
                      <MdClose size={28} />
                    </button>
                  </div>
                </div>

                <div className="p-8">
                  {userbyId ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Left Panel - Profile Overview */}
                      <div className="w-full lg:w-2/5">
                        <div className="sticky top-8">
                          {/* Profile Card */}
                          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-7 border border-blue-100 shadow-lg">
                            <div className="flex flex-col items-center">
                              {/* Profile Image with Badge */}
                              <div className="relative mb-6">
                                <div className="absolute -inset-2 bg-blue-900 rounded-full blur opacity-30"></div>
                                <img
                                  src={userbyId?.image || UserImage}
                                  alt="user-img"
                                  className="relative h-52 w-52 rounded-full object-cover border-8 border-white shadow-2xl"
                                />
                                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white p-2 rounded-full shadow-lg">
                                  <MdVerified size={24} />
                                </div>
                              </div>

                              {/* User Name & Role */}
                              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {userbyId?.name?.charAt(0)?.toUpperCase() +
                                  userbyId?.name?.slice(1) || "N/A"}
                              </h2>
                              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-5 py-2 rounded-full mb-4">
                                <FaUserTag className="text-blue-900" />
                                <span className="text-blue-900 font-semibold">
                                  {userbyId?.role?.toUpperCase() || "USER"}
                                </span>
                              </div>

                              {/* Quick Stats */}
                              <div className=" gap-4 w-full mt-6">
                                <div className="text-center p-3 bg-indigo-50 rounded-xl">
                                  <div className="text-sm text-blue-900 mb-1">
                                    Status
                                  </div>
                                  <div className="font-semibold text-green-600">
                                    Active
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Contact Quick Actions */}
                        </div>
                      </div>

                      {/* Vertical Divider */}
                      <div className="hidden lg:block">
                        <div className="h-full w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent"></div>
                      </div>

                      {/* Right Panel - Detailed Information */}
                      <div className="w-full lg:w-3/5">
                        <div className="mb-8">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                            <div className="p-2 bg-blue-900 rounded-lg text-white">
                              <MdPerson size={24} />
                            </div>
                            Personal Information
                          </h3>
                        </div>

                        {/* Information Grid */}
                        <div className="space-y-6">
                          {/* Contact Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InfoField
                              icon={
                                <MdPhone className="text-blue-900" size={22} />
                              }
                              label="Phone Number"
                              value={userbyId?.contact || "N/A"}
                              copyable
                            />

                            <InfoField
                              icon={
                                <MdEmail className="text-blue-900" size={22} />
                              }
                              label="Email Address"
                              value={userbyId?.email || "N/A"}
                              copyable
                            />

                            <InfoField
                              icon={
                                <MdBadge className="text-blue-900" size={22} />
                              }
                              label="CNIC Number"
                              value={userbyId?.cnic || "N/A"}
                              copyable
                            />
                          </div>

                          {/* ADDRESS FIELD - SPECIAL WIDE DESIGN */}
                          <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                                <div className="p-2 bg-blue-900 rounded-lg text-white">
                                  <FaMapMarkerAlt size={20} />
                                </div>
                                Complete Address
                              </h4>
                              <button
                                onClick={() =>
                                  copyToClipboard(userbyId?.address)
                                }
                                className="text-sm text-blue-950 hover:text-blue-800 flex items-center gap-2 transition-colors"
                              >
                                <HiOutlineClipboardCopy size={18} />
                                Copy Address
                              </button>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-dashed border-blue-200 min-h-[120px]">
                              {userbyId?.address ? (
                                <div className="flex items-start gap-4">
                                  <div className="flex-1">
                                    <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
                                      {userbyId.address
                                        .charAt(0)
                                        .toUpperCase() +
                                        userbyId.address.slice(1)}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <MdLocationOn
                                    className="inline-block text-gray-400 mb-2"
                                    size={32}
                                  />
                                  <p>No address information available</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="relative">
                        <div className="h-20 w-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MdPerson className="text-blue-950" size={32} />
                        </div>
                      </div>
                      <p className="text-xl text-gray-600 mt-6">
                        Loading user profile...
                      </p>
                      <p className="text-gray-500">Please wait a moment</p>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 rounded-b-3xl flex justify-end items-center">
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="px-8 py-3 bg-red-600 text-white font-medium rounded hover:opacity-90 transition-all hover:shadow-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Enhanced Info Field Component with Copy Functionality
const InfoField = ({ icon, label, value = false }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 hover:border-blue-200 transition-all hover:shadow-md">
    <div className="flex justify-between items-start">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2.5 bg-blue-50 rounded-lg">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
          <p className="text-gray-800 font-semibold break-words">{value}</p>
        </div>
      </div>
    </div>
  </div>
);

export default ViewUserModal;
