import React, { useContext, useEffect, useState } from "react";
import { debounce } from "lodash";
import UserContext from "../../context/UserContext";
import ViewUserModal from "./ViewUserModal";
import EditUserModal from "./EditUserModal";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import { User } from "lucide-react";
import CustomAdd from "../../CustomAdd";
import CustomSearch from "../../CustomSearch";
import Swal from "sweetalert2"; // SweetAlert2 imported

export default function ManageUsers() {
  const { getUserbyId, delUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({});

  const itemsPerRequest = 10;

  const debouncedSearch = React.useCallback(
    debounce((value) => {
      setSearch(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const fetchPage = async (page, searchTerm = "") => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getRegisteredMembers`, {
        params: { entry: itemsPerRequest, page, search: searchTerm },
      });
      const data = res.data || [];
      if (data.length < itemsPerRequest) setHasMore(false);
      return data;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to load users",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
      return [];
    }
  };

  const loadUsers = async (reset = false) => {
    setLoading(true);
    const pageToLoad = reset ? 1 : currentPage;
    const users = await fetchPage(pageToLoad, search);

    if (reset) {
      setAllUsers(users);
      setHasMore(users.length === itemsPerRequest);
    } else {
      setAllUsers((prev) => [...prev, ...users]);
    }
    setLoading(false);
  };

  useEffect(() => {
    setAllUsers([]);
    setHasMore(true);
    setCurrentPage(1);
    loadUsers(true);
  }, [search, itemsPerPage]);

  useEffect(() => {
    const totalNeeded = currentPage * itemsPerPage;
    if (allUsers.length < totalNeeded && hasMore && !loading) {
      loadUsers(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const handleTotalUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/customer/totalBuyers`);
        setTotals(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    handleTotalUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#9333ea",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await delUser(userId);
        setAllUsers((prev) => prev.filter((u) => u.id !== userId));
        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#9333ea",
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete user",
          icon: "error",
          confirmButtonColor: "#9333ea",
        });
      }
    }
  };

  const handleView = async (user) => {
    await getUserbyId(user.id);
    setIsViewModalOpen(true);
  };

  const handleUserUpdated = (updatedUser) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
    );
    setIsModalOpen(false);
  };

  const totalItems = allUsers.length + (hasMore ? 1 : 0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, allUsers.length);
  const currentDisplay = allUsers.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }
    return pages;
  };

  const UserImage = ({ user, size = "md" }) => {
    const sizeClasses = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-16 h-16" };
    const iconSizes = { sm: 16, md: 20, lg: 32 };

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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3">
        <h1 className="lg:text-3xl text-xl font-bold text-gray-900">
          Registered Users
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
          <CustomSearch
            placeholder="Search by Role..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="flex gap-2 lg:text-2xl text-xl text-gray-800 font-semibold">
        <div>
          Total Customers:
          <span>{totals?.totalCustomers}</span>
        </div>{" "}
        |
        <div>
          Total Seller:
          <span>{totals?.totalSellers}</span>
        </div>
      </div>

      <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-950 text-white ">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">User</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Phone</th>
                <th className="px-6 py-4 text-left font-semibold">Role</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {currentDisplay.map((user) => (
                <tr key={user.id} className="">
                  <td className="px-6 ">
                    <div className="flex items-center gap-3">
                      <UserImage user={user} size="md" />
                      <span className="font-medium text-gray-900">
                        {user?.name?.charAt(0)?.toUpperCase() +
                          user?.name?.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {user?.email?.charAt(0)?.toUpperCase() +
                      user?.email?.slice(1)}
                  </td>
                  <td className="px-6 py-4 text-left text-gray-700">
                    {user?.contact?.slice(0, 15)}
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
                    <CustomAdd
                      text="Edit"
                      variant="edit"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}
                    />
                    <CustomAdd
                      text="View"
                      variant="view"
                      onClick={() => handleView(user)}
                    />
                    <CustomAdd
                      text="Delete"
                      variant="delete"
                      onClick={() => handleDeleteUser(user.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {currentDisplay.map((user) => (
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
                {user?.contact?.slice(0, 14)}
              </p>
            </div>
            <div className="flex gap-2">
              <CustomAdd
                text="Edit"
                variant="edit"
                onClick={() => {
                  setSelectedUser(user);
                  setIsModalOpen(true);
                }}
                className="flex-1"
              />
              <CustomAdd
                text="View"
                variant="view"
                onClick={() => handleView(user)}
                className="flex-1"
              />
              <CustomAdd
                text="Delete"
                variant="delete"
                onClick={() => handleDeleteUser(user.id)}
                className="flex-1"
              />
            </div>
          </div>
        ))}
      </div>

      {currentDisplay.length === 0 && (
        <div className="flex items-center justify-center mt-4 font-medium text-sm lg:text-xl text-gray-400">
          No users found.
        </div>
      )}

      {allUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
            <div className="text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{endIndex}</span>{" "}
              <span className="font-medium"></span> entries
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {"<<"}
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {"<"}
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === page
                      ? "bg-blue-950 text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={!hasMore && currentPage >= totalPages}
                className={`px-3 py-1 rounded border ${
                  !hasMore && currentPage >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {">"}
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={!hasMore && currentPage >= totalPages}
                className={`px-3 py-1 rounded border ${
                  !hasMore && currentPage >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ViewUserModal
        isOpen={isViewModalOpen}
        closeModal={() => setIsViewModalOpen(false)}
      />
      <EditUserModal
        Open={isModalOpen}
        setOpen={setIsModalOpen}
        selectedUser={selectedUser}
        onUserUpdated={handleUserUpdated}
      />
      {/* ToastContainer completely removed */}
    </div>
  );
}
