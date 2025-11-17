import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";
import CustomDropdown from "../CustomDropdown";
const SearchableOption = ({ datas, placeholder, name, value, onChange }) => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(datas || []);
  const [showOptions, setShowOptions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  // Update filtered data based on search input
  useEffect(() => {
    setFilteredData(
      datas.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    );
    setActiveIndex(-1);
  }, [search, datas]);

  // Handle selection of an option
  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setSearch(""); // Clear search after selection
    setShowOptions(false);
    setActiveIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setShowOptions(true);
      setActiveIndex((prev) => Math.min(prev + 1, filteredData.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setShowOptions(true);
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredData.length) {
        handleSelect(filteredData[activeIndex].value);
      }
    } else if (e.key === "Escape") {
      setSearch("");
      setShowOptions(false);
      setActiveIndex(-1);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowOptions(false);
        setSearch(""); // Clear search on outside click
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine input value
  const inputValue =
    search || // Show search text when typing
    (value ? datas.find((d) => d.value === value)?.label : "") || // Show selected label if value exists
    ""; // Empty if no value or search

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        placeholder={value ? "" : placeholder} // Show placeholder only if no value is selected
        className="border p-2 rounded w-full"
        value={inputValue}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => {
          setShowOptions(true);
          if (!value) setSearch(""); // Clear search on focus if no value is selected
        }}
        onKeyDown={handleKeyDown}
      />
      {showOptions && filteredData.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full max-h-60 overflow-y-auto mt-1 rounded shadow">
          {filteredData.map((item, index) => (
            <li
              key={item.value}
              className={`p-2 cursor-pointer ${
                index === activeIndex ? "bg-gray-200" : ""
              }`}
              onClick={() => handleSelect(item.value)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const initialState = {
  city: "",
  make: "",
  model: "",
  budget: {},
  bodyStyle: "",
};

const TabsSection = () => {
  const [filterData, setFilterData] = useState({
    city: "",
    make: "",
    bodyStyle: "",
    budget: { min: 0, max: 0 },
  });
  const [allCities, setAllCities] = useState([]);
  const [allMake, setAllMake] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch all cities
  const handleGetAllCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`);
      setAllCities(res.data);
    } catch (error) {
      console.log("Error fetching cities:", error);
      setAllCities([]);
    }
  };

  // ✅ Fetch all makes (brands)
  const handleGetAllMakes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBrands`);
      setAllMake(res.data);
    } catch (error) {
      console.log("Error fetching makes:", error);
      setAllMake([]);
    }
  };

  useEffect(() => {
    handleGetAllCities();
    handleGetAllMakes();
  }, []);

  // ✅ Map city data
  const cityData = allCities.map((city) => ({
    label: city.cityName.charAt(0).toUpperCase() + city.cityName.slice(1),
    value: city.id,
  }));

  // ✅ Map make data (show count but keep plain brand name for routing)
  const makeData = allMake
    .filter((make) => make.vehicleCount > 0)
    .map((make) => ({
      label: `${make.brandName} (${make.vehicleCount})`, // visible text in dropdown
      value: make.id, // dropdown value (used to identify selection)
      brandName: make.brandName, // actual brand name for URL
      vehicleCount: make.vehicleCount,
    }));

  // ✅ Handle change for dropdowns
  const handleChange = (e) => {
    const { name, value } = e.target;
    let urlValue = value;

    if (name === "city") {
      const selectedCity = cityData.find((city) => city.value === value);
      urlValue = selectedCity ? encodeURIComponent(selectedCity.label) : "";
    } else if (name === "make") {
      const selectedMake = makeData.find((make) => make.value === value);
      // 👉 use brandName only (without vehicle count)
      urlValue = selectedMake ? encodeURIComponent(selectedMake.brandName) : "";
    } else if (name === "bodyStyle") {
      urlValue = encodeURIComponent(value);
    }

    setFilterData({ ...filterData, [name]: value });

    if (urlValue) {
      navigate(`/filterprice/${name}/${urlValue}`);
    } else {
      navigate(`/filterprice`);
    }
  };

  // ✅ Handle Budget range selection
  const handleFilterPrice = (e) => {
    const { name, value } = e.target;
    const [min, max] = value.split("-").map(Number);
    setFilterData({
      ...filterData,
      [name]: { min, max },
    });
    navigate(`/filterprice/${name}/${value}`);
  };

  // ✅ Body styles
  const bodyData = [
    { label: "Mini Vehicles", value: "Mini Vehicles" },
    { label: "Van", value: "Van" },
    { label: "Truck", value: "Truck" },
    { label: "SUV", value: "SUV" },
    { label: "Sedan", value: "Sedan" },
    { label: "Pick Up", value: "Pick Up" },
    { label: "Hatchback", value: "Hatchback" },
    { label: "Coupe", value: "Coupe" },
    { label: "Convertible", value: "Convertible" },
    { label: "Compact SUV", value: "Compact SUV" },
    { label: "Compact sedan", value: "Compact sedan" },
  ];

  // ✅ Budget range list
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

  return (
    <div className="lg:p-10 p-4 max-w-[90rem] mx-auto">
      <div className="items-center flex-wrap pb-2">
        <h1 className="text-2xl text-gray-800 text-center lg:text-left lg:text-3xl font-bold mx-0 lg:mx-6">
          Search Your Dream Car
        </h1>
      </div>

      {/* ✅ Dropdown Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-0 lg:mx-6">
        {/* City */}
        <div className="max-w-xs">
          <CustomDropdown
            datas={cityData}
            placeholder="Search City"
            name="city"
            value={filterData.city || ""}
            onChange={handleChange}
          />
        </div>

        {/* Make (Brand + Vehicle Count) */}
        <div className="max-w-xs">
          <CustomDropdown
            datas={makeData}
            placeholder="Search Make"
            name="make"
            value={filterData.make || ""}
            onChange={handleChange}
          />
        </div>

        {/* Body Style */}
        <div className="max-w-xs">
          <CustomDropdown
            datas={bodyData}
            placeholder="Search BodyStyle"
            name="bodyStyle"
            value={filterData.bodyStyle || ""}
            onChange={handleChange}
          />
        </div>

        {/* Budget */}
        <div className="max-w-xs">
          <CustomDropdown
            datas={budgetData.map((b) => ({
              label: b.label,
              value: `${b.min}-${b.max}`,
            }))}
            placeholder="Search Budget"
            name="budget"
            value={
              filterData.budget.min
                ? `${filterData.budget.min}-${filterData.budget.max}`
                : ""
            }
            onChange={handleFilterPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default TabsSection;
