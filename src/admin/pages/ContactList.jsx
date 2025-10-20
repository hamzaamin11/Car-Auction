import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { BASE_URL } from "../../components/Contant/URL";

export const ContactList = () => {
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
      setCurrentPage(1); // Reset to first page on search
    }, 300),
    []
  );

  const handleGetSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/getContactUs`);
      console.log("API Response:", res.data);
      setAllContacts(res.data);
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
      contact.subject?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [search, allContacts]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContacts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
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
          <input
            type="text"
            placeholder="Search by Subject..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
      </div>
      <>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full bg-white shadow-md rounded-lg text-xs sm:text-sm">
            <thead className="bg-[#191970] text-white">
              <tr>
                <th className="py-3 px-4 text-left w-[10%]">SR#</th>
                <th className="py-3 px-4 text-left w-[25%]">Name</th>
                <th className="py-3 px-4 text-left w-[30%]">Email</th>
                <th className="py-3 px-4 text-left w-[20%]">Contact</th>
                <th className="py-3 px-4 text-center w-[15%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((contact, index) => (
                  <tr
                    key={contact.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 px-4 whitespace-nowrap">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="py-2 px-4">
                      {contact?.subject.charAt(0).toUpperCase() +
                        contact?.subject.slice(1)}
                    </td>
                    <td className="py-2 px-4">
                      {contact?.email.charAt(0).toUpperCase() +
                        contact?.email.slice(1)}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      {contact?.contactNumber}
                    </td>
                    <td className="py-2 px-4 flex justify-center">
                      <button
                        onClick={() => handleView(contact)}
                        className="px-4 py-1 text-xs sm:text-sm border border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-600 hover:text-white transition"
                      >
                        View
                      </button>
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

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {currentItems.length > 0 ? (
            currentItems.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-4 transition-all duration-300 hover:shadow-lg cursor-pointer"
                onClick={() => handleView(contact)}
              >
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="font-bold text-gray-900">Name</span>
                    <span className="text-gray-700">
                      {contact?.subject.charAt(0).toUpperCase() +
                        contact?.subject.slice(1)}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-bold text-gray-900">Email</span>
                    <span className="text-gray-700">
                      {contact?.email.charAt(0).toUpperCase() +
                        contact?.email.slice(1)}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-bold text-gray-900">Contact</span>
                    <span className="text-gray-700">
                      {contact?.contactNumber}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-bold text-gray-900"> Contact Details</span>
                    <span className="text-gray-700 text-xs">
                      {contact?.description?.length > 50
                        ? `${contact?.description.slice(0, 50)}...`
                        : contact?.description || "No message provided."}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              No contacts found.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between mt-6">
            <button
              className={`bg-blue-950 text-white px-5 py-2 rounded ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              ‹ Prev
            </button>
            <div></div>
            <button
              className={`bg-blue-950 text-white px-5 py-2 rounded ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next ›
            </button>
          </div>
        )}
      </>

      {/* Modal */}
      {isModalOpen && selectedContact && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-opacity-40 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 relative animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 px-2 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              ✕
            </button>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              Contact Details
            </h3>
            <div className="space-y-4">
              <div>
                <span className="block font-semibold text-gray-700 mb-2">
                  Customer Message:
                </span>
                <div className="bg-gray-100 p-3 rounded-md text-gray-800 text-sm leading-relaxed shadow-inner">
                  {selectedContact?.description || "No message provided."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};