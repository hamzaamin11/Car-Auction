import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "./Contant/URL";
import { RotateLoader } from "./Loader/RotateLoader";

const AudiQ2Prices = () => {
  const { carType } = useParams();

  const [allPrices, setAllPrices] = useState([]);

  const navigate = useNavigate();

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
    <div className="px-4 py-6 max-w-6xl mx-auto h-[27rem] ">
      <h3 className="text-2xl font-bold text-black mb-4">
        <button
    onClick={() => window.history.back()}
    className="flex items-center text-gray-700 hover:text-black font-medium text-sm lg:text-base mr-4 transition-all duration-200 group"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-1.5 text-black "
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
      />
    </svg>
    Back
  </button>  Add Bid on {carType} Cars
      </h3>

      <div className="overflow-y-auto max-h-80 rounded">
        <table className="min-w-[600px] w-full  text-left text-sm sm:text-base">
          <thead className="bg-blue-950">
            <tr>
              <th className="p-3  text-center text-white ">SR#</th>
              <th className="p-3  text-center text-white">Car Version</th>
              <th className="p-3  text-center text-white">
                Vehicle Price
              </th>
              <th className="p-3 text-center text-white">
                Start Bidding
              </th>
            </tr>
          </thead>
          <tbody>
            {allPrices.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-1 border text-center ">{idx + 1}</td>
                <td className="p-1 border text-center ">
                  <span
                    onClick={() => navigate(`/detailbid/${item.id}`)}
                    className="text-gray-800 hover:cursor-pointer"
                  >
                    {item.make} {item.model} {item.series} {item.engine}
                  </span>
                </td>
                <td className="p-1 border text-center">
                  PKR-{item.buyNowPrice}
                </td>
                <td className="p-1 border text-center">
                  <button
                    onClick={() => navigate(`/detailbid/${item.id}`)}
                    className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:cursor-pointer"
                  >
                    View Detail
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
    </div>
  );
};

export default AudiQ2Prices;
