import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../components/Contant/URL";

export const ContactList = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const handleGetSuggestions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getContactUs`);
      setAllContacts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetSuggestions();
  }, []);

  const handleView = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Contact List</h2>
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
            {allContacts?.map((contact, index) => (
              <tr
                key={contact.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-4 whitespace-nowrap">{index + 1}</td>
                <td className="py-2 px-4 whitespace-nowrap">
                  {contact?.subject.charAt(0).toUpperCase() +
                    contact?.subject.slice(1)}
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedContact && (
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
              Contact Details
            </h3>

            {/* Content */}
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