import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomDropdown from "../CustomDropdown";
import axios from "axios";
import { BASE_URL } from "./Contant/URL"; // Adjust path if needed

const WheelBidzAlert = () => {
  // ────── Years (static) ──────
  const searchYears = Array.from({ length: 30 }, (_, i) => ({
    label: (2025 - i).toString(),
    value: (2025 - i).toString(),
  }));

  // ────── Vehicle Type: ONLY "Cars" ──────
  const vehicleTypes = [{ label: "Cars", value: "Cars" }]; // Only one option
  const [selectedVehicleType] = useState(vehicleTypes[0]); // Always "Cars"

  // ────── Form fields ──────
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    agree: false,
  });

  // ────── Dropdown states ──────
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [yearFrom, setYearFrom] = useState(searchYears[10]); // 2015
  const [yearTo, setYearTo] = useState(searchYears[0]);     // 2025

  // ────── Loading states ──────
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // ────── Fetch Brands ──────
  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        const res = await axios.get(`${BASE_URL}/admin/getBrands`);
        const brandOpts = res.data.map((b) => ({
          label: b.brandName,
          value: b.id.toString(),
        }));
        setBrands(brandOpts);

        if (brandOpts.length > 0) {
          setSelectedMake(brandOpts[0]);
        }
      } catch (err) {
        console.error("Failed to load brands:", err);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  // ────── Fetch Models when Make changes ──────
  useEffect(() => {
    if (!selectedMake) return;

    const fetchModels = async () => {
      setLoadingModels(true);
      setModels([]);
      setSelectedModel(null);

      try {
        const res = await axios.get(
          `${BASE_URL}/getModelById/${selectedMake.value}`
        );
        const modelOpts = res.data.map((m) => ({
          label: m.modelName,
          value: m.modelId.toString(),
        }));
        setModels(modelOpts);

        if (modelOpts.length > 0) {
          setSelectedModel(modelOpts[0]);
        }
      } catch (err) {
        console.error("Failed to load models:", err);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [selectedMake]);

  // ────── Input handlers ──────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", {
      ...formData,
      selectedVehicleType,
      selectedMake,
      selectedModel,
      yearFrom,
      yearTo,
    });
  };

  // ────── Render ──────
  return (
    <div className="flex flex-col md:flex-row bg-gray-100 p-8 rounded-lg shadow-md">
      {/* LEFT – Info */}
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

      {/* RIGHT – Form */}
      <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-inner">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">
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

          {/* Vehicle Type: Only "Cars" */}
          <CustomDropdown
            label="Vehicle Type"
            options={vehicleTypes}
            value={selectedVehicleType}
            disabled
          />

          {/* Year Range */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col w-40">
              <label className="text-sm font-medium text-gray-800">From Year</label>
              <CustomDropdown
                options={searchYears}
                value={yearFrom}
                onChange={setYearFrom}
              />
            </div>
            <div className="flex flex-col w-40">
              <label className="text-sm font-medium text-gray-800">To Year</label>
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
            options={brands}
            value={selectedMake}
            onChange={setSelectedMake}
            placeholder={loadingBrands ? "Loading brands…" : "Select a make"}
            disabled={loadingBrands}
          />

          {/* Model Dropdown */}
          <CustomDropdown
            label="Model"
            options={models}
            value={selectedModel}
            onChange={setSelectedModel}
            placeholder={
              loadingModels
                ? "Loading models…"
                : models.length === 0
                ? "No models for this make"
                : "Select a model"
            }
            disabled={loadingModels || models.length === 0}
          />

          {/* First Name */}
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-800">
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

          {/* Last Name */}
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-800">
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

          {/* Consent */}
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
              className="w-full block text-center bg-blue-950 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-md transition"
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