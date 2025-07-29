import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "./Contant/URL";

const AudiQ2Prices = () => {
  const { carType } = useParams();

  const [allPrices, setAllPrices] = useState([]);

  const navigate = useNavigate();

  console.log(allPrices, "prices");

  const handleGetPrice = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/customer/getVehicleByMake?requestedMake=${carType}`
      );
      setAllPrices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetPrice();
  }, []);

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold text-[#233D7B] mb-4">
        {carType} 2025 Prices
      </h3>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-[600px] w-full border border-gray-300 text-left text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Car Version</th>
              <th className="p-3 border">Ex-Factory Price</th>
              <th className="p-3 border">Get Loan Information</th>
            </tr>
          </thead>
          <tbody>
            {allPrices.map((item, idx) => (
              <tr
                onClick={() => navigate(`/standardline/${item.id}`)}
                key={idx}
                className="hover:bg-gray-50"
              >
                <td className="p-3 border whitespace-nowrap">
                  <span className="text-[#233D7B] underline hover:cursor-pointer">
                    {item.make} {item.model} {item.series} {item.engine}
                  </span>
                </td>
                <td className="p-3 border whitespace-nowrap">
                  PKR-{item.buyNowPrice}
                </td>
                <td className="p-3 border">
                  <button className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700">
                    GET THIS CAR FINANCED
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allPrices.length === 0 && (
          <div className="flex items-center justify-center font-bold py-1">
            No Car Found
          </div>
        )}
      </div>

      <div className="space-y-4 sm:hidden">
        {allPrices.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-4 shadow-sm bg-white">
            <h4 className="text-lg font-semibold text-[#233D7B] mb-2">
              <Link to={item.link} className="underline">
                {item.make} {item.model} {item.series} {item.engine}
              </Link>
            </h4>
            <p className="text-gray-700 mb-2">
              <strong>Ex-Factory Price:</strong> PKR-{item.buyNowPrice}
            </p>
            <button className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700">
              GET THIS CAR FINANCED
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudiQ2Prices;
