import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "./Contant/URL";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const JoinAuctionTable = ({ allLive, upComing }) => {
  const [getId, setGetId] = useState({});
  const [addBiding, setAddBiding] = useState({
    userId: "",
    vehicleId: "",
    maxBid: "",
    monsterBid: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddBiding({ ...addBiding, [name]: value });
  };

  useEffect(() => {
    if (getId?.userId) setAddBiding((p) => ({ ...p, userId: getId.userId }));
    if (getId?.vehicleId)
      setAddBiding((p) => ({ ...p, vehicleId: getId.vehicleId }));
  }, [getId]);

  // const handleSubmitBid = async (e) => {
  //   e.preventDefault();
  //   const filteredData = Object.fromEntries(
  //     Object.entries(addBiding).filter(([_, v]) => v !== "")
  //   );
  //   try {
  //     const res = await axios.post(
  //       `${BASE_URL}/customer/startBidding`,
  //       filteredData
  //     );
  //     console.log(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* ========== LIVE AUCTIONS SECTION ========== */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Live Auctions
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-blue-950 p-3 text-white font-semibold text-sm uppercase tracking-wide">
            Live Auctions
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 border-b">
              <tr>
                <th className="p-3 text-left">SR#</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Model</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Start</th>
                <th className="p-3 text-left">End</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {allLive?.map((auction, idx) => (
                <tr
                  key={idx}
                  className="border-b  transition-all duration-200"
                >
                  <td className="p-3 text-gray-600">{idx + 1}</td>
                  <td className="p-3">
                    <img
                      src={auction.images[0]}
                      alt="auction"
                      className="w-24 h-16 object-cover rounded-lg border"
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    {auction.make}/{auction.model}
                  </td>
                  <td className="p-3 text-gray-600">
                    {auction.startTime
                      ? new Date(auction.startTime).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {moment(auction.startTime).format("hh:mm A")}
                  </td>
                  <td className="p-3 text-gray-600">
                    {moment(auction.endTime).format("hh:mm A")}
                  </td>
                  <td className="p-3 text-gray-700">{auction.locationId}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        navigate(`/detailbid/${auction.vehicleId}`)
                      }
                      className="px-4 py-1.5 bg-blue-950 text-white rounded text-xs font-semibold shadow-sm transition-all hover:cursor-pointer"
                    >
                      Start Bidding
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allLive?.length === 0 && (
            <div className="p-6 text-center text-gray-600 font-medium">
              No live auctions available
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="grid gap-4 md:hidden mt-4">
          {allLive?.map((auction, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition duration-200"
            >
              <div className="flex items-center gap-3">
                <img
                  src={auction.images[0]}
                  alt="auction"
                  className="w-24 h-16 object-cover rounded-md border"
                />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {auction.make}/{auction.model}/{auction.series}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {auction.startTime
                      ? new Date(auction.startTime).toLocaleDateString("en-GB")
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Start:</strong>{" "}
                  {moment(auction.startTime).format("hh:mm A")}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {moment(auction.endTime).format("hh:mm A")}
                </p>
                <p>
                  <strong>Location:</strong> {auction.locationId}
                </p>
              </div>
              <button
                onClick={() => navigate(`/detailbid/${auction.vehicleId}`)}
                className="mt-3 w-full py-2 bg-blue-950 text-white  text-sm font-semibold transition"
              >
                Start Bidding
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ========== UPCOMING AUCTIONS SECTION ========== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="lg:text-3xl text-lg  font-bold text-gray-800">
            Upcoming Auctions
          </h2>
        </div>

        <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-blue-950 p-3 text-white font-semibold text-sm uppercase tracking-wide">
            Scheduled Auctions
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 border-b">
              <tr>
                <th className="p-3 text-left">SR#</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Model</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Start Time</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {upComing?.map((auction, idx) => (
                <tr
                  key={idx}
                  className="border-b  transition-all duration-200"
                >
                  <td className="p-3 text-gray-600">{idx + 1}</td>
                  <td className="p-3">
                    <img
                      src={auction.images[0]}
                      alt="auction"
                      className="w-24 h-16 object-cover rounded-lg border"
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    {auction.make}/{auction.model}
                  </td>
                  <td className="p-3 text-gray-600">
                    {auction.startTime
                      ? new Date(auction.startTime).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {moment(auction.startTime).format("hh:mm A")}
                  </td>
                  <td className="p-3 text-gray-700">{auction.locationId}</td>
                  <td className="p-3 text-center text-gray-500 font-semibold">
                    Pending
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {upComing?.length === 0 && (
            <div className="p-6 text-center text-gray-600 font-medium">
              No upcoming auctions available
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="grid gap-4 md:hidden mt-4">
          {upComing?.map((auction, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition duration-200"
            >
              <div className="flex items-center gap-3">
                <img
                  src={auction.images[0]}
                  alt="auction"
                  className="w-24 h-16 object-cover rounded-md border"
                />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {auction.make}/{auction.model}/{auction.series}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {auction.startTime
                      ? new Date(auction.startTime).toLocaleDateString("en-GB")
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Start:</strong>{" "}
                  {moment(auction.startTime).format("hh:mm A")}
                </p>
                <p>
                  <strong>Location:</strong> {auction.locationId}
                </p>
                <p className="flex gap-1">
                  <strong>Bid Status:</strong>
                  <p className="text-gray-500 font-semibold"> Pending</p>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default JoinAuctionTable;
