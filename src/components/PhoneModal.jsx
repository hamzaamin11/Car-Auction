import { useEffect, useState } from "react";
import OtpModal from "./OtpVarificationModal";

const PhoneModal = ({ handleModal }) => {
  const [phone, setPhone] = useState("");

  const [isOpenOpt, setIsOpenOtp] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mt-20">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Please enter your phone number
        </h2>

        {/* Input */}
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value) && value.length <= 13) {
              setPhone(e.target.value);
            }
          }}
          placeholder="0321xxxxxxx"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => handleModal("")}
            className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsOpenOtp(true);
            }}
            className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800"
          >
            Send
          </button>
        </div>
      </div>

      {isOpenOpt && <OtpModal onClose={() => setIsOpenOtp(false)} />}
    </div>
  );
};

export default PhoneModal;
