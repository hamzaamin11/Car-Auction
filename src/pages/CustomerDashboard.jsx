import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../components/Contant/URL";

export const CustomerDashboard = () => {
  const { wishlistByUser } = useSelector((state) => state?.wishList);
  const { currentUser } = useSelector((state) => state?.auth);

  const [statsData, setStatsData] = useState({});

  const wishLength = wishlistByUser?.[124]?.length;

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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-950 pb-4">Dashboard Stats</h1>

      <div className="flex lg:flex-row flex-col gap-6 text-blue-950 ">
        {/* Card 1 */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 w-full">
          <p className="text-xl font-semibold mb-4">Active Bids</p>

          <div className="space-y-2 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span>Total Vehicles Lot Count:</span>
              <span className="text-lg font-semibold">
                {statsData?.lotCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span>Total Vehicles Max Exposure:</span>
              <span className="text-lg font-semibold">
                {statsData?.maxExposure}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 w-full">
          <p className="text-xl font-semibold mb-4">Total Won Auction</p>

          <div className="space-y-2 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span>Won Auction:</span>
              <span className="text-lg font-semibold">
                {statsData?.wonCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span>Auction Cash:</span>
              <span className="text-lg font-semibold">
                {statsData?.wonSpend}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 w-full">
          <p className="text-xl font-semibold mb-4">Pre-qualification Status</p>

          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>Customer Eligible:</span>
            <span
              className={`text-lg font-semibold px-3 py-1 rounded ${
                statsData?.hasCnic === "No"
                  ? "bg-red-600 text-white"
                  : "bg-blue-950 text-white"
              }`}
            >
              {statsData?.hasCnic}
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 w-full">
          <p className="text-xl font-semibold mb-4">Outbid Alerts</p>

          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>Last 7 Days Outbids:</span>
            <span className="text-lg font-semibold">
              {statsData?.outbidLast7Days}
            </span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 w-full">
          <p className="text-xl font-semibold mb-4">Total Wishlist Vehicles</p>

          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>Wish Auctions:</span>
            <span className="text-lg font-semibold">{wishLength}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
