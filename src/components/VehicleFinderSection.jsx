import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "./Contant/URL";
import { addMake, addModel } from "./Redux/SelectorCarSlice";
import CustomDropdown from "../CustomDropdown";
import numberToWords from "number-to-words";

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
  const [carsPerPage, setCarsPerPage] = useState(10);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const vehicleData = useSelector((state) => state.carSelector);

  const [filterPrice, setFilterPrice] = useState({
    budget: { min: "", max: "" },
  });

  const handleChange = (name, val) => {
    setFilters((prev) => ({ ...prev, [name]: val }));
    setCurrentPage(1);
  };

  const handleGetCars = async () => {
    try {
      let {
        condition,
        toCash,
        formCash,
        fromYear,
        toYear,
        vehicleType,
        location,
        lot,
      } = filters;

      toCash = filterPrice.budget.max ?? "";
      formCash = filterPrice.budget.min ?? "";

      const make = vehicleData.make || "";
      const model = vehicleData.model || "";

      const res = await axios.get(
        `${BASE_URL}/getApprovedVehicles?vehicleCondition=${condition}&make=${make}&model=${model}&minPrice=${formCash}&maxPrice=${toCash}&sortType=${sorting}&yearStart=${fromYear}&yearEnd=${toYear}&bodyStyle=${vehicleType}&locationId=${location}&lot_number=${lot}`
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

  const handleFilterPrice = (e) => {
    const { name, value } = e.target;
    const [min, max] = value.split("-").map(Number);
    setFilterPrice({
      ...filterPrice,
      [name]: { min, max },
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
    handleGetCars();
  }, [
    vehicleData.make,
    vehicleData.model,
    filters.condition,
    filters.toYear,
    filters.formCash || filterPrice.budget.min,
    filters.toCash || filterPrice.budget.max,
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
      {/* ===========================
        SIDEBAR - Vehicle Finder
      ============================ */}
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

        <div className="flex items-center  w-full">
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

      {/* ===========================
        CAR LISTING
      ============================ */}
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h1 className="text-black font-bold text-lg sm:text-xl">
            {allCars.length} Vehicles For Sale
          </h1>

          <div className="flex items-center gap-1">
            <div className="font-semibold">Sort By</div>
            <div className="flex gap-2">
              <div className="w-full">
                <CustomDropdown
                  datas={budgetData.map((b) => ({
                    label: b.label,
                    value: `${b.min}-${b.max}`,
                  }))}
                  placeholder="Select Budget"
                  name="budget"
                  value={
                    filterPrice.budget.min
                      ? `${filterPrice.budget.min}-${filterPrice.budget.max}`
                      : ""
                  }
                  onChange={handleFilterPrice}
                />
              </div>

              <select
                className="border text-black border-black focus:border-blue-900 focus:ring-1 focus:ring-blue-900 rounded-lg px-3 py-2 text-sm w-full sm:w-auto cursor-pointer bg-white outline-none transition-all duration-200"
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
          </div>
        </div>

        <div className="overflow-y-auto max-h-screen">
          {currentCars.length > 0 ? (
            currentCars.map((car) => (
              <div
                key={car.id}
                onClick={() => navigate(`/detailbid/${car.id}`)}
                className={`relative rounded-lg shadow p-4 mb-4 flex flex-col md:flex-row hover:shadow-lg transition-shadow hover:cursor-pointer ${
                  car.certifyStatus === "Certified"
                    ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-400"
                    : "bg-white"
                }`}
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
                    <h3
                      className={`font-semibold text-sm sm:text-base ${
                        car.certifyStatus === "Certified"
                          ? "text-green-700"
                          : "text-gray-800"
                      }`}
                    >
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
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 mt-10">
              No vehicles found.
            </div>
          )}

          {/* Pagination */}
          {allCars.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
                {/* Showing X to Y of Z */}
                <div className="text-gray-600">
                  Showing{" "}
                  <span className="font-medium">
                    {startIndex + 1} to {endIndex}
                  </span>{" "}
                  of <span className="font-medium">{allCars.length}</span>{" "}
                  entries
                </div>

                {/* Page Buttons */}
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

                {/* Show entries */}
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
