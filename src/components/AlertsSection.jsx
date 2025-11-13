import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomDropdown from "../CustomDropdown";

const WheelBidzAlert = () => {
  // Years
  const searchYears = Array.from({ length: 30 }, (_, i) => ({
    label: (2025 - i).toString(),
    value: (2025 - i).toString(),
  }));

  // Vehicle Types
  const vehicleTypes = [
    "All Types",
    "Agricultural",
    "Boats",
    "Caravan",
    "Commercial Under 7.5T",
    "HGV",
    "Jet Ski",
    "RV",
    "Vehicles Under 7.5T",
  ].map((item) => ({ label: item, value: item }));

  // Makes
  const staticMakes = [
    "Toyota",
    "Honda",
    "Ford",
    "BMW",
    "Mercedes",
    "Audi",
    "Hyundai",
    "Kia",
    "Nissan",
    "Chevrolet",
  ].map((item) => ({ label: item, value: item }));

  // Models
  const staticModels = [
    "Tesla Model Y",
    "Toyota RAV4/Wildlander",
    "Honda CR-V/Breeze",
    "Toyota Corolla",
    "Toyota Camry",
    "Ford F-150",
    "Toyota Hilux",
    "Nissan Sentra",
    "Tesla Model 3",
  ].map((item) => ({ label: item, value: item }));

  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    agree: false,
  });

  const [selectedVehicleType, setSelectedVehicleType] = useState(vehicleTypes[0]);
  const [selectedMake, setSelectedMake] = useState(staticMakes[0]);
  const [selectedModel, setSelectedModel] = useState(staticModels[0]);
  const [yearFrom, setYearFrom] = useState(searchYears[10]);
  const [yearTo, setYearTo] = useState(searchYears[0]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", {
      ...formData,
      selectedVehicleType,
      selectedMake,
      selectedModel,
      yearFrom,
      yearTo,
    });
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 p-8 rounded-lg shadow-md">
      {/* Left Section */}
      <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
        <h2 className="text-2xl text-gray-800 font-bold mb-6 mt-6">
          Don’t see the vehicle you want? Sign up for WheelBidz Vehicle Alerts.
        </h2>
        <p className="mb-6 text-gray-800">
          Vehicle Alerts are emails notifying you of the latest vehicles we add
          to our inventory based on what you're looking for.
        </p>
        <p className="mb-6 text-gray-800">
          You can cancel alerts at any time or change the frequency to suit your
          needs. You can also set up as many alerts as you want.
        </p>
        <p className="mb-6 text-gray-800">
          By signing up for Vehicle Alerts, you are consenting to receive
          Vehicle Alert emails.
        </p>
        <p className="mb-6 text-gray-800">
          Please note: to unsubscribe from all alerts, you will need to
          unsubscribe from each one individually.
        </p>

        <img
          src="/alertmessage.jpg"
          alt="Vehicle Alerts"
          className="w-full h-auto rounded-md shadow-md mt-10"
        />
      </div>

      {/* Right Section - Form */}
      <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-inner">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-700 rounded-md shadow-sm p-2 focus:ring-1 focus:ring-blue-900 focus:outline-none"
              placeholder="your@example.com"
            />
          </div>

          {/* Vehicle Type Dropdown */}
          <CustomDropdown
            label="Vehicle Type"
            options={vehicleTypes}
            value={selectedVehicleType}
            onChange={setSelectedVehicleType}
          />

          {/* Year Range */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col w-40">
              <label className="text-sm font-medium text-gray-800">
                From Year
              </label>
              <CustomDropdown
                options={searchYears}
                value={yearFrom}
                onChange={setYearFrom}
              />
            </div>

            <div className="flex flex-col w-40">
              <label className="text-sm font-medium text-gray-800">
                To Year
              </label>
              <CustomDropdown
                options={searchYears}
                value={yearTo}
                onChange={setYearTo}
              />
            </div>
          </div>

          {/* Make Dropdown */}
          <CustomDropdown
            label="Make"
            options={staticMakes}
            value={selectedMake}
            onChange={setSelectedMake}
          />

          {/* Model Dropdown */}
          <CustomDropdown
            label="Model"
            options={staticModels}
            value={selectedModel}
            onChange={setSelectedModel}
          />

          {/* First & Last Name */}
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-800"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              required
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-700 rounded-md shadow-sm p-2 focus:ring-1 focus:ring-blue-900 focus:outline-none"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-800"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              required
              value={formData.lastname}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-700 rounded-md shadow-sm p-2 focus:ring-1 focus:ring-blue-900 focus:outline-none"
              placeholder="Enter your last name"
            />
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="agree"
              id="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-700 rounded"
            />
            <label htmlFor="agree" className="ml-2 text-sm text-gray-900">
              Yes, I consent to WheelBidz sending me Vehicle Alert emails. I may
              cancel anytime using the unsubscribe function.
            </label>
          </div>

          {/* Submit */}
          <div className="w-full">
            <Link
              to="/register"
              className="w-full block text-center bg-blue-950 text-white font-semibold py-2 px-4 rounded-md"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WheelBidzAlert;
