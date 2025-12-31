import React, { useContext, useEffect, useState, useCallback } from "react";
import AuctionsContext from "../../context/AuctionsContext";
import { IoMdClose } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { debounce } from "lodash";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import CustomSearch from "../../CustomSearch";

const AdminBidHistory = () => {
  const { aucHistory } = useContext(AuctionsContext);
  const [allBiders, setAllBiders] = useState([]);
  const [filteredBiders, setFilteredBiders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // modal states
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleGetAllBiders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/bidsForAdmin`);
      setAllBiders(res.data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllBiders();
  }, []);

  useEffect(() => {
    const filtered = allBiders.filter(
      (bid) =>
        bid.make?.toLowerCase().includes(search.toLowerCase()) ||
        bid.model?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBiders(filtered);
  }, [search, allBiders]);

  //  PAGINATION
  const totalItems = filteredBiders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredBiders.slice(startIndex, endIndex);

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

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedVehicle.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedVehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-1 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3 px-3">
          <h1 className="lg:text-3xl text-xl font-bold text-gray-800">
            Auction History
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
              placeholder="Search by Make, Model..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                debouncedSearch(e.target.value);
              }}
            />
          </div>
        </div>

        {/* DESKTOP TABLE – 100% YOUR ORIGINAL */}
        <div className="hidden md:block overflow-hidden max-w-7xl mx-auto">
          {/* Modern Table Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Elegant Header */}
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Bids Overview
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    All active and completed bids at a glance
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200">
                    Total: {currentItems?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Modern Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-8 py-4 text-left">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full"></div>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          #
                        </span>
                      </div>
                    </th>
                    <th className="px-8 py-4 text-left">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Customer
                        </span>
                      </div>
                    </th>
                    <th className="px-8 py-4 text-left">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Vehicle
                        </span>
                      </div>
                    </th>
                    <th className="px-8 py-4 text-left">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Bid Amount
                        </span>
                      </div>
                    </th>
                    <th className="px-8 py-4 text-left">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-600"
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
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Date
                        </span>
                      </div>
                    </th>
                    <th className="px-8 py-4 text-left">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems?.length > 0 ? (
                    currentItems.map((item, index) => {
                      const isEven = (startIndex + index + 1) % 2 === 0;

                      return (
                        <tr
                          key={index}
                          className={`border-b border-gray-100 last:border-0 group transition-colors duration-200 ${
                            isEven
                              ? "bg-gray-50/50 hover:bg-gray-100"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {/* Serial Number */}
                          <td className="px-8 py-5">
                            <div className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-lg group-hover:border-blue-300 transition-colors duration-200">
                              <span className="font-bold text-gray-700">
                                {startIndex + index + 1}
                              </span>
                            </div>
                          </td>

                          {/* Customer Name */}
                          <td className="px-8 py-5">
                            <div
                              onClick={() =>
                                setSelectedCustomer({
                                  name: item.name,
                                  contact: item.contact,
                                  cnic: item.cnic,
                                  address: item.address,
                                  email: item.email,
                                })
                              }
                              className="cursor-pointer group/customer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border border-blue-200">
                                  <span className="font-bold text-blue-700">
                                    {item.name?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 group-hover/customer:text-blue-600 transition-colors duration-200">
                                    {item.name}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-0.5">
                                    {item.contact || "No contact"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Vehicle */}
                          <td className="px-8 py-5">
                            <div
                              onClick={() => {
                                setSelectedVehicle({
                                  make: item.make,
                                  model: item.model,
                                  year: item.year,
                                  engine: item.engine,
                                  transmission: item.transmission,
                                  color: item.color,
                                  images: [],
                                  ...item,
                                });
                                setCurrentImageIndex(0);
                              }}
                              className="cursor-pointer group/vehicle"
                            >
                              <div className="space-y-2">
                                <p className="font-medium text-gray-900 group-hover/vehicle:text-blue-600 transition-colors duration-200">
                                  {item.make} {item.model}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                    {item.year || "N/A"}
                                  </span>
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                    {item.color || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Bid Amount */}
                          <td className="px-8 py-5">
                            <div className="space-y-1">
                              <div className="flex items-baseline gap-1">
                                <span className="text-sm font-medium text-gray-600">
                                  PKR
                                </span>
                                <span className="text-xl font-bold text-gray-900">
                                  {item.MonsterBid || item.maxBid || "0"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-600 font-medium">
                                  Active
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-8 py-5">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900">
                                {item.bidCreatedAt
                                  ? new Date(
                                      item.bidCreatedAt
                                    ).toLocaleDateString("en-GB")
                                  : "N/A"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.bidCreatedAt
                                  ? new Date(
                                      item.bidCreatedAt
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })
                                  : ""}
                              </p>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-8 py-5">
                            <div className="flex justify-start">
                              <span
                                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  item.status === "Highest"
                                    ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200 hover:border-red-300"
                                    : "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 hover:border-green-300"
                                }`}
                              >
                                {item.status === "Y" ? (
                                  <div className="flex items-center gap-2">
                                    <TiTick
                                      size={18}
                                      className="text-green-600"
                                    />
                                    <span>Sold</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span>Active</span>
                                  </div>
                                )}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-8 py-16">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">
                            No bids available
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Start accepting bids to see them listed here
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {currentItems?.length > 0 && (
              <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-gray-900">
                      {startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-900">
                      {Math.min(
                        startIndex + itemsPerPage,
                        currentItems?.length || 0
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900">
                      {currentItems?.length || 0}
                    </span>{" "}
                    bids
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {
                          currentItems.filter((item) => item.status !== "Y")
                            .length
                        }{" "}
                        active
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {
                          currentItems.filter((item) => item.status === "Y")
                            .length
                        }{" "}
                        sold
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE CARDS – 100% YOUR ORIGINAL */}
        <div className="md:hidden space-y-4 px-3">
          {currentItems?.length > 0 ? (
            currentItems.map(
              (
                {
                  id,
                  name,
                  model,
                  MonsterBid,
                  maxBid,
                  date,
                  status,
                  make,
                  contact,
                  cnic,
                  address,
                  year,
                  engine,
                  transmission,
                  color,
                  email,
                },
                index
              ) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-4"
                >
                  <div className="flex justify-end items-center mb-3">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 text-xs rounded-full font-semibold ${
                        status === "Highest"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {status === "Y" ? <TiTick size={20} /> : "Sold"}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">Customer</span>
                      <span
                        onClick={() =>
                          setSelectedCustomer({
                            name,
                            contact,
                            cnic,
                            address,
                          })
                        }
                        className="text-gray-800 cursor-pointer underline"
                      >
                        {name}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">Vehicle</span>
                      <span
                        onClick={() => {
                          setSelectedVehicle({
                            make,
                            model,
                            year,
                            engine,
                            transmission,
                            color,
                            images: [],
                            ...currentItems[index],
                          });
                          setCurrentImageIndex(0);
                        }}
                        className="text-gray-800 cursor-pointer underline"
                      >
                        {make}/{model}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">
                        Bid Amount
                      </span>
                      <span className="text-[#191970] font-semibold">
                        PKR {MonsterBid || maxBid || "0000"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">Date</span>
                      <span className="text-gray-500">
                        {date
                          ? new Date(date).toLocaleDateString("en-GB")
                          : "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="text-center py-8 text-gray-400">No bids yet.</div>
          )}
        </div>

        {/* PAGINATION */}
        {totalItems > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
              <div className="text-gray-600">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{endIndex}</span> of{" "}
                <span className="font-medium">{totalItems}</span> entries
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
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1 rounded border ${
                    currentPage >= totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {">"}
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1 rounded border ${
                    currentPage >= totalPages
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

        {/* YOUR FULL VEHICLE MODAL – 100% UNTOUCHED */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Premium Header */}
              <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 px-10 py-8">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white tracking-tight">
                        {selectedCustomer.name}
                      </h1>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-slate-300 text-sm font-medium">
                          Customer Profile
                        </span>
                        <span className="text-slate-400 text-sm">•</span>
                        <span className="text-slate-300 text-sm">
                          ID:{" "}
                          <span className="font-mono font-semibold">
                            #{selectedCustomer.id?.padStart(6, "0") || "000000"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-slate-300 hover:text-white p-3 rounded-xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                    aria-label="Close"
                  >
                    <IoMdClose size={26} />
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white">
                <div className="p-10">
                  {/* Quick Stats Bar */}
                  <div className="grid grid-cols-4 gap-6 mb-10">
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">
                            Status
                          </p>
                          <p className="text-lg font-semibold text-slate-900">
                            Active
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">
                            Joined
                          </p>
                          <p className="text-lg font-semibold text-slate-900">
                            {selectedCustomer.dateJoined || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">
                            Email
                          </p>
                          <p className="text-lg font-semibold text-slate-900 truncate">
                            {selectedCustomer.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">
                            Contact
                          </p>
                          <p className="text-lg font-semibold text-slate-900">
                            {selectedCustomer.contact || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Information */}
                  <div className="grid grid-cols-2 gap-8">
                    {/* Left Column - Personal Details */}
                    <div className="space-y-8">
                      {/* Personal Information Card */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            Personal Details
                          </h3>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                              Full Name
                            </label>
                            <div className="flex items-center gap-3 p-4 bg-slate-50/80 rounded-xl">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {selectedCustomer.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-slate-900">
                                  {selectedCustomer.name}
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                  Primary Account Holder
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Identification
                              </label>
                              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200">
                                <p className="text-slate-900 font-medium font-mono">
                                  {selectedCustomer.cnic || "Not Provided"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  CNIC / National ID
                                </p>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Customer ID
                              </label>
                              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200">
                                <p className="text-slate-900 font-medium font-mono">
                                  #
                                  {selectedCustomer.id?.padStart(8, "0") ||
                                    "00000000"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  Unique Identifier
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                              Contact Information
                            </label>
                            <div className="space-y-3">
                              <div className="flex items-center gap-4 p-4 bg-slate-50/80 rounded-xl hover:bg-slate-100/80 transition-colors">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-slate-900 font-medium">
                                    {selectedCustomer.contact || "Not Provided"}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    Primary Phone
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 p-4 bg-slate-50/80 rounded-xl hover:bg-slate-100/80 transition-colors">
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-slate-900 font-medium truncate">
                                    {selectedCustomer.email || "Not Provided"}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    Email Address
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Notes Card */}
                      {selectedCustomer.additionalNotes && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-7">
                          <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-amber-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">
                              Notes
                            </h3>
                          </div>
                          <div className="relative pl-5">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-300 rounded-full"></div>
                            <p className="text-slate-700 text-lg leading-relaxed italic">
                              "{selectedCustomer.additionalNotes}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Address & Metadata */}
                    <div className="space-y-8">
                      {/* Address Information Card */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-emerald-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            Address Information
                          </h3>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <p className="text-slate-900 text-lg leading-relaxed">
                                {selectedCustomer.address ||
                                  "No address information available for this customer."}
                              </p>
                            </div>
                            <button className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Metadata Card */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-7 text-white">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          Account Metadata
                        </h3>

                        <div className="space-y-5">
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div>
                              <p className="text-sm text-slate-300">Created</p>
                              <p className="text-lg font-semibold">
                                {selectedCustomer.dateJoined || "N/A"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-300">
                                Last Updated
                              </p>
                              <p className="text-lg font-semibold">
                                {new Date().toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-sm text-slate-300 mb-2">
                              Record Status
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium">Active</span>
                              </div>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-300 text-sm">
                                Verified Profile
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions Card */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">
                          Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <button className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center flex-col gap-2">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              Edit Profile
                            </span>
                          </button>

                          <button className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center flex-col gap-2">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                                />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              Send Message
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 bg-white px-10 py-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    <span className="font-medium text-slate-700">
                      Profile created:
                    </span>{" "}
                    {selectedCustomer.dateJoined || "N/A"}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="px-8 py-3 text-slate-700 hover:text-slate-900 font-medium rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                    >
                      Close
                    </button>
                    <button
                      onClick={() =>
                        console.log("Edit customer:", selectedCustomer)
                      }
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Manage Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blur backdrop-blur-md p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#191970]">
                  View Vehicles
                </h2>
                <button
                  className="text-black hover:text-red-500 p-2 rounded-full shadow-md"
                  onClick={() => {
                    setSelectedVehicle(null);
                    setCurrentImageIndex(0);
                  }}
                >
                  <IoMdClose size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* LEFT COLUMN – FULLY PRESERVED */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Location:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.cityName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Make:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.make}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Model:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Series:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.series || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Color:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.color || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Transmission:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.transmission || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Fuel Type:</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {selectedVehicle.fuelType || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Body Style:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.bodyStyle || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Certification Status:
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.certifyStatus || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Drive Type:</p>
                        <p className="font-semibold text-gray-900 uppercase">
                          {selectedVehicle.driveType || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Meter Reading:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.mileage || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Year:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.year || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Condition:</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {selectedVehicle.vehicleCondition || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.buyNowPrice ||
                            selectedVehicle.MonsterBid ||
                            selectedVehicle.maxBid ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN – IMAGE CAROUSEL – 100% PRESERVED */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-4">
                      {selectedVehicle.images &&
                      selectedVehicle.images.length > 0 ? (
                        <>
                          <img
                            src={selectedVehicle.images[currentImageIndex]}
                            alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                            className="w-full h-full object-cover"
                          />
                          {selectedVehicle.images.length > 1 && (
                            <>
                              <button
                                onClick={handlePrevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No images available
                        </div>
                      )}
                    </div>

                    {selectedVehicle.images &&
                      selectedVehicle.images.length > 1 && (
                        <div className="flex gap-2 justify-center flex-wrap">
                          {selectedVehicle.images
                            .slice(0, 5)
                            .map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                                  currentImageIndex === idx
                                    ? "border-blue-600"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                <img
                                  src={img}
                                  alt={`Thumbnail ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminBidHistory;
