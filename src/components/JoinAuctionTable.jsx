import axios from "axios";
import React, { useState, useEffect } from "react";

const JoinAuctionTable = ({ allLive, upComing }) => {
  const [isRegistered, setIsRegistered] = useState(false);

  const [getId, setGetId] = useState({});

  const [addBiding, setAddBiding] = useState({
    userId: "",
    vehicleId: "",
    maxBid: "",
    monsterBid: "",
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddBiding({ ...addBiding, [name]: value });
  };

  const handleClickStartBiding = (id) => {
    setIsRegistered(true);
    setGetId(id);
  };

  useEffect(() => {
    if (getId?.userId) {
      setAddBiding((prev) => ({
        ...prev,
        userId: getId.userId,
      }));
    }
  }, [getId]);

  useEffect(() => {
    if (getId?.vehicleId) {
      setAddBiding((prev) => ({
        ...prev,
        vehicleId: getId?.vehicleId,
      }));
    }
  }, [getId]);

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    const filteredData = Object.fromEntries(
      Object.entries(addBiding).filter(([key, value]) => value !== "")
    );

    try {
      const res = await axios.post(
        `http://localhost:3001/customer/startBidding`,
        filteredData
      );
      console.log(res.data);
      setIsRegistered(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Auction Dashboard</h1>
      </div>

      {/* Live Auctions */}
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        Live Auctions ({allLive.length})
      </h2>
      <table className="w-full mb-8 border shadow-sm rounded overflow-hidden text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Sr#</th>
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-left">Model</th>
            <th className="p-2 text-left">Location</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {allLive?.map((auction, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="p-1">{idx + 1}</td>
              <td className="p-1">
                {auction.startTime.slice(11, 19) || "00:00"}
              </td>
              <td className="p-1">{auction.model}</td>
              <td className="p-1">{auction.locationId}</td>
              <td className="p-1">
                <button
                  className={`px-1 py-1 rounded ${"bg-blue-500 hover:bg-blue-600 text-white text-xs hover:cursor-pointer"}`}
                  onClick={() => handleClickStartBiding(auction)}
                >
                  Start Biding
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Upcoming Auctions */}
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        Upcoming Auctions ({upComing.length})
      </h2>
      <table className="w-full mb-8 border shadow-sm rounded overflow-hidden text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Sr#</th>
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-left">Model</th>
            <th className="p-2 text-left">Location</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {upComing?.map((auction, idx) => {
            return (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-1">{idx + 1}</td>
                <td className="p-1">
                  {auction.startTime.slice(11, 19) || "00:00"}
                </td>
                <td className="p-1">{auction.model}</td>
                <td className="p-1">{auction.locationId}</td>
                <td className="p-1">{"Pending"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add Auction Form */}
      {isRegistered && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50">
          <div className="p-5 bg-white text-gray-700 rounded ">
            <div className="flex items-center justify-between my-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Add New Bid
              </h3>

              <button
                onClick={() => setIsRegistered(false)}
                className="bg-red-500 text-white rounded hover:cursor-pointer p-1"
              >
                Close
              </button>
            </div>
            <form
              onSubmit={(e) => handleSubmitBid(e)}
              className="grid grid-cols-1 w-[26rem] gap-4 mb-4"
            >
              <input
                type="number"
                name="userId"
                placeholder="UserId.."
                value={getId.userId}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="vehicleId"
                placeholder="VehicleId"
                value={getId.vehicleId}
                onChange={handleChange}
                className="p-2 border rounded"
              />

              <input
                type="number"
                name="maxBid"
                placeholder="Max Bid"
                value={addBiding.maxBid}
                onChange={handleChange}
                className="p-2 border rounded"
                disabled={addBiding.monsterBid > 1}
              />

              <input
                type="number"
                name="monsterBid"
                placeholder="Monster Bid"
                value={addBiding.monsterBid}
                onChange={handleChange}
                className="p-2 border rounded"
                disabled={addBiding.maxBid > 1}
              />
              <button className="bg-green-600 text-white px- py-2 rounded-full hover:bg-green-700 w-full hover:cursor-pointer">
                Add Bid
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinAuctionTable;
