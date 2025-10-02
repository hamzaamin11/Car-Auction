import { useEffect, useState } from "react";
import {
  FaGasPump,
  FaRoad,
  FaCogs,
  FaTachometerAlt,
  FaArrowRight,
  FaArrowLeft,
  FaCarSide,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ImportCarForm from "../pages/import";
import { MdLocationOn } from "react-icons/md";

const CarOverview = ({ selectedPrice, vehicleId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const [indexImage, setIndexImage] = useState(0);

  const navigate = useNavigate();
  const ImageLength = selectedPrice?.images?.length - 1;

  useEffect(() => {
    if (selectedPrice?.images?.length > 0) {
      setViewImage(selectedPrice.images[0]);
    }
  }, [selectedPrice]);

  useEffect(() => {
    if (selectedPrice?.images?.length > 0) {
      setViewImage(selectedPrice.images[indexImage]);
    }
  }, [indexImage]);

  const handleNextImage = () =>
    setIndexImage((prev) => (ImageLength > prev ? prev + 1 : 0));

  const handlePreviousImage = () =>
    setIndexImage((prev) => (prev > 0 ? prev - 1 : ImageLength));

  return (
    <div className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
      {/* Title + Location */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {selectedPrice?.make} {selectedPrice?.model}{" "}
          <span className="text-gray-600">{selectedPrice?.series}</span>
        </h1>

        <div className="mt-2 flex items-center text-gray-600 gap-3">
          <div className="flex items-center">
            <MdLocationOn size={20} className="text-blue-500 mr-1" />
            <span className="text-sm">{selectedPrice?.cityName}</span>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            FEATURED
          </span>
        </div>
      </div>

      {/* Price + Image Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        {/* Left Side - Pricing */}
        <div>
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow p-6 border border-green-100 flex flex-col h-full justify-between">
            {/* Car Price */}
            <div>
              <p className="text-4xl font-extrabold text-green-700 mb-2">
                PKR {selectedPrice?.buyNowPrice}
              </p>
              <p className="text-gray-500 text-sm mb-6"></p>

              {/* Extra Vehicle Info */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-bold text-gray-700">Year</p>
                  <p>{selectedPrice?.year || "—"}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">Condition</p>
                  <p>{selectedPrice?.vehicleCondition || "—"}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">Location</p>
                  <p>{selectedPrice?.locationId}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">Transmission</p>
                  <p>{selectedPrice?.transmission || "—"}</p>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => navigate(`/detailbid/${vehicleId}`)}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              Add Bid
            </button>
          </div>
        </div>

        {/* Right Side - Image + Thumbnails */}
        <div>
          <div className="overflow-hidden rounded-xl shadow-lg">
            <img
              src={viewImage || "/images/AudiQ2.jpg"}
              alt="vehicle"
              className="w-full h-80 object-cover transform hover:scale-105 transition duration-500"
            />
          </div>

          {/* Thumbnails + Navigation */}
          <div className="flex items-center justify-center mt-6 gap-3">
            <button
              onClick={handlePreviousImage}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow hover:scale-110 transition-transform duration-200"
            >
              <FaArrowLeft size={18} />
            </button>

            <div className="flex gap-3 overflow-x-auto max-w-[70%] px-2">
              {selectedPrice?.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail-${idx}`}
                  onClick={() => setViewImage(img)}
                  className={`w-[55px] h-[55px] object-cover rounded-md cursor-pointer border-2 transition-all ${
                    viewImage === img
                      ? "border-blue-600 ring-2 ring-blue-300"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextImage}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow hover:scale-110 transition-transform duration-200"
            >
              <FaArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
        <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <FaRoad className="text-[#233D7B] text-2xl mb-2" />
          <p className="font-semibold text-sm text-gray-700">Mileage</p>
          <p className="text-gray-600 text-sm">{selectedPrice?.mileage} km/l</p>
        </div>

        <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <FaCogs className="text-[#233D7B] text-2xl mb-2" />
          <p className="font-semibold text-sm text-gray-700">Transmission</p>
          <p className="text-gray-600 text-sm">{selectedPrice?.transmission}</p>
        </div>

        <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <FaGasPump className="text-[#233D7B] text-2xl mb-2" />
          <p className="font-semibold text-sm text-gray-700">Fuel Type</p>
          <p className="text-gray-600 text-sm">{selectedPrice?.fuelType}</p>
        </div>

        <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <FaCarSide className="text-[#233D7B] text-2xl mb-2" />
          <p className="font-semibold text-sm text-gray-700">Body Style</p>
          <p className="text-gray-600 text-sm">{selectedPrice?.bodyStyle}</p>
        </div>
      </div>

      {/* Import Car Modal */}
      {isOpen && (
        <ImportCarForm
          handleClose={() => setIsOpen(false)}
          vehicleId={vehicleId}
        />
      )}
    </div>
  );
};

export default CarOverview;
