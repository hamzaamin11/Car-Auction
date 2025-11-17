import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "./Contant/URL";
import { addMake, addModel } from "./Redux/SelectorCarSlice";
import CustomDropdown from "../CustomDropdown";
import numberToWords from "number-to-words";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BodyType = [
  { label: "Mini Vehicles", value: "Mini Vehicles" },
  { label: "Van", value: "Van" },
  { label: "Truck", value: "Truck" },
  { label: "SUV", value: "SUV" },
  { label: "Subcompact hatchback", value: "Subcompact hatchback" },
  { label: "Station Wagon", value: "Station Wagon" },
  { label: "Single Cabin", value: "Single Cabin" },
  { label: "Sedan", value: "Sedan" },
  { label: "Pick Up", value: "Pick Up" },
  { label: "Off-Road Vehicles", value: "Off-Road Vehicles" },
  { label: "MPV", value: "MPV" },
  { label: "Compact hatchback", value: "Compact hatchback" },
  { label: "Mini Van", value: "Mini Van" },
  { label: "Micro Van", value: "Micro Van" },
  { label: "High Roof", value: "High Roof" },
  { label: "Hatchback", value: "Hatchback" },
  { label: "Double Cabin", value: "Double Cabin" },
  { label: "Crossover", value: "Crossover" },
  { label: "Coupe", value: "Coupe" },
  { label: "Convertible", value: "Convertible" },
  { label: "Compact SUV", value: "Compact SUV" },
  { label: "Compact sedan", value: "Compact sedan" },
];

const initialState = {
  year: "",
  fromYear: "",
  toYear: "",
  formCash: "",
  toCash: "",
  location: "",
  vehicleType: "",
  condition: "all",
};

const VehicleFinderSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filters, setFilters] = useState(initialState);
  const [allCars, setAllCars] = useState([]);
  const [allMakes, setAllMakes] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [sorting, setSorting] = useState("low");
  const [years, setYears] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 4;

  const vehicleData = useSelector((state) => state.carSelector);

  const handleChange = (name, val) => {
    setFilters((prev) => ({ ...prev, [name]: val }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleGetCars = async () => {
    try {
      const {
        condition,
        toCash,
        formCash,
        fromYear,
        toYear,
        vehicleType,
        location,
      } = filters;

      const make = vehicleData.make || "";
      const model = vehicleData.model || "";

      const res = await axios.get(
        `${BASE_URL}/getApprovedVehicles?vehicleCondition=${condition}&make=${make}&model=${model}&minPrice=${formCash}&maxPrice=${toCash}&sortType=${sorting}&yearStart=${fromYear}&yearEnd=${toYear}&bodyStyle=${vehicleType}&locationId=${location}`
      );

      setAllCars(res.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetYear = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/fetchVehicleYears`);
      const formattedYears = res.data.map((year) => ({
        label: year,
        value: year,
      }));
      setYears(formattedYears);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`);
      setAllCities(res.data);
    } catch (error) {
      console.log("Error fetching cities:", error);
      setAllCities([]);
    }
  };

  const handleGetMakes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBrands`);
      setAllMakes(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetModels = async () => {
    if (!vehicleData.make) {
      setAllModels([]);
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/getModelById/${vehicleData.make}`);
      setAllModels(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    handleChange("condition", tab);
  };

  const cityOptions = useMemo(
    () =>
      allCities.map((city) => ({
        label: city.cityName,
        value: city.id,
      })),
    [allCities]
  );

  const convertToPakistaniWords = (number) => {
    if (!number || isNaN(number)) return "";
    const num = Number(number);

    const toWords = (n) => (n === 0 ? "" : numberToWords.toWords(n));

    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;

    let result = [];
    if (crore > 0) result.push(`${toWords(crore)} crore${crore > 1 ? "s" : ""}`);
    if (lakh > 0) result.push(`${toWords(lakh)} lakh${lakh > 1 ? "s" : ""}`);
    if (thousand > 0) result.push(`${toWords(thousand)} thousand`);
    if (remainder > 0) result.push(toWords(remainder));

    return result.length === 0 ? "" : result.join(" ");
  };

  useEffect(() => {
    handleGetMakes();
    handleGetYear();
    handleGetAllCities();
  }, []);

  useEffect(() => {
    handleGetModels();
  }, [vehicleData.make]);

  useEffect(() => {
    handleGetCars();
  }, [
    vehicleData.make,
    vehicleData.model,
    filters.condition,
    filters.toYear,
    filters.formCash,
    filters.toCash,
    filters.location,
    filters.vehicleType,
    filters.fromYear,
    sorting,
  ]);

  const totalMakes = allMakes.map((m) => ({
    label: `${m.brandName} (${m.vehicleCount})`,
    value: m.id,
  }));

  const totalModels = allModels.map((m) => ({
    label: `${m.modelName} (${m.vehicleCount})`,
    value: m.modelName,
  }));

  // === Pagination Logic ===
  const totalPages = Math.ceil(allCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = allCars.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="px-2 flex font-sans">
      {/* ===========================
        LEFT FILTER
      ============================ */}
      <div className="finder-box bg-white shadow p-5 rounded-lg">
        <h2 className="text-xl font-bold text-gray-700 mb-3">Vehicle Finder</h2>

        {/* Condition Tabs */}
        <div className="flex space-x-2 mb-4">
          {["all", "used", "new"].map((t) => (
            <button
              key={t}
              onClick={() => handleTabClick(t)}
              className={`flex-1 py-2 rounded font-semibold ${
                activeTab === t
                  ? "bg-blue-950 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Body Type */}
        <div className="mb-3">
          <label className="text-sm font-semibold">Body Type</label>
          <CustomDropdown
            options={[{ label: "All Types", value: "" }, ...BodyType]}
            value={BodyType.find((o) => o.value === filters.vehicleType)}
            onChange={(s) => handleChange("vehicleType", s.value)}
            isSearchable
          />
        </div>

        {/* Year Range */}
        <div className="flex gap-2 mb-3">
          <div className="w-48">
            <label className="text-sm font-semibold">From Year</label>
            <CustomDropdown
              options={[{ label: "From", value: "" }, ...years]}
              value={years.find((y) => y.value === filters.fromYear)}
              onChange={(s) => handleChange("fromYear", s.value)}
            />
          </div>
          <div className="w-48">
            <label className="text-sm font-semibold">To Year</label>
            <CustomDropdown
              options={[{ label: "To", value: "" }, ...years]}
              value={years.find((y) => y.value === filters.toYear)}
              onChange={(s) => handleChange("toYear", s.value)}
            />
          </div>
        </div>

        {/* Make */}
        <div className="mb-3">
          <label className="text-sm font-semibold">Make</label>
          <CustomDropdown
            options={[{ label: "Select Make", value: "" }, ...totalMakes]}
            value={totalMakes.find((o) => o.value === vehicleData.make)}
            onChange={(s) => {
              dispatch(addMake(s.value));
              dispatch(addModel(""));
            }}
          />
        </div>

        {/* Model */}
        <div className="mb-3">
          <label className="text-sm font-semibold">Model</label>
          <CustomDropdown
            options={[{ label: "Select Model", value: "" }, ...totalModels]}
            value={totalModels.find((o) => o.value === vehicleData.model)}
            onChange={(s) => dispatch(addModel(s.value))}
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <label className="text-sm font-semibold">Location</label>
          <CustomDropdown
            options={[{ label: "Select City", value: "" }, ...cityOptions]}
            value={cityOptions.find((o) => o.value === filters.location)}
            onChange={(s) => handleChange("location", s.value)}
          />
        </div>

        {/* Price */}
        <div className="relative w-full max-w-sm mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter Price
          </label>
          <div className="flex flex-col md:flex-col lg:flex-row w-full gap-2">
            <div className="w-full">
              <input
                className="border p-2 rounded w-full"
                name="formCash"
                value={filters.formCash}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 9) {
                    handleChange("formCash", value);
                  }
                }}
                placeholder="From"
              />
              {filters.formCash && (
                <p className="text-sm text-red-500 font-semibold mt-1 capitalize">
                  {convertToPakistaniWords(filters.formCash)}
                </p>
              )}
            </div>
            <div className="w-full">
              <input
                className="border p-2 rounded w-full"
                name="toCash"
                value={filters.toCash}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 9) {
                    handleChange("toCash", value);
                  }
                }}
                placeholder="To"
              />
              {filters.toCash && (
                <p className="text-sm text-red-500 font-semibold mt-1 capitalize">
                  {convertToPakistaniWords(filters.toCash)}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleGetCars}
          className="bg-blue-950 text-white py-2 w-full rounded"
        >
          Search Vehicle
        </button>
      </div>

      {/* ===========================
            CAR LISTING
      ============================ */}
      <div className="mt-4 w-full px-5">
        {/* Header: Count + Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h1 className="text-black font-bold text-lg sm:text-xl">
            {allCars.length} Vehicles For Sale   
          </h1>

          <select
            className="border p-2 text-sm rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer"
            onChange={(e) => {
              setSorting(e.target.value);
              setCurrentPage(1);
            }}
            value={sorting}
          >
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="year_desc">Year: Newest to Oldest</option>
            <option value="year_asc">Year: Oldest to Newest</option>
          </select>
        </div>

        {/* Car Cards */}
        <div className="space-y-4">
          {currentCars.length > 0 ? (
            currentCars.map((car) => (
              <div
                key={car.id}
                onClick={() => navigate(`/detailbid/${car.id}`)}
                className={`relative my-3 flex bg-white rounded-lg shadow hover:shadow-lg cursor-pointer overflow-hidden ${
                  car.certifyStatus === "Certified"
                    ? "border border-green-400 bg-green-50"
                    : ""
                }`}
              >
                {/* Certified Badge */}
                {car.certifyStatus === "Certified" && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    Certified
                  </div>
                )}

                {/* Car Image */}
                <div className="w-full md:w-48 h-40 md:h-40 overflow-hidden">
                  <img
                    src={car?.images?.[0] || "/placeholder.png"}
                    alt={car.make}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Car Details */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3
                      className={`font-semibold ${
                        car.certifyStatus === "Certified"
                          ? "text-green-700"
                          : "text-gray-800"
                      }`}
                    >
                      {car.make} {car.model} {car.series || ""} {car.engine || ""}{" "}
                      for sale
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Lot # {car.lot_number}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{car.cityName}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded-full shadow-sm">
                        {car.year}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded-full shadow-sm">
                        {car.mileage} km
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded-full shadow-sm">
                        {car.fuelType}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded-full shadow-sm">
                        {car.bodyStyle}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded-full shadow-sm">
                        {car.color}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded-full shadow-sm">
                        {car.transmission}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end">
                    <span className="text-lg font-bold text-gray-800">
                      PKR {car.buyNowPrice} Lac
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No vehicles found.</p>
          )}
        </div>

        {/* === Pagination Controls === */}
 {totalPages > 1 && (
  <div className="flex justify-between items-center mt-6 pb-5">
    <button
      onClick={goToPrevPage}
      disabled={currentPage === 1}
      className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-all ${
        currentPage === 1
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-950 text-white "
      }`}
    >
      <ChevronLeft size={18} />
      Prev
    </button>

   

    <button
      onClick={goToNextPage}
      disabled={currentPage === totalPages}
      className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-all ${
        currentPage === totalPages
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-950 text-white "
      }`}
    >
      Next
      <ChevronRight size={18} />
    </button>
  </div>
)}
      </div>
    </div>
  );
};

export default VehicleFinderSection;