import React, { useContext, useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import UserContext from "../../context/UserContext";
import ViewUserModal from "./ViewUserModal";
import { ToastContainer } from "react-toastify";
import EditUserModal from "./EditUserModal";


export default function ManageUsers() {
  // const [users, setUsers] = useState(initialUsers);
  const { getUsers, userbyId, getUserbyId, delUser } = useContext(UserContext);
  // const [viewUser, setViewUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  console.log("user passed",selectedUser);
  

  const handleView = async (user) => {
    await getUserbyId(user.id); // ✅ correct function call
    setIsViewModalOpen(true);
  };

  return (
    <>
      {/* <Topbar />
      <Sidebar /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">
          Admin Panel - All Users (Customers & Sellers)
        </h1>

        <div className="overflow-x-auto shadow ring-1 ring-gray-300 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#191970] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  CNIC
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Role
                </th>

                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {getUsers.map((user, idx) => (
                <tr key={user.id} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{user.email}</td>
                  <td className="px-4 py-3 text-gray-700">{user.contact}</td>
                  <td className="px-4 py-3 text-indigo-600 font-semibold">
                    {user.cnic}
                  </td>
                  <td className="px-4 py-3 text-indigo-600 font-semibold">
                    {user.role}
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1 text-sm border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleView(user)}
                      className="px-3 py-1 text-sm border border-[#191970] text-[#191970] rounded hover:bg-[#191970] hover:text-white transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => delUser(user.id)}
                      className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
    </>
  );
}
