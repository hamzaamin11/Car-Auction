import {
  FaGasPump,
  FaRoad,
  FaCogs,
  FaTachometerAlt,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const CarOverview = ({ selectedPrice }) => {
  const currentDate =
    new Date(new Date().toISOString()).toLocaleDateString("sv-SE") ?? "";

  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
      <div className="text-xl sm:text-2xl font-bold text-[#233D7B] mb-6 leading-snug">
        {selectedPrice && selectedPrice?.model}{" "}
        {selectedPrice && selectedPrice?.make}{" "}
        {selectedPrice && selectedPrice?.engine} {currentDate.slice(0, 4)} Price
        in Pakistan, Specs & Features
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white p-4 rounded-lg shadow">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-green-700">
            PKR {selectedPrice && selectedPrice?.buyNowPrice}
          </p>

          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-500 text-sm">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <span className="text-gray-600 text-sm">(38 Reviews)</span>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button className="w-auto bg-[#233D7B] text-white px-4 py-2 rounded hover:bg-[#1a2f5c] transition text-sm">
              {selectedPrice && selectedPrice?.model}{" "}
              {selectedPrice && selectedPrice?.make}{" "}
              {selectedPrice && selectedPrice?.engine} for Sale
            </button>

            <Link to="/import">
              <button className="w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm">
                Import This Car
              </button>
            </Link>
          </div>
        </div>

        <div>
          <img
            src={(selectedPrice && selectedPrice.image) || "/images/AudiQ2.jpg"}
            alt="image"
            className="w-full h-auto rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 text-center">
        <div className="flex flex-col items-center">
          <FaRoad className="text-[#233D7B] text-xl mb-1" />
          <p className="font-medium text-sm">Mileage</p>
          <p className="text-gray-700 text-sm">
            {selectedPrice && selectedPrice?.mileage} km/l
          </p>
        </div>
        <div className="flex flex-col items-center">
          <FaCogs className="text-[#233D7B] text-xl mb-1" />
          <p className="font-medium text-sm">Transmission</p>
          <p className="text-gray-700 text-sm">
            {" "}
            {selectedPrice && selectedPrice?.transmission}{" "}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <FaGasPump className="text-[#233D7B] text-xl mb-1" />
          <p className="font-medium text-sm">Fuel Type</p>
          <p className="text-gray-700 text-sm">
            {selectedPrice && selectedPrice?.fuelType}{" "}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <FaTachometerAlt className="text-[#233D7B] text-xl mb-1" />
          <p className="font-medium text-sm">Engine</p>
          <p className="text-gray-700 text-sm">
            {selectedPrice && selectedPrice?.engine} cc
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarOverview;
