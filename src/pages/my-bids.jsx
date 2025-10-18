import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../components/Contant/URL";

const MyBids = () => {
  const { currentUser } = useSelector((state) => state?.auth);
  const [allBiders, setAllBiders] = useState([]);

  const handleGetBidersHistory = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/customer/myBids/${currentUser?.id}`
      );
      setAllBiders(res.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  useEffect(() => {
    handleGetBidersHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          My Bidding History
        </h1>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-[#191970] text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">SR#</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left font-semibold">Vehicle</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Bid Amount
                </th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allBiders && allBiders.length > 0 ? (
                allBiders.map((bid, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {bid?.buyerDetails?.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {bid?.vehicleDetails?.make}/{bid?.vehicleDetails?.model}/
                      {bid?.vehicleDetails?.series}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#191970]">
                      PKR {bid?.bidDetails.yourOffer || "0"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {bid?.bidDetails?.bidCreatedAt?.slice(0, 10)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                        Sold
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-400 font-medium"
                  >
                    No bids yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBids;
