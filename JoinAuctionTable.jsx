import React, { useState, useEffect } from "react";

const JoinAuctionTable = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  const [newAuction, setNewAuction] = useState({
    time: "",
    location: "",
    lane: "",
  });
  const [auctions, setAuctions] = useState({
    live: [
      { time: "10:00 AM", location: "Lahore", lane: "Lane A" },
      { time: "11:00 AM", location: "Islamabad", lane: "Lane B" },
      { time: "12:00 PM", location: "Multan", lane: "Lane C" },
      { time: "01:00 PM", location: "Faisalabad", lane: "Lane D" },
      { time: "02:00 PM", location: "Peshawar", lane: "Lane E" },
    ],
    upcoming: [
      {
        time: "03:00 PM",
        location: "Karachi",
        lane: "Lane F",
        startDate: "2025-05-15T15:00:00",
      },
      {
        time: "04:00 PM",
        location: "Sialkot",
        lane: "Lane G",
        startDate: "2025-05-15T16:00:00",
      },
      {
        time: "05:00 PM",
        location: "Quetta",
        lane: "Lane H",
        startDate: "2025-05-15T17:00:00",
      },
      {
        time: "06:00 PM",
        location: "Rawalpindi",
        lane: "Lane I",
        startDate: "2025-05-15T18:00:00",
      },
      {
        time: "07:00 PM",
        location: "Hyderabad",
        lane: "Lane J",
        startDate: "2025-05-15T19:00:00",
      },
    ],
  });

  const [countdown, setCountdown] = useState({});

  const getTimeRemaining = (startDate) => {
    const now = new Date();
    const endTime = new Date(startDate);
    const distance = endTime - now;

    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let tempCountdown = {};
      auctions.upcoming.forEach((auction) => {
        tempCountdown[auction.startDate] = getTimeRemaining(auction.startDate);
      });
      setCountdown(tempCountdown);
    }, 1000);
    return () => clearInterval(interval);
  }, [auctions.upcoming]);

  const handleAddAuction = () => {
    if (newAuction.time && newAuction.location && newAuction.lane) {
      setAuctions((prev) => ({
        ...prev,
        live: [...prev.live, { ...newAuction }],
      }));
      setNewAuction({ time: "", location: "", lane: "" });
    }
  };

  const handleRegister = () => {
    setIsRegistered(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Auction Dashboard</h1>
        {!isRegistered && (
          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        )}
      </div>

      {/* Live Auctions */}
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        Live Auctions ({auctions?.live?.length})
      </h2>
      <table className="w-full mb-8 border shadow-sm rounded overflow-hidden text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Lane</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {auctions?.live?.map((auction, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="p-3">{auction.time}</td>
              <td className="p-3">{auction.location}</td>
              <td className="p-3">{auction.lane}</td>
              <td className="p-3">
                <button
                  className={`px-4 py-2 rounded ${
                    isRegistered
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                  onClick={() =>
                    isRegistered
                      ? alert("Joined auction!")
                      : alert("Please register to join this auction.")
                  }
                >
                  Join
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Upcoming Auctions */}
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        Upcoming Auctions ({auctions.upcoming.length})
      </h2>
      <table className="w-full mb-8 border shadow-sm rounded overflow-hidden text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Lane</th>
            <th className="p-3 text-left">Countdown</th>
          </tr>
        </thead>
        <tbody>
          {auctions.upcoming.map((auction, idx) => {
            const { hours, minutes, seconds } =
              countdown[auction.startDate] || {};
            return (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3">{auction.time}</td>
                <td className="p-3">{auction.location}</td>
                <td className="p-3">{auction.lane}</td>
                <td className="p-3 text-gray-700">
                  {hours !== undefined ? (
                    <span>
                      {hours}h {minutes}m {seconds}s
                    </span>
                  ) : (
                    <span>Loading...</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add Auction Form */}
      {isRegistered && (
        <div className="mt-8 bg-gray-100 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Add New Auction
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Time (e.g. 08:00 AM)"
              value={newAuction.time}
              onChange={(e) =>
                setNewAuction({ ...newAuction, time: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Location"
              value={newAuction.location}
              onChange={(e) =>
                setNewAuction({ ...newAuction, location: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Lane"
              value={newAuction.lane}
              onChange={(e) =>
                setNewAuction({ ...newAuction, lane: e.target.value })
              }
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAddAuction}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 w-full"
          >
            Add Auction
          </button>
        </div>
      )}
    </div>
  );
};

export default JoinAuctionTable;
