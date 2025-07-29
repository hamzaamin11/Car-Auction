import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../components/Contant/URL";

const FilterPriceCars = () => {
  const { tab } = useParams();

  const [allFilterCars, setAllFilterCars] = useState([]);

  console.log("allFilterCars", allFilterCars);

  const handleGetFilterCarbyLocation = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/seller/getVehicles?locationId=${tab}`
      );
      setAllFilterCars(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetFilterCarbyMake = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/seller/getVehicles?make=${tab}`);
      setAllFilterCars(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetFilterCarbyModel = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/seller/getVehicles?model=${tab}`
      );
      setAllFilterCars(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetFilterCarbyBodyStyle = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/seller/getVehicles?bodyStyle=${tab}`
      );
      setAllFilterCars(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetFilterCarbyPrice = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/seller/getVehicles?buyNowPrice=${tab}`
      );
      setAllFilterCars(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetFilterCarbyLocation();
    handleGetFilterCarbyMake();
    handleGetFilterCarbyModel();
    handleGetFilterCarbyBodyStyle();
    handleGetFilterCarbyPrice();
  }, []);
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4 gap-4">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Show Results By:</h2>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Search Filters</h3>
          <div className="flex items-center justify-between text-sm bg-blue-100 px-3 py-1 rounded">
            <span>{tab}</span>
          </div>
        </div>
      </div>

      {/* Car List */}
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h1 className="text-sm text-gray-700">
            1 - 25 of {allFilterCars.length} Results
          </h1>
          <select className="border p-2 text-sm rounded w-full sm:w-auto">
            <option>Updated Date: Recent First</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {allFilterCars.map((car) => (
          <div
            key={car.id}
            className={`rounded-lg shadow p-4 mb-4 flex flex-col md:flex-row hover:shadow-md transition-shadow ${
              car.certifyStatus === "Certified" ? "bg-blue-100" : "bg-white"
            }`}
          >
            <div className="w-full md:w-40 h-48 md:h-28 overflow-hidden rounded-md mb-4 md:mb-0 md:mr-4">
              <img
                src={car.image}
                alt={car.make}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <h3 className="text-blue-700 font-semibold text-sm sm:text-base">
                  {car.make} {car.model} {car.series} {car.engine} for sale
                </h3>
                <span className="text-lg font-bold text-gray-800 mt-2 sm:mt-0">
                  PKR {car.buyNowPrice}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{car.location}</p>
              <div className="text-sm text-gray-600 mt-1">
                model Year : {car.year} | Mileage : {car.mileage}km | FuelType{" "}
                {car.fuelType} | Engine : {car.engine}cc | {car.transmission}
              </div>
              <div className="flex flex-wrap items-center mt-3 gap-2">
                {car.certifyStatus === "Certified" ? (
                  <span className="text-sm text-green-600 font-bold border border-green-600 px-2 py-0.5 rounded ">
                    CERTIFIED
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ))}
        {allFilterCars.length === 0 && <div> no car found</div>}
      </div>
    </div>
  );
};

export default FilterPriceCars;
