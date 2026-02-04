import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { BASE_URL } from "../../components/Contant/URL";
import CustomAdd from "../../CustomAdd";
import CustomSearch from "../../CustomSearch";

export const BecomePartnerList = () => {
  const [allPartner, setAllPartner] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
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
    [],
  );

  const handleGetPartners = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/getPartner`);
      setAllPartner(res.data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetPartners();
  }, []);

  useEffect(() => {
    const filtered = allPartner.filter((partner) =>
      partner.bussinessType?.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredPartners(filtered);
  }, [search, allPartner]);

  // PERFECT PAGINATION LOGIC (same as all your other lists)
  const totalItems = filteredPartners.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredPartners.slice(startIndex, endIndex);

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

  const handleViewBtn = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  return (
    <div className="max-h-screen bg-gray-100 p-4 ">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800">
          Partners List
        </h2>
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
            placeholder="Search by Business Type..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Desktop Table – 100% unchanged */}
      <div className="min-w-full">
        <div className=" min-w-full overflow-hidden rounded border border-gray-600 shadow-sm ">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-950 ">
              <tr>
                <th className="p-3  text-left text-sm font-semibold text-white">
                  Sr
                </th>
                <th className="p-1 text-left text-sm font-semibold text-white">
                  Name
                </th>
                <th className="p-1 text-left text-sm font-semibold text-white">
                  Email
                </th>
                <th className="p-1 text-left text-sm font-semibold text-white">
                  Contact
                </th>
                <th className="p-1 text-left text-sm font-semibold text-white">
                  Business Type
                </th>
                <th className="p-1 text-left text-sm font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {currentItems.length > 0 ? (
                currentItems.map((msg, index) => (
                  <tr
                    key={msg.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-ful">
                        <span className="text-xs font-bold">
                          {startIndex + index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="p-1">
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                          <span className="text-xs font-semibold  text-blue-900">
                            {msg?.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          {msg?.name?.charAt(0)?.toUpperCase() +
                            msg?.name?.slice(1) || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-1">
                      <div className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-700 truncate max-w-[180px]">
                          {msg?.email?.toLowerCase() || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-1">
                      <div className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">
                          {msg?.contact || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-1">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        <svg
                          className="mr-1 h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        {msg?.bussinessType?.charAt(0)?.toUpperCase() +
                          msg?.bussinessType?.slice(1) || "N/A"}
                      </span>
                    </td>
                    <td className="p-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewBtn(msg)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="mb-3 h-12 w-12 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-500">
                        No partners found
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ONLY THIS PART CHANGED – PERFECT PAGINATION */}
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

      {/* Modal – 100% unchanged */}
      {isModalOpen && selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Enhanced Backdrop with gradient */}
          <div
            className="absolute inset-0  backdrop-blur-sm transition-all duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container with subtle scale animation */}
          <div className="relative w-full max-w-2xl transform transition-all duration-300 animate-modalEnter">
            {/* Main Modal Card with border gradient */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent -translate-x-12 -translate-y-12 rounded-full" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-gray-500/5 to-transparent translate-x-16 translate-y-16 rounded-full" />

              {/* Header with modern gradient and pattern */}
              <div className="relative bg-blue-900 p-4">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10" />

                <div className="relative flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          Partner Details
                        </h3>
                      </div>
                    </div>

                    {/* Partner Info Badges */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedPartner.type && (
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                          {selectedPartner.type}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-green-500 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                        Active Partner
                      </span>
                      {selectedPartner.since && (
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                          Since {selectedPartner.since}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 space-y-8">
                {/* Partner Message Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">
                          Partner Communication
                        </h4>
                        <p className="text-sm text-gray-500">
                          Direct message from partner
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message Container with elegant styling */}
                  <div className="relative group">
                    {/* Corner decorations */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-blue-200 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-blue-200 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-blue-200 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-blue-200 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 min-h-[120px] max-h-80 overflow-y-auto">
                      {/* Fade effect at bottom for long content */}
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />

                      <div className="space-y-4">
                        {/* Message content with proper typography */}
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-light">
                          {selectedPartner.message}
                        </p>

                        {/* Optional message metadata */}
                        {selectedPartner.sender && (
                          <div className="pt-4 mt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Sent by:</span>{" "}
                              {selectedPartner.sender}
                              {selectedPartner.department &&
                                ` • ${selectedPartner.department}`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Partner Information (if available) */}
                {(selectedPartner.contact || selectedPartner.company) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                    {selectedPartner.company && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          Company
                        </p>
                        <p className="text-gray-800 font-medium">
                          {selectedPartner.company}
                        </p>
                      </div>
                    )}

                    {selectedPartner.email && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          Contact Email
                        </p>
                        <p className="text-gray-800 font-medium  transition-colors">
                          {selectedPartner.email}
                        </p>
                      </div>
                    )}

                    {selectedPartner.contact && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.2 1.1a11.04 11.04 0 005.52 5.52l1.1-2.2a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
                            />
                          </svg>
                          Contact Email
                        </p>
                        <p className="text-gray-800 font-medium  transition-colors">
                          {selectedPartner.contact}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-sm font-medium bg-red-600 text-white hover:bg-opacity-95  rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
