import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../components/Contant/URL";
import toyotaImg from "../../src/assets/contact.png";
import Swal from "sweetalert2";
import CustomButton from "../CustomButton";
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
  const handleContactChange = (e) => {
  let value = e.target.value.replace(/\D/g, ""); // remove all non-digits

  // Ensure the number always starts with +92
  if (value.startsWith("92")) {
    value = "+" + value;
  } else if (!value.startsWith("+92")) {
    value = "+92" + value;
  }

  // Format like +92-300-1234567
  if (value.length > 3 && value.length <= 6) {
    value = value.slice(0, 3) + "-" + value.slice(3);
  } else if (value.length > 6 && value.length <= 10) {
    value =
      value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6);
  } else if (value.length > 10) {
    value =
      value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 15);
  }

  setFormData({ ...formData, contactNumber: value });
};


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
      
      // Show SweetAlert success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your application has been submitted successfully",
        confirmButtonColor: "#1d4ed8",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      
      // Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#1d4ed8",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-start px-4 py-8"
      style={{
        backgroundImage: `url(${toyotaImg})`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="lg:w-1/3 w-full bg-white bg-opacity-95 p-8 rounded-xl shadow-lg space-y-2"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Become a Partner
        </h2>

        {/* Full Name */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-1 text-sm text-gray-900 font-semibold">
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
              maxLength={15}
            />
          </div>

          {/* Contact Number */}
        <div>
  <label className="block mb-1 text-sm text-gray-900 font-semibold">
    Contact Number
  </label>
  <input
    type="tel"
    name="contactNumber"
    placeholder="+92-300-1234567"
    value={formData.contactNumber}
    onChange={handleContactChange}
    className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    required
    maxLength={15}
  />
</div>


          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-900 font-semibold">
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
              maxLength={20}
            />
          </div>

          {/* Business Type */}
          <div>
            <label className="block mb-1 text-sm text-gray-900 font-semibold">
              Business Type
            </label>
            <input
              type="text"
              name="businessType"
              placeholder="e.g. Car Dealer, Workshop"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={20}
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block mb-1 text-sm text-gray-900 font-semibold">
            City 
          </label>
          <input
            type="text"
            name="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength={25}
          />
        </div>

        {/* Message */}
        <div>
          <label className="block mb-1 text-sm text-gray-900 font-semibold">
            Message
          </label>
          <textarea
            rows={5}
            name="description"
            placeholder="Tell us about your business..."
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength={100}
          />
        </div>

        {/* Submit Button with Loader */}
        <div className="flex items-center justify-center">
        <CustomButton text="Submit Application" /> 
        </div>
      </form>
    </div>
  );
};