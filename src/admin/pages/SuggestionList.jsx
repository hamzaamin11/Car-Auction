import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { BASE_URL } from "../../components/Contant/URL";
import CustomAdd from "../../CustomAdd";
import CustomSearch from "../../CustomSearch";

export const SuggestionList = () => {
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
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

  const handleGetSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/getSuggestions`);
      setAllSuggestions(res.data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetSuggestions();
  }, []);

  useEffect(() => {
    const filtered = allSuggestions.filter((suggestion) =>
      suggestion.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  }, [search, allSuggestions]);

  // PERFECT PAGINATION LOGIC (same as all your other admin lists)
  const totalItems = filteredSuggestions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredSuggestions.slice(startIndex, endIndex);

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

  const handleViewBtn = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsModalOpen(true);
  };

  const truncateSuggestion = (text, maxLength = 25) => {
    if (!text) return "No suggestion provided.";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800">
          Suggestion List
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
            placeholder="Search by Name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Desktop Table – 100% unchanged */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-xs sm:text-sm">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="py-3 px-4 text-left">SR#</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Contact</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((sugest, index) => (
                <tr key={sugest.id} className="border-b">
                  <td className="py-2 px-4 whitespace-nowrap">
                    {startIndex + index + 1}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    {sugest.name.charAt(0).toUpperCase() + sugest.name.slice(1)}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    {sugest.email.charAt(0).toUpperCase() +
                      sugest.email.slice(1)}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    {sugest.contactNumber}
                  </td>
                  <td className="py-2 px-4 flex justify-center">
                    <CustomAdd
                      text="View"
                      variant="view"
                      onClick={() => handleViewBtn(sugest)}
                      className="text-xs sm:text-sm"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400">
                  No suggestions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards – 100% unchanged */}
      <div className="md:hidden space-y-2">
        {currentItems.length > 0 ? (
          currentItems.map((sugest) => (
            <div
              key={sugest.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-4 transition-all duration-300 hover:shadow-lg cursor-pointer"
              onClick={() => handleViewBtn(sugest)}
            >
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="font-bold text-gray-900">Name</span>
                  <span className="text-gray-700">
                    {sugest.name.charAt(0).toUpperCase() + sugest.name.slice(1)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-bold text-gray-900">Email</span>
                  <span className="text-gray-700">
                    {sugest.email.charAt(0).toUpperCase() +
                      sugest.email.slice(1)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-bold text-gray-900">Contact</span>
                  <span className="text-gray-700">{sugest.contactNumber}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-bold text-gray-900">Suggestion</span>
                  <span className="text-gray-700">
                    {truncateSuggestion(sugest.suggestion)}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm">
            No suggestions found.
          </div>
        )}
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
      {isModalOpen && selectedSuggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl animate-scaleUp">
            {/* Modal Card */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Header with gradient */}
              <div className="bg-blue-950 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Suggestion Details
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">
                      Customer feedback #{selectedSuggestion.id || "N/A"}
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="group rounded-lg p-2  duration-200 text-white bg-red-600 group-hover:text-white transition-colors"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6  "
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
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {selectedSuggestion.status || "Submitted"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {selectedSuggestion.date || new Date().toLocaleDateString()}
                  </span>
                </div>

                {/* Suggestion Box */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gray-100 ">
                      <svg
                        className="w-5 h-5 text-blue-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800">
                      Customer Suggestion
                    </h4>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none rounded-xl" />
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 max-h-64 overflow-y-auto">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedSuggestion.suggestion ||
                          "No suggestion provided."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info (if available) */}
                {selectedSuggestion.category && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="font-medium text-gray-800">
                        {selectedSuggestion.category}
                      </p>
                    </div>
                    {selectedSuggestion.priority && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Priority</p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedSuggestion.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : selectedSuggestion.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {selectedSuggestion.priority}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-white  bg-red-600 hover:opacity-95 hover:cursor-pointer rounded  transition-colors"
                  >
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
