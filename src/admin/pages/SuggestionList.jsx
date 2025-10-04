import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../components/Contant/URL";

export const SuggestionList = () => {
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetSuggestions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getSuggestions`);
      setAllSuggestions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetSuggestions();
  }, []);

  // Handle View button click
  const handleViewBtn = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Suggestion List</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-xs sm:text-sm">
          <thead className="bg-[#191970] text-white">
            <tr>
              <th className="py-3 px-4 text-left">SR#</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Contact</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {allSuggestions?.map((sugest, index) => (
              <tr
                key={sugest.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-4 whitespace-nowrap">{index + 1}</td>
                <td className="py-2 px-4 whitespace-nowrap">
                  {sugest.name.charAt(0).toUpperCase() + sugest.name.slice(1)}
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  {sugest.email.charAt(0).toUpperCase() + sugest.email.slice(1)}
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  {sugest.contactNumber}
                </td>
                <td className="py-2 px-4 flex justify-center">
                  <button
                    onClick={() => handleViewBtn(sugest)}
                    className="px-4 py-1 text-xs sm:text-sm border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedSuggestion && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-opacity-40 px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 px-2 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              ✕
            </button>

            {/* Heading */}
            <h3 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-6 border-b pb-2">
              Suggestion Details
            </h3>

            {/* Content */}
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-600">
                  Customer Suggestion:
                </span>
                <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md shadow-sm">
                  {selectedSuggestion.suggestion || "No suggestion provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};