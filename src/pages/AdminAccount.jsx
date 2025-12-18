import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";

import CustomSearch from "../CustomSearch";
import { BASE_URL } from "../components/Contant/URL";

const currentDate = new Date().toISOString().split("T")[0];

const initialState = {
  fromDate: currentDate,
  toDate: currentDate,
};

export const AdminAccount = () => {
  const [filterDate, setFilterDate] = useState(initialState);
  const [allContacts, setAllContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFilterDate({ ...filterDate, [name]: value });
  };

  const handleGetAccount = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/adminAccounts?fromDate=${filterDate.fromDate}&toDate=${filterDate.toDate}`
      );

      setAllContacts(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAccount();
  }, [filterDate]);

  useEffect(() => {
    const filtered = allContacts.filter((c) =>
      c?.vehicleName?.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Admin Account List
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

      {/* Date Filters */}
      <div className="flex gap-2 mb-4">
        <div className="flex flex-col">
          <label className="text-gray-950 font-semibold mb-1">From Date</label>
          <input
            type="date"
            name="fromDate"
            value={filterDate.fromDate}
            onChange={handlechange}
            className="px-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-700"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-800 font-semibold mb-1">To Date</label>
          <input
            type="date"
            name="toDate"
            value={filterDate.toDate}
            onChange={handlechange}
            className="px-3 py-2 border border-gray-300 rounded-lg min-w-full focus:outline-none focus:border-blue-700"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full bg-white shadow rounded-lg overflow-hidden text-sm">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="py-3 px-4 text-left">SR#</th>
              <th className="py-3 px-10 text-left">Vehicle Name</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Debit</th>
              <th className="py-3 px-4 text-left">Credit</th>
              <th className="py-3 px-4 text-left">Balance</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((c, i) => (
                <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-left">{startIndex + i + 1}</td>
                  <td className="py-3 px-10">{c.vehicleName}</td>
                  <td className="py-3 px-4">{c.date.slice(0, 10)}</td>
                  <td className="py-3 px-4">{c.debit} PKR</td>
                  <td className="py-3 px-4">{c.credit} PKR</td>
                  <td className="py-3 px-4 font-semibold">{c.balance} PKR</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400">
                  No Accounts Found.
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
    </div>
  );
};
