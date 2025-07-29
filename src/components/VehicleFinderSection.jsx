import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path as needed
import axios from "axios";
import { BASE_URL } from "./Contant/URL";

const carsData = [
  {
    id: 1,
    name: "Toyota Corolla",
    model: "Corolla",
    make: "Toyota",
    year: "2021",
    price: 2500000,
    image: "/images/toyota1.jpg",
    reviews: 4.2,
    condition: "used",
    city: "Karachi",
    category: "Sedan",
  },
  {
    id: 2,
    name: "Honda Civic",
    model: "Civic",
    make: "Honda",
    year: "2023",
    price: 3000000,
    image: "/images/civic1.jpg",
    reviews: 4.7,
    condition: "new",
    city: "Lahore",
    category: "Sedan",
  },
  {
    id: 3,
    name: "Suzuki Alto",
    model: "Alto",
    make: "Suzuki",
    year: "2019",
    price: 1800000,
    image: "/images/suzuki1.jpg",
    reviews: 3.9,
    condition: "used",
    city: "Islamabad",
    category: "Hatchback",
  },
  {
    id: 4,
    name: "Suzuki Swift",
    model: "Swift",
    make: "Suzuki",
    year: "2022",
    price: 4000000,
    image: "/images/swift1.jpg",
    reviews: 4.5,
    condition: "new",
    city: "Karachi",
    category: "SUV",
  },
  {
    id: 5,
    name: "Hyundai Sonata",
    model: "Sonata",
    make: "Hyundai",
    year: "2020",
    price: "PKR 99.3 lacs - 1.59 crore",
    image: "/images/sonata1.jpg",
    reviews: 4.3,
    condition: "New",
    city: "Multan",
    category: "SUV",
  },
  {
    id: 6,
    name: "KIA Stonic",
    model: "Stonic",
    make: "KIA",
    year: "2025",
    price: "PKR 55.0 lacs",
    image: "/images/stonic1.jpg",
    reviews: 4.8,
    condition: "new",
    city: "Karachi",
    category: "Sports",
  },
  {
    id: 7,
    name: "Suzuki Cultus 2025",
    model: "Cultus",
    make: "Suzuki",
    year: "2025",
    price: "PKR 42.3 - 46.2 lacs",
    image: "/images/cultus1.png",
    reviews: 4.5,
    condition: "new",
    city: "Gujranwala",
    category: "hatchback",
  },
  {
    id: 8,
    name: "Toyota Yaris",
    model: "Yaris",
    make: "Toyota",
    year: "2025",
    price: "PKR 44.8 - 63.2 lacs ",
    image: "/images/yaris2.jpg",
    reviews: 4.1,
    condition: "new",
    city: "Multan",
    category: "sedan",
  },
  {
    id: 9,
    name: "Daihatsu Mira X SA lll",
    model: "MIRA",
    make: "DAIHATSU",
    year: "2021",
    price: "PKR 36.75 lacs",
    image: "/images/mira1.jpg",
    reviews: 3.9,
    condition: "used",
    city: "Rawalpindi",
    category: "hatchback",
  },
  {
    id: 10,
    name: "Toyota Vitz F 1.0",
    model: "Vitz",
    make: "Toyota",
    year: "2016",
    price: "PKR 33 lacs",
    image: "/images/vitz1.jpg",
    reviews: 3.5,
    condition: "used",
    city: "karachi",
    category: "hatchback",
  },
  {
    id: 11,
    name: "Haval H6 HEV",
    model: "H6 HEV",
    make: "Haval",
    year: "2025",
    price: "PKR 11,749,000 crore",
    image: "/images/haval1.jpg",
    reviews: 4.4,
    condition: "used",
    city: "Islamabad",
    category: "SUV",
  },
  {
    id: 12,
    name: "Honda N Wgn 2021",
    model: "2021",
    make: "Honda",
    year: "2021",
    price: "PKR 35.5 lacs",
    image: "/images/wgn1.jpg",
    reviews: 4.6,
    condition: "used",
    city: "Multan",
    category: "N/A",
  },
];

const VehicleFinderSection = () => {
  const { user } = useAuth(); // 👈 Get the logged-in user

  const [filters, setFilters] = useState({
    model: "",
    make: "",
    year: "",
    price: "",
    condition: "all",
  });
  const [allCars, setAllCars] = useState([]);

  const [filteredCars, setFilteredCars] = useState(allCars);

  console.log(filters.condition);

  const [allMakes, setAllmakes] = useState([]);

  const [allModels, setAllModels] = useState([]);

  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = 4;

  const handleGetCars = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/customer/getVehicles?vehicleCondition=${filters.condition}&make=${filters.make}&model=${filters.model}&year=${filters.year}&buyNowPrice=${filters.price}`
      );
      setAllCars(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetMakes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getMake`);

      setAllmakes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetModels = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getModel`);
      setAllModels(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const result = carsData.filter((car) => {
      return (
        (filters.model === "" || car.model === filters.model) &&
        (filters.make === "" || car.make === filters.make) &&
        (filters.year === "" || car.year === filters.year) &&
        (filters.price === "" || car.price <= parseInt(filters.price)) &&
        (filters.condition === "all" || car.condition === filters.condition)
      );
    });
    setFilteredCars(result);
    setStartIndex(0);
  };

  const handleTabClick = (tab) => {
    setFilters({ ...filters, condition: tab });
    if (tab === "all") {
      setFilteredCars(carsData);
    } else {
      setFilteredCars(carsData.filter((car) => car.condition === tab));
    }
    setStartIndex(0);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <span className="text-yellow-400 text-lg">
        {"★".repeat(fullStars)}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  const prevCards = () => {
    setStartIndex((prev) =>
      prev - cardsPerPage < 0
        ? Math.max(filteredCars.length - cardsPerPage, 0)
        : prev - cardsPerPage
    );
  };

  const nextCards = () => {
    setStartIndex((prev) =>
      prev + cardsPerPage >= filteredCars.length ? 0 : prev + cardsPerPage
    );
  };

  const visibleCars = filteredCars.slice(startIndex, startIndex + cardsPerPage);

  const calcYearVal = () => {
    const possibleYearValue = [];
    const currentYear = new Date().getFullYear();
    for (let i = 1970; i <= currentYear; i++) {
      possibleYearValue.unshift(i);
    }
    return possibleYearValue;
  };
  const years = calcYearVal();

  const generateCarPrices = () => {
    const prices = [];
    const start = 1000000;
    const end = 200000000;
    const step = 2000000;

    for (let price = start; price <= end; price += step) {
      prices.push(price);
    }

    return prices;
  };

  const allPrices = generateCarPrices();

  useEffect(() => {
    handleGetCars();
    handleGetMakes();
    handleGetModels();
  }, [
    filters.condition,
    filters.make,
    filters.model,
    filters.year,
    filters.price,
  ]);
  return (
    <div className="max-w-7xl mx-auto p-6 font-sans">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
        <select
          name="make"
          value={filters?.make}
          onChange={handleChange}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Select Make</option>
          {allMakes.length > 0 &&
            allMakes?.map((make) => (
              <option key={make?.make} value={make?.make}>
                {make?.make}
              </option>
            ))}
        </select>

        <select
          name="model"
          value={filters?.model}
          onChange={handleChange}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Select Model</option>
          {allModels?.map((model) => (
            <option key={model?.model} value={model?.model}>
              {model?.model}
            </option>
          ))}
        </select>

        <select
          name="year"
          value={filters.year}
          onChange={handleChange}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          name="price"
          value={filters.price}
          onChange={handleChange}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Max Price</option>
          {allPrices?.map((price) => (
            <option key={price} value={price}>
              {price}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="bg-[#b73439] text-white rounded px-5 py-2 font-semibold hover:bg-[#518ecb] transition"
        >
          Search
        </button>
      </div>

      {/* Tabs */}
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

      {/* Cars */}
      {allCars.length === 0 ? (
        <div className="flex items-center justify-center text-xl font-bold text-gray-500">
          {" "}
          No car found{" "}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 flex flex-col"
            >
              <img
                src={car?.image}
                alt={"car"}
                className="w-full h-44 object-contain rounded-t-lg bg-white"
              />
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{car.model}</h3>
                  <p className="text-gray-700 font-semibold mb-1">
                    Price: PKR {car.buyNowPrice}
                  </p>
                  <p className="mb-1">{renderStars(car.reviews)}</p>
                  <p className="text-sm text-gray-600">
                    Condition:{" "}
                    <span
                      className={
                        car.condition === "new"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {car.vehicleCondition.toUpperCase()}
                    </span>
                  </p>

                  <p className="text-sm text-gray-600">
                    Model Year: <span>{car.year}</span>
                  </p>
                </div>

                <div className="mt-3 flex justify-between">
                  {user?.role === "customer" && (
                    <Link
                      to="/make-bidding"
                      className=" text-white text-sm px-3 py-1 rounded hover:bg-green-600"
                    ></Link>
                  )}

                  <Link
                    to="/join"
                    className="bg-[#b73439] text-white text-sm px-3 py-1 rounded hover:bg-red-700"
                  >
                    Join Auctions
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevCards}
          className="bg-[#518ecb] text-white px-5 py-2 rounded hover:bg-[#518ecb]"
        >
          ‹ Prev
        </button>
        <button
          onClick={nextCards}
          className="bg-[#518ecb] text-white px-5 py-2 rounded hover:bg-[#518ecb]"
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

export default VehicleFinderSection;
