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
  const totalItems = getCertified.length;
  const totalPages = Math.ceil(totalItems / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const endIndex = Math.min(startIndex + vehiclesPerPage, totalItems);
  const currentVehicles = getCertified.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }
    return pages;
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
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
         
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-medium">{error}</div>
      ) : (
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
                  <h3 className="text-lg font-semibold text-black truncate text-[15px]">
                    {car.make} {car.model} {car.series}
                  </h3>
                  <p>
                    <span className="text-sm font-base text-[13px]"> Model Year:</span> {car.year}
                  </p>
                  <p className="mt-1 text-sm font-base text-black text-[13px]">
                    Current Bid: <b>PKR {car.buyNowPrice.toLocaleString()}</b>
                  </p>

                  <div className="mt-1 text-sm text-black space-y-2">
                    <p>
                      <span className="font-base text-[13px]">Location:</span>{" "}
                      {car.locationId}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PROFESSIONAL ARROW PAGINATION */}
          {totalItems > 0 && totalPages > 1 && (
            <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
                  <div className="text-gray-600">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{endIndex}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> vehicles
                  </div>

                  <div className="flex items-center gap-2">
                 
                <button
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1}
                      className={`w-10 h-10 flex items-center justify-center rounded border font-bold ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {"<<"}
                    </button>
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-10 h-10 flex items-center justify-center rounded border font-bold ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {"<"}
                    </button>

                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded border font-medium ${
                          currentPage === page
                            ? "bg-blue-950 text-white"
                            : "bg-white hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className={`w-10 h-10 flex items-center justify-center rounded border font-bold ${
                        currentPage >= totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {">"}
                    </button>
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage >= totalPages}
                      className={`w-10 h-10 flex items-center justify-center rounded border font-bold ${
                        currentPage >= totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {">>"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
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