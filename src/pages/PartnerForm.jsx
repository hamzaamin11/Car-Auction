import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../components/Contant/URL";
import toyotaImg from "../../src/assets/contact.png";
import { toast } from "react-toastify";

const initialState = {
  fullName: "",
  contactNumber: "",
  email: "",
  businessType: "",
  city: "",
  description: "",
};

export const PartnerForm = () => {
  const [formData, setFormData] = useState(initialState);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/customer/becomePartnerForm`,
        formData
      );
      console.log(res.data);
      setFormData(initialState);
      setLoading(false);
      toast.success("Your Request has been submit successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen  bg-cover bg-center flex items-start px-4 py-8"
      style={{
        backgroundImage: `url(${toyotaImg})`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="lg:w-1/3 w-full bg-white bg-opacity-95 p-8 rounded-xl shadow-lg space-y-5"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Become a Partner
        </h2>

        {/* Full Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-600 font-semibold">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block mb-1 text-sm text-gray-600 font-semibold">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              placeholder="+92XXXXXXXXXX"
              value={formData.contactNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 11) {
                  handleChange(e);
                }
              }}
              className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-600 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Business Type */}
          <div>
            <label className="block mb-1 text-sm text-gray-600 font-semibold">
              Business Type
            </label>
            <input
              type="text"
              name="businessType"
              placeholder="e.g. Car Dealer, Workshop"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block mb-1 text-sm text-gray-600 font-semibold">
            City / Location
          </label>
          <input
            type="text"
            name="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block mb-1 text-sm text-gray-600 font-semibold">
            Message
          </label>
          <textarea
            rows={5}
            name="description"
            placeholder="Tell us about your business..."
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className=" p-2 bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-all hover:cursor-pointer"
          >
            {loading ? "Loading..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};
