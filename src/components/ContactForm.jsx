import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "./Contant/URL";
import Swal from "sweetalert2";
import CustomButton from "../CustomButton";
const initialState = {
  subject: "",
  contactNumber: "",
  email: "",
  description: "",
};

const ContactForm = () => {
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
        `${BASE_URL}/customer/contactFrom`,
        formData
      );
      console.log(res.data);
      setFormData(initialState);
      setLoading(false);

      // Show SweetAlert success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Contact form has been submitted successfully",
        confirmButtonColor: "#dc2626",
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
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-start px-4"
      style={{
        backgroundImage:
          "url('https://t4.ftcdn.net/jpg/07/98/14/53/360_F_798145314_GftvLXWuBwUX1wQLGlXjaIsLPVsx7pUU.jpg')",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="lg:w-1/3 w-full bg-white p-6 rounded-lg shadow-lg space-y-2 mt-3"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Send a Message
        </h2>

        <div>
          <label className="block mb-1 text-sm text-gray-900 font-semibold">
            Name
          </label>
          <input
            type="text"
            name="subject"
            placeholder="Your name"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            maxLength={20}
          />
        </div>

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
          />
        </div>

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
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            maxLength={30}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-900 font-semibold">
            Message
          </label>
          <textarea
            rows="5"
            name="description"
            placeholder="Type your message..."
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            maxLength={100}
          />
        </div>

        <CustomButton text="Send Message" />
      </form>
    </div>
  );
};

export default ContactForm;
