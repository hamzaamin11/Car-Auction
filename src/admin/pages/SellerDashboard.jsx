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

export const SellerDashboard = () => {
  const { currentUser } = useSelector((state) => state?.auth);
  const [records, setRecords] = useState();

  const token = currentUser?.token;
  console.log("=>", records?.data);

  const vehicle = records?.data?.approvedVehicles;
  const lastMonth = records?.data?.last30DaysSold;
  const daysSale = records?.data?.soldVehicles;
  const bidder = records?.data?.topBidder;

  const handleGetDashboardData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/SellerDashBoardStats/${currentUser?.id}/${currentUser?.role}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      setRecords(res.data);
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetDashboardData();
  }, []);

  return (
    <div className="max-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-6 lg:p-8">
      {/* HEADER SECTION */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-950">
              Seller Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Welcome back! Here's your performance overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD CARDS GRID - Compact Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {/* ACTIVE LOTS CARD */}
        <div className="group relative bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">
                Active Lots
              </h3>
              <p className="text-xs text-gray-500">Currently listed vehicles</p>
            </div>
            <div className="bg-blue-950 p-2 rounded-lg">
              <FaCar className="text-lg text-white" />
            </div>
          </div>

          <Link to={"/seller/addVehicle"}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs">Total Vehicles</span>
                <span className="text-lg font-bold text-blue-950">
                  {vehicle?.totalApproved || 0}
                </span>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs">Total Price</span>
                  <span className="text-base font-semibold text-gray-900">
                    {vehicle?.approvedAmount || "0"} PKR
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-blue-950 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (vehicle?.totalApproved || 0) * 10,
                    100,
                  )}%`,
                }}
              />
            </div>
           
          </div>
        </div>

        {/* SOLD LOTS CARD */}
        <div className="group relative bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-gray-800">
                  Sold Lots
                </h3>
                <span className="text-xs bg-blue-100 text-blue-950 px-2 py-0.5 rounded-full">
                  Last 30 Days
                </span>
              </div>
              <p className="text-xs text-gray-500">Recent sales performance</p>
            </div>
            <div className="bg-blue-950 p-2 rounded-lg">
              <FaGavel className="text-lg text-white" />
            </div>
          </div>

          <Link to={"/seller/my-bids"}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs">Total Vehicles</span>
                <span className="text-lg font-bold text-blue-950">
                  {lastMonth?.last30Sold || 0}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs">Total Price</span>
                  <span className="text-base font-semibold text-gray-900">
                    {lastMonth?.last30Amount || "0"} PKR
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* SELL-THROUGH RATE CARD */}
        <div className="group relative bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">
                Sell-through Rate
              </h3>
              <p className="text-xs text-gray-500">Conversion rate</p>
            </div>
            <div className="bg-blue-950 p-2 rounded-lg">
              <FaChartLine className="text-lg text-white" />
            </div>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="url(#gradient-purple)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${records?.data?.salePercentage || 0} 100`}
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
                <span className="text-xl font-bold text-gray-900">
                  {records?.data?.salePercentage || 0}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Listing to sales conversion
          </p>
        </div>

        {/* AVERAGE DAYS TO SALE CARD */}
        <div className="group relative bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">
                Average Days to Sale
              </h3>
              <p className="text-xs text-gray-500">Time to sell vehicles</p>
            </div>
            <div className="bg-blue-950 p-2 rounded-lg">
              <FaClock className="text-lg text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-xs">Sold Vehicles</span>
              <span className="text-lg font-bold text-blue-950">
                {daysSale?.totalSold || 0}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs">Average Time</span>
                <span className="text-base font-semibold text-gray-900">
                  {daysSale?.averageDays || "0"} Days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TOP BIDDERS CARD */}
        <div className="group relative bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">
                Top Bidder Interest
              </h3>
              <p className="text-xs text-gray-500">Most active bidder</p>
            </div>
            <div className="bg-blue-950 p-2 rounded-lg">
              <FaUser className="text-lg text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-indigo-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-950 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">
                  {bidder?.name?.charAt(0) || "B"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {bidder?.name || "No Bidder Data"}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  Most Active Bidder
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-0.5">Contact Number</p>
                <p className="text-xs font-medium text-gray-900 truncate">
                  {bidder?.contact || "N/A"}
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-0.5">Total Bids</p>
                <p className="text-xs font-medium text-gray-900">
                  {bidder?.totalBids || "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
