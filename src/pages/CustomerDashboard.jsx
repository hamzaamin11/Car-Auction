import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../components/Contant/URL";
import { Link } from "react-router-dom";

export const CustomerDashboard = () => {
  const wishlistByUser = useSelector(
    (state) => state?.wishList?.wishlistByUser
  );

  const { currentUser } = useSelector((state) => state?.auth);

  const [statsData, setStatsData] = useState({});
  // Get current user's wishlist only
  const wishVehicle = useMemo(() => {
    if (!currentUser?.id) return [];
    return wishlistByUser?.[currentUser.id] || [];
  }, [currentUser, wishlistByUser]);

  const handleCustomerStats = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/CustomerStatsDashboard/${currentUser?.id}`
      );
      setStatsData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCustomerStats();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with elegant design */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-950 pb-2">
            Dashboard <span className="text-blue-600">Stats</span>
          </h1>
          <p className="text-gray-600">Overview of your auction performance</p>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-900 to-blue-500 mt-2 rounded-full"></div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 - Active Bids */}
          <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-5">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg
                  className="w-6 h-6 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-xl font-bold text-blue-950">Active Bids</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">
                  Total Vehicles Lot Count
                </div>
                <div className="text-2xl font-bold text-blue-950">
                  {statsData?.lotCount || 0}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">
                  Total Vehicles Max Exposure
                </div>
                <div className="text-2xl font-bold text-blue-950">
                  {statsData?.maxExposure || "$0"}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Total Won Auction */}
          <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-5">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg
                  className="w-6 h-6 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-xl font-bold text-blue-900">
                Total Won Auction
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Won Auction</div>
                <div className="text-2xl font-bold text-blue-900">
                  {statsData?.wonCount || 0}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Auction Cash</div>
                <div className="text-2xl font-bold text-blue-900">
                  {statsData?.wonSpend || "$0"}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Pre-qualification Status */}
          <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-5">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg
                  className="w-6 h-6 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="text-xl font-bold text-blue-900">
                Pre-qualification Status
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-100 text-center">
              <div className="text-sm text-gray-600 mb-3">
                Customer Eligible
              </div>
              <div
                className={`inline-flex items-center justify-center px-6 py-3 rounded-lg text-xl font-bold ${
                  statsData?.hasCnic === "No"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                    : "bg-blue-900 text-white"
                }`}
              >
                {statsData?.hasCnic || "No"}
                {statsData?.hasCnic === "Yes" && (
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Card 4 - Outbid Alerts */}
          <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-5">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg
                  className="w-6 h-6 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.308 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-xl font-bold text-blue-900">Outbid Alerts</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-100 text-center">
              <div className="text-sm text-gray-600 mb-3">
                Last 7 Days Outbids
              </div>
              <div className="text-4xl font-bold text-blue-900">
                {statsData?.outbidLast7Days || 0}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Recent outbid situations
              </div>
            </div>
          </div>

          {/* Card 5 - Total Wishlist Vehicles */}
          <Link to={"/wishlist"}>
            <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-5">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <svg
                    className="w-6 h-6 text-blue-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <p className="text-xl font-bold text-blue-900">
                  Total Wishlist Vehicles
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-100 text-center">
                <div className="text-sm text-gray-600 mb-3">Wish Auctions</div>
                <div className="text-4xl font-bold text-blue-900">
                  {wishVehicle?.length || 0}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Saved for future
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
