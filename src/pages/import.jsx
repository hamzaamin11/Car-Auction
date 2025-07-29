import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../components/Contant/URL";

const ImportCarForm = ({ handleClose, vehicleId }) => {

  const [make, setMake] = useState("");

  const [model, setModel] = useState("");

  const [allMakes, setAllMakes] = useState([]);

  const [allModels, setAllModels] = useState([]);

  const [year, setYear] = useState("");

  const [name, setName] = useState("");

  const [city, setCity] = useState("");

  const [mobileNumber, setMobile] = useState("");

  const calcYearVal = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 1970; i--) {
      years.push(i);
    }
    return years;
  };

  const currentYearList = calcYearVal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { make, model, year, name, city, mobileNumber };
    try {
      const res = await axios.post(
        `${BASE_URL}/customer/addImportedCar`,
        formData
      );
      console.log("Submitted:", res.data);
      setMake("");
      setModel("");
      setYear("");
      setName("");
      setCity("");
      setMobile("");
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  const handleGetMakes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getMake`);
      setAllMakes(res.data);
    } catch (error) {
      console.error("Get Makes Error:", error);
    }
  };

  const handleGetModels = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getModel`);
      setAllModels(res.data);
    } catch (error) {
      console.error("Get Models Error:", error);
    }
  };



  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    handleGetMakes();
    handleGetModels();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-2xl space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-left text-[#233d7b] mb-6">
            Buy this Car
          </h2>

          <span
            onClick={handleClose}
            className="text-xl pb-10 hover:cursor-pointer"
          >
            X
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Make */}
          <div className="mb-5 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Make*
            </label>
            <select
              name="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Please Select Make</option>
              {allMakes.map((mak) => (
                <option key={mak.make} value={mak.make}>
                  {mak.make}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div className="mb-5 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model*
            </label>
            <select
              name="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Please Select Model</option>
              {allModels.map((mod) => (
                <option key={mod.model} value={mod.model}>
                  {mod.model}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="mb-5 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year*
            </label>
            <select
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Please Select Year</option>
              {currentYearList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div className="mb-5 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name*
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* City */}
          <div className="mb-5 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City*
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your city"
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="mb-5 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number*
            </label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="03xxxxxxxxx"
              pattern="03[0-9]{9}"
              required
            />
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-2">
          I authorize CHAUDHRY Cars Auction to share my contact information with
          its partners to get in touch with me through email, SMS or phone.
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-[#233d7b] text-white px-8 py-2 text-sm font-medium hover:bg-blue-900 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImportCarForm;
