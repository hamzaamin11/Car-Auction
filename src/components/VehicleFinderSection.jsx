import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "./Contant/URL";
import { addMake, addModel } from "./Redux/SelectorCarSlice";
import CustomDropdown from "../CustomDropdown";
import numberToWords from "number-to-words";
import { FaHeart } from "react-icons/fa";
import Swal from "sweetalert2";
import { addInList } from "./Redux/WishlistSlice";

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
  lot: "",
  condition: "all",
};

const budgetData = [
  { label: "5–10 Lac", min: 500000, max: 1000000 },
  { label: "10–20 Lac", min: 1000000, max: 2000000 },
  { label: "20–40 Lac", min: 2000000, max: 4000000 },
  { label: "40–60 Lac", min: 4000000, max: 6000000 },
  { label: "60–80 Lac", min: 6000000, max: 8000000 },
  { label: "80 Lac – 1 Crore", min: 8000000, max: 10000000 },
  { label: "1 – 2 Crore", min: 10000000, max: 20000000 },
  { label: "2 – 5 Crore", min: 20000000, max: 50000000 },
  { label: "5 – 10 Crore", min: 50000000, max: 100000000 },
  { label: "10 – 20 Crore", min: 100000000, max: 200000000 },
  { label: "20 – 50 Crore", min: 200000000, max: 500000000 },
  { label: "50 – 99 Crore", min: 500000000, max: 990000000 },
];

const VehicleFinderSection = () => {
  const currentUser = useSelector((state) => state?.auth?.currentUser);
  const wishlistByUser = useSelector(
    (state) => state?.wishList?.wishlistByUser || {}
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filters, setFilters] = useState(initialState);
  // Add this state (you already have selectedYearRange, just rename or keep both)
  const [quickYearFilter, setQuickYearFilter] = useState(""); // e.g., "2024-2025"
  const [allCars, setAllCars] = useState([]);
  const [allMakes, setAllMakes] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [sorting, setSorting] = useState("low");
  const [years, setYears] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [carsPerPage, setCarsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYearRange, setSelectedYearRange] = useState(""); // e.g., "2024-2025"

  const [yearRanges, setYearRanges] = useState([]); // dynamic ranges
  const vehicleData = useSelector((state) => state.carSelector);
  const [filterPrice, setFilterPrice] = useState({
    budget: { min: "", max: "" },
  });

  // Helper: Check if a car is already in user's wishlist
  const isCarInWishlist = (carId) => {
    if (!currentUser?.id) return false;
    const userWishlist = wishlistByUser[currentUser.id] || [];
    return userWishlist.some((item) => item.id === carId);
  };

  const handleWishlist = (car) => {
    if (!currentUser) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to add vehicles to your wishlist.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (isCarInWishlist(car.id)) {
      return; // Already added
    }

    dispatch(addInList({ userId: currentUser.id, vehicle: car }));
  };

  const handleChange = (name, val) => {
    setFilters((prev) => ({ ...prev, [name]: val }));
    setCurrentPage(1);
  };

  const handleGetCars = async () => {
    try {
      let { condition, vehicleType, location, lot } = filters;

      // Initialize year and price variables
      let fromYear = "";
      let toYear = "";
      let formCash = "";
      let toCash = "";

      // Priority 1: Use quickYearFilter if selected (from Sort By dropdown)
      if (quickYearFilter && quickYearFilter !== "") {
        const selected = yearRanges.find((r) => r.value === quickYearFilter);
        if (selected) {
          fromYear = selected.from.toString();
          toYear = selected.to.toString();
        }
      }
      // Priority 2: Use sidebar filters if quickYearFilter is not set
      else {
        fromYear = filters.fromYear || "";
        toYear = filters.toYear || "";
      }

      // Use filterPrice for budget (from Sort By dropdown)
      if (filterPrice.budget.min && filterPrice.budget.max) {
        formCash = filterPrice.budget.min;
        toCash = filterPrice.budget.max;
      }
      // Fallback to manual inputs from sidebar
      else {
        formCash = filters.formCash || "";
        toCash = filters.toCash || "";
      }

      const make = vehicleData.make || "";
      const model = vehicleData.model || "";

      if (lot.length === 4) {
        navigate(`/detailbid/${lot}`);
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/getApprovedVehicles/${currentUser?.role}?vehicleCondition=${condition}&make=${make}&model=${model}&minPrice=${formCash}&maxPrice=${toCash}&sortType=${sorting}&yearStart=${fromYear}&yearEnd=${toYear}&bodyStyle=${vehicleType}&locationId=${location}&lot_number=${lot}`
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
      const apiYears = res.data
        .map((year) => parseInt(year))
        .sort((a, b) => b - a); // newest first

      const formattedYears = apiYears.map((year) => ({
        label: year.toString(),
        value: year.toString(),
      }));
      setYears(formattedYears);

      // Generate Year Ranges like 2024-2025, 2023-2024, etc.
      const yearRanges = [];
      for (let i = 0; i < apiYears.length - 1; i++) {
        const start = apiYears[i + 1]; // older year
        const end = apiYears[i]; // newer year
        yearRanges.push({
          label: `${start}-${end}`,
          value: `${start}-${end}`,
          from: start,
          to: end,
        });
      }
      // Add "Before oldest" option
      if (apiYears.length > 0) {
        const oldest = Math.min(...apiYears);
        yearRanges.push({
          label: `Before ${oldest}`,
          value: `1900-${oldest - 1}`,
          from: 1900,
          to: oldest - 1,
        });
      }
      setYearRanges(yearRanges); // ← We'll create this state below
    } catch (error) {
      console.log(error);
    }
  };
  const handleYearRangeChange = (e) => {
    const value = e.target.value;
    setSelectedYearRange(value);

    if (!value || value === "all-years") {
      setFilters((prev) => ({ ...prev, fromYear: "", toYear: "" }));
      return;
    }

    const selected = yearRanges.find((range) => range.value === value);
    if (selected) {
      setFilters((prev) => ({
        ...prev,
        fromYear: selected.from.toString(),
        toYear: selected.to.toString(),
      }));
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

  const handleFilterPrice = (e) => {
    const { value } = e.target;
    const [min, max] = value.split("-").map(Number);
    setFilterPrice({
      budget: { min, max },
    });
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
      const res = await axios.get(
        `${BASE_URL}/getModelById/${vehicleData.make}`
      );
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
        label: city.cityName.charAt(0).toUpperCase() + city.cityName.slice(1),
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
    if (crore > 0)
      result.push(`${toWords(crore)} crore${crore > 1 ? "s" : ""}`);
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
    if (filters.fromYear || filters.toYear) {
      setQuickYearFilter("");
    }
  }, [filters.fromYear, filters.toYear]);

  useEffect(() => {
    handleGetCars();
  }, [
    vehicleData.make,
    vehicleData.model,
    filters.condition,
    filters.toYear,
    filters.fromYear,
    filterPrice.budget.min,
    filterPrice.budget.max,
    filters.location,
    filters.vehicleType,
    sorting,
    quickYearFilter,
  ]);

  const totalMakes = allMakes.map((m) => ({
    label: `${m.brandName} (${m.vehicleCount})`,
    value: m.id,
  }));

  const totalModels = allModels.map((m) => ({
    label: `${m.modelName} (${m.vehicleCount})`,
    value: m.modelName,
  }));

  // Pagination
  const totalPages = Math.ceil(allCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = Math.min(startIndex + carsPerPage, allCars.length);
  const currentCars = allCars.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4 gap-4">
      {/* SIDEBAR - Vehicle Finder */}
      <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-bold text-gray-600">Vehicle Finder</h2>

        {/* Tabs */}
        <div className="flex space-x-2">
          {["All", "Used", "New"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab.toLowerCase())}
              className={`flex-1 py-2 rounded text-sm font-semibold ${
                activeTab === tab.toLowerCase()
                  ? "bg-blue-950 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Body Style */}
        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Body Style
          </label>
          <CustomDropdown
            options={[...BodyType]}
            value={BodyType.find((o) => o.value === filters.vehicleType)}
            onChange={(s) => handleChange("vehicleType", s ? s.value : "")}
            placeholder="Select Body Style"
            isSearchable
            className="w-full"
            styles={{
              singleValue: (provided, state) => ({
                ...provided,
                color: state.data.value === "" ? "#d1d5db" : "#111827",
              }),
            }}
          />
        </div>

        {/* Year Range */}
        <div className="flex w-full gap-2">
          <div className="relative w-[186px] max-w-sm">
            <label className="block text-sm font-medium text-gray-700">
              From Year
            </label>
            <CustomDropdown
              options={[...years]}
              value={years.find((y) => y.value === filters.fromYear)}
              onChange={(s) => handleChange("fromYear", s ? s.value : "")}
              placeholder="Select Year"
              isSearchable
              className="w-full"
              styles={{
                singleValue: (provided, state) => ({
                  ...provided,
                  color: state.data.value === "" ? "#d1d5db" : "#111827",
                }),
              }}
            />
          </div>
          <div className="relative w-48 max-w-sm">
            <label className="block text-sm font-medium text-gray-700">
              To Year
            </label>
            <CustomDropdown
              options={[...years]}
              value={years.find((y) => y.value === filters.toYear)}
              onChange={(s) => handleChange("toYear", s ? s.value : "")}
              placeholder="To Year"
              isSearchable
              className="w-full"
              styles={{
                singleValue: (provided, state) => ({
                  ...provided,
                  color: state.data.value === "" ? "#d1d5db" : "#111827",
                }),
              }}
            />
          </div>
        </div>

        {/* Make */}
        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Make
          </label>
          <CustomDropdown
            options={[...totalMakes]}
            value={totalMakes.find((o) => o.value === vehicleData.make)}
            onChange={(s) => {
              dispatch(addMake(s ? s.value : ""));
              dispatch(addModel(""));
            }}
            placeholder="Select Make"
            isSearchable
            className="w-full"
            styles={{
              singleValue: (provided, state) => ({
                ...provided,
                color: state.data.value === "" ? "#d1d5db" : "#111827",
              }),
            }}
          />
        </div>

        {/* Model */}
        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Model
          </label>
          <CustomDropdown
            options={[...totalModels]}
            value={totalModels.find((o) => o.value === vehicleData.model)}
            onChange={(s) => dispatch(addModel(s ? s.value : ""))}
            placeholder="Select Model"
            isSearchable
            className="w-full"
            styles={{
              singleValue: (provided, state) => ({
                ...provided,
                color: state.data.value === "" ? "#d1d5db" : "#111827",
              }),
            }}
          />
        </div>

        {/* Location */}
        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Location
          </label>
          <CustomDropdown
            options={[...cityOptions]}
            value={cityOptions.find((o) => o.value === filters.location)}
            onChange={(s) => handleChange("location", s ? s.value : "")}
            placeholder="Select Location"
            isSearchable
            className="w-full"
            styles={{
              singleValue: (provided, state) => ({
                ...provided,
                color: state.data.value === "" ? "#d1d5db" : "#111827",
              }),
            }}
          />
        </div>

        {/* Price Filter */}
        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter Price
          </label>
          <div className="flex flex-col md:flex-col lg:flex-row w-full gap-2">
            <div className="w-full">
              <input
                className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-900"
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
                className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-900"
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

        <div className="flex items-center w-full">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-sm font-medium text-gray-700">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lot #
          </label>
          <div className="flex flex-col md:flex-col lg:flex-row w-full gap-2">
            <div className="w-full">
              <input
                className="border p-2 rounded w-full"
                value={filters.lot}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val) && val.length <= 4) {
                    handleChange("lot", val);
                  }
                }}
                placeholder="Lookup by Lot Number"
                max={4}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center relative w-full max-w-sm">
          <button
            onClick={handleGetCars}
            className="bg-blue-950 hover:bg-blue-900 w-full p-2 px-10 text-white rounded hover:cursor-pointer"
          >
            Search Vehicle
          </button>
        </div>
      </div>

      {/* CAR LISTING */}
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h1 className="text-black font-bold text-lg sm:text-xl">
            {allCars.length} Vehicles For Sale
          </h1>

          <div className="flex items-center gap-2">
            <div className="font-semibold whitespace-nowrap">Sort By</div>

            <div className="flex gap-3 w-full max-w-4xl">
              {/* 1. Budget - Native Select (as requested) */}
              <div className="flex-1 min-w-0">
                <select
                  className="w-full border border-black text-black focus:border-blue-900 focus:ring-1 focus:ring-blue-900 rounded-lg px-4 py-2.5 text-sm cursor-pointer bg-white outline-none transition-all"
                  value={
                    filterPrice.budget.min
                      ? `${filterPrice.budget.min}-${filterPrice.budget.max}`
                      : ""
                  }
                  onChange={(e) => {
                    if (!e.target.value) {
                      setFilterPrice((prev) => ({
                        ...prev,
                        budget: { min: "", max: "" },
                      }));
                    } else {
                      const [min, max] = e.target.value.split("-").map(Number);
                      setFilterPrice((prev) => ({
                        ...prev,
                        budget: { min, max },
                      }));
                    }
                  }}
                >
                  <option value="">All Budgets</option>
                  {budgetData.map((b) => (
                    <option
                      key={`${b.min}-${b.max}`}
                      value={`${b.min}-${b.max}`}
                    >
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Year Range - Native Select + Fully Independent */}
              <div className="flex-1 min-w-0">
                <select
                  className="w-full border border-black text-black focus:border-blue-900 focus:ring-1 focus:ring-blue-900 rounded-lg px-4 py-2.5 text-sm cursor-pointer bg-white outline-none transition-all"
                  value={quickYearFilter}
                  onChange={(e) => {
                    setQuickYearFilter(e.target.value);
                  }}
                >
                  <option value="">All Years</option>
                  {yearRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Sort Order - Native Select */}
              <div className="flex-1 min-w-0">
                <select
                  className="w-full border border-black text-black focus:border-blue-900 focus:ring-1 focus:ring-blue-900 rounded-lg px-4 py-2.5 text-sm cursor-pointer bg-white outline-none transition-all"
                  value={sorting}
                  onChange={(e) => {
                    setSorting(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="year_desc">Year: Newest First</option>
                  <option value="year_asc">Year: Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-screen">
          {currentCars.length > 0 ? (
            currentCars.map((car) => {
              const inWishlist = isCarInWishlist(car.id); // Check per car

              return (
                <div
                  key={car.id}
                  className={`relative rounded-lg shadow p-4 mb-4 flex flex-col md:flex-row hover:shadow-lg transition-shadow hover:cursor-pointer border border-gray-500`}
                  onClick={() => navigate(`/detailbid/${car.id}`)}
                >
                  {car.certifyStatus === "Certified" && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Certified
                    </div>
                  )}

                  <div className="w-full md:w-40 h-48 md:h-28 overflow-hidden rounded-md mb-4 md:mb-0 md:mr-4">
                    <img
                      src={car?.images?.[0] || "/placeholder.png"}
                      alt={car.make}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800">
                        {car.make} {car.model} {car.series || ""}{" "}
                        {car.engine || ""} for sale
                      </h3>
                      <span className="text-lg font-bold text-gray-800 mt-2 sm:mt-0">
                        PKR {car.buyNowPrice}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      Lot # {car.lot_number}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{car.cityName}</p>

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
                      <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded-full shadow-sm">
                        {car.cityName}
                      </span>
                    </div>

                    {/* Heart Button - Stop click from opening detail page */}
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWishlist(car);
                        }}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          inWishlist
                            ? "text-red-600"
                            : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <FaHeart
                          size={20}
                          className={inWishlist ? "fill-current" : ""}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-600 mt-10">
              No vehicles found.
            </div>
          )}

          {/* Pagination - Your exact original */}
          {allCars.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
                <div className="text-gray-600">
                  Showing{" "}
                  <span className="font-medium">
                    {startIndex + 1} to {endIndex}
                  </span>{" "}
                  of <span className="font-medium">{allCars.length}</span>{" "}
                  entries
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded border ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {"<<"}
                  </button>

                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded border ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {"<"}
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2)
                      pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`px-3 py-1 rounded border ${
                          currentPage === pageNum
                            ? "bg-blue-950 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded border ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {">"}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage(totalPages);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded border ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {">>"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Show</span>
                  <select
                    value={carsPerPage}
                    onChange={(e) => {
                      setCarsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-600">entries</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleFinderSection;
