import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const MyBids = () => {
  const { user } = useAuth();

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utility: check if bid ended
  const isBidEnded = (endTime) => new Date() > new Date(endTime);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        if (!user?.id) return;

        let endpoint = "";
        if (user.role === "seller") {
          endpoint = `http://localhost:3001/customer/myBids/${user.id}`;
        } else {
          endpoint = `http://localhost:3001/customer/myBids/${user.id}`;
        }

        const res = await fetch(endpoint, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch bids");

        const data = await res.json();

        setBids(data?.bids || data);
      } catch (err) {
        setError(err.message || "Error fetching bids");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [user]);

  console.log("bid", bids);

  const handleGetBids = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/customer/myBids/${user.id}`
      );

      setBids(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetBids();
  }, []);
  const handleEndBid = async (bidId) => {
    try {
      const res = await fetch(
        `http://localhost:3001/seller/endBidding/${bidId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to end bid");

      // Update UI to reflect bid ended
      setBids((prev) =>
        prev.map((bid) =>
          bid.id === bidId
            ? { ...bid, status: "ended", endTime: new Date().toISOString() }
            : bid
        )
      );
      handleGetBids();
    } catch (err) {
      alert(err.message || "Error ending bid");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg font-semibold">
        Loading...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-red-500 text-lg font-semibold">
        {error}
      </p>
    );

  if (bids.length === 0)
    return (
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md text-center text-gray-500 text-lg font-medium">
        No bids found.
      </div>
    );

  if (user.role === "seller") {
    // Seller view
    return (
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-8 border-b-4 border-blue-500 pb-3 select-none drop-shadow-md">
          Bids on Your Vehicles
        </h2>

        <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-r from-blue-200 to-blue-300 text-gray-800 uppercase text-sm font-semibold select-none shadow-sm">
            <tr>
              <th className="p-4 border border-blue-300 text-left">Sr#</th>
              <th className="p-4 border border-blue-300 text-left">
                Vehicle ID
              </th>
              <th className="p-4 border border-blue-300 text-left">VIN</th>
              <th className="p-4 border border-blue-300 text-left">Image</th>
              <th className="p-4 border border-blue-300 text-right">
                Current Bid
              </th>
              <th className="p-4 border border-blue-300 text-left">
                Start Time
              </th>
              <th className="p-4 border border-blue-300 text-left">End Time</th>
              <th className="p-4 border border-blue-300 text-center">Status</th>
              <th className="p-4 border border-blue-300 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, i) => {
              const ended = isBidEnded(bid.endTime) || bid.status === "ended";
              return (
                <tr
                  key={bid.id}
                  className={`transition-colors duration-300 ${
                    i % 2 === 0 ? "bg-white" : "bg-blue-50"
                  } hover:bg-blue-100 cursor-pointer`}
                >
                  <td className="p-4 border border-blue-300">{i + 1}</td>
                  <td className="p-4 border border-blue-300">
                    {bid.vehicleId}
                  </td>
                  <td className="p-4 border border-blue-300">{bid.vin}</td>
                  <td className="p-4 border border-blue-300">
                    <img
                      src={bid.image || "/placeholder.jpg"}
                      alt="Vehicle"
                      className="w-28 h-16 object-cover rounded-lg border border-gray-300 shadow-sm"
                    />
                  </td>
                  <td className="p-4 border border-blue-300 text-right">
                    {bid.currentBid}
                  </td>
                  <td className="p-4 border border-blue-300">
                    {new Date(bid.startTime).toLocaleString()}
                  </td>
                  <td className="p-4 border border-blue-300">
                    {new Date(bid.endTime).toLocaleString()}
                  </td>
                  <td className="p-4 border border-blue-300 text-center font-semibold uppercase">
                    {bid.auctionStatus}
                  </td>
                  <td className="p-4 border border-blue-300 text-center">
                    <button
                      onClick={() => handleEndBid(bid.bidId)}
                      // disabled={bid.auctionStatus}
                      className={`px-4 py-1 rounded ${
                        bid.auctionStatus === "end"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {bid.auctionStatus === "end" ? "Ended" : "End"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // Default: Customer view (your existing one)
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-blue-800 mb-8 border-b-4 border-blue-500 pb-3 select-none drop-shadow-md">
        My Bids
      </h2>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-r from-blue-200 to-blue-300 text-gray-800 uppercase text-sm font-semibold select-none shadow-sm">
            <tr>
              <th className="p-4 border border-blue-300 text-left">Image</th>
              <th className="p-4 border border-blue-300 text-left">Vehicle</th>
              <th className="p-4 border border-blue-300 text-left">VIN</th>
              <th className="p-4 border border-blue-300 text-right">Max Bid</th>
              <th className="p-4 border border-blue-300 text-right">
                Monster Bid
              </th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, i) => (
              <tr
                key={bid.id || i}
                className={`transition-colors duration-300 ${
                  i % 2 === 0 ? "bg-white" : "bg-blue-50"
                } hover:bg-blue-100 cursor-pointer`}
              >
                <td className="p-4 border border-blue-300">
                  <img
                    src={bid.image || "haxa"}
                    alt="Vehicle"
                    className="w-28 h-16 object-cover rounded-lg border border-gray-300 shadow-sm"
                  />
                </td>
                <td className="p-4 border border-blue-300 font-semibold text-gray-900">
                  {bid.make} {bid.model}{" "}
                  <span className="text-gray-500 font-normal">
                    ({bid.year})
                  </span>
                </td>
                <td className="p-4 border border-blue-300">{bid.vin}</td>
                <td className="p-4 border border-blue-300 text-right">
                  {bid.maxBid}
                </td>
                <td className="p-4 border border-blue-300 text-right">
                  {bid.monsterBid}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-6">
        {bids.map((bid, i) => (
          <div
            key={bid.id || i}
            className="p-5 border border-gray-300 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-[1.03] cursor-pointer bg-white"
          >
            <img
              src={bid.image || "/placeholder.jpg"}
              alt="Vehicle"
              className="w-full h-44 object-cover rounded-lg border border-gray-300 shadow-sm mb-4"
            />
            <p className="font-extrabold text-xl text-blue-800 mb-1">
              {bid.make} {bid.model}{" "}
              <span className="font-normal text-gray-500">({bid.year})</span>
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">VIN:</span> {bid.vin}
            </p>
            <p className="text-gray-800 font-semibold mb-0">
              Max Bid: {bid.maxBid}
            </p>
            <p className="text-gray-800 font-semibold">
              Monster Bid: {bid.monsterBid}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBids;
