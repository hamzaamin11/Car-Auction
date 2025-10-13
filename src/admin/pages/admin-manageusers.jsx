import React, { useContext, useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import UserContext from "../../context/UserContext";
import ViewUserModal from "./ViewUserModal";
import EditUserModal from "./EditUserModal";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  navigationStart,
  navigationSuccess,
} from "../../components/Redux/NavigationSlice";
import { RotateLoader } from "../../components/Loader/RotateLoader";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import { User } from "lucide-react";

export default function ManageUsers() {
  const { getUserbyId, delUser } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [getUsers, setGetUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPageNo(1); // Reset to first page on search
    }, 300),
    []
  );

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getRegisteredMembers?entry=10&page=${pageNo}`
      );
      console.log("API Response:", res.data);
      setGetUsers(res.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handlePrevPage = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleView = async (user) => {
    await getUserbyId(user.id);
    setIsViewModalOpen(true);
  };

  useEffect(() => {
    getAllUsers();
  }, [pageNo]);

  useEffect(() => {
    const filtered = getUsers.filter((user) =>
      user.role?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, getUsers]);

  // Component to render user image or avatar
  const UserImage = ({ user, size = "md" }) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-16 h-16",
    };

    const iconSizes = {
      sm: 16,
      md: 20,
      lg: 32,
    };

    if (user.image) {
      return (
        <img
          src={user.image}
          alt={user.name}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`}
        />
      );
    }

    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300`}
      >
        <User size={iconSizes[size]} className="text-gray-500" />
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Register Users
        </h1>
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by Role..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <RotateLoader />
        </div>
      ) : (
        <>
          {/* Table for md+ screens */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">User</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Phone</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-indigo-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserImage user={user} size="md" />
                          <span className="font-medium text-gray-900">
                            {user?.name?.charAt(0)?.toUpperCase() + user?.name?.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {user?.email?.charAt(0)?.toUpperCase() + user?.email?.slice(1)}
                      </td>
                      <td className="px-6 py-4 text-left text-gray-700">
                        {user?.contact?.slice(0, 14)}
                      </td>
                      <td>
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded-full ${
                            user.role === "admin"
                              ? "bg-blue-100 text-blue-500"
                              : user.role === "customer"
                              ? "bg-yellow-100 text-yellow-500"
                              : "bg-green-100 text-green-500"
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsModalOpen(true);
                          }}
                          className="px-4 py-1 rounded-lg border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleView(user)}
                          className="px-4 py-1 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => delUser(user.id)}
                          className="px-4 py-1 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white shadow rounded-xl p-4 border border-gray-200"
              >
                <div className="flex gap-3 mb-3">
                  <UserImage user={user} size="lg" />
                  <div className="flex-1 flex items-start justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 py-4">
                      {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                    </h2>
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-500"
                          : user.role === "customer"
                          ? "bg-yellow-100 text-yellow-500"
                          : "bg-green-100 text-green-500"
                      }`}
                    >
                      {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Email:</span>{" "}
                    {user?.email?.charAt(0)?.toUpperCase() + user?.email?.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Phone:</span>{" "}
                    {user?.contact.slice(0, 14)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 px-4 py-1 rounded-lg border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleView(user)}
                    className="flex-1 px-4 py-1 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => delUser(user.id)}
                    className="flex-1 px-4 py-1 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="flex items-center justify-center mt-4 font-medium text-sm lg:text-xl text-gray-400">
              No users found.
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              className={`bg-blue-950 text-white px-5 py-2 rounded ${
                pageNo > 1 ? "block" : "hidden"
              }`}
              onClick={handlePrevPage}
            >
              ‹ Prev
            </button>
            <div></div>
            <button
              className={`bg-blue-950 text-white px-5 py-2 rounded ${
                filteredUsers.length === 0 ? "hidden" : "block"
              }`}
              onClick={handleNextPage}
            >
              Next ›
            </button>
          </div>
        </>
      )}

      {/* Modals */}
      <ViewUserModal
        isOpen={isViewModalOpen}
        closeModal={() => setIsViewModalOpen(false)}
      />

      <EditUserModal
        Open={isModalOpen}
        setOpen={setIsModalOpen}
        selectedUser={selectedUser}
      />

      <ToastContainer />
    </div>
  );
}