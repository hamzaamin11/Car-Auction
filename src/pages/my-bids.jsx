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
        <h1 className="lg:text-3xl  text-xl font-bold mb-6 text-gray-800 lg:text-start text-center">
          My Bidding History
        </h1>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200">
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

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {allBiders && allBiders.length > 0 ? (
            allBiders.map((bid, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-4"
              >
                <div className="flex justify-end items-center mb-3">
                  <span className="inline-flex items-center justify-center px-3 py-1 text-xs rounded-full font-semibold bg-green-100 text-green-800">
                    Sold
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-900 font-bold">Customer</span>
                    <span className="text-gray-800 cursor-pointer underline">
                      {bid?.buyerDetails?.name}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-900 font-bold">Vehicle</span>
                    <span className="text-gray-800 cursor-pointer underline">
                      {bid?.vehicleDetails?.make}/{bid?.vehicleDetails?.model}/
                      {bid?.vehicleDetails?.series}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-900 font-bold">Bid Amount</span>
                    <span className="text-[#191970] font-semibold">
                      PKR {bid?.bidDetails.yourOffer || "0"}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-900 font-bold">Date</span>
                    <span className="text-gray-500">
                      {bid?.bidDetails?.bidCreatedAt?.slice(0, 10)}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">No bids yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBids;