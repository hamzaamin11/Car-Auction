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
      <h3 className="text-2xl font-bold text-[#233D7B] mb-4">
        Add Bid on {carType} Cars
      </h3>

      <div className="overflow-y-auto max-h-80">
        <table className="min-w-[600px] w-full border border-gray-300 text-left text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-center">SR#</th>
              <th className="p-3 border text-center">Car Version</th>
              <th className="p-3 border text-center">Vehicle Price</th>
              <th className="p-3 border text-center">Start Bidding</th>
            </tr>
          </thead>
          <tbody>
            {allPrices.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-1 border text-center ">{idx + 1}</td>
                <td className="p-1 border text-center ">
                  <span
                    onClick={() => navigate(`/detailbid/${item.id}`)}
                    className="text-[#233D7B] underline hover:cursor-pointer"
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
