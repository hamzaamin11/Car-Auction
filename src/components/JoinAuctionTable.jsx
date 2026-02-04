import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const JoinAuctionTable = ({ allLive, upComing }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 font-sans">
      {/* ================= LIVE AUCTIONS ================= */}
      <section className="mb-12">
        <h2 className="lg:text-3xl text-lg font-bold text-gray-800 mb-4">
          Live Auctions
        </h2>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="bg-blue-950 p-3 text-white font-semibold text-sm uppercase">
            Live Auctions
          </div>

          {/* 🔥 Responsive Wrapper */}
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-xs sm:text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-2 sm:p-3 text-left">SR#</th>
                  <th className="p-2 sm:p-3 text-left">Image</th>
                  <th className="p-2 sm:p-3 text-left">Model</th>
                  <th className="p-2 sm:p-3 text-left">Date</th>
                  <th className="p-2 sm:p-3 text-left">Start</th>
                  <th className="p-2 sm:p-3 text-left">End</th>
                  <th className="p-2 sm:p-3 text-left">Location</th>
                  <th className="p-2 sm:p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {allLive?.map((auction, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2 sm:p-3">{idx + 1}</td>
                    <td className="p-2 sm:p-3">
                      <img
                        src={auction.images[0]}
                        alt="auction"
                        className="w-20 h-14 object-cover rounded border"
                      />
                    </td>
                    <td className="p-2 sm:p-3 font-medium">
                      {auction.make}/{auction.model}
                    </td>
                    <td className="p-2 sm:p-3">
                      {new Date(auction.startTime).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-2 sm:p-3">
                      {moment(auction.startTime).format("hh:mm A")}
                    </td>
                    <td className="p-2 sm:p-3">
                      {moment(auction.endTime).format("hh:mm A")}
                    </td>
                    <td className="p-2 sm:p-3">{auction.locationId}</td>
                    <td className="p-2 sm:p-3 text-center">
                      <button
                        onClick={() =>
                          navigate(`/detailbid/${auction.vehicleId}`)
                        }
                        className="px-3 py-1 bg-blue-950 text-white rounded text-xs"
                      >
                        Start
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {allLive?.length === 0 && (
            <div className="p-4 text-center text-gray-600">
              No live auctions available
            </div>
          )}
        </div>
      </section>

      {/* ================= UPCOMING AUCTIONS ================= */}
      <section>
        <h2 className="lg:text-3xl text-lg font-bold text-gray-800 mb-4">
          Upcoming Auctions
        </h2>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="bg-blue-950 p-3 text-white font-semibold text-sm uppercase">
            Scheduled Auctions
          </div>

          {/* 🔥 Responsive Wrapper */}
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-xs sm:text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-2 sm:p-3 text-left">SR#</th>
                  <th className="p-2 sm:p-3 text-left">Image</th>
                  <th className="p-2 sm:p-3 text-left">Model</th>
                  <th className="p-2 sm:p-3 text-left">Date</th>
                  <th className="p-2 sm:p-3 text-left">Start</th>
                  <th className="p-2 sm:p-3 text-left">Location</th>
                  <th className="p-2 sm:p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {upComing?.map((auction, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2 sm:p-3">{idx + 1}</td>
                    <td className="p-2 sm:p-3">
                      <img
                        src={auction.images[0]}
                        alt="auction"
                        className="w-20 h-14 object-cover rounded border"
                      />
                    </td>
                    <td className="p-2 sm:p-3 font-medium">
                      {auction.make}/{auction.model}
                    </td>
                    <td className="p-2 sm:p-3">
                      {new Date(auction.startTime).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-2 sm:p-3">
                      {moment(auction.startTime).format("hh:mm A")}
                    </td>
                    <td className="p-2 sm:p-3">{auction.locationId}</td>
                    <td className="p-2 sm:p-3 text-center text-yellow-600 font-semibold">
                      Pending
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {upComing?.length === 0 && (
            <div className="p-4 text-center text-gray-600">
              No upcoming auctions available
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default JoinAuctionTable;
