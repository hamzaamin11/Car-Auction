import { useState } from "react";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";


const PaymentMethod = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-6 md:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add Payment Details</h2>

        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-medium transition"
        >
          Pay with Credit Card
        </button>

       <div className="flex justify-center items-center gap-6 mt-6 text-4xl text-gray-600">
                <img
                    src="/images/visa.jpg"
                    alt="Visa"
                    className="w-15 h-10 object-contain hover:scale-110 transition"
                />
                <img
                    src="/images/master.png"
                    alt="MasterCard"
                    className="w-15 h-10 object-contain hover:scale-110 transition"
                />
                <img
                    src="/images/american.jpg"
                    alt="American Express"
                    className="w-15 h-10 object-contain hover:scale-110 transition"
                />
                <img
                    src="/images/union.png"
                    alt="UnionPay"
                    className="w-15 h-10 object-contain"
                />
            </div>


      
        {showForm && (
          <form className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Enter Card Information</h3>
            <input
              type="text"
              placeholder="Cardholder Name"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              placeholder="Card Number"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Expiry (MM/YY)"
                className="w-full md:w-1/2 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-full md:w-1/2 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold transition"
            >
              Confirm Payment
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
