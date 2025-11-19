import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomDropdown from "../CustomDropdown";
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

  const [filterPrice, setFilterPrice] = useState({
    budget: { min: "", max: "" },
  });

  console.log("filter =>", filterPrice);

  const [filterData, setFilterData] = useState({
    vehicleType: name === "bodyStyle" ? decodeURIComponent(value || "") : "",
    selectYear: "",
    toYear: "",
    allMakes: "",
    allModels: name === "model" ? decodeURIComponent(value || "") : "",
    location: "",
    lot: "",
    formCash:
      name === "budget"
        ? decodeURIComponent(value || "").split("-")[0] || ""
        : "",
    toCash:
      name === "budget"
        ? decodeURIComponent(value || "").split("-")[1] || ""
        : "",
  });

  console.log("lot =>", filterData.lot);

  const [allFilterCars, setAllFilterCars] = useState([]);

  const [filterModel, setFilterModel] = useState([]);

  const [activeTab, setActiveTab] = useState("all");

  const [sorting, setSorting] = useState("");

  const [loading, setLoading] = useState(false);

  const [currentYear, setCurrentYears] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  const [carsPerPage, setCarsPerPage] = useState(10);

  // Transform cities
  const cityOptions = useMemo(
    () =>
      allCities.map((city) => ({
        label: city.cityName.charAt(0).toUpperCase() + city.cityName.slice(1),
        value: city.id,
      })),
    [allCities]
  );

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

  // Transform makes
  const allMakes = useMemo(
    () =>
      allMake.map((make) => ({
        label: `${make.brandName} (${make.vehicleCount})`,
        value: make.id,
        brandName: make.brandsName,
        vehicleCount: make.vehicleCount,
      })),
    [allMake]
  );

  // Transform models
  const allModels = useMemo(
    () =>
      filterModel.map((m) => ({
        label: `${m.modelName} (${m.vehicleCount})`,
        value: m.modelName,
      })),
    [filterModel]
  );

  const handleGetYear = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/fetchVehicleYears`);
      const formattedYears = res.data.map((year) => ({
        label: year,
        value: year,
      }));
      setCurrentYears(formattedYears);
    } catch (error) {
      console.log(error);
    }
  };

  // Sorted + paginated cars
  const sortedCars = useMemo(() => {
    let cars = [...allFilterCars];

    if (sorting === "low") {
      cars.sort((a, b) => a.buyNowPrice - b.buyNowPrice);
    } else if (sorting === "high") {
      cars.sort((a, b) => b.buyNowPrice - a.buyNowPrice);
    } else if (sorting === "year_desc") {
      cars.sort((a, b) => b.year - a.year);
    } else if (sorting === "year_asc") {
      cars.sort((a, b) => a.year - b.year);
    }

    return cars;
  }, [allFilterCars, sorting]);

  // === PAGINATION LOGIC ===
  const totalPages = Math.ceil(sortedCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = Math.min(startIndex + carsPerPage, sortedCars.length);
  const currentCars = sortedCars.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  // Map URL value to option value (ID) for city and make
  useEffect(() => {
    if (name === "city" && value && allCities.length > 0) {
      const selectedCity = allCities.find(
        (city) =>
          city.cityName.toLowerCase() ===
          decodeURIComponent(value).toLowerCase()
      );
      if (selectedCity) {
        setFilterData((prev) => ({ ...prev, location: selectedCity.id }));
      }
    }
    if (name === "make" && value && allMake.length > 0) {
      const selectedMake = allMake.find(
        (make) =>
          make.brandName.toLowerCase() ===
          decodeURIComponent(value).toLowerCase()
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
      filters.push(
        `bodyStyle/${encodeURIComponent(updatedFilterData.vehicleType)}`
      );
    }
    if (updatedFilterData.selectYear) {
      filters.push(`year/${encodeURIComponent(updatedFilterData.selectYear)}`);
    }
    if (updatedFilterData.allMakes) {
      const selectedMake = allMake.find(
        (make) => make.id === updatedFilterData.allMakes
      );
      if (selectedMake) {
        filters.push(`make/${encodeURIComponent(selectedMake.brandName)}`);
      }
    }
    if (updatedFilterData.allModels) {
      filters.push(`model/${encodeURIComponent(updatedFilterData.allModels)}`);
    }
    if (updatedFilterData.location) {
      const selectedCity = allCities.find(
        (city) => city.id === updatedFilterData.location
      );
      if (selectedCity) {
        filters.push(`city/${encodeURIComponent(selectedCity.cityName)}`);
      }
    }
    if (updatedFilterData.formCash && updatedFilterData.toCash) {
      filters.push(
        `budget/${updatedFilterData.formCash}-${updatedFilterData.toCash}`
      );
    }

    return filters.length > 0 ? `/filterprice/${filters[0]}` : "/filterprice";
  };

  const handleGetFilterByVehicle = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/getApprovedVehicles`, {
        params: {
          locationId: filterData?.location,
          make: filterData?.allMakes,
          model: filterData?.allModels,
          bodyStyle: filterData?.vehicleType,
          minPrice: filterData?.formCash || filterPrice.budget.min,
          maxPrice: filterData?.toCash || filterPrice.budget.max,
          sortType: sorting,
          yearStart: filterData.selectYear || "",
          yearEnd: filterData.toYear || "",
          vehicleCondition: activeTab !== "all" ? activeTab : undefined,
          lot_number: filterData.lot,
        },
      });
      setAllFilterCars(res.data);
      setCurrentPage(1);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching cars:", error);
      setAllFilterCars([]);
      setLoading(false);
    }
  };

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

  const handleChange = (name, value) => {
    const updatedFilterData = { ...filterData, [name]: value };
    if (name === "allMakes") {
      updatedFilterData.allModels = "";
    }
    setFilterData(updatedFilterData);
    navigate(buildFilterUrl(updatedFilterData));
  };

  const handleFilterPrice = (e) => {
    const { name, value } = e.target;
    const [min, max] = value.split("-").map(Number);
    setFilterPrice({
      ...filterPrice,
      [name]: { min, max },
    });
  };
  useEffect(() => {
    handleGetAllCities();
    handleGetAllMakes();
    handleGetYear();
  }, []);

  useEffect(() => {
    handleGetFilterByVehicle();
  }, [activeTab, sorting, filterData, filterPrice]);

  useEffect(() => {
    handleGetFilterModel();
  }, [filterData.allMakes]);

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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4 gap-4">
      {/* Sidebar */}
      <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-bold text-gray-600">Vehicle Finder</h2>

        {/* Tabs */}
        <div className="flex space-x-2">
          {["All", "Used", "New"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
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

        {/* All Filters - Same as before */}
        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Body Style
          </label>
          <CustomDropdown
            options={[...BodyType]}
            value={BodyType.find(
              (option) => option.value === filterData.vehicleType
            )}
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

        <div className="flex w-full gap-2">
          <div className="relative w-48 max-w-sm">
            <label className="block text-sm font-medium text-gray-700">
              From Year
            </label>
            <CustomDropdown
              options={[...currentYear]}
              value={currentYear.find(
                (option) => option.value === filterData.selectYear
              )}
              onChange={(s) => handleChange("selectYear", s ? s.value : "")}
              placeholder="Select Year"
              isSearchable
              className="w-full"
            />
          </div>
          <div className="relative w-48 max-w-sm">
            <label className="block text-sm font-medium text-gray-700">
              To Year
            </label>
            <CustomDropdown
              options={[...currentYear]}
              value={currentYear.find(
                (option) => option.value === filterData.toYear
              )}
              onChange={(s) => handleChange("toYear", s ? s.value : "")}
              placeholder="To Year"
              isSearchable
              className="w-full"
            />
          </div>
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Make
          </label>
          <CustomDropdown
            options={[...allMakes]}
            value={allMakes.find(
              (option) => option.value === filterData.allMakes
            )}
            onChange={(s) => handleChange("allMakes", s ? s.value : "")}
            placeholder="Select Make"
            isSearchable
            className="w-full"
          />
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Model
          </label>
          <CustomDropdown
            options={[...allModels]}
            value={allModels.find(
              (option) => option.value === filterData.allModels
            )}
            onChange={(s) => handleChange("allModels", s ? s.value : "")}
            placeholder="Select Model"
            isSearchable
            className="w-full"
          />
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Location
          </label>
          <CustomDropdown
            options={[...cityOptions]}
            value={cityOptions.find(
              (option) => option.value === filterData.location
            )}
            onChange={(s) => handleChange("location", s ? s.value : "")}
            placeholder="Select Location"
            isSearchable
            className="w-full"
          />
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter Price
          </label>
          <div className="flex flex-col md:flex-col lg:flex-row w-full gap-2">
            <div className="w-full">
              <input
                className="border p-2 rounded w-full"
                value={filterData.formCash}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val) && val.length <= 9) {
                    handleChange("formCash", val);
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
                value={filterData.toCash}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val) && val.length <= 9) {
                    handleChange("toCash", val);
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
                value={filterData.lot}
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
            disabled={loading}
            onClick={handleGetFilterByVehicle}
            className="bg-blue-950 w-full p-2 px-10 text-white rounded hover:cursor-pointer"
          >
            {loading ? "Loading..." : "Search Vehicle"}
          </button>
        </div>
      </div>

      {/* Car List */}
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h1 className="text-black font-bold text-lg sm:text-xl">
            {allFilterCars.length}{" "}
            {filterData.allMakes
              ? allMakes
                  .find((m) => m.value === filterData.allMakes)
                  ?.label.split(" (")[0]
              : "Cars"}{" "}
            Vehicles For Sale
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
                    src={car.images?.[0] || "/placeholder.png"}
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
            <div className="text-center text-gray-600 mt-10">No cars found</div>
          )}

          {/* === FULL IDENTICAL PAGINATION FROM FIRST COMPONENT === */}
          {allFilterCars.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
                {/* Showing X to Y of Z */}
                <div className="text-gray-600">
                  Showing{" "}
                  <span className="font-medium">
                    {startIndex + 1} to {endIndex}
                  </span>{" "}
                  of <span className="font-medium">{sortedCars.length}</span>{" "}
                  entries
                </div>

                {/* Page Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(1)}
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
                        onClick={() => goToPage(pageNum)}
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
                    onClick={() => goToPage(totalPages)}
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

export default FilterPriceCars;
