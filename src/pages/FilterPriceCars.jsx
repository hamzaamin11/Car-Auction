import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../components/Contant/URL";

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

const Cities = [
  // A
  "Abbottabad",
  "Addul Hakeem",
  "Ahmadpur East",
  "Ahmednagar",
  "Alipur",
  "Arandu",
  "Arifwala",
  "Atharan Hazari",
  "Attock",

  // B
  "Badah",
  "Badin",
  "Bahawalnagar",
  "Bahawalpur",
  "Balakot",
  "Bannu",
  "Barkhan",
  "Basirpur",
  "Basti Maluk",
  "Bela",
  "Bhag",
  "Bhakkar",
  "Bhan",
  "Bhera",
  "Bucheki",

  // C
  "Chacharan Sharif",
  "Chak Jhumra",
  "Chakwal",
  "Chaman",
  "Charsadda",
  "Chawinda",
  "Chichawatni",
  "Chiniot",
  "Chitral",
  "Choubara",
  "Chunian",

  // D
  "Dadu",
  "Daira Din Panah",
  "Dalbandin",
  "Daulatpur",
  "Daur",
  "Depalpur",
  "Dera Bugti",
  "Dera Ghazi Khan",
  "Dera Ismail Khan",
  "Dhadar",
  "Digri",
  "Dijkot",
  "Dinga",
  "Diplo",
  "Dir",
  "Drosh",
  "Dudhial",
  "Duki",
  "Dunyapur",

  // E
  "Eminabad",

  // F
  "Faisalabad",
  "Fateh Jang",
  "Fateh Pur",
  "Firozwala",
  "Fort Abbas",

  // G
  "Gaddani",
  "Gambat",
  "Garhi Khairo",
  "Gharibwal",
  "Gharo",
  "Gilgit",
  "Gojra",
  "Gujranwala",
  "Gujrat",
  "Gwadar",

  // H
  "Hafizabad",
  "Hala",
  "Hangu",
  "Haripur",
  "Harnai",
  "Haroonabad",
  "Hasilpur",
  "Havelian",
  "Hoshab",
  "Hyderabad",

  // I
  "Isa Khel",
  "Islamabad",

  // J
  "Jacobabad",
  "Jaranwala",
  "Jhang",
  "Jhelum",
  "Jamshoro",

  // K
  "Karachi",
  "Kamalia",
  "Kamoke",
  "Kandhkot",
  "Kasur",
  "Khairpur",
  "Khushab",
  "Khuzdar",
  "Kohat",
  "Kot Abdul Malik",
  "Kot Addu",
  "Kotri",

  // L
  "Lahore",
  "Larkana",
  "Layyah",
  "Lodhran",

  // M
  "Mandi Bahauddin",
  "Mansehra",
  "Mardan",
  "Mianwali",
  "Mirpur Khas",
  "Mirpur (Azad Kashmir)",
  "Mingora",
  "Muzaffarabad",
  "Muzaffargarh",
  "Multan",
  "Muridke",

  // N
  "Nawabshah",
  "Narowal",
  "Nowshera",

  // O
  "Okara",

  // P
  "Pakpattan",
  "Parachinar",

  // Q
  "Quetta",
  "Qambar Shahdadkot",

  // R
  "Rahim Yar Khan",
  "Rawalpindi",
  "Rabwah",

  // S
  "Sadiqabad",
  "Sahiwal",
  "Sambrial",
  "Sanghar",
  "Sargodha",
  "Shaheed Benazirabad (Nawabshah)",
  "Sheikhupura",
  "Shikarpur",
  "Sialkot",
  "Sukkur",
  "Swabi",

  // T
  "Taxila",
  "Tando Adam",
  "Tando Allahyar",
  "Tando Muhammad Khan",
  "Talagang",
  "Tharparkar",
  "Thatta",
  "Turβat",

  // V
  "Vehari",

  // W
  "Wah Cantonment",
  "Wazirabad",
  "WeTa? (ignore)",

  // Z
  "Zabād",
  "Zafarke",
  "Zafarwal",
  "Zahir Pir",
  "Zahri",
  "Zaida",
];

const FilterPriceCars = () => {
  const { name, value } = useParams();
  console.log({ name, value });

  const navigate = useNavigate();

  const [allMake, setAllMake] = useState([]);

  const [selectMake, setSelectMake] = useState();

  console.log("all makes =>>>>>", selectMake);

  console.log({ name, value });

  let fromCash = "";
  let toCash = "";

  if (name === "budget") {
    [fromCash, toCash] = value.split("-");
  }

  const initialState = {
    vehicleType: name === "bodyStyle" ? value : "",
    selectYear: "",
    allMakes: name === "make" ? value : "",
    allModels: name === "model" ? value : "",
    location: name === "city" ? value : "",
    formCash: name === "budget" ? fromCash : "",
    toCash: name === "budget" ? toCash : "",
  };

  const [filterData, setFilterData] = useState(initialState);

  const [allFilterCars, setAllFilterCars] = useState([]);

  const [filterModel, setFilterModel] = useState([]);

  const [allCities, setAllCities] = useState([]);

  const [activeTab, setActiveTab] = useState("all");

  const [sorting, setSorting] = useState("");

  const [loading, setLoading] = useState(false);

  // ✅ Generate years only once
  const currentYear = useMemo(() => {
    const year = new Date().getFullYear();
    const years = [];
    for (let i = 1970; i <= year; i++) {
      years.unshift(i);
    }
    return years;
  }, []);

  // ✅ Fetch vehicles with all filters
  const handleGetFilterByVehicle = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/seller/getVehicles`, {
        params: {
          locationId: filterData?.location || "",
          make: selectMake?.brandName || filterData.allMakes || "",
          model: filterData?.allModels || "",
          bodyStyle: filterData.vehicleType || filterData.vehicleType || "",
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
      setLoading(false);
    }
  };

  // ✅ Fetch models when make changes
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
      console.log(error);
    }
  };

  const handleSelectMake = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getBrandById/${filterData.allMakes}`
      );
      console.log(res.data);
      setSelectMake(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllMakes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBrands`);
      setAllMake(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`);

      setAllCities(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllCities();
  }, []);

  // ✅ update state from form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterData({ ...filterData, [name]: value });
  };

  const allMakes = [
    ...allMake.map((make) => ({
      label: make?.brandName,
      value: make?.id,
    })),
  ];

  const allModels = [
    ...filterModel.map((m) => ({
      label: m.modelName,
      value: m.modelName,
    })),
  ];

  // ✅ Run once on mount (default fetch)
  useEffect(() => {
    handleGetFilterByVehicle();
  }, [activeTab]);

  // ✅ Update on make change
  useEffect(() => {
    handleGetFilterModel();
    handleSelectMake();
  }, [filterData.allMakes]);

  // ✅ Update on sorting change
  useEffect(() => {
    handleGetFilterByVehicle();
  }, [sorting, filterData.location]);

  useEffect(() => {
    handleGetAllMakes();
  }, []);

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
          <select
            className="border w-full p-1.5 rounded"
            name="vehicleType"
            onChange={handleChange}
            value={filterData.vehicleType}
          >
            <option value="">Select All Type</option>
            {BodyType.map((body) => (
              <option
                onClick={() => navigate(`/filterprice/bodyStyle/${body.value}`)}
                key={body.value}
                value={body.value}
              >
                {body.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Year
          </label>
          <select
            className="border w-full p-1.5 rounded"
            value={filterData.selectYear}
            name="selectYear"
            onChange={handleChange}
          >
            <option value="">Select Model Year</option>
            {currentYear.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Make
          </label>
          <select
            className="border w-full p-1.5 rounded"
            value={filterData && filterData?.allMakes}
            name="allMakes"
            onChange={handleChange}
          >
            <option value="">Select Vehicle Make</option>
            {allMakes.map((body) => (
              <option
                onClick={() => navigate(`/filterprice/make/${body.label}`)}
                key={body.value}
                value={body.label && body.value}
              >
                {body.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Model
          </label>
          <select
            className="border w-full p-1.5 rounded"
            name="allModels"
            value={filterData.allModels}
            onChange={handleChange}
          >
            <option value="">Select Vehicle Model</option>
            {allModels.map((body, index) => (
              <option key={index} value={body.label}>
                {body.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Location
          </label>
          <select
            className="border w-full p-1.5 rounded"
            name="location"
            value={filterData.location}
            onChange={handleChange}
          >
            <option value="">Select Vehicle location</option>
            {allCities.map((body) => (
              <option
                onClick={() => navigate(`/filterprice/city/${body.id}`)}
                key={body.cityName}
                value={body.id}
              >
                {body.cityName}
              </option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="relative w-full max-w-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter Price
          </label>
          <div className="flex flex-col md:flex-col lg:flex-row w-full gap-2">
            <input
              className="border p-2 rounded   w-full"
              name="formCash"
              value={filterData.formCash}
              onChange={(e) => {
                const value = e.target.value;
                // sirf digits aur max 9 digits allow karo
                if (/^\d*$/.test(value) && value.length <= 9) {
                  handleChange(e);
                }
              }}
              placeholder="From"
            />
            <input
              className="border p-2 rounded  w-full "
              name="toCash"
              value={filterData.toCash}
              onChange={(e) => {
                const value = e.target.value;
                // sirf digits aur max 9 digits allow karo
                if (/^\d*$/.test(value) && value.length <= 9) {
                  handleChange(e);
                }
              }}
              placeholder="To"
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            disabled={loading}
            onClick={handleGetFilterByVehicle}
            className="bg-green-500 p-2  px-10  text-white rounded hover:cursor-pointer "
          >
            {loading ? "Loading..." : "Search Vehicle"}
          </button>
        </div>
      </div>

      {/* Car List */}
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 ">
          <h1 className="text-sm text-gray-700">
            1 - 25 of {allFilterCars.length} Results
          </h1>
          <select
            className="border p-2 text-sm rounded w-full sm:w-auto"
            onChange={(e) => setSorting(e.target.value)}
            name="sorting"
            value={sorting}
          >
            <option value={""}>Updated Date: Recent First</option>
            <option value={"low"}>Price: Low to High</option>
            <option value={"high"}>Price: High to Low</option>
          </select>
        </div>

        <div className="overflow-y-auto max-h-screen">
          {allFilterCars.map((car) => (
            <div
              key={car.id}
              onClick={() => navigate(`/detailbid/${car.id}`)}
              className={`relative rounded-lg shadow p-4 mb-4 flex flex-col md:flex-row hover:shadow-lg transition-shadow hover:cursor-pointer  ${
                car.certifyStatus === "Certified"
                  ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-400"
                  : "bg-white"
              }`}
            >
              {/* Certified Badge */}
              {car.certifyStatus === "Certified" && (
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  ✅ Certified
                </div>
              )}

              {/* Image */}
              <div className="w-full md:w-40 h-48 md:h-28 overflow-hidden rounded-md mb-4 md:mb-0 md:mr-4">
                <img
                  src={car.images[0]}
                  alt={car.make}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
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

                  <span className="px-3 py-1 bg-gray-100  text-xs font-medium rounded-full shadow-sm">
                    {car.bodyStyle}
                  </span>
                  <span className="px-3 py-1 bg-gray-100  text-xs font-medium rounded-full shadow-sm">
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
