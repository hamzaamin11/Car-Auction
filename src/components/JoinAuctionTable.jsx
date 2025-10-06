import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "./Contant/URL";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const JoinAuctionTable = ({ allLive, upComing }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [getId, setGetId] = useState({});
  const navigate = useNavigate();

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
      Object.entries(addBiding).filter(([_, value]) => value !== "")
    );

    try {
      const res = await axios.post(
        `${BASE_URL}/customer/startBidding`,
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
        Live Auctions ({allLive?.length})
      </h2>

      {/* Table for large screens, cards for mobile */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full mb-8 border shadow-sm rounded overflow-hidden text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">SR#</th>
              <th className="p-2">Image</th>
              <th className="p-2">Model</th>
              <th className="p-2">Date</th>
              <th className="p-2">Start Time</th>
              <th className="p-2">End Time</th>

              <th className="p-2">Location</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {allLive?.map((auction, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 text-center">
                <td className="p-1">{idx + 1}</td>
                <td className="p-1 text-center w-16 h-16 ">
                  <img
                    src={auction.images[0]}
                    alt="auction image"
                    className=" "
                  />
                </td>
                <td className="p-1">
                  {auction.make}/{auction.model}
                </td>
                <td className="p-1">{auction.startTime.slice(0, 10)}</td>
                <td className="p-1">
                  {auction?.startTime
                    ? moment(auction.startTime).local().format("hh:mm A")
                    : "--"}
                </td>
                <td className="p-1">
                  {" "}
                  {auction?.endTime
                    ? moment(auction?.endTime).local().format("hh:mm A")
                    : "--"}
                </td>

                <td className="p-1">{auction.locationId}</td>
                <td className="p-1">
                  <button
                    className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs"
                    onClick={() => navigate(`/detailbid/${auction.vehicleId}`)}
                  >
                    Start Biding
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {allLive?.map((auction, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-3 shadow-sm bg-white text-sm"
          >
            <p>
              <strong>SR#:</strong> {idx + 1}
            </p>
            <p>
              <strong>Date:</strong> {auction.startTime.slice(0, 10)}
            </p>
            <p>
              <strong>Start Time:</strong>{" "}
              {auction?.startTime
                ? moment(auction.startTime).local().format("HH:mm:ss")
                : "--"}
            </p>
            <p>
              <strong>End Time:</strong>{" "}
              {auction?.endTime
                ? moment(auction?.endTime).local().format("HH:mm:ss")
                : "--"}
            </p>
            <p>
              <strong>Model:</strong> {auction.model}
            </p>
            <p>
              <strong>Location:</strong> {auction.locationId}
            </p>
            <button
              className="mt-2 w-full px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs"
              onClick={() => navigate(`/detailbid/${auction.vehicleId}`)}
            >
              Start Biding
            </button>
          </div>
        ))}
      </div>
      {allLive.length === 0 && (
        <span className="flex items-center justify-center font-bold ">
          No live data
        </span>
      )}

      {/* Upcoming Auctions */}
      <h2 className="text-xl font-semibold mb-2 text-gray-800 mt-6">
        Upcoming Auctions ({upComing.length})
      </h2>

      {/* Table for large screens */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full mb-2 border shadow-sm rounded overflow-hidden text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-center">Sr#</th>

              <th className=" text-center">Image</th>
              <th className="p-2 text-center">Model</th>

              <th className="p-2 text-center">Date</th>
              <th className="p-2 text-center">Auction Start</th>
              <th className="p-2 text-center">Location</th>
              <th className="p-2 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {upComing?.map((auction, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-1 text-center">{idx + 1}</td>
                <td
                  onClick={() => navigate(`/detailbid/${auction.vehicleId}`)}
                  className="p-1 text-center w-16 h-16 hover:cursor-pointer "
                >
                  <img
                    src={auction.images[0]}
                    alt="auction image"
                    className=" "
                  />
                </td>

                <td
                  onClick={() => navigate(`/detailbid/${auction.vehicleId}`)}
                  className="p-1 text-center hover:cursor-pointer"
                >
                  {auction.make}/{auction.model}
                </td>
                <td className="p-1 text-center">
                  {auction?.startTime.slice(0, 10)}
                </td>

                <td className="p-1 text-center">
                  {auction?.startTime
                    ? moment(auction.startTime).local().format("hh:mm A")
                    : "--"}
                </td>

                <td className="p-1 text-center">{auction.locationId}</td>
                <td className="p-1 text-center text-red-600 font-bold">
                  Pending
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {upComing?.map((auction, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-3 shadow-sm bg-white text-sm"
          >
            <p>
              <strong>SR#:</strong> {idx + 1}
            </p>
            <p>
              <strong>Date:</strong> {auction.startTime.slice(0, 10)}
            </p>
            <p>
              <strong>Auction Live:</strong>{" "}
              {auction.startTime.slice(10) || "00:00"}
            </p>
            <p>
              <strong>Model:</strong> {auction.make}/{auction.model}
            </p>
            <p>
              <strong>Location:</strong> {auction.locationId}
            </p>
            <p className="text-red-600">
              <strong>Status:</strong> Pending
            </p>
          </div>
        ))}
      </div>

      {upComing.length === 0 && (
        <span className="flex items-center justify-center font-bold mt-4">
          No upcoming data
        </span>
      )}
    </div>
  );
};

export default JoinAuctionTable;
