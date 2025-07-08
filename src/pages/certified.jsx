import axios from "axios";
import React, { useEffect, useState } from "react";

const carData = [
  {
    id: 1,
    name: "Toyota Corolla 2025",
    image: "/images/toyota1.jpg",
    certified: true,
    price: "PKR 59.7 lacs",
    fuel: "Petrol",
    city: "Lahore",
  },
  {
    id: 2,
    name: "Suzuki Mehran 2018",
    image: "/images/",
    certified: false,
    price: "PKR 9.5 lacs",
    fuel: "Petrol",
    city: "Karachi",
  },
  {
    id: 3,
    name: "Honda Civic 2025",
    image: "/images/hondacivic.avif",
    certified: true,
    price: "PKR 8,659,000",
    fuel: "Petrol",
    city: "Islamabad",
  },
  {
    id: 4,
    name: "Changan Lumin",
    image: "/images/lumin.png",
    certified: true,
    price: "PKR 20 Lacs to 35 Lacs",
    fuel: "Petrol",
    city: "Abbottabad",
  },
];

const CertifiedCarsPage = () => {
  const [activeTab, setActiveTab] = useState("certified");

  console.log("active tab", activeTab);

  const [getCertified, setGetCertified] = useState([]);

  const filteredCars = carData.filter(
    (car) => car.certified === (activeTab === "certified")
  );

  const handleGetcertified = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/seller/getCertifiedVehicles`
      );
      console.log("=>", res.data);
      setGetCertified(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetNoncertify = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/seller/getNonCertifiedVehicles`
      );
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
          >
            <img
              src={car.imageBase64}
              alt={car.name}
              className="w-full h-44 object-cover"
            />
            <span
              className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full shadow ${
                car.certifyStatus === "Certified"
                  ? "bg-green-600 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {car.certifyStatus}
            </span>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">
                {car.make} {car.model}
              </h3>
              <p className="text-sm text-gray-600">
                {car.locationId} • {car.mileage}
              </p>
              <p className="text-[#3eb549] font-semibold mt-1">{car.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertifiedCarsPage;
