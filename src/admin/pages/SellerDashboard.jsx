import React, { useEffect, useState } from "react";
import {
  FaCar,
  FaGavel,
  FaChartLine,
  FaClock,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../components/Contant/URL";

// Reusable Card Component
const DashboardCard = ({
  title,
  value,
  icon,
  label,
  labelPrice,
  totalPrice,
}) => (
  <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center">
    <div>
      <p className="text-2xl font-semibold text-blue-950">{title}</p>
      <h2 className="text-lg font-bold mt-3">
        {label} {value}
      </h2>
      <div className="text-lg font-bold mt-3">
        {labelPrice} {totalPrice}
      </div>
    </div>
    <div className="text-5xl text-blue-950">{icon}</div>
  </div>
);

export const SellerDashboard = () => {
  const { currentUser } = useSelector((state) => state?.auth);

  const [records, setRecords] = useState();

  console.log("=>", records?.data);

  const vehicle = records?.data?.approvedVehicles;

  const lastMonth = records?.data?.last30DaysSold;

  const daysSale = records?.data?.soldVehicles;

  const bidder = records?.data?.topBidder;

  const handleGetDashboardData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/SellerDashBoardStats/${currentUser?.id}/${currentUser?.role}`
      );
      setRecords(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetDashboardData();
  }, []);

  return (
    <div className="flex bg-[#F5F8FC] min-h-screen">
      <div className="flex-1 p-8 space-y-10 text-blue-950">
        <h1 className="text-3xl font-bold text-blue-950">
          Welcome, Seller Dashboard
        </h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Active Lots"
            label="Total Vehicles"
            labelPrice="Total Price"
            totalPrice={vehicle?.approvedAmount}
            value={vehicle?.totalApproved}
            icon={<FaCar />}
          />
          <DashboardCard
            title="Sold Lots (Last 30 Days)"
            label="Total Vehicles"
            value={lastMonth?.last30Sold}
            labelPrice="Total Price"
            totalPrice={lastMonth?.last30Amount}
            icon={<FaGavel />}
          />
          <DashboardCard
            title="Sell-through Rate"
            value={`${records?.data?.salePercentage}%`}
            icon={<FaChartLine />}
          />
          <DashboardCard
            title="Average Days to Sale"
            label="Sold Vehicles"
            value={daysSale?.totalSold}
            labelPrice="Total Price"
            totalPrice={lastMonth?.last30Amount}
            icon={<FaClock />}
          />

          <DashboardCard
            title="Top Bidders Interested"
            icon={<FaUser />}
            label="Bidder Name"
            value={bidder?.name}
            labelPrice="Contact #"
            totalPrice={bidder?.contact}
          />
        </div>
      </div>
    </div>
  );
};
