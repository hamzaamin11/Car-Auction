import React, { useContext } from "react";
import AuctionsContext from "../../context/AuctionsContext";
import { IoMdClose } from "react-icons/io";
import { TiTick } from "react-icons/ti";

const formatDate = (date) =>
  new Date(date).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const AdminBidHistory = () => {
  const { aucHistory } = useContext(AuctionsContext);

  // Calculate statistics from aucHistory
  const totalBids = aucHistory?.length || 0;
  const highestBids =
    aucHistory?.filter((b) => b.status === "Highest").length || 0;
  const outbidBids =
    aucHistory?.filter((b) => b.status === "Outbid").length || 0;
  const highestBidAmount =
    aucHistory?.length > 0
      ? Math.max(...aucHistory.map((b) => b.bidAmount), 0)
      : 0;

  return (
    <>
      {/* <Topbar />
      <Sidebar /> */}
      <div className="min-h-screen bg-gray-50 p-6 md:p-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Bid History</h1>

        {/* Stats Section */}

        {/*
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 max-w-6xl mx-auto">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500">Total Bids</h3>
            <p className="text-2xl font-bold text-[#191970]">{totalBids}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500">Highest Bids</h3>
            <p className="text-2xl font-bold text-green-700">{highestBids}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500">Outbid Bids</h3>
            <p className="text-2xl font-bold text-red-600">{outbidBids}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500">Highest Bid Amount</h3>
            <p className="text-2xl font-bold text-[#191970]">
              PKR {highestBidAmount.toLocaleString()}
            </p>
          </div>
        </div>

        */}

        {/* Bids Table */}
        <div className="overflow-x-auto max-w-6xl mx-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#191970] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Bidder
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Bid Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {aucHistory?.length > 0 ? (
                aucHistory.map(
                  ({ id, name, model, MonsterBid, maxBid, date, status }) => (
                    <tr
                      key={id}
                      className="hover:bg-gray-50 transition cursor-default"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#191970]">
                        PKR {MonsterBid || maxBid || "0000"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 text-xs rounded-full font-semibold ${
                            status === "Highest"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {status === "Y" ? (
                            <TiTick size={20} />
                          ) : (
                            <IoMdClose size={20} />
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    No bids yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminBidHistory;
