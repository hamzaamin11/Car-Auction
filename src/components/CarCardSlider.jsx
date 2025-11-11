import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addInList } from "./Redux/WishlistSlice";
import Swal from "sweetalert2";

// ---------------- CarCard  -------------------
const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("car = >", car);

  const currentUser = useSelector((state) => state?.auth?.currentUser);
  const wishlistByUser = useSelector(
    (state) => state?.wishList?.wishlistByUser
  );

  const isInWishlist =
    currentUser?.id &&
    wishlistByUser?.[currentUser.id]?.some((v) => v.id === car.id);

  const handleWishlist = () => {
    if (!currentUser) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to add vehicles to your wishlist.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    dispatch(addInList({ userId: currentUser.id, vehicle: car }));
  };

  const handleTodayAuction = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/todayAuction`);
      console.log("home =>", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleTodayAuction();
  }, []);
  return (
    <div className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-full h-full flex flex-col ">
      <div className="relative w-full">
        <img
          src={car.images[0]}
          alt="car"
          className="w-full h-48 object-cover rounded-t-xl hover:cursor-pointer"
          onClick={() => navigate(`/detailbid/${car.id}`)}
        />
      </div>

      <div className="relative group p-4 space-y-1 text-gray-800 flex-grow flex flex-col bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 ">
        {/* For Desktop → Heart at top right */}
        <div className="hidden sm:flex justify-end">
          <button
            onClick={handleWishlist}
            disabled={isInWishlist}
            className={`p-2 rounded-full transition-all duration-300 ${
              isInWishlist
                ? "text-red-600 cursor-default"
                : "text-gray-400 hover:text-red-600 hover:bg-red-50"
            }`}
          >
            <FaHeart size={20} className={isInWishlist ? "fill-current" : ""} />
          </button>
        </div>

        {/* Title + Heart (for Mobile) */}
        <div className="flex sm:hidden justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 transition">
            {car?.make} {car?.model}
          </h3>

          <button
            onClick={handleWishlist}
            disabled={isInWishlist}
            className={`p-2 rounded-full transition-all duration-300 ${
              isInWishlist
                ? "text-red-600 cursor-default"
                : "text-gray-400 hover:text-red-600 hover:bg-red-50"
            }`}
          >
            <FaHeart size={20} className={isInWishlist ? "fill-current" : ""} />
          </button>
        </div>

        {/* Keep original title for desktop only */}
        <h3 className="hidden sm:block text-lg font-bold  text-gray-800 transition">
          {car?.make} {car?.model}
        </h3>
        <p className="text-sm text-gray-800">
          <span className="font-base text-gray-800">Lot#</span> {car.lot_number}
        </p>
        <p className="text-sm text-black">
          <span className="font-base text-black">Model Year:</span> {car.year}
        </p>

        <p className="text-sm text-black">
          <span className="font-base text-black">Current Bid:</span>{" "}
          <span className="text-black font-bold">
            PKR {car?.buyNowPrice?.toLocaleString()}
          </span>
        </p>

        <p className="text-sm text-black">
          <span className="font-base text-black">Location:</span> {car.cityName}
        </p>

        <span
          onClick={() => navigate(`/detailbid/${car.id}`)}
          className="mt-auto block bg-red-600 text-center text-sm font-semibold text-white py-2 rounded transition-all duration-300 cursor-pointer"
        >
          View Details
        </span>
      </div>
    </div>
  );
};

// ---------------- CarCardSlider  -------------------
const CarCardSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [allCars, setAllCars] = useState([]);

  // Fetch
  const handleGetVehicles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getApprovedVehicles`);
      setAllCars(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetVehicles();
  }, []);

  // Responsive
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 768) setVisibleCards(2);
      else if (window.innerWidth < 1024) setVisibleCards(3);
      else setVisibleCards(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
  // ONLY THESE TWO FUNCTIONS CHANGED
  const prevCards = () => {
    setCurrentIndex((prev) => Math.max(0, prev - visibleCards));
  };

  const nextCards = () => {
    setCurrentIndex((prev) =>
      Math.min(allCars.length - visibleCards, prev + visibleCards)
    );
  };
  // ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←

  const getVisibleCars = () =>
    allCars.slice(currentIndex, currentIndex + visibleCards);

  return (
    <div className="py-12 px-4 md:px-20 bg-gray-100">
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800 animate-fade-in">
        Popular Vehicles
      </h2>

      <div className="relative flex items-center justify-center">
        {allCars.length > visibleCards && (
          <button
            onClick={prevCards}
            disabled={currentIndex === 0}
            className="absolute left-0 md:-left-10 bg-white p-2 rounded-full shadow text-gray-700 z-10 hover:bg-red-600 hover:text-white transition-transform hover:scale-110"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            <ChevronLeft size={24} className="md:w-7 md:h-7" />
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
          {getVisibleCars().map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {allCars.length > visibleCards && (
          <button
            onClick={nextCards}
            disabled={currentIndex + visibleCards >= allCars.length}
            className="absolute right-0 md:-right-10 bg-white p-2 rounded-full shadow text-gray-700 z-10 hover:bg-red-600 hover:text-white disabled:opacity-50 transition-transform hover:scale-110"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            <ChevronRight size={24} className="md:w-7 md:h-7" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CarCardSlider;
