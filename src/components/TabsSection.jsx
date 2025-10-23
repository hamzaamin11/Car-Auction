import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";

const SearchableOption = ({ datas, placeholder, name, value, onChange }) => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(datas || []);
  const [showOptions, setShowOptions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    setFilteredData(
      datas.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    );
    setActiveIndex(-1);
  }, [search, datas]);

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setSearch("");
    setShowOptions(false);
  };

  const handleKeyDown = (e) => {
    if (!showOptions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filteredData.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredData.length) {
        handleSelect(filteredData[activeIndex].value);
      }
    } else if (e.key === "Escape") {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        placeholder={placeholder}
        className="border p-2 rounded w-full"
        value={search || datas.find((d) => d.value === value)?.label || ""}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
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
  const [filterData, setFilterData] = useState(initialState);
  const [allCities, setAllCities] = useState([]);
  const [allMake, setAllMake] = useState([]);
  const navigate = useNavigate();

  const handleGetAllCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`);
      setAllCities(res.data);
    } catch (error) {
      console.log("Error fetching cities:", error);
      setAllCities([]);
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

  useEffect(() => {
    handleGetAllCities();
    handleGetAllMakes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let urlValue = value;
    if (name === "city") {
      const selectedCity = cityData.find((city) => city.value === value);
      urlValue = selectedCity ? encodeURIComponent(selectedCity.label) : "";
    } else if (name === "make") {
      const selectedMake = makeData.find((make) => make.value === value);
      urlValue = selectedMake ? encodeURIComponent(selectedMake.label) : "";
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

  const handleFilterPrice = (e) => {
    const { name, value } = e.target;
    const [min, max] = value.split("-").map(Number);
    setFilterData({
      ...filterData,
      [name]: { min, max },
    });
    navigate(`/filterprice/${name}/${value}`);
  };

  const cityData = allCities.map((city) => ({
    label: city.cityName,
    value: city.id,
  }));

  const makeData = allMake.map((make) => ({
    label: make.brandName,
    value: make.id,
  }));

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

  const budgetData = [
    { label: "5–10 Lac", min: 500000, max: 1000000 },
    { label: "10–20 Lac", min: 1000000, max: 2000000 },
    { label: "20–30 Lac", min: 2000000, max: 3000000 },
    { label: "30–40 Lac", min: 3000000, max: 4000000 },
    { label: "40–50 Lac", min: 4000000, max: 5000000 },
    { label: "50–60 Lac", min: 5000000, max: 6000000 },
    { label: "60–80 Lac", min: 6000000, max: 8000000 },
    { label: "80 Lac – 1 Crore", min: 8000000, max: 10000000 },
    { label: "1 Crore – 1.5 Crore", min: 10000000, max: 15000000 },
    { label: "1.5 Crore – 2 Crore", min: 15000000, max: 20000000 },
  ];

  return (
    <div className="p-10 max-w-[90rem] mx-auto">
      <div className="items-center flex-wrap pb-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mx-6">
          Search Your Dream Car
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-6">
        <div className="max-w-xs">
          <SearchableOption
            datas={[{ label: "Select City", value: "" }, ...cityData]}
            placeholder="Search City"
            name="city"
            value={filterData.city}
            onChange={handleChange}
          />
        </div>
        <div className="max-w-xs">
          <SearchableOption
            datas={[{ label: "Select Make", value: "" }, ...makeData]}
            placeholder="Search Make"
            name="make"
            value={filterData.make}
            onChange={handleChange}
          />
        </div>
        <div className="max-w-xs">
          <SearchableOption
            datas={[{ label: "Select Body Style", value: "" }, ...bodyData]}
            placeholder="Search BodyStyle"
            name="bodyStyle"
            value={filterData.bodyStyle}
            onChange={handleChange}
          />
        </div>
        <div className="max-w-xs">
          <SearchableOption
            datas={[{ label: "Select Budget", value: "" }, ...budgetData.map((b) => ({
              label: b.label,
              value: `${b.min}-${b.max}`,
            }))]}
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