import React from "react";
import { Link, useParams } from "react-router-dom";
import HoldingCharges from "../components/Charges";
import ShowroomCharges from "../components/Showroom";
import KpkGovtCharges from "../components/kpkCharges";
import TotalCharges from "../components/Price";
import { useState } from "react";

const cityData = {
  bahawalpur: {
    manufacturer: "Audi",
    model: "Q2",
    version: "1.0 TFSI Standard Line",
    exFactory: "PKR 7,050,000",
  },
  abbottabad: {
    manufacturer: "Audi",
    model: "Q2",
    version: "1.0 TFSI Standard Line",
    exFactory: "PKR 7,100,000",
  },
};

export default function OnRoadPrice() {
    const { city } = useParams();
    const vehicle = cityData[city.toLowerCase()];
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [yourEmail, setYourEmail] = useState("");
    const [message, setMessage] = useState('');
    const [emailList, setEmailList] = useState('');
    const [showBookingModal, setShowBookingModal] = useState(false);




  if (!vehicle) {
    return <div className="text-center text-red-500 py-10">City data not found.</div>;
  }

  return (
    <>
    <div className="max-w-6xl mx-auto p-6">
     
      <nav className="text-sm text-gray-500 space-x-2 mb-4">
        <Link
         to="/" 
         className="hover:underline text-gray-600">
            Home
        </Link>
        <span>/</span>
        <Link
         to="/saleslist" 
         className="hover:underline text-gray-600">
            Price List
        </Link>
        <span>/</span>
        <Link
         to="/roadprice" 
         className="hover:underline text-gray-600">
             Road Price
        </Link>
        <span>/</span>
        <span>Audi Q2 1.0 TFSI Standard Line On Road Price in {city.charAt(0).toUpperCase() + city.slice(1)}</span>
      </nav>

   
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Audi Q2 1.0 TFSI Standard Line On Road Price in {city.charAt(0).toUpperCase() + city.slice(1)}
      </h1>

     
      
    
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <button
          onClick={() => setShowEmailForm(!showEmailForm)}
          className="px-5 py-2 bg-[#233d7b] text-white rounded-lg text-center hover:bg-[#1d3367] transition w-full md:w-auto"
        >
          Email
        </button>

            <button
              onClick={() => setShowBookingModal(true)}
              className="px-5 py-2 bg-[#233d7b] text-white rounded-lg text-center hover:bg-[#1d3367] transition w-full md:w-auto"
            >
              Book This Car
            </button>
      </div>

    {showEmailForm && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-start pt-20 px-4">
    <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative">
      <button
        className="absolute top-3 right-4 text-xl text-gray-600 hover:text-red-500"
        onClick={() => setShowEmailForm(false)}
      >
        &times;
      </button>
      <h2 className="text-xl md:text-2xl font-bold text-[#233d7b] mb-4">
        Share Car Info
      </h2>
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
         
          setShowEmailForm(false);
        }}
      >
        <p className="text-sm text-gray-600 mb-2">
          Audi Q2 1.0 TFSI Standard Line On Road Price in Abbottabad
        </p>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Your Email*</label>
          <input
            type="email"
            value={yourEmail}
            onChange={(e) => setYourEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#233d7b]"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Your Message*</label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#233d7b]"
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Email Address*</label>
          <input
            type="text"
            value={emailList}
            onChange={(e) => setEmailList(e.target.value)}
            placeholder="eg. first@email.com, second@email.com"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#233d7b]"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Add comma-separated email addresses
          </p>
        </div>

  
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              setYourEmail('');
              setMessage('');
              setEmailList('');
              setShowEmailForm(false);
            }}
            className="px-6 py-2 rounded-md border border-gray-400 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-[#233d7b] text-white rounded-md hover:bg-[#1d3367] transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  </div>
)}

 {showBookingModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-start pt-20 px-4">
    <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative">
      <button
        className="absolute top-3 right-4 text-xl text-gray-600 hover:text-red-500"
        onClick={() => setShowBookingModal(false)}
      >
        &times;
      </button>
      <h2 className="text-xl md:text-2xl font-bold text-[#233d7b] mb-4">
        Book Audi Q2 1.0 TFSI
      </h2>
      <form className="space-y-5">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Payment Type*</label>
          <select
            required
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b]"
          >
            <option value="">Select Payment Type</option>
            <option value="cash">Cash</option>
            <option value="lease">Finance/Leased</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Full Name*</label>
          <input
            type="text"
            placeholder="Your Name"
            required
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b]"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Mobile Number*</label>
          <input
            type="tel"
            placeholder="03XXXXXXXXX"
            required
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b]"
          />
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <label className="text-sm text-gray-600">
            Send me updates and relevant news.
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowBookingModal(false)}
            className="px-6 py-2 rounded-md border border-gray-400 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#233d7b] text-white rounded-md hover:bg-[#1d3367] transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
)}

        <div className="overflow-x-auto">
 
  <table className="hidden md:table w-full min-w-[500px] bg-white border border-gray-200 rounded-lg shadow-sm">
    <thead className="bg-[#f3f6fc] text-[#233d7b] text-sm uppercase tracking-wide">
      <tr>
        <th className="text-left px-6 py-3 border-b font-semibold">Vehicle Details</th>
        <th className="text-left px-6 py-3 border-b font-semibold">Info</th>
      </tr>
    </thead>
    <tbody className="text-sm text-gray-700">
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b">Manufacturer</td>
        <td className="px-6 py-4 border-b">{vehicle.manufacturer}</td>
      </tr>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b">Model</td>
        <td className="px-6 py-4 border-b">{vehicle.model}</td>
      </tr>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b">Version</td>
        <td className="px-6 py-4 border-b">{vehicle.version}</td>
      </tr>
      <tr className="hover:bg-gray-50 transition">
        <td className="px-6 py-4 border-b font-medium">Ex-Factory Price</td>
        <td className="px-6 py-4 border-b font-bold text-green-600">{vehicle.exFactory}</td>
      </tr>
    </tbody>
  </table>

 
  <div className="md:hidden space-y-4">
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Manufacturer</p>
      <p className="text-gray-800">{vehicle.manufacturer}</p>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Model</p>
      <p className="text-gray-800">{vehicle.model}</p>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Version</p>
      <p className="text-gray-800">{vehicle.version}</p>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-500 font-semibold">Ex-Factory Price</p>
      <p className="text-green-600 font-bold">{vehicle.exFactory}</p>
    </div>
  </div>
</div>



    </div>
    <HoldingCharges />
    <ShowroomCharges />
    <KpkGovtCharges />
    <TotalCharges />
    </>
  );
}
