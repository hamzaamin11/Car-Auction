import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../components/Contant/URL";
import { useNavigate } from "react-router-dom";
import { RotateLoader } from "../components/Loader/RotateLoader";

const CertifiedCarsPage = () => {
  const [activeTab, setActiveTab] = useState("certified");
  const navigate = useNavigate();
  const [getCertified, setGetCertified] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state

  const handleGetcertified = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/seller/getCertifiedVehicles`);
      console.log("=>", res.data);
      setGetCertified(res.data);
    } catch (error) {
      setError("Failed to fetch certified vehicles. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetNoncertify = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/seller/getNonCertifiedVehicles`);
      setGetCertified(res.data);
    } catch (error) {
      setError("Failed to fetch non-certified vehicles. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "certified") {
      handleGetcertified();
    } else {
      handleGetNoncertify();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        Car Listings
      </h1>

      {/* Tab Buttons */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setActiveTab("certified")}
          aria-label="View certified cars"
          className={`px-6 py-2 font-semibold text-lg rounded-l-full transition-colors duration-200 ${
            activeTab === "certified"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
          }`}
        >
          Certified
        </button>
        <button
          onClick={() => setActiveTab("nonCertified")}
          aria-label="View non-certified cars"
          className={`px-6 py-2 font-semibold text-lg rounded-r-full transition-colors duration-200 ${
            activeTab === "nonCertified"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
          }`}
        >
          Non-Certified
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-12"></div>
      ) : error ? (
        <div className="flex justify-center py-12">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          {getCertified.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/detailbid/${car.id}`)}
            >
              {/* Image Section */}
              <div className="relative">
                <img
                  src={
                    car.images && car.images.length > 0
                      ? car.images[0]
                      : "https://via.placeholder.com/400x200?text=No+Image"
                  }
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
                <span
                  className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                    car.certifyStatus === "Certified"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {car.certifyStatus}
                </span>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {car.make} {car.model} {car.series}
                </h3>
                <div className="mt-3 text-sm text-gray-600 space-y-2">
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {car.locationId}
                  </p>
                  <p>
                    <span className="font-medium">Mileage:</span> {car.mileage}{" "}
                    Km
                  </p>
                  <p>
                    <span className="font-medium">Year:</span> {car.year}
                  </p>
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-900">
                  PKR:{car.buyNowPrice.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && getCertified?.length === 0 && (
        <div className="flex justify-center py-12">
          <p className="text-lg text-gray-600">No vehicles found yet</p>
        </div>
      )}
    </div>
  );
};

export default CertifiedCarsPage;
