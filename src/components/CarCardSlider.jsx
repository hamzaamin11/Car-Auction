import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addInList } from "./Redux/WishlistSlice";
import Swal from "sweetalert2";

// ---------------- CarCard -------------------
const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state?.auth?.currentUser);
  const wishlistByUser = useSelector(
    (state) => state?.wishList?.wishlistByUser
  );

  const isInWishlist =
    currentUser?.id &&
    wishlistByUser?.[currentUser.id]?.some((v) => v.id === car.id);

  const handleWishlist = (e) => {
    e.stopPropagation(); // ← THIS IS THE KEY FIX

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

    if (isInWishlist) return; // already in wishlist → do nothing

    dispatch(addInList({ userId: currentUser.id, vehicle: car }));
  };

  const goToDetail = () => navigate(`/detailbid/${car.id}`);

  return (
    <div className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-full h-full flex flex-col cursor-pointer">
      {/* Image */}
      <div className="relative w-full">
        <img
          src={car.images[0]}
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover rounded-t-xl"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-1 flex-grow flex flex-col">
        {/* Desktop: Heart at top-right */}
        <div className="flex justify-end -mt-2 relative z-20">
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full transition-all duration-300 ${
              isInWishlist
                ? "text-red-600"
                : "text-gray-400 hover:text-red-600 hover:bg-red-50"
            }`}
          >
            <FaHeart size={20} className={isInWishlist ? "fill-current" : ""} />
          </button>
        </div>

        {/* Mobile: Title + Heart */}
        <div className="flex sm:hidden justify-between items-center relative z-20">
          <h3 className="text-[15px] font-bold text-gray-800 line-clamp-1">
            {car?.make} {car?.model}
          </h3>
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full transition-all duration-300 ${
              isInWishlist
                ? "text-red-600"
                : "text-gray-400 hover:text-red-600 hover:bg-red-50"
            }`}
          >
            <FaHeart size={20} className={isInWishlist ? "fill-current" : ""} />
          </button>
        </div>

        {/* Desktop Title (below heart) */}
        <h3 className="hidden sm:block text-[15px] font-bold text-gray-800 -mt-6 relative z-10">
          {car?.make} {car?.model}
        </h3>

        {/* Details */}
        <p className="text-sm text-gray-800 text-[13px]">
          <span className="font-medium">Lot#</span> {car.lot_number}
        </p>
        <p className="text-sm text-black text-[13px]">
          <span className="font-medium">Model Year:</span> {car.year}
        </p>
        <p className="text-sm text-black text-[13px]">
          <span className="font-medium">Current Bid:</span>{" "}
          {car?.auctionStatus === "live" ? (
            <span className="font-bold text-green-600">Start the Bidding</span>
          ) : (
            <span className="font-bold">
              PKR {car?.buyNowPrice?.toLocaleString()}
            </span>
          )}
        </p>
        <p className="text-sm text-black text-[13px]">
          <span className="font-medium">Location:</span> {car.cityName}
        </p>

        <button
          onClick={goToDetail}
          className="mt-3 block bg-blue-950 text-center text-sm text-[13px] font-semibold text-white py-2 rounded transition-all duration-300"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// ---------------- CarCardSlider -------------------
const CarCardSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [allCars, setAllCars] = useState([]);

  // Fetch vehicles
  const handleGetVehicles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getApprovedVehicles`);
      setAllCars(res.data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };

  useEffect(() => {
    handleGetVehicles();
  }, []);

  // Responsive visible cards
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

  // Slider controls
  const prevCards = () => {
    setCurrentIndex((prev) => Math.max(0, prev - visibleCards));
  };

  const nextCards = () => {
    setCurrentIndex((prev) =>
      Math.min(allCars.length - visibleCards, prev + visibleCards)
    );
  };

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

      <div className="relative">
        {/* Left Arrow */}
        {allCars.length > visibleCards && (
          <button
            onClick={prevCards}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 md:-left-12 bg-white p-2 rounded-full shadow-lg text-gray-700 z-20 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {getVisibleCars().map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {/* Right Arrow */}
        {allCars.length > visibleCards && (
          <button
            onClick={nextCards}
            disabled={currentIndex + visibleCards >= allCars.length}
            className="absolute right-0 top-1/2 -translate-y-1/2 md:-right-12 bg-white p-2 rounded-full shadow-lg text-gray-700 z-20 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CarCardSlider;
