import React, { useState, useMemo, useEffect } from "react";
import VehicleHeader from "../components/VehicleHeader";
import {
  FaMapMarkerAlt,
  FaGasPump,
  FaCarSide,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../components/Contant/URL";
const vehiclesData = [
  {
    id: 1,
    name: "Toyota Corolla 2025",
    brand: "Toyota",
    price: "PKR 59.7 - 75.5 lacs",
    year: 2025,
    fuel: "Petrol",
    mileage: "10 to 17",
    city: "Lahore",
    images: [
      "/images/toyota1.jpg",
      "/images/toyota2.jpg",
      "/images/toyota3.jpg",
      "/images/toyota4.jpg",
      "/images/toyota5.jpg",
      "/images/toyota6.jpg",
      "/images/toyota7.jpg",
      "/images/toyota8.jpg",
      "/images/toyota9.jpg",
      "/images/toyota10.jpg",
    ],
  },
  {
    id: 2,
    name: "Suzuki Alto 2025",
    brand: "Alto",
    price: "PKR 23.3 - 31.4 lacs",
    year: 2024,
    fuel: "Petrol",
    mileage: "18 to 22",
    city: "Lahore",
    images: [
      "/images/suzuki1.jpg",
      "/images/suzuki2.jpg",
      "/images/suzuki3.jpg",
      "/images/suzuki4.jpg",
      "/images/suzuki5.jpg",
      "/images/suzuki6.jpg",
      "/images/suzuki7.jpg",
      "/images/suzuki8.jpg",
      "/images/suzuki9.jpg",
      "/images/suzuki10.jpg",
    ],
  },
  {
    id: 3,
    name: "Honda City 2025",
    brand: "Honda",
    price: "PKR 46.5 - 58.5 lacs",
    year: 2025,
    fuel: "Petrol",
    mileage: "12 to 16",
    city: "Rawalpindi",
    images: [
      "/images/honda1.jpg",
      "/images/honda2.jpg",
      "/images/honda3.jpg",
      "/images/honda4.jfif",
      "/images/honda5.jpg",
      "/images/honda6.jpg",
      "/images/honda7.jpg",
      "/images/honda8.jpg",
      "/images/honda9.jpg",
      "/images/honda10.jpg",
    ],
  },
  {
    id: 4,
    name: "Honda Civic 2025",
    brand: "Honda",
    price: "PKR 86.6 - 99.0 lacs",
    year: 2025,
    fuel: "Petrol",
    mileage: "11 to 14",
    city: "Peshawar",
    images: [
      "/images/civic1.jpg",
      "/images/civic2.jpg",
      "/images/civic3.jpg",
      "/images/civic4.jpg",
      "/images/civic5.jpg",
      "/images/civic6.jpg",
      "/images/civic7.jpg",
      "/images/civic8.jpg",
      "/images/civic9.jpg",
      "/images/civic10.jpg",
    ],
  },
  {
    id: 5,
    name: "Toyota Fortuner",
    brand: "Toyota",
    price: "PKR 1.45 - 1.99 crore",
    year: 2024,
    fuel: "Petrol & Diesel",
    mileage: "8 to 11",
    city: "Islamabad",
    images: [
      "/images/fortuner1.jpg",
      "/images/fortuner2.jpg",
      "/images/fortuner3.jpg",
      "/images/fortuner4.jpg",
      "/images/fortuner5.jpg",
      "/images/fortuner6.jpg",
      "/images/fortuner7.jpg",
      "/images/fortuner8.jpg",
      "/images/fortuner9.jpg",
      "/images/fortuner10.jpg",
    ],
  },
  {
    id: 6,
    name: "Toyota Land Crusier",
    brand: "Toyota",
    price: "PKR 12.0 crore",
    year: 2025,
    fuel: "Petrol & Diesel",
    mileage: "9 to 10 ",
    city: "Gujranwala",
    images: [
      "/images/crusier1.png",
      "/images/crusier2.jpg",
      "/images/crusier3.jpg",
      "/images/crusier4.jpg",
      "/images/crusier5.jpg",
      "/images/crusier6.avif",
      "/images/crusier7.avif",
    ],
  },
  {
    id: 7,
    name: "Toyota Hilux 2025",
    brand: "Toyota",
    price: "PKR 1.1 - 1.54 crore",
    year: 2024,
    fuel: "Diesel",
    mileage: "10 to 13",
    city: "Karachi",
    images: [
      "/images/hilux1.png",
      "/images/hilux2.jpg",
      "/images/hikux3.jpg",
      "/images/hilux4.jpg",
      "/images/hilux5.jpg",
      "/images/hilux6.jpg",
      "/images/hilux7.jpg",
      "/images/hilux8.jpg",
      "/images/hilux9.jpg",
      "/images/hilux10.jpg",
    ],
  },
  {
    id: 8,
    name: "Suzuki Liana 2006",
    brand: "Suzuki",
    price: "PKR 12.9 lacs",
    year: 2006,
    fuel: "Petrol",
    mileage: "103,799",
    city: "Rawalpindi",
    images: [
      "/images/liana1.jpg",
      "/images/liana2.jpg",
      "/images/liana3.png",
      "/images/liana4.jpg",
      "/images/liana5.jpg",
      "/images/liana6.png",
      "/images/liana7.jpg",
      "/images/liana8.jpg",
      "/images/liana9.jpg",
      "/images/liana10.jpg",
    ],
  },
  {
    id: 9,
    name: "Toyota Yaris Sedan ATIV X CVT 1.5",
    brand: "Toyota",
    price: "PKR 46.5 lacs",
    year: 2021,
    fuel: "Petrol",
    mileage: "56,000 km",
    city: "Islamabad",
    images: [
      "/images/yaris1.jpg",
      "/images/yaris2.jpg",
      "/images/yaris3.jpg",
      "/images/yaris4.jpg",
      "/images/yaris5.jpg",
      "/images/yaris6.jpg",
      "/images/yaris7.jpg",
      "/images/yaris8.jpg",
      "/images/yaris9.jpg",
      "/images/yaris10.jpg",
    ],
  },
  {
    id: 10,
    name: "Audi A3 1.2 TFSI",
    brand: "Audi",
    price: "PKR 74 lacs",
    year: 2017,
    fuel: "Diesel",
    mileage: "122,321 km",
    city: "Lahore",
    images: [
      "/images/audi1.jpg",
      "/images/audi2.jpg",
      "/images/audi3.jpg",
      "/images/audi4.jpg",
      "/images/audi5.jpg",
      "/images/audi6.jpg",
      "/images/audi7.jpg",
      "/images/audi8.jpg",
      "/images/audi9.jpg",
      "/images/audi10.jpg",
    ],
  },
  {
    id: 11,
    name: "Daihatsu Move X 2022",
    brand: "Daihatsu",
    price: "PKR 36.3 lacs",
    year: 2022,
    fuel: "Petrol",
    mileage: "40,344 km",
    city: "Lahore",
    images: [
      "/images/move1.jpg",
      "/images/move2.jpg",
      "/images/move3.png",
      "/images/move4.png",
      "/images/move5.jpg",
      "/images/move6.jpg",
    ],
  },
  {
    id: 12,
    name: "Chery Tiggo 4 Pro",
    brand: "Chery",
    price: "PKR 69.3 lacs",
    year: 2025,
    fuel: "Petrol",
    mileage: "14 to 15",
    city: "Multan",
    images: [
      "/images/tiggo1.jpg",
      "/images/tiggo2.jpg",
      "/images/tiggo3.jpg",
      "/images/tiggo4.jpg",
      "/images/tiggo5.jpg",
      "/images/tiggo6.jpg",
      "/images/tiggo7.jpg",
      "/images/tiggo8.jpg",
      "/images/tiggo9.jpg",
      "/images/tiggo10.jpg",
      "/images/tiggo11.jpg",
      "/images/tiggo12.jpg",
      "/images/tiggo13.jpg",
      "/images/tiggo14.jpg",
      "/images/tiggo15.jpg",
    ],
  },
];

const makes = [
  "Suzuki",
  "Toyota",
  "Honda",
  "Daihatsu",
  "Nissan",
  "Hyundai",
  "KIA",
  "Mitsubishi",
  "Changan",
  "Mercedes Benz",
  "Haval",
  "MG",
  "Audi",
  "BMW",
  "Mazda",
  "FAW",
  "Lexus",
  "JAC",
  "DFSK",
  "Prince",
  "Proton",
  "Peugeot",
  "Subaru",
  "Chevrolet",
];
const fuels = ["Petrol", "Diesel", "Electric", "Manual"];

const cities = [
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
];

export default function UsedCars() {
  const [search, setSearch] = useState("");

  const [filterMake, setFilterMake] = useState("");

  const [filterFuel, setFilterFuel] = useState("");

  const [filterCity, setFilterCity] = useState("");

  const [sortBy, setSortBy] = useState("");

  const [allMakes, setAllMakes] = useState([]);

  const [allModels, setAllModels] = useState([]);

  console.log({ allMakes, allModels });

  const [currentPage, setCurrentPage] = useState(1);

  console.log("current page ", currentPage);

  const [selectCars, setSelectCars] = useState([]);

  const vehiclesPerPage = 3;

  const [selectedImagesIndex, setSelectedImagesIndex] = useState({});

  const { type } = useParams();

  const [modal, setModal] = useState({
    isOpen: false,
    vehicleId: null,
    imgIndex: 0,
  });

  const filteredVehicles = useMemo(() => {
    let filtered = [...vehiclesData];

    if (search.trim()) {
      filtered = filtered.filter((v) =>
        v.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterMake) filtered = filtered.filter((v) => v.brand === filterMake);
    if (filterFuel) filtered = filtered.filter((v) => v.fuel === filterFuel);
    if (filterCity) filtered = filtered.filter((v) => v.city === filterCity);

    if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc")
      filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "year-desc") filtered.sort((a, b) => b.year - a.year);

    return filtered;
  }, [search, filterMake, filterFuel, filterCity, sortBy]);

  const indexOfLast = currentPage * vehiclesPerPage;
  const indexOfFirst = indexOfLast - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

  const handleThumbnailClick = (vehicleId, idx) => {
    setSelectedImagesIndex((prev) => ({
      ...prev,
      [vehicleId]: idx,
    }));
  };

  const openModal = (vehicleId, idx) => {
    setModal({ isOpen: true, vehicleId, imgIndex: idx });
  };

  const navigate = useNavigate();

  const closeModal = () =>
    setModal({ isOpen: false, vehicleId: null, imgIndex: 0 });

  const modalNext = () => {
    const vehicle = vehiclesData.find((v) => v.id === modal.vehicleId);
    if (!vehicle) return;
    setModal((m) => ({
      ...m,
      imgIndex: (m.imgIndex + 1) % vehicle.images.length,
    }));
  };
  const modalPrev = () => {
    const vehicle = vehiclesData.find((v) => v.id === modal.vehicleId);
    if (!vehicle) return;
    setModal((m) => ({
      ...m,
      imgIndex:
        (m.imgIndex - 1 + vehicle.images.length) % vehicle.images.length,
    }));
  };

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/customer/getVehicleByMake?requestedMake=${type}&page=${currentPage} `
      );
      setSelectCars(res.data);
    } catch (error) {
      console.error(
        "Error fetching vehicles:",
        error.response?.data || error.message
      );
    }
  };

  const handleGetMakes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getMake`);

      setAllMakes(res.data);
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

  useEffect(() => {
    handleGetModels();
    handleGetMakes();
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [currentPage]);

  return (
    <>
      <VehicleHeader />
      <div className="min-h-screen bg-gray-50 px-6 py-8 max-w-7xl mx-auto font-sans">
        <h1 className="text-4xl  font-extrabold mb-8 text-center text-[#233d7b]">
          Find Your Perfect Cars
        </h1>

        <div className="bg-white p-5 rounded-xl shadow-md mb-10 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name..."
            className="col-span-2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b]"
            value={filterMake}
            onChange={(e) => setFilterMake(e.target.value)}
          >
            <option value="">All Makes</option>
            {allMakes.map((make, index) => (
              <option key={index} value={make?.make}>
                {make?.make}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b]"
            value={filterFuel}
            onChange={(e) => setFilterFuel(e.target.value)}
          >
            <option value="">All Fuel Types</option>
            {fuels.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b]"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="year-desc">Newest First</option>
          </select>
        </div>

        {(selectCars && selectCars?.length === 0) ||
        selectCars?.length === null ? (
          <p className="text-center text-gray-400 text-lg">No cars found.</p>
        ) : (
          <div className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-[#233d7b] scrollbar-track-gray-200 pb-4">
            {selectCars?.length > 0 &&
              selectCars &&
              selectCars?.map((vehicle) => {
                return (
                  <div
                    key={vehicle.id}
                    className="flex-shrink-0 w-[350px] bg-white rounded-2xl shadow-lg p-5 flex flex-col"
                    onClick={() => navigate(`/standardline/${vehicle.id}`)}
                  >
                    <div className="relative cursor-pointer mb-3 rounded-lg overflow-hidden group">
                      <img
                        src={vehicle.image}
                        alt={` main`}
                        className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <h2 className="text-xl font-semibold mb-1 truncate text-[#233d7b] hover:underline cursor-pointer">
                      {vehicle.model}
                    </h2>

                    <p className="text-[#3eb549] font-bold mb-2">
                      {vehicle.buyNowPrice.toLocaleString()}
                    </p>
                    <div className="flex flex-wrap gap-2 text-gray-600 text-sm mb-3">
                      <div className="flex items-center space-x-1">
                        <FaGasPump />
                        <span>{vehicle.fuelType}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaCarSide />
                        <span>{vehicle.mileage.toLocaleString()} km</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaMapMarkerAlt />
                        <span>{vehicle.locationId}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Year:</span>
                        <span>{vehicle?.year}</span>
                      </div>
                    </div>

                    

                    <Link
                      to="/contact"
                      className="mt-auto bg-[#b73439] hover:bg-[#518ecb] text-white text-center rounded-md py-2 transition"
                    >
                      Contact Us
                    </Link>
                  </div>
                );
              })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#b73439] text-white rounded disabled:opacity-50 hover:bg-[#518ecb] transition"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === idx + 1
                    ? "bg-[#233d7b] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                } transition`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#518ecb] text-white rounded disabled:opacity-50 hover:bg-[#b73439] transition"
            >
              Next
            </button>
          </div>
        )}

        {modal.isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-50"
            onClick={closeModal}
          >
            {/* Close Button */}
            <button
              className="absolute top-5 right-5 text-white text-3xl p-2 hover:text-[#233d7b] transition"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
