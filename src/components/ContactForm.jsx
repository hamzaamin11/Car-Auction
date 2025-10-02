import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "./Contant/URL";
import { toast } from "react-toastify";

const initialState = {
  subject: "",
  contactNumber: "",
  email: "",
  description: "",
};

const ContactForm = () => {
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
        `${BASE_URL}/customer/contactFrom`,
        formData
      );
      console.log(res.data);
      setFormData(initialState);
      setLoading(false);
      toast.success("Contact form has been submit sucessfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-start  px-4"
      style={{
        backgroundImage:
          "url('https://t4.ftcdn.net/jpg/07/98/14/53/360_F_798145314_GftvLXWuBwUX1wQLGlXjaIsLPVsx7pUU.jpg')",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="lg:w-1/3 w-full  p-6 rounded-lg shadow-lg space-y-5"
      >
        <h2 className="text-3xl font-bold text-gray-800">Send a Message</h2>

        <div>
          <label className="block mb-1 text-sm text-gray-600">Name</label>
          <input
            type="text"
            name="subject"
            placeholder="Your name"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-600">
            Contact Number
          </label>
          <input
            type="tel"
            name="contactNumber"
            placeholder="+92XXX-XXXXX-X"
            value={formData.contactNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) && value.length <= 11) {
                handleChange(e);
              }
            }}
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-600">Message</label>
          <textarea
            rows="5"
            name="description"
            placeholder="Type your message..."
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-red-600 text-white font-semibold p-3 rounded-lg hover:bg-yellow-500 transition-all"
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
