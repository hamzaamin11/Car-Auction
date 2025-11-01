/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaCarSide } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeInList } from "../components/Redux/WishlistSlice";
import Swal from "sweetalert2";

export const WishList = () => {
  const navigate = useNavigate();

  const { wishVehicle } = useSelector((state) => state?.wishList);

  const dispatch = useDispatch();

  // Example static wishlist data (replace this with Redux or Context data)
  const handleRemove = (id) => {
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
        dispatch(removeInList(id));
        Swal.fire("Removed!", "Vehicle has been removed.", "success");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaCarSide className="text-red-600" />
          My Wishlist
        </h1>
      </div>

      {/* Wishlist Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {car.make} {car.model} ({car.year})
                </h3>
                <p className="text-md font-bold text-gray-700 mb-3">
                  Price: ${car?.buyNowPrice}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Location:</span> {car.cityName}
                </p>

                {/* Buttons */}
                <div className="mt-auto flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/detailbid/${car.id}`)}
                    className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded  transition"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleRemove(car.id)}
                    className="text-red-600 hover:text-red-700 transition"
                    title="Remove from wishlist"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No vehicles in your wishlist yet.
          </div>
        )}
      </div>
    </div>
  );
};
