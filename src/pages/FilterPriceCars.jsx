import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { BASE_URL } from "../components/Contant/URL";
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

const FilterPriceCars = () => {
  const { name, value } = useParams();
  const navigate = useNavigate();

  const [allMake, setAllMake] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [filterData, setFilterData] = useState({
    vehicleType: name === "bodyStyle" ? decodeURIComponent(value || "") : "",
    selectYear: "",
    allMakes: "",
    allModels: name === "model" ? decodeURIComponent(value || "") : "",
    location: "",
    formCash: name === "budget" ? decodeURIComponent(value || "").split("-")[0] || "" : "",
    toCash: name === "budget" ? decodeURIComponent(value || "").split("-")[1] || "" : "",
  });
  const [allFilterCars, setAllFilterCars] = useState([]);
  const [filterModel, setFilterModel] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [sorting, setSorting] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate years
  const currentYear = useMemo(() => {
    const year = new Date().getFullYear();
    const years = [];
    for (let i = 1970; i <= year; i++) {
      years.unshift({ label: i.toString(), value: i.toString() });
    }
    return years;
  }, []);

  // Transform cities for react-select
  const cityOptions = useMemo(
    () =>
      allCities.map((city) => ({
        label: city.cityName,
        value: city.id,
      })),
    [allCities]
  );

  // Transform makes for react-select
  const allMakes = useMemo(
    () =>
      allMake.map((make) => ({
        label: make.brandName,
        value: make.id,
      })),
    [allMake]
  );

  // Transform models for react-select
  const allModels = useMemo(
    () =>
      filterModel.map((m) => ({
        label: m.modelName,
        value: m.modelName,
      })),
    [filterModel]
  );

  // Map URL value to option value (ID) for city and make
  useEffect(() => {
    if (name === "city" && value && allCities.length > 0) {
      const selectedCity = allCities.find(
        (city) => city.cityName.toLowerCase() === decodeURIComponent(value).toLowerCase()
      );
      if (selectedCity) {
        setFilterData((prev) => ({ ...prev, location: selectedCity.id }));
      }
    }
    if (name === "make" && value && allMake.length > 0) {
      const selectedMake = allMake.find(
        (make) => make.brandName.toLowerCase() === decodeURIComponent(value).toLowerCase()
      );
      if (selectedMake) {
        setFilterData((prev) => ({ ...prev, allMakes: selectedMake.id }));
      }
    }
  }, [name, value, allCities, allMake]);

  // Build URL with current filters
  const buildFilterUrl = (updatedFilterData) => {
    const filters = [];
    if (updatedFilterData.vehicleType) {
      filters.push(`bodyStyle/${encodeURIComponent(updatedFilterData.vehicleType)}`);
    }
    if (updatedFilterData.selectYear) {
      filters.push(`year/${encodeURIComponent(updatedFilterData.selectYear)}`);
    }
    if (updatedFilterData.allMakes) {
      const selectedMake = allMake.find((make) => make.id === updatedFilterData.allMakes);
      if (selectedMake) {
        filters.push(`make/${encodeURIComponent(selectedMake.brandName)}`);
      }
    }
    if (updatedFilterData.allModels) {
      filters.push(`model/${encodeURIComponent(updatedFilterData.allModels)}`);
    }
    if (updatedFilterData.location) {
      const selectedCity = allCities.find((city) => city.id === updatedFilterData.location);
      if (selectedCity) {
        filters.push(`city/${encodeURIComponent(selectedCity.cityName)}`);
      }
    }
    if (updatedFilterData.formCash && updatedFilterData.toCash) {
      filters.push(`budget/${updatedFilterData.formCash}-${updatedFilterData.toCash}`);
    }

    return filters.length > 0 ? `/filterprice/${filters[0]}` : "/filterprice";
  };

  // Fetch vehicles with all filters
  const handleGetFilterByVehicle = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/getApprovedVehicles`, {
        params: {
          locationId: filterData.location || "",
          make: filterData.allMakes || "",
          model: filterData.allModels || "",
          bodyStyle: filterData.vehicleType || "",
          minPrice: filterData.formCash || "",
          maxPrice: filterData.toCash || "",
          sortType: sorting || "",
          year: filterData.selectYear || "",
          vehicleCondition: activeTab !== "all" ? activeTab : undefined,
        },
      });
      setAllFilterCars(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching cars:", error);
      setAllFilterCars([]);
      setLoading(false);
    }
  };

  // Fetch models when make changes
  const handleGetFilterModel = async () => {
    if (!filterData.allMakes) {
      setFilterModel([]);
      return;
    }
    try {
      const res = await axios.get(
        `${BASE_URL}/getModelById/${filterData.allMakes}`
      );
      setFilterModel(res.data);
    } catch (error) {
      console.log("Error fetching models:", error);
      setFilterModel([]);
    }
  };

  const handleGetAllMakes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBrands`);
      setAllMake(res.data);
    } catch (error) {
      console.log("Error fetching makes:", error);
      setAllMake([]);
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

  // Update state from form
  const handleChange = (name, value) => {
    const updatedFilterData = { ...filterData, [name]: value };
    if (name === "allMakes") {
      updatedFilterData.allModels = ""; // Reset model when make changes
    }
    setFilterData(updatedFilterData);
    navigate(buildFilterUrl(updatedFilterData));
  };

  useEffect(() => {
    handleGetAllCities();
    handleGetAllMakes();
  }, []);

  useEffect(() => {
    handleGetFilterByVehicle();
  }, [activeTab, sorting, filterData]);

  useEffect(() => {
    handleGetFilterModel();
  }, [filterData.allMakes]);

  // Convert number to Pakistani words
  const convertToPakistaniWords = (number) => {
    if (!number || isNaN(number)) return "";
    const num = Number(number);

    const toWords = (n) => (n === 0 ? "" : numberToWords.toWords(n));

    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;

    let result = [];
    if (crore > 0) {
      result.push(`${toWords(crore)} crore${crore > 1 ? "s" : ""}`);
    }
    if (lakh > 0) {
      result.push(`${toWords(lakh)} lakh${lakh > 1 ? "s" : ""}`);
    }
    if (thousand > 0) {
      result.push(`${toWords(thousand)} thousand`);
    }
    if (remainder > 0) {
      result.push(toWords(remainder));
    }

    return result.length === 0 ? "" : result.join(" ");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4 gap-4">
      {/* Sidebar */}
      <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-bold text-gray-600">Vehicle Finder</h2>

        {/* Tabs */}
        <div className="flex space-x-2">
          {["All", "Used", "New"].map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                activeTab === tab.toLowerCase()
                  ? "bg-[#c90107] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Body Style
          </label>
          <Select
            options={[{ label: "Select All Type", value: "" }, ...BodyType]}
            value={
              BodyType.find(
                (option) => option.value === filterData.vehicleType
              ) || { label: "Select All Type", value: "" }
            }
            onChange={(selected) => handleChange("vehicleType", selected.value)}
            placeholder="Select Body Style"
            isSearchable
            className="w-full"
          />
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Year
          </label>
          <Select
            options={[
              { label: "Select Model Year", value: "" },
              ...currentYear,
            ]}
            value={
              currentYear.find(
                (option) => option.value === filterData.selectYear
              ) || { label: "Select Model Year", value: "" }
            }
            onChange={(selected) => handleChange("selectYear", selected.value)}
            placeholder="Select Year"
            isSearchable
            className="w-full"
          />
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Make
          </label>
          <Select
            options={[{ label: "Select Vehicle Make", value: "" }, ...allMakes]}
            value={
              allMakes.find(
                (option) => option.value === filterData.allMakes
              ) || {
                label: "Select Vehicle Make",
                value: "",
              }
            }
            onChange={(selected) => handleChange("allMakes", selected.value)}
            placeholder="Select Make"
            isSearchable
            className="w-full"
          />
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Model
          </label>
          <Select
            options={[
              { label: "Select Vehicle Model", value: "" },
              ...allModels,
            ]}
            value={
              allModels.find(
                (option) => option.value === filterData.allModels
              ) || {
                label: "Select Vehicle Model",
                value: "",
              }
            }
            onChange={(selected) => handleChange("allModels", selected.value)}
            placeholder="Select Model"
            isSearchable
            className="w-full"
          />
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Location
          </label>
          <Select
            options={[
              { label: "Select Vehicle Location", value: "" },
              ...cityOptions,
            ]}
            value={
              cityOptions.find(
                (option) => option.value === filterData.location
              ) || {
                label: "Select Vehicle Location",
                value: "",
              }
            }
            onChange={(selected) => handleChange("location", selected.value)}
            placeholder="Select Location"
            isSearchable
            className="w-full"
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
                className="border p-2 rounded w-full"
                name="formCash"
                value={filterData.formCash}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 9) {
                    handleChange("formCash", value);
                  }
                }}
                placeholder="From"
              />
              {filterData.formCash && (
                <p className="text-sm text-red-500 font-semibold mt-1 capitalize">
                  {convertToPakistaniWords(filterData.formCash)}
                </p>
              )}
            </div>
            <div className="w-full">
              <input
                className="border p-2 rounded w-full"
                name="toCash"
                value={filterData.toCash}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 9) {
                    handleChange("toCash", value);
                  }
                }}
                placeholder="To"
              />
              {filterData.toCash && (
                <p className="text-sm text-red-500 font-semibold mt-1 capitalize">
                  {convertToPakistaniWords(filterData.toCash)}
                </p>
              )}
            </div>
          </div>
          {filterData.formCash && filterData.toCash && (
            <button
              onClick={() => {
                const updatedFilterData = { ...filterData };
                navigate(buildFilterUrl(updatedFilterData));
              }}
              className="mt-2 bg-blue-500 p-2 px-4 text-white rounded hover:cursor-pointer"
            >
              Apply Price Filter
            </button>
          )}
        </div>

        <div className="flex items-center justify-center">
          <button
            disabled={loading}
            onClick={handleGetFilterByVehicle}
            className="bg-green-500 p-2 px-10 text-white rounded hover:cursor-pointer"
          >
            {loading ? "Loading..." : "Search Vehicle"}
          </button>
        </div>
      </div>

      {/* Car List */}
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h1 className="text-sm text-gray-700">
            1 - 25 of {allFilterCars.length} Results
          </h1>
          <select
            className="border p-2 text-sm rounded w-full sm:w-auto"
            onChange={(e) => setSorting(e.target.value)}
            name="sorting"
            value={sorting}
          >
            <option value="">Updated Date: Recent First</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        <div className="overflow-y-auto max-h-screen">
          {allFilterCars.map((car) => (
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
                  ✅ Certified
                </div>
              )}
              <div className="w-full md:w-40 h-48 md:h-28 overflow-hidden rounded-md mb-4 md:mb-0 md:mr-4">
                <img
                  src={car.images[0]}
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
                        : "text-blue-700"
                    }`}
                  >
                    {car.make} {car.model} {car.series} {car.engine} for sale
                  </h3>
                  <span className="text-lg font-bold text-gray-800 mt-2 sm:mt-0">
                    PKR {car.buyNowPrice}
                  </span>
                </div>
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
          ))}
          {allFilterCars.length === 0 && (
            <div className="text-center text-gray-600 mt-10">No cars found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPriceCars;