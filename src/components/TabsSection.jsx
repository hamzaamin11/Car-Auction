import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchableOption from "./MenuOption/SearchableOption";
import { Options } from "../admin/components/InputFields/Options";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";

const initialState = {
  city: "",
  make: "",
  model: "",
  budget: {},
  bodyStyle: "",
};

const TabsSection = () => {
  const [activeTab, setActiveTab] = useState("");

  console.log(activeTab);

  console.log(activeTab);

  const [currentPage, setCurrentPage] = useState(0);

  const [allMake, setAllMake] = useState([]);

  const itemsPerPage = 12;

  const [filterData, setFilterData] = useState(initialState);

  const [allCities, setAllCities] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterData({ ...filterData, [name]: value });
    navigate(`/filterprice/${name}/${value}`);
  };

  const handleFilterPrice = (e) => {
    const { name, value } = e.target;

    const [min, max] = value.split("-");

    setFilterData({
      ...filterData,
      [name]: { min: Number(min), max: Number(max) },
    });
    navigate(`/filterprice/${name}/${value}`);
  };
  const selectedTopic = ["City", "Make", "Model", "BodyStyle", "Budgets"];

  const tabData = {
    City: [
      "Karachi",
      "Lahore",
      "Islamabad",
      "Rawalpindi",
      "Peshawar",
      "Faisalabad",
      "Multan",
      "Gujranwala",
      "Sialkot",
      "Hyderabad",
      "Sargodha",
      "Abbottabad",
      "Quetta",
      "Bahawalpur",
      "Wah Cantt",
      "Gujrat",
      "Mardan",
      "Rahim Yar Khan",
      "Sahiwal",
      "Attock",
      "Chakwal",
      "Okara",
      "Sheikhupura",
      "Jhelum",
      "Mansehra",
      "Swabi",
      "Mandi",
      "bahauddin",
      "Haripur",
      "Jhang",
      "Taxila",
    ],
    Make: [
      { name: "Suzuki", image: "/images/Suzuki.png" },
      { name: "Toyota", image: "/images/Tyota.png" },
      { name: "Honda", image: "/images/Honda.png" },
      { name: "Daihatsu", image: "/images/daihatsu.png" },
      { name: "Nissan", image: "/images/Nisan.png" },
      { name: "Hyundai", image: "/images/hyundai.png" },
      { name: "KIA", image: "/images/kia.png" },
      { name: "Mitsubishi", image: "/images/Mitsubishi.png" },
      { name: "Changan", image: "/images/changan.png" },
      { name: "Mercedes Benz", image: "/images/mercedes.png" },
      { name: "Haval", image: "/images/haval.png" },
      { name: "MG", image: "/images/MG.png" },
      { name: "Audi", image: "/images/Audi.png" },
      { name: "BMW", image: "/images/BMW.png" },
      { name: "Mazda", image: "/images/mazda.png" },
      { name: "FAW", image: "/images/FAW.png" },
      { name: "Lexus", image: "/images/Lexus.png" },
      { name: "JAC", image: "/images/jac.png" },
      { name: "DFSK", image: "/images/DFSK.png" },
      { name: "Prince", image: "/images/prince.png" },
      { name: "Proton", image: "/images/proton.png" },
      { name: "Peugeot", image: "/images/peugeot.png" },
      { name: "Subaru", image: "/images/Subaro.png" },
      { name: "Chevrolet", image: "/images/Chevrolet.png" },
    ],
    Model: [
      "Corolla",
      "Civic",
      "Mehran",
      "Alto",
      "Cultus",
      "City",
      "Wagon R",
      "Vitz",
      "Mira",
      "Bolan",
      "Swift",
      "Prado",
      "Passo",
      "Vezel",
      "Raize",
      "Sportage",
      "Hilux",
      "Cuore",
      "Land",
      "Cruiser",
      "Aqua",
      "Prius",
      "Yaris",
      "Sedan",
      "Khyber",
      "Dayz",
      "Santro",
      "Fortuner",
      "H6",
      "Yaris",
      "Hatchback",
      "Tucson",
      "Move",
    ],
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

  const cityData = [
    ...(allCities?.map((city) => ({
      label: city.cityName,
      value: city.id,
    })) || []),
  ];

  const allMakes = [
    ...allMake.map((make) => ({
      label: make?.brandName,
      value: make?.id,
    })),
  ];
  const auctionData = {
    budgets: [
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
    ],

    BodyType: [
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
    ],
  };

  const handleGetAllMakes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBrands`);
      setAllMake(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(res.data);
    }
  };

  const imageTabs = ["Make"];

  const isImageTab = imageTabs.includes(activeTab);

  const totalPages = isImageTab
    ? Math.ceil(tabData[activeTab].length / itemsPerPage)
    : 1;

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const paginatedItems = isImageTab
    ? tabData[activeTab].slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    : tabData[activeTab];

  const handleClickTabs = (active) => {
    setActiveTab((prev) => (prev === active ? "" : active));
  };

  useEffect(() => {
    handleGetAllMakes();
  }, []);
  return (
    <div className="p-10 max-w-[85rem]  mx-auto">
      <div className="items-center   flex-wrap  mb-6 border-b pb-2 ">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Search Your Dream Car
        </h1>
      </div>
      <div className="grid grid-cols-1  lg:grid-cols-4 gap-4">
        <Options
          datas={cityData}
          placeHolder="Please Select City"
          name="city"
          onChange={handleChange}
          value={filterData.city}
        />

        <Options
          datas={allMakes}
          placeHolder="Please Select Make"
          name="make"
          onChange={handleChange}
          value={filterData.make}
        />

        <Options
          datas={auctionData?.BodyType}
          placeHolder="Please Select BodyType"
          name="bodyStyle"
          onChange={handleChange}
          value={filterData.bodyStyle}
        />

        <select
          name="budget"
          className="border p-2 rounded w-full"
          onChange={handleFilterPrice}
          value={
            filterData.budget.min
              ? `${filterData.budget.min}-${filterData.budget.max}`
              : ""
          }
        >
          <option value="">Please select Budget</option>
          {auctionData.budgets.map((price) => (
            <option key={price.label} value={`${price.min}-${price.max}`}>
              {price.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TabsSection;
