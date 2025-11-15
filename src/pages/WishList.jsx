/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaCarSide } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeInList } from "../components/Redux/WishlistSlice";
import Swal from "sweetalert2";

export const WishList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get current user and wishlist data
  const currentUser = useSelector((state) => state?.auth?.currentUser);
  const wishlistByUser = useSelector((state) => state?.wishList?.wishlistByUser);

  // Get current user's wishlist only
  const wishVehicle = useMemo(() => {
    if (!currentUser?.id) return [];
    return wishlistByUser?.[currentUser.id] || [];
  }, [currentUser, wishlistByUser]);

  const handleRemove = (vehicleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This vehicle will be removed from your wishlist.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeInList({ 
          userId: currentUser.id, 
          vehicleId: vehicleId 
        }));
        Swal.fire("Removed!", "Vehicle has been removed.", "success");
      }
    });
  };

  // Show message if user is not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-5xl mx-auto text-center py-20">
          <FaCarSide className="text-gray-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Please Log In</h2>
          <p className="text-gray-500">You need to be logged in to view your wishlist.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section / Banner */}
      <div
        className="relative w-full h-99 flex items-center justify-center"
        style={{
          backgroundImage: "url('/banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Black overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* Text */}
        <h1 className="relative text-white text-3xl md:text-4xl font-bold text-center px-4">
           Keep Track of Your Favorite Vehicles
        </h1>
      </div>

      {/* Header */}
    <div className="max-w-5xl mx-auto mb-2 flex items-center justify-between px-4 py-6">


        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 ">
         
          My Wishlist
        </h1>
         <p className="text-sm text-gray-600 ml-auto">
    {wishVehicle.length} {wishVehicle.length === 1 ? 'vehicle' : 'vehicles'}
  </p>
      </div>

      {/* Wishlist Grid */}

<div
  className="
    max-w-5xl 
    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
    gap-4        /* <-- SPACE BETWEEN CARDS */
    pb-6 -mt-5 
    px-4
    mx-auto
    sm:px-3
    
  "
>


  {wishVehicle?.length > 0 ? (
    wishVehicle?.map((car) => (
      <div
        key={car.id}
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
      >
        {/* Car Image */}
        <img
          src={car.images[0]}
          alt={`${car.make} ${car.model}`}
          className="w-full h-40 object-cover"
        />

        {/* Car Details */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 text-[15px]">
            {car.make} {car.model} ({car.year})
          </h3>
          <p className="text-md font-bold text-gray-700 mb-1 text-[13px]">
            Price: ${car?.buyNowPrice}
          </p>
          <p className="text-sm text-gray-600 mb-2 text-[13px]">
            <span className="font-medium text-[13px]">Location:</span> {car.cityName}
          </p>

          {/* Buttons */}
          <div className="mt-auto flex justify-between items-center gap-2">
            <button
              onClick={() => navigate(`/detailbid/${car.id}`)}
              className="bg-blue-950 text-white text-sm font-semibold px-4 py-2 rounded transition"
            >
              View Details
            </button>

            <button
              onClick={() => handleRemove(car.id)}
              className="bg-red-600 text-white text-sm font-semibold px-7 py-2 rounded transition"
              title="Remove from wishlist"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-full text-center py-10 text-gray-500">
      <FaCarSide className="text-gray-300 text-5xl mx-auto mb-3" />
      <p className="text-lg font-medium">No vehicles in your wishlist yet.</p>
      <p className="text-sm mt-1">Start adding vehicles to keep track of your favorites!</p>
    </div>
  )}
</div>

    </div>
  );
};
