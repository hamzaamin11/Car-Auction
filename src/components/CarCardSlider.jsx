import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";

// ---------------- CarCard -------------------
const CarCard = ({ car }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("car => ", car);

  const navigate = useNavigate();

  const openModal = (index) => {
    setImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const nextModalImage = () => {
    if (Array.isArray(car.image)) {
      setImageIndex((prev) => (prev + 1) % car.image.length);
    }
  };

  const prevModalImage = () => {
    if (Array.isArray(car.image)) {
      setImageIndex((prev) => (prev === 0 ? car.image.length - 1 : prev - 1));
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden max-w-xs w-full">
      <div
        onClick={() => navigate(`/standardline/${car.id}`)}
        className="relative"
      >
        <img
          src={car.images[1]}
          alt={"car"}
          onClick={() => openModal(0)}
          className="w-full h-48 object-cover rounded-t-xl hover:cursor-pointer"
        />
      </div>

      <div className="p-4 space-y-2 text-gray-800">
        <h3 className="text-lg font-semibold">{car?.model}</h3>
        <p className="text-sm">
          <span className="font-medium">Current Bid:</span> {car?.currentBid}
        </p>
        <p className="text-sm">
          <span className="font-medium">Location:</span> {car.locationId}
        </p>

        {/* Static Reviews */}
        <p className="text-sm flex items-center gap-1">
          <span className="font-medium">Reviews:</span>
          <span className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="0"
              >
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.401 8.171L12 18.896l-7.335 3.867 1.401-8.171L.132 9.21l8.2-1.192z" />
              </svg>
            ))}
          </span>
        </p>

        <span
          onClick={() => navigate(`/standardline/${car.id}`)}
          className="block bg-[#ed3237] hover:bg-red-700 text-center text-sm font-semibold text-white py-2 rounded transition hover:cursor-pointer"
        >
          View Details
        </span>
      </div>

      {/* MODAL */}
      {isModalOpen && Array.isArray(car.image) && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white bg-gray-700 p-1 rounded-full hover:bg-red-500"
          >
            <X size={24} />
          </button>
          <button
            onClick={prevModalImage}
            className="absolute left-5 text-white bg-gray-700 p-2 rounded-full hover:bg-gray-600"
          >
            <ChevronLeft size={28} />
          </button>

          <img
            src={car.image[imageIndex]}
            alt="Car Modal"
            className="max-w-[90%] max-h-[80vh] object-contain rounded"
          />

          <button
            onClick={nextModalImage}
            className="absolute right-5 text-white bg-gray-700 p-2 rounded-full hover:bg-gray-600"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
};

// ---------------- CarCardSlider -------------------
const CarCardSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCards = 3;
  const [allCars, setAllCars] = useState([]);

  const navigate = useNavigate();

  const handleGetVehicles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/customer/getVehicles`);
      setAllCars(res.data);
      console.log("get All vehicles", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetVehicles();
  }, []);

  const getVisibleCars = () => {
    const total = allCars.length;
    const count = Math.min(visibleCards, total);

    return Array.from(
      { length: count },
      (_, offset) => allCars[(currentIndex + offset) % total]
    );
  };

  const nextCards = () => {
    setCurrentIndex((prev) => (prev + 1) % allCars.length);
  };

  const prevCards = () => {
    setCurrentIndex((prev) => (prev === 0 ? allCars.length - 1 : prev - 1));
  };

  return (
    <div className="py-12 px-4 md:px-20 bg-[#f9fbfd]">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Available Cars
      </h2>
      <div className="relative flex items-center justify-center">
        {allCars.length > visibleCards && (
          <button
            onClick={prevCards}
            className="absolute left-0 md:-left-10 bg-white p-2 rounded-full shadow text-gray-700 z-10 hover:bg-gray-100"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {getVisibleCars().map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {allCars.length > visibleCards && (
          <button
            onClick={nextCards}
            className="absolute right-0 md:-right-10 bg-white p-2 rounded-full shadow text-gray-700 z-10 hover:bg-gray-100"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CarCardSlider;
