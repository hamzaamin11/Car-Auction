import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../components/Contant/URL";
import { useNavigate } from "react-router-dom";
import { RotateLoader } from "../components/Loader/RotateLoader";

const CertifiedCarsPage = () => {
  const [activeTab, setActiveTab] = useState("certified");

  const navigate = useNavigate();

  const [getCertified, setGetCertified] = useState([]);

  const handleGetcertified = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/seller/getCertifiedVehicles`);
      console.log("=>", res.data);
      setGetCertified(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetNoncertify = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/seller/getNonCertifiedVehicles`);
      setGetCertified(res.data);
    } catch (error) {
      console.log(error);
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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
        Car Listings
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("certified")}
          className={`px-6 py-2 font-semibold rounded-l-lg ${
            activeTab === "certified"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-600"
          }`}
        >
          Certified
        </button>
        <button
          onClick={() => setActiveTab("nonCertified")}
          className={`px-6 py-2 font-semibold rounded-r-lg ${
            activeTab === "nonCertified"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-600"
          }`}
        >
          Non-Certified
        </button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {getCertified.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-xl shadow-md overflow-hidden relative hover:shadow-xl transition"
            onClick={() => navigate(`/detailbid/${car.id}`)}
          >
            <img
              src={car.images[0]}
              alt={car.name}
              className="w-full h-44 object-cover"
            />
            <span
              className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full shadow ${
                car.certifyStatus === "Certified"
                  ? "bg-green-600 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {car?.certifyStatus}
            </span>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">
                {car?.make} {car?.model} {car?.series}
              </h3>
              <p className="text-sm gap-1">
                <strong className="pr-1">Location</strong>
                {car.locationId} <strong className="pr-1">Milage</strong>
                {car.mileage}Km
                <strong className="px-1">Year</strong>
                {car.year}
              </p>

              <p className="font-semibold mt-1">
                {" "}
                <strong className="pr-1">Demand Price:</strong>
                {car.buyNowPrice}
              </p>
            </div>
          </div>
        ))}
      </div>
      {getCertified?.length === 0 && (
        <div className="flex items-center justify-center">
          {" "}
          No vehicle found yet
        </div>
      )}
    </div>
  );
};

export default CertifiedCarsPage;
