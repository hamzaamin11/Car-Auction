import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { BASE_URL } from "../../components/Contant/URL";
const initialState = {
  sellerId: "",
  type: "",
  amount: "",
  date: "",
  description: "",
};

export const AddPayment = () => {
  const [formData, setFormData] = useState(initialState);
  const [allSeller, setAllSeller] = useState([]);

  console.log("=>>>", allSeller);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGetAllSeller = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getAllSellers`);
      setAllSeller(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const eventOptions = [
    { label: "Choose the Seller", value: "" },
    ...allSeller.map((seller) => ({
      label: `${seller?.name ?? "NIL"} | ${seller?.cnic ?? "NIL"} | ${seller?.contact ?? "NIL"}`,
      value: seller.id,
    })),
  ];

  const handleChangeEvent = (name, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/addAdminPayment`,
        formData,
      );
      setFormData(initialState)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllSeller();
  }, []);

  return (
    <div className="max-w-full mx-auto  bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold text-center text-white bg-blue-950 p-4 mb-8 rounded">
        Add Payment
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 p-6 ">
        {/* Seller Name */}
        <div>
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
          />
        </div>

        {/* Account Type */}
        <div>
          <label
            htmlFor="accountType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Account Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-900"
          >
            <option value="">Select account type</option>
            <option value="credit">Credit</option>
            <option value="debit"> Debit</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-900"
            placeholder="Enter amount"
          />
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-900"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-900 resize-none"
            placeholder="Enter payment description (optional)"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 justify-center pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-950 text-white font-medium rounded-md hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Add Payment
          </button>
        </div>
      </form>
    </div>
  );
};
