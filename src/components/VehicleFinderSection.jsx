import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select"; // Import react-select for searchable dropdowns
import { BASE_URL } from "./Contant/URL";

const initialState = {
  model: "",
  make: "",
  year: "",
  price: "",
  condition: "all",
};

const VehicleFinderSection = () => {
  const [filters, setFilters] = useState(initialState);

  console.log("filter data =>", filters);

  const [allCars, setAllCars] = useState([]);
  const [allMakes, setAllMakes] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [selectMake, setSelectMake] = useState(null);

  console.log("all Selected make", selectMake);

  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = 4;

  const navigate = useNavigate();

  // Fetch cars from API
  const handleGetCars = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getApprovedVehicles?vehicleCondition=${filters.condition}&make=${filters.make}&model=${filters.model}&year=${filters.year}&buyNowPrice=${filters.price}`
      );
      setAllCars(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all makes
  const handleGetMakes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBrands`);
      setAllMakes(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch selected make details
  const handleSelectMake = async () => {
    if (!filters.make) return;
    try {
      const res = await axios.get(`${BASE_URL}/getBrandById/${filters.make}`);
      setSelectMake(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch models based on selected make
  const handleGetModels = async () => {
    if (!filters.make) return;
    try {
      const res = await axios.get(`${BASE_URL}/getModelById/${filters.make}`);
      setAllModels(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Update state from form
  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabClick = (tab) => {
    setFilters({ ...filters, condition: tab });
    setStartIndex(0);
  };

  // Transform makes for react-select
  const totalMakes = allMakes.map((make) => ({
    label: make.brandName,
    value: make.id,
  }));

  // Transform models for react-select
  const totalModels = allModels.map((model) => ({
    label: model.modelName,
    value: model.modelName,
  }));

  // Generate years for react-select
  const calcYearVal = () => {
    const possibleYearValue = [];
    const currentYear = new Date().getFullYear();
    for (let i = 1970; i <= currentYear; i++) {
      possibleYearValue.unshift({ label: i.toString(), value: i.toString() });
    }
    return possibleYearValue;
  };
  const years = calcYearVal();

  // Generate prices (not used in this version, but kept for consistency)
  const generateCarPrices = () => {
    const prices = [];
    const start = 1000000;
    const end = 200000000;
    const step = 2000000;
    for (let price = start; price <= end; price += step) {
      prices.push(price);
    }
    return prices;
  };
  const allPrices = generateCarPrices();

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <span className="text-yellow-400 text-lg">
        {"★".repeat(fullStars)}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  const prevCards = () => {
    setStartIndex((prev) =>
      prev - cardsPerPage < 0
        ? Math.max(allCars.length - cardsPerPage, 0)
        : prev - cardsPerPage
    );
  };

  const nextCards = () => {
    setStartIndex((prev) =>
      prev + cardsPerPage >= allCars.length ? 0 : prev + cardsPerPage
    );
  };

  // useEffect calls
  useEffect(() => {
    handleGetCars();
    handleGetMakes();
    handleGetModels();
  }, [
    filters.condition,
    filters.make,
    filters.model,
    filters.year,
    filters.price,
  ]);

  useEffect(() => {
    handleSelectMake();
  }, [filters.make]);

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans">
      {/* Filters */}

      <div className="flex lg:flex-row flex-col items-center justify-between gap-4 mb-4">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Make
          </label>
          <Select
            options={[{ label: "Select Make", value: "" }, ...totalMakes]}
            value={
              totalMakes.find((option) => option.value === filters.make) || {
                label: "Select Make",
                value: "",
              }
            }
            onChange={(selected) => handleChange("make", selected.value)}
            placeholder="Select Make"
            isSearchable
            className="w-full"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Model
          </label>
          <Select
            options={[{ label: "Select Model", value: "" }, ...totalModels]}
            value={
              totalModels.find((option) => option.value === filters.model) || {
                label: "Select Model",
                value: "",
              }
            }
            onChange={(selected) => handleChange("model", selected.value)}
            placeholder="Select Model"
            isSearchable
            className="w-full"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Year
          </label>
          <Select
            options={[{ label: "Select Year", value: "" }, ...years]}
            value={
              years.find((option) => option.value === filters.year) || {
                label: "Select Year",
                value: "",
              }
            }
            onChange={(selected) => handleChange("year", selected.value)}
            placeholder="Select Year"
            isSearchable
            className="w-full"
          />
        </div>
        <button
          onClick={handleGetCars}
          className="bg-[#b73439] text-white rounded px-5 py-2 font-semibold hover:bg-[#518ecb] transition w-full md:mt-5 mt-0"
        >
          Search
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 justify-center">
        {["all", "new", "used"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-5 py-2 font-semibold uppercase tracking-wide ${
              filters.condition === tab
                ? "bg-[#233d7b] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-[#233d7b] hover:text-white transition"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Cars */}
      {allCars.length === 0 ? (
        <div className="flex items-center justify-center text-xl font-bold text-gray-500">
          No car found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allCars.slice(startIndex, startIndex + cardsPerPage).map((car) => (
            <div
              key={car.id}
              onClick={() => navigate(`/detailbid/${car.id}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 flex flex-col hover:cursor-pointer"
            >
              <img
                src={car?.images?.[0]}
                alt="car"
                className="w-full h-64 object-cover rounded-t-lg bg-white"
              />

              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-gray-700 font-semibold mb-1">
                    Price: PKR {car.buyNowPrice}
                  </p>
                  <p className="text-sm font-semibold text-gray-600">
                    Condition:{" "}
                    <span
                      className={
                        car.vehicleCondition === "new"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {car.vehicleCondition?.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Model Year: <span>{car.year}</span>
                  </p>
                </div>

                <div className="mt-3 flex justify-between">
                  <button className="bg-[#b73439] text-white text-sm px-3 py-1 rounded hover:bg-red-700">
                    Detail View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevCards}
          className="bg-blue-950 text-white px-5 py-2 rounded "
        >
          ‹ Prev
        </button>
        <button
          onClick={nextCards}
          className="bg-blue-950 text-white px-5 py-2 rounded "
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

export default VehicleFinderSection;
