import React, { useEffect, useState } from "react";
import Card from "../../components/AdminCardComponent/Card";
import { FaCalendarAlt, FaCarSide, FaGavel, FaHistory } from "react-icons/fa";
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
    <div className="lg:p-6 p-2 bg-gray-50   lg:space-y-8 space-y-2">
      <h2 className="lg:text-3xl text-xl font-bold text-blue-950 text-center lg:text-start">
        Welcome Seller Dashboard
      </h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-2 gap-2">
        <Card
          title={"Total Vehicles"}
          totalData={allVehicles.length}
          color={"bg-blue-200"}
          icon={<FaCarSide size={28} />}
          path={"/seller/addVehicle"}
        />

        <Card
          title={"Live Auctions"}
          totalData={allLiveAuction.length}
          color={"bg-blue-200"}
          icon={<FaGavel size={28} />}
          path={"/seller/live-auctions"}
        />

        <Card
          title={"Upcoming Auctions"}
          totalData={allUpcoming.length}
          color={"bg-blue-200"}
          icon={<FaCalendarAlt size={28} />}
          path={"/seller/upcoming-auctions"}
        />

        <Card
          title={"Bid History"}
          totalData={bidHistory.length}
          color={"bg-blue-200"}
          icon={<FaHistory size={28} />}
          path={"/seller/my-bids"}
        />
      </div>
    </div>
  );
};
