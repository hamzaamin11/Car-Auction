import React, { useEffect, useState } from "react";
import Card from "../../components/AdminCardComponent/Card";
import {
  FaCalendarAlt,
  FaCar,
  FaCarSide,
  FaGavel,
  FaHistory,
  FaUsers,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import { useSelector } from "react-redux";

export const SellerDashboard = () => {
  const { currentUser } = useSelector((state) => state?.auth);

  const [allVehicles, setAllVehicles] = useState([]);

  const [allLiveAuction, setAllLiveAuction] = useState([]);

  const [allUpcoming, setAllUpcoming] = useState([]);

  const [bidHistory, setBidHistory] = useState([]);

  console.log("history =>", bidHistory);

  console.log("all vehicle =>", allVehicles);

  const handleGetAllVehicles = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getVehiclesByUser/${currentUser?.id}`
      );
      setAllVehicles(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllLivebySeller = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/liveAuctions/${currentUser?.id}`
      );
      setAllLiveAuction(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllHistorybySeller = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/customer/myBids/${currentUser?.id}`
      );
      setBidHistory(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllUpcomingAuctionsbySeller = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/seller/upcomingAuctions/${currentUser?.id}`
      );
      setAllUpcoming(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllVehicles();
    handleGetAllLivebySeller();
    handleGetAllUpcomingAuctionsbySeller();
    handleGetAllHistorybySeller();
  }, []);
  return (
    <>
      <div className="flex bg-[#F5F8FC] min-h-screen ">
        {/* MAIN CONTENT */}
        <div className="flex-1 p-8 space-y-10 text-blue-950">
          <h1 className="text-3xl font-bold text-blue-950">
            Welcome, Seller Dashboard
          </h1>
          {/* TOP ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Approved Vehicles */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center">
              <div>
                <p className="text-blue-950 text-xl">Total Approved Vehicles</p>
                <h2 className="text-4xl font-bold mt-3">
                  {allVehicles.length}
                </h2>
              </div>
              <FaCar className=" text-6xl" />
            </div>

            {/* Live Auctions */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center">
              <div>
                <p className=" text-xl">Live Auctions Now</p>
                <h2 className="text-4xl font-bold mt-3">
                  {allLiveAuction.length}
                </h2>
              </div>
              <FaGavel className=" text-6xl" />
            </div>

            {/* Total Users */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center">
              <div>
                <p className="text-xl">Auction History</p>
                <h2 className="text-4xl font-bold mt-3">{bidHistory.length}</h2>
              </div>
              <FaHistory className=" text-6xl" />
            </div>

            {/* Upcoming Auctions */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center">
              <div>
                <p className=" text-xl">Upcoming Auctions</p>
                <h2 className="text-4xl font-bold mt-3">
                  {allUpcoming.length}
                </h2>
              </div>
              <FaCalendarAlt className=" text-6xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
