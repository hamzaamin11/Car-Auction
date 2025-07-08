import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactSupport = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Optional: You can reset the form after submission
    setForm({ name: '', email: '', message: '' });

    // Show success toast
    toast.success('Submitted successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    });
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
          Need More Help?
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Submit your query and our support team will contact you shortly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="peer w-full border-b-2 border-gray-300 focus:border-[#233d7b] outline-none bg-transparent py-2 placeholder-transparent"
              placeholder="Your Name"
            />
            <label className="absolute left-0 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#233d7b] transition-all">
              Your Name
            </label>
          </div>

      
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="peer w-full border-b-2 border-gray-300 focus:border-[#233d7b] outline-none bg-transparent py-2 placeholder-transparent"
              placeholder="Your Email"
            />
            <label className="absolute left-0 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#233d7b] transition-all">
              Your Email
            </label>
          </div>
          <div className="relative">
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              className="peer w-full border-b-2 border-gray-300 focus:border-[#233d7b] outline-none bg-transparent py-2 placeholder-transparent resize-none"
              placeholder="Your Message"
            />
            <label className="absolute left-0 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#233d7b] transition-all">
              Your Message
            </label>
          </div>

       
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-[#233d7b] hover:bg-blue-900 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>

     
      <ToastContainer />
    </section>
  );
};

export default ContactSupport;
