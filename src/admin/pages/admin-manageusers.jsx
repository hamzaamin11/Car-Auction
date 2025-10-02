import React, { useContext, useEffect, useState } from "react";
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
import { Eye, Pencil, Trash2, Users } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";

export default function ManageUsers() {
  const { getUserbyId, delUser } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [pageNo, setPageNo] = useState(1);

  console.log(pageNo);

  const [getUsers, setGetUsers] = useState([]);

  console.log(getUsers);

  // const getAllUsers = async () => {
  //   const res = await fetch(`${BASE_URL}/admin/getRegisteredMembers`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await res.json();
  //   setGetUsers(data);
  // };

  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getRegisteredMembers?entry=${10}&page=${pageNo}`
      );
      setGetUsers(res.data);
    } catch (error) {
      console.log(error);
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
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Register Users
        </h1>
      </div>

      {/* ✅ Table for md+ screens */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm ">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Phone</th>

                <th className="px-2 py-4 text-left font-semibold">Role</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {getUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-indigo-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {user.email.charAt(0).toUpperCase() + user.email.slice(1)}
                  </td>
                  <td className="px-6 py-4 text-left text-gray-700">
                    {user.contact.slice(0, 14)}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${
                        (user.role === "admin" &&
                          "bg-blue-100 text-blue-500") ||
                        (user.role === "customer" &&
                          "bg-yellow-100 text-yellow-500") ||
                        (user.role === "seller" &&
                          "bg-green-100 text-green-500")
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}
                      className="p-2 rounded-lg border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleView(user)}
                      className="p-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => delUser(user.id)}
                      className="p-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Card layout for small screens */}
      <div className="grid gap-4 md:hidden">
        {getUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow rounded-xl p-4 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h2>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.role === "Admin"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user.role}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Email:</span> {user.email}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">phone# </span>
              {user.contact}
            </p>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setIsModalOpen(true);
                }}
                className="flex-1 p-2 rounded-lg border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white transition flex items-center justify-center gap-1"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleView(user)}
                className="flex-1 p-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition flex items-center justify-center gap-1"
              >
                <Eye className="w-4 h-4" /> View
              </button>
              <button
                onClick={() => delUser(user.id)}
                className="flex-1 p-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="bg-[#518ecb] text-white px-5 py-2 rounded hover:bg-[#518ecb]"
          onClick={() => handlePrevPage()}
        >
          ‹ Prev
        </button>
        <button
          className="bg-[#518ecb] text-white px-5 py-2 rounded hover:bg-[#518ecb]"
          onClick={() => handleNextPage()}
        >
          Next ›
        </button>
      </div>

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
