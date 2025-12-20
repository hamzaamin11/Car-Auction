import React, { useEffect, useState } from "react";
import {
  FaCar,
  FaGavel,
  FaChartLine,
  FaClock,
  FaMoneyBillWave,
  FaUser,
  FaArrowUp,
} from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../components/Contant/URL";
import { Link } from "react-router-dom";

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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 ">
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        {/* HEADER SECTION */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-blue-950 bg-clip-text text-transparent">
                Seller Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your vehicles and track performance metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-20"></div>
                <div className="relative bg-white px-4 py-2 rounded-full shadow-md border border-blue-100">
                  <span className="text-sm font-medium text-blue-950">
                    Real-time Analytics
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {/* ACTIVE LOTS CARD */}
          <div className="group relative bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4">
              <div className="bg-blue-950 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <FaCar className="text-2xl text-white" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Active Lots
            </h3>
            <Link to={"/seller/addVehicle"}>
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Total Vehicles</span>
                  <span className="text-2xl font-bold text-blue-950">
                    {vehicle?.totalApproved || 0}
                  </span>
                </div>

                <div className="pt-3 border-t border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Total Price</span>
                    <span className="text-xl font-bold text-gray-900">
                      {vehicle?.approvedAmount || "0"} PKR
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="mt-6 pt-4 border-t border-blue-100">
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div
                  className="bg-blue-950 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (vehicle?.totalApproved || 0) * 10,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* SOLD LOTS CARD */}
          <div className="group relative bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4">
              <div className="bg-blue-950 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <FaGavel className="text-2xl text-white" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Sold Lots</h3>
              <span className="text-xs bg-blue-100 text-blue-950 px-2 py-1 rounded-full">
                Last 30 Days
              </span>
            </div>
            <Link to={"/seller/my-bids"}>
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Total Vehicles</span>
                  <span className="text-2xl font-bold text-blue-950">
                    {lastMonth?.last30Sold || 0}
                  </span>
                </div>
                <div className="pt-3 border-t border-green-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Total Price</span>
                    <span className="text-xl font-bold text-gray-900">
                      {lastMonth?.last30Amount || "0"} PKR
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* SELL-THROUGH RATE CARD */}
          <div className="group relative bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4">
              <div className="bg-blue-950 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <FaChartLine className="text-2xl text-white" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Sell-through Rate
            </h3>

            <div className="mt-8 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient-purple)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${
                      records?.data?.salePercentage || 0
                    } 100`}
                    strokeDashoffset="25"
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient
                      id="gradient-purple"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#172554" />
                      <stop offset="100%" stopColor="#172554" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {records?.data?.salePercentage || 0}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Conversion rate of listings to sales
              </p>
            </div>
          </div>

          {/* AVERAGE DAYS TO SALE CARD */}
          <div className="group relative bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4">
              <div className="bg-blue-950 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <FaClock className="text-2xl text-white" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Average Days to Sale
            </h3>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Sold Vehicles</span>
                <span className="text-2xl font-bold text-blue-950">
                  {daysSale?.totalSold || 0}
                </span>
              </div>
              <div className="pt-3 border-t border-orange-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Average Time</span>
                  <span className="text-xl font-bold text-gray-900">
                    {daysSale?.averageDays || "0"} Days
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6"></div>
          </div>

          {/* TOP BIDDERS CARD */}
          <div className="group relative bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-4 right-4">
              <div className="bg-blue-950 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <FaUser className="text-2xl text-white" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Top Bidder Interest
            </h3>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-950 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {bidder?.name?.charAt(0) || "B"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {bidder?.name || "No Bidder Data"}
                  </p>
                  <p className="text-sm text-gray-600">Most Active Bidder</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-white rounded-lg border border-indigo-100">
                  <p className="text-xs text-gray-600 mb-1">Contact Number</p>
                  <p className=" text-xs text-gray-900">
                    {bidder?.contact || "N/A"}
                  </p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-indigo-100">
                  <p className="text-xs text-gray-600 mb-1">Total Bids</p>
                  <p className="text-xs text-gray-900">
                    {bidder?.totalBids || "0"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-indigo-100"></div>
          </div>

          <div className=""></div>
        </div>
      </div>
    </div>
  );
};
