import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../components/Contant/URL";
import { useNavigate } from "react-router-dom";
import { RotateLoader } from "../components/Loader/RotateLoader";

const CertifiedCarsPage = () => {
  const [activeTab, setActiveTab] = useState("certified");
  const navigate = useNavigate();
  const [getCertified, setGetCertified] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const handleGetcertified = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const res = await axios.get(`${BASE_URL}/seller/getCertifiedVehicles`);
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
    setCurrentPage(1);
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

  // Pagination Logic
  const vehiclesPerPage = 12;
  const totalPages = Math.ceil(getCertified.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const endIndex = startIndex + vehiclesPerPage;
  const currentVehicles = getCertified.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

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
              ? "bg-blue-950 text-white shadow-md"
              : "bg-white text-blue-950 border border-blue-950 hover:bg-blue-50"
          }`}
        >
          Certified
        </button>
        <button
          onClick={() => setActiveTab("nonCertified")}
          aria-label="View non-certified cars"
          className={`px-6 py-2 font-semibold text-lg rounded-r-full transition-colors duration-200 ${
            activeTab === "nonCertified"
              ? "bg-blue-950 text-white shadow-md"
              : "bg-white text-blue-950 border border-blue-950 hover:bg-blue-50"
          }`}
        >
          Non-Certified
        </button>
      </div>

      {/* Loading State */}
     
        <>
          {/* Vehicle Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
            {currentVehicles.map((car) => (
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

          {/* Pagination Controls – Prev left, Page center, Next right */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-10 max-w-7xl mx-auto px-4">
              {/* Prev Button – Left */}
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white transition-all ${
                  currentPage === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-950 "
                }`}
                aria-label="Previous page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Prev
              </button>

           

              {/* Next Button – Right */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-950 "
                }`}
                aria-label="Next page"
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      {""}

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