import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import Select from "react-select";
import CustomSearch from "../../CustomSearch";
import { BASE_URL } from "../../components/Contant/URL";
import { CircleUser } from "lucide-react";
import { UserDetailModal } from "../../admin/components/UserDetailModal/UserDetail";

const currentDate = new Date().toISOString().split("T")[0];

const initialState = {
  fromDate: "",
  toDate: "",
};

const initialData = {
  sellerId: "",
};

export const CommissionList = () => {
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

  const handleGetAllSeller = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getAllSellers`);
      setAllSeller(res.data || []);
    } catch (error) {
      console.log(error);
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

  const handleGetAccount = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getCommissionAmountListBySeller?sellerId=${formData.sellerId}&fromDate=${filterDate.fromDate}&toDate=${filterDate.toDate}`,
      );

      setAllContacts(res?.data || []);
    } catch (error) {
      console.log(error);
    }
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

  useEffect(() => {
    handleGetAccount();
  }, [filterDate, formData]);

  useEffect(() => {
    const filtered = allContacts.filter((c) =>
      c?.vehicleName?.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredContacts(filtered);
  }, [search, allContacts]);

  const totalItems = filteredContacts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredContacts.slice(startIndex, endIndex);

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

  const handleView = (c) => {
    setSelectedContact(c);
    setIsModalOpen(true);
  };

  useEffect(() => {
    handleGetAllSeller();
  }, []);

  return (
    <div className="max-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Commission List
        </h2>

        <div className="w-full max-w-md relative">
          <span className="absolute left-3 inset-y-0 flex items-center text-gray-400"></span>

          <CustomSearch
            placeholder="Search vehicle..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
        </div>
      </div>
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

      {/* Date Filters */}

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full bg-white shadow rounded-lg overflow-hidden text-sm">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="p-3 text-left">Sr#</th>
              <th className="p-1 text-left">Customer Name</th>
              <th className="p-1 text-left">Seller Name</th>
              <th className="p-1 text-left">Vehicle Name</th>
              <th className="p-1 text-left">Lot#</th>
              <th className="p-1  text-left">Year</th>
              <th className="p-1 text-left">City</th>
              <th className="p-1  text-left">Date </th>
              <th className="p-1  text-left">Sold Price </th>
              <th className="p-1  text-left">Commission %</th>
              <th className="p-1 text-left">Commission Acc</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((c, i) => (
                <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                  {/* Serial Number */}
                  <td className="p-3 text-gray-600">{startIndex + i + 1}</td>

                  <td
                    className="hover:cursor-pointer"
                    onClick={() => {
                      handleIsOpen("detail");
                      handleViewUserDetail(c?.customerId);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <CircleUser
                        size={"30"}
                        style={{
                          color: "gray",
                        }}
                      />
                      <span className="text-sm text-gray-600 capitalize">
                        {c?.customerName}
                      </span>
                    </div>
                  </td>

                  <td
                    className="hover:cursor-pointer"
                    onClick={() => {
                      handleIsOpen("detail");
                      handleViewUserDetail(c?.sellerId);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <CircleUser
                        size={"30"}
                        style={{
                          color: "gray",
                        }}
                      />
                      <span className="text-sm text-gray-600 capitalize">
                        {c?.sellerName}
                      </span>
                    </div>
                  </td>

                  {/* Vehicle with Image */}
                  <td className="p-1">
                    <div className="flex items-center gap-3">
                      {/* Vehicle Image */}
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {c.images ? (
                          <img
                            src={c.images[0]}
                            alt={c.vehicleName || "Vehicle"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Vehicle Name and Details */}
                      <div className="cursor-pointer min-w-0">
                        <h2 className="text-sm font-bold text-gray-800 truncate">
                          {c.make.charAt(0).toUpperCase() + c.make.slice(1)}{" "}
                          {c.model.charAt(0).toUpperCase() + c.model.slice(1)}
                        </h2>
                        <p className="text-xs text-gray-500 truncate">
                          {c.series.charAt(0).toUpperCase() + c.series.slice(1)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-1 ">
                    <span className="text-gray-700">{c?.lotNumber}</span>
                  </td>
                  <td className="p-1 ">
                    <span className="text-gray-700">{c?.year}</span>
                  </td>
                  <td className="p-1 ">
                    <span className="text-gray-700">{c?.cityName}</span>
                  </td>
                  {/* Date */}
                  <td className="p-1">
                    <span className="text-gray-700">
                      {c.date.slice(0, 10).split("-").reverse().join("-")}
                    </span>
                  </td>

                  <td className="p-1">
                    <span className="text-gray-700">
                      {c.soldAmount
                        ? `${c.soldAmount.toLocaleString()} PKR`
                        : "0 PKR"}
                    </span>
                  </td>

                  {/* Debit */}
                  <td className="p-1 ">
                    <span className="text-red-600 font-medium">
                      {c?.commission_percent
                        ? `${c?.commission_percent?.toLocaleString()} PKR`
                        : "0 PKR"}
                    </span>
                  </td>

                  {/* Credit */}
                  <td className="p-1 ">
                    <span className="text-green-600 font-medium">
                      {c?.commission_amount
                        ? `${c?.commission_amount?.toLocaleString()} PKR`
                        : "0 PKR"}
                    </span>
                  </td>

                  {/* Balance */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="py-8 text-center text-gray-400">
                  No Accounts Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {currentItems.length > 0 ? (
          currentItems.map((c) => (
            <div
              key={c.id}
              onClick={() => handleView(c)}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-4 transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">
                    Vehicle Name
                  </span>
                  <span className="text-gray-700">{c.vehicleName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Date</span>
                  <span className="text-gray-700">{c.date.slice(0, 10)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Debit</span>
                  <span className="text-red-600 font-medium">
                    {c.debit} PKR
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Credit</span>
                  <span className="text-green-600 font-medium">
                    {c.credit} PKR
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Balance</span>
                  <span className="font-bold text-blue-700">
                    {c.balance} PKR
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">No Accounts Found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="bg-white shadow rounded-lg p-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <p>
              Showing <span className="font-semibold">{startIndex + 1}</span> -{" "}
              <span className="font-semibold">{endIndex}</span> of{" "}
              <span className="font-semibold">{totalItems}</span>
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "hover:bg-gray-50"
                }`}
              >
                {"<<"}
              </button>

              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "hover:bg-gray-50"
                }`}
              >
                {"<"}
              </button>

              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === p
                      ? "bg-blue-900 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`px-3 py-1 border rounded ${
                  currentPage >= totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "hover:bg-gray-50"
                }`}
              >
                {">"}
              </button>

              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage >= totalPages}
                className={`px-3 py-1 border rounded ${
                  currentPage >= totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "hover:bg-gray-50"
                }`}
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpen === "detail" && (
        <UserDetailModal
          isOpen={isOpen}
          closeModal={() => handleIsOpen("")}
          userDetail={userDetail}
        />
      )}
    </div>
  );
};
