import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { BASE_URL } from "../../components/Contant/URL";
import CustomAdd from "../../CustomAdd";
import CustomSearch from "../../CustomSearch";

export const ContactList = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  console.log("selectedContact =>", selectedContact);
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

  const handleGetSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/getContactUs`);
      setAllContacts(res.data || []);
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
    const filtered = allContacts.filter((contact) =>
      contact.subject?.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredContacts(filtered);
  }, [search, allContacts]);

  // PERFECT PAGINATION LOGIC — same as all your other lists
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

  const handleView = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  return (
    <div className="max-h-screen bg-gray-100 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800">
          Contact List
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
            placeholder="Search by Subject..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Desktop Table – 100% unchanged */}
      <div className="">
        <table className="w-full bg-white shadow-md rounded border border-gray-600 overflow-hidden text-xs sm:text-sm">
          <thead className="bg-blue-950 text-white rounded-t-lg">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">Sr</th>
              <th className="p-1 text-left text-sm font-semibold">Name</th>
              <th className="p-1 text-left text-sm font-semibold">Email</th>
              <th className="p-1 text-left text-sm font-semibold">Contact</th>
              <th className="p-1 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((contact, index) => (
                <tr key={contact.id} className="border-b">
                  <td className="p-3 whitespace-nowrap">
                    {startIndex + index + 1}
                  </td>
                  <td className="p-1 capitalize">{contact?.subject}</td>
                  <td className="p-1 capitalize">{contact?.email}</td>
                  <td className="p-1 whitespace-nowrap">
                    {contact?.contactNumber}
                  </td>
                  <td className="p-1">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(contact)}
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
                <td colSpan="5" className="py-8 text-center text-gray-400">
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
      {isModalOpen && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Simple White Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl transform transition-all duration-300">
            <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl">
              {/* Header Section */}
              <div className="px-6 py-5 border-b border-gray-200 bg-blue-900">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {/* Contact Icon */}
                    <div className="p-3 rounded-lg bg-blue-100 border border-blue-100">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    {/* Title and Info */}
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Contact Inquiry
                      </h3>

                      {/* Contact Info Badges */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedContact?.email && (
                          <span className="px-3 py-1 bg-blue-50 rounded-md text-xs font-medium text-blue-900 border border-blue-200">
                            {selectedContact.email}
                          </span>
                        )}
                        {selectedContact?.contactNumber && (
                          <span className="px-3 py-1 bg-indigo-50 rounded-md text-xs font-medium text-indigo-700 border border-indigo-200">
                            📞 {selectedContact?.contactNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Simple Close Button */}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 ">
                {/* Customer Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {selectedContact?.name && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <svg
                            className="w-4 h-4 text-blue-950"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                          Customer Name
                        </p>
                      </div>
                      <p className="text-gray-800 font-medium text-lg pl-10">
                        {selectedContact.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Category & Priority Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {selectedContact?.category && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                          Category
                        </p>
                      </div>
                      <p className="text-gray-800 font-medium text-lg pl-10">
                        {selectedContact.category}
                      </p>
                    </div>
                  )}

                  {/* Priority Indicator */}
                  {selectedContact?.priority && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-gray-500">
                            Priority
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            selectedContact.priority === "High"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : selectedContact.priority === "Medium"
                                ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                : "bg-green-50 text-green-700 border border-green-200"
                          }`}
                        >
                          {selectedContact.priority}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">
                        Customer Message
                      </h4>
                    </div>
                  </div>

                  {/* Message Container */}
                  <div className="relative">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[180px] max-h-80 overflow-y-auto">
                      {/* Message content */}
                      <div className="space-y-3">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-normal text-base">
                          {selectedContact?.description ||
                            "No message provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 justify-end">
                  {/* Close Button */}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-5 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gray-300"
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
                          strokeWidth="1.5"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Close
                    </button>
                    {selectedContact?.email && (
                      <button
                        onClick={() =>
                          (window.location.href = `mailto:${selectedContact.email}`)
                        }
                        className="flex-1 px-5 py-3 text-sm font-medium bg-blue-950 hover:bg-blue-900 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-blue-600"
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
                            strokeWidth="1.5"
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
