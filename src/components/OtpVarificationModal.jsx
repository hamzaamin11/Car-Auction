import React, { useState } from "react";

const OtpModal = ({ onClose, onSubmit }) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    if (onSubmit) onSubmit(otp);
    setOtp("");
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-start justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mt-24">
        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Enter OTP for Verification
        </h2>

        {/* Input */}
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-3 border border-gray-300 rounded-lg text-center tracking-widest text-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
        />

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="w-1/2 mr-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-1/2 ml-2 px-4 py-2 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
