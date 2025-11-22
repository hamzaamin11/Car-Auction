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
      contact.subject?.toLowerCase().includes(search.toLowerCase())
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3">
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
      <div className="hidden md:block">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden text-xs sm:text-sm">
          <thead className="bg-blue-950 text-white rounded-t-lg">
            <tr>
              <th className="py-3 px-4 text-left w-[10%] rounded-tl-lg">SR#</th>
              <th className="py-3 px-4 text-left w-[25%]">Name</th>
              <th className="py-3 px-4 text-left w-[30%]">Email</th>
              <th className="py-3 px-4 text-left w-[20%]">Contact</th>
              <th className="py-3 px-4 text-center w-[15%] rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((contact, index) => (
                <tr key={contact.id} className="border-b">
                  <td className="py-2 px-4 whitespace-nowrap">
                    {startIndex + index + 1}
                  </td>
                  <td className="py-2 px-4 capitalize">{contact?.subject}</td>
                  <td className="py-2 px-4">{contact?.email}</td>
                  <td className="py-2 px-4 whitespace-nowrap">{contact?.contactNumber}</td>
                  <td className="py-2 px-4 text-center">
                    <CustomAdd
                      text="View"
                      variant="view"
                      onClick={() => handleView(contact)}
                      className="text-xs sm:text-sm"
                    />
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

      {/* Mobile Cards – 100% unchanged */}
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
                    {contact?.subject.charAt(0).toUpperCase() + contact?.subject.slice(1)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-bold text-gray-900">Email</span>
                  <span className="text-gray-700">
                    {contact?.email.charAt(0).toUpperCase() + contact?.email.slice(1)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-bold text-gray-900">Contact</span>
                  <span className="text-gray-700">{contact?.contactNumber}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-bold text-gray-900">Customer Message</span>
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
                    currentPage === page ? "bg-blue-950 text-white" : "bg-white hover:bg-gray-50"
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
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-opacity-40 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 relative animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 px-2 py-1 text-sm bg-red-600 text-white rounded-md transition"
            >
              X
            </button>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              Contact Details
            </h3>
            <div className="space-y-4">
              <div>
                <span className="block font-semibold text-gray-700 mb-2">
                  Customer Message:
                </span>
                <div className="bg-gray-100 p-3 rounded-md text-gray-800 text-sm break-words overflow-y-auto">
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