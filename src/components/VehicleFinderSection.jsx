import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { BASE_URL } from "./Contant/URL";
import { useDispatch, useSelector } from "react-redux";
import { addMake, addModel } from "./Redux/SelectorCarSlice";

const initialState = {
  year: "",
  price: "",
  condition: "all",
};

const VehicleFinderSection = () => {
  const [filters, setFilters] = useState(initialState);
  const [allCars, setAllCars] = useState([]);
  const [allMakes, setAllMakes] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [selectMake, setSelectMake] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = 4;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🧩 Get selected make and model from Redux
  const vehicleData = useSelector((state) => state.carSelector);

  // ✅ Fetch Cars API
  const handleGetCars = async () => {
    try {
      // Use Redux values for make & model (instead of local filter)
      const make = vehicleData.make || "";
      const model = vehicleData.model || "";
      const { condition, year, price } = filters;

      const res = await axios.get(
        `${BASE_URL}/getApprovedVehicles?vehicleCondition=${condition}&make=${make}&model=${model}&year=${year}&buyNowPrice=${price}`
      );

      setAllCars(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Fetch all makes
  const handleGetMakes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBrands`);
      setAllMakes(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Fetch models by selected make
  const handleGetModels = async () => {
    if (!vehicleData.make) return;
    try {
      const res = await axios.get(
        `${BASE_URL}/getModelById/${vehicleData.make}`
      );
      setAllModels(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Fetch selected make details
  const handleSelectMake = async () => {
    if (!vehicleData.make) return;
    try {
      const res = await axios.get(
        `${BASE_URL}/getBrandById/${vehicleData.make}`
      );
      setSelectMake(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Handle change for year/price/condition only (make/model via redux)
  const handleChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  // ✅ Tabs for condition
  const handleTabClick = (tab) => {
    setFilters({ ...filters, condition: tab });
    setStartIndex(0);
  };

  // ✅ Convert makes and models for dropdowns
  const totalMakes = allMakes.map((make) => ({
    label: `${make.brandName} (${make.vehicleCount})`,
    value: make.id,
  }));

  const totalModels = allModels.map((model) => ({
    label: `${model.modelName} (${model.vehicleCount})`,
    value: model.modelName,
  }));

  const calcYearVal = () => {
    const arr = [];
    const currentYear = new Date().getFullYear();
    for (let i = 1970; i <= currentYear; i++) {
      arr.unshift({ label: i.toString(), value: i.toString() });
    }
    return arr;
  };
  const years = calcYearVal();

  // ✅ useEffects
  useEffect(() => {
    handleGetMakes();
  }, []);

  useEffect(() => {
    handleGetModels();
    handleSelectMake();
    handleGetCars(); // 🚀 Fetch new cars whenever make/model changes from Redux
  }, [
    vehicleData.make,
    vehicleData.model,
    filters.condition,
    filters.year,
    filters.price,
  ]);

  // ✅ Render
  return (
    <div className="max-w-7xl mx-auto p-6 font-sans">
      {/* Filters */}
      <div className="flex lg:flex-row flex-col items-center justify-between gap-4 mb-4">
        {/* MAKE */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Make
          </label>
          <Select
            options={[{ label: "Select Make", value: "" }, ...totalMakes]}
            value={
              totalMakes.find(
                (option) => option.value === vehicleData.make
              ) || {
                label: "Select Make",
                value: "",
              }
            }
            onChange={(selected) => {
              dispatch(addMake(selected.value));
              dispatch(addModel(""));
            }}
            placeholder="Select Make"
            isSearchable
          />
        </div>

        {/* MODEL */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Model
          </label>
          <Select
            options={[{ label: "Select Model", value: "" }, ...totalModels]}
            value={
              totalModels.find(
                (option) => option.value === vehicleData.model
              ) || {
                label: "Select Model",
                value: "",
              }
            }
            onChange={(selected) => dispatch(addModel(selected.value))}
            placeholder="Select Model"
            isSearchable
          />
        </div>

        {/* YEAR */}
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
          />
        </div>

        {/* SEARCH BUTTON */}
        <button
          onClick={handleGetCars}
          className="bg-red-600 text-white rounded px-5 py-2 font-semibold  transition w-full md:mt-5 mt-0"
        >
          Search
        </button>
      </div>

      {/* Condition Tabs */}
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

      {/* Car Cards */}
      {allCars.length === 0 ? (
        <div className="text-center text-lg font-semibold text-gray-500">
          No cars found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allCars.slice(startIndex, startIndex + cardsPerPage).map((car) => (
            <div
              key={car.id}
              onClick={() => navigate(`/detailbid/${car.id}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition flex flex-col cursor-pointer"
            >
              <img
                src={car?.images?.[0]}
                alt="car"
                className="w-full h-64 object-cover rounded-t-lg"
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
                <button className="bg-red-600 py-2 text-white text-sm px-3  rounded mt-3 ">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleFinderSection;
