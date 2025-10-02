import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";

// ---------------- CarCard -------------------
const CarCard = ({ car }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <div
      className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden  w-full"
      onClick={() => navigate(`/standardline/${car.id}`)}
    >
      <div className="relative w-full">
        <img
          src={car.images[0]}
          alt="car"
          onClick={() => navigate(`/standardline/${car.id}`)}
          className="w-96 lg:w-[96rem] h-48 object-cover rounded-t-xl hover:cursor-pointer p-2"
        />
      </div>

      <div className="p-4 space-y-2 text-gray-800">
        <h3 className="text-md font-bold gap-1.5">
          {car?.make}-{car?.model}
        </h3>
        <p className="text-sm">
          <span className=" font-bold">Demand Price:</span> {car?.buyNowPrice}
        </p>
        <p className="text-sm">
          <span className="font-bold">Location:</span> {car.cityName}
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
  const [visibleCards, setVisibleCards] = useState(4);
  const [allCars, setAllCars] = useState([]);

  const handleGetVehicles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/customer/getVehicles`);
      setAllCars(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetVehicles();
  }, []);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1); // Mobile: 1 card
      } else {
        setVisibleCards(4); // Desktop: 4 cards
      }
    };

    updateVisibleCards(); // run on load
    window.addEventListener("resize", updateVisibleCards);

    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const getVisibleCars = () => {
    return allCars.slice(currentIndex, currentIndex + visibleCards);
  };

  const nextCards = () => {
    if (currentIndex + visibleCards < allCars.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevCards = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="py-12 px-4 md:px-20 bg-[#f9fbfd]">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Available Cars
      </h2>
      <div className="relative flex flex-col items-center justify-center">
        {/* Desktop Arrows */}
        {allCars.length > visibleCards && (
          <button
            onClick={prevCards}
            disabled={currentIndex === 0}
            className="absolute left-0 md:-left-10 bg-white p-2 rounded-full shadow text-gray-700 z-10 hover:bg-gray-100 hidden lg:block disabled:opacity-50"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {getVisibleCars().map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {allCars.length > visibleCards && (
          <button
            onClick={nextCards}
            disabled={currentIndex + visibleCards >= allCars.length}
            className="absolute right-0 md:-right-10 bg-white p-2 rounded-full shadow text-gray-700 z-10 hover:bg-gray-100 hidden lg:block disabled:opacity-50"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Mobile Buttons */}
        {allCars.length > visibleCards && (
          <div className="flex lg:hidden gap-4 mt-6">
            <button
              onClick={prevCards}
              disabled={currentIndex === 0}
              className="bg-white p-2 rounded-full shadow text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextCards}
              disabled={currentIndex + visibleCards >= allCars.length}
              className="bg-white p-2 rounded-full shadow text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarCardSlider;
