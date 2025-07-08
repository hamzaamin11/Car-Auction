import axios from "axios";
import React, { useState } from "react";

const initialState = {
  subject: "",
  contactNumber: "",
  email: "",
  description: "",
};

const ContactForm = () => {
  const [formData, setFormData] = useState(initialState);

  console.log(formData);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    console.log({ name, value });

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3001/customer/contactFrom`,
        formData
      );
      console.log(res.data);
      setFormData(initialState);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Send a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-5 w-1/2">
        <div>
          <label className="block mb-1 text-sm text-gray-600">Name</label>
          <input
            type="text"
            name="subject"
            placeholder="Your name"
            value={formData?.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-600">
            Contact Number
          </label>
          <input
            type="number"
            name="contactNumber"
            placeholder="+92XXX-XXXXX-X"
            value={formData?.contactNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData?.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-600">Message</label>
          <textarea
            rows="5"
            name="description"
            placeholder="Type your message..."
            onChange={handleChange}
            value={formData.description}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#ffbf00] text-white font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-all"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
