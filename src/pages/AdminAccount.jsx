import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import Select from "react-select";
import CustomSearch from "../CustomSearch";
import { BASE_URL } from "../components/Contant/URL";
import { CircleUser } from "lucide-react";

const currentDate = new Date().toISOString().split("T")[0];

const initialState = {
  fromDate: "",
  toDate: "",
};

const initialData = {
  sellerId: "",
};

export const AdminAccount = () => {
  const [filterDate, setFilterDate] = useState(initialState);
  const [formData, setFromData] = useState(initialData);
  const [allContacts, setAllContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [userDetail, setUSerDetail] = useState(null);
  const [isOpen, setIsOpen] = useState("");
  const [allSeller, setAllSeller] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setCurrentPage(1);
    }, 300),
    [],
  );

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFilterDate({ ...filterDate, [name]: value });
  };

  const handleIsOpen = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleGetAccount = async () => {
    // Don't fetch if no seller selected
    if (!formData.sellerId) {
      setAllContacts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${BASE_URL}/admin/getSellerLedger?sellerId=${formData.sellerId}&fromDate=${filterDate.fromDate}&toDate=${filterDate.toDate}`,
      );

      console.log("API Response:", res?.data);

      // Handle different response formats
      let data = res?.data;

      if (Array.isArray(data)) {
        // If it's already an array
        setAllContacts(data);
      } else if (data && typeof data === "object") {
        // Check if it's an object with numeric keys (like {0: {...}, 1: {...}})
        const keys = Object.keys(data);
        const hasNumericKeys =
          keys.length > 0 && keys.every((key) => !isNaN(Number(key)));

        if (hasNumericKeys) {
          // Convert object with numeric keys to array
          const dataArray = Object.values(data);
          setAllContacts(dataArray);
        } else if (keys.length === 0) {
          // Empty object
          setAllContacts([]);
        } else {
          // Single object, wrap in array
          setAllContacts([data]);
        }
      } else if (data === null || data === undefined) {
        setAllContacts([]);
      } else {
        setAllContacts([]);
      }
    } catch (error) {
      console.error("Error fetching account:", error);
      setError("Failed to fetch account data");
      setAllContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllSeller = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getAllSellers`);
      setAllSeller(res.data || []);
    } catch (error) {
      console.log(error);
      setAllSeller([]);
    }
  };

  const eventOptions = [
    { label: "Choose the Seller", value: "" },
    ...(Array.isArray(allSeller)
      ? allSeller.map((seller) => ({
          label: `${seller?.name ?? "NIL"} | ${seller?.cnic ?? "NIL"} | ${seller?.contact ?? "NIL"}`,
          value: seller.id,
        }))
      : []),
  ];

  const handleChangeEvent = (name, selectedOption) => {
    setFromData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleViewUserDetail = async (id) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getUserDetailsApprovedVehicleListById/${id}`,
      );
      setUSerDetail(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch account data when seller or dates change
  useEffect(() => {
    handleGetAccount();
  }, [filterDate, formData.sellerId]);

  // Fetch all sellers on component mount
  useEffect(() => {
    handleGetAllSeller();
  }, []);

  // Filter contacts based on search
  useEffect(() => {
    if (!Array.isArray(allContacts)) {
      setFilteredContacts([]);
      return;
    }

    if (!search.trim()) {
      setFilteredContacts(allContacts);
      return;
    }

    const searchTerm = search.toLowerCase();
    const filtered = allContacts.filter((c) => {
      if (!c || typeof c !== "object") return false;

      return (
        (c.vehicleName && c.vehicleName.toLowerCase().includes(searchTerm)) ||
        (c.transactionNo &&
          c.transactionNo.toLowerCase().includes(searchTerm)) ||
        false
      );
    });

    setFilteredContacts(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [search, allContacts]);

  // Pagination calculations
  const totalItems = filteredContacts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredContacts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  const handleView = (c) => {
    setSelectedContact(c);
    setIsModalOpen(true);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return dateString.slice(0, 10).split("-").reverse().join("-");
    } catch {
      return dateString;
    }
  };

  // Format currency function
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === "")
      return "0 PKR";
    const num = parseFloat(amount);
    return isNaN(num) ? "0 PKR" : `${num.toLocaleString()} PKR`;
  };

  return (
    <div className="max-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Account List
        </h2>

        <div className="w-full max-w-md relative">
          <CustomSearch
            placeholder="Search vehicle or transaction..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Seller Selector */}
      <div className="mb-4">
        <label
          htmlFor="sellerName"
          className="block text-base font-medium text-gray-700 mb-2"
        >
          Seller Name <span className="text-red-500">*</span>
        </label>
        <Select
          name="sellerId"
          options={eventOptions}
          isSearchable={true}
          required
          onChange={(selected) => handleChangeEvent("sellerId", selected)}
          className="mb-4"
        />
      </div>

      {/* Date Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="text-gray-950 font-semibold mb-1 block">
            From Date
          </label>
          <input
            type="date"
            name="fromDate"
            value={filterDate.fromDate}
            onChange={handlechange}
            className="px-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-700"
            max={currentDate}
          />
        </div>

        <div className="flex-1">
          <label className="text-gray-800 font-semibold mb-1 block">
            To Date
          </label>
          <input
            type="date"
            name="toDate"
            value={filterDate.toDate}
            onChange={handlechange}
            className="px-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-700"
            max={currentDate}
            min={filterDate.fromDate}
          />
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading account data...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block">
        {!loading && filteredContacts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">
              {formData.sellerId
                ? "No transactions found for the selected criteria"
                : "Please select a seller to view account details"}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-950 text-white">
                  <tr>
                    <th className="p-3 text-left">Sr#</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Transaction No</th>
                    <th className="p-3 text-left">Debit</th>
                    <th className="p-3 text-left">Credit</th>
                    <th className="p-3 text-left">Pre Balance</th>
                    <th className="p-3 text-left">Net Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((c, i) => (
                    <tr
                      key={c.id || i}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-gray-600">
                        {startIndex + i + 1}
                      </td>
                      <td className="p-3 text-gray-700">
                        {formatDate(c.date)}
                      </td>
                      <td className="p-3 text-gray-700 font-medium">
                        {c.transactionNo || "N/A"}
                      </td>
                      <td className="p-3 text-red-600 font-medium">
                        {formatCurrency(c.debit)}
                      </td>
                      <td className="p-3 text-green-600 font-medium">
                        {formatCurrency(c.credit)}
                      </td>
                      <td className="p-3 text-gray-700">
                        {formatCurrency(c.preBalance)}
                      </td>
                      <td
                        className={`p-3 font-semibold ${
                          parseFloat(c.netBalance || 0) > 0
                            ? "text-green-700"
                            : parseFloat(c.netBalance || 0) < 0
                              ? "text-red-700"
                              : "text-gray-700"
                        }`}
                      >
                        {formatCurrency(c.netBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Cards - Add similar logic here if needed */}

      {/* Pagination */}
      {!loading && filteredContacts.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {Math.min(startIndex + 1, totalItems)}
              </span>{" "}
              - <span className="font-semibold">{endIndex}</span> of{" "}
              <span className="font-semibold">{totalItems}</span> transactions
            </p>

            <div className="flex items-center gap-1 flex-wrap justify-center">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded transition-colors ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-50 hover:text-blue-900"
                }`}
              >
                {"<<"}
              </button>

              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded transition-colors ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-50 hover:text-blue-900"
                }`}
              >
                {"<"}
              </button>

              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-3 py-1 border rounded transition-colors ${
                    currentPage === p
                      ? "bg-blue-900 text-white"
                      : "hover:bg-gray-50 hover:text-blue-900"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`px-3 py-1 border rounded transition-colors ${
                  currentPage >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-50 hover:text-blue-900"
                }`}
              >
                {">"}
              </button>

              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage >= totalPages}
                className={`px-3 py-1 border rounded transition-colors ${
                  currentPage >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-50 hover:text-blue-900"
                }`}
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uncomment if you have UserDetailModal component */}
      {/* {isOpen === "detail" && (
        <UserDetailModal
          isOpen={isOpen}
          closeModal={() => handleIsOpen("")}
          userDetail={userDetail}
        />
      )} */}
    </div>
  );
};
