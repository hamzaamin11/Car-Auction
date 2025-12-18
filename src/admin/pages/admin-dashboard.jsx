import { useEffect, useState } from "react";

import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import Card from "../../components/AdminCardComponent/Card";
import { MdBrandingWatermark } from "react-icons/md";

import {
  FaCarSide,
  FaGavel,
  FaUsers,
  FaCalendarAlt,
  FaClipboardCheck,
  FaEnvelope,
  FaHandshake,
  FaCar,
  FaUser,
  FaChartLine,
  FaChartBar,
  FaCheckCircle,
  FaUserPlus,
  FaPercentage,
  FaShieldAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const currentDate = new Date().toISOString().split("T")[0];

const initialState = {
  fromDate: currentDate,
  toDate: currentDate,
};

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state?.auth);
  const [filterDate, setFilterDate] = useState(initialState);
  console.log("filter date =>", filterDate);
  const [loading, setLoading] = useState(false);
  const [totalVehicles, setTotalVehicles] = useState({});
  const [allBrands, setAllBrands] = useState([]);
  const [unapprovelVehicles, setUnapprovelVehicles] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [allSeries, setAllSeries] = useState([]);
  const [allPartners, setAllPartners] = useState([]);
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [contactMembers, setContactMembers] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [liveAuctions, setLiveAuctions] = useState({});
  const [upcomingBid, setUpcompingBid] = useState({});
  const [totalCustomers, setTotalCustomers] = useState({});
  const [bidHistory, setBidHistory] = useState([]);
  const [SubcribeUserList, setSubscribeUserList] = useState([]);
  const [awaitingStatus, setAwaitingStatus] = useState([]);
  const [bidInfo, setBidInfo] = useState([]);
  const [kpisStats, setKpisStats] = useState();

  const totalGMV = kpisStats?.data?.totalGMV;

  const totalAuction = kpisStats?.data?.totalAuctionsCompleted;

  const totalUsers = kpisStats?.data?.totalUsers?.newToday;

  const totalMonthUsers = kpisStats?.data?.totalUsers?.last30Days;

  const soldRate = kpisStats?.data?.soldRate?.last30Days;

  const activeAuction = kpisStats?.data?.complianceKPIs?.activeAuctions;

  const pendingAuction = kpisStats?.data?.complianceKPIs?.pendingKYC;

  console.log("totalGMV =>", totalAuction?.custom);

  const handleGetAllVehicle = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/getApprovedVehicles/${currentUser?.role}`
      );
      setTotalVehicles(res?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleGetBidHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/bidsForAdmin`);
      setBidHistory(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllLiveAuction = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/customer/totalLiveAuctions`);
      setLiveAuctions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpcomingBid = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/customer/totalUpcomingAuctions`);
      setUpcompingBid(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSuggestions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getSuggestions`);
      setAllSuggestions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdminKPIS = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/AdminDashboardStats/${currentUser?.id}?fromDate=${filterDate.fromDate}&toDate=${filterDate.toDate}`
      );
      console.log("KPIS =>>", res.data);
      setKpisStats(res.data);
    } catch {
      console.log(error);
    }
  };

  const handleGetAllPartners = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getPartner`);
      setAllPartners(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetCustomers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/customer/totalBuyers`);
      setTotalCustomers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllUnapprovelVehicles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getUnApprovedVehicles`);
      setUnapprovelVehicles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFilterDate({ ...filterDate, [name]: value });
  };

  const handleGetAllBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getBrands/${currentUser?.role}`
      );
      setAllBrands(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleGetAllModels = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getModels`);
      setAllModels(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllSeries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getSeries`);
      setAllSeries(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetContactUs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getContactUs`);
      setContactMembers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetALLCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`);

      setAllCities(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAwaitingVehicles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getawatingApprovedVehicles`);

      setAwaitingStatus(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetBidSummary = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBidSummary`);

      setBidInfo(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("KPIS =>", kpisStats);

  useEffect(() => {
    handleGetAllVehicle();
    handleGetAllLiveAuction();
    handleUpcomingBid();
    handleGetCustomers();
    handleGetAllBrands();
    handleGetAllModels();
    handleGetAllSeries();
    handleGetAllUnapprovelVehicles();
    handleGetSuggestions();
    handleGetAllPartners();
    handleGetContactUs();
    handleGetALLCities();
    handleGetBidHistory();
    handleGetAwaitingVehicles();
    handleGetBidSummary();
  }, []);

  useEffect(() => {
    handleAdminKPIS();
  }, [filterDate]);

  return (
    <>
      <div className="flex bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 md:p-8 space-y-8">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, Admin! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Live Dashboard
              </span>
            </div>
          </div>

          {/* TOP METRICS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Approved Vehicles */}
            <div className="group bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Link to={"/admin/vehicles"}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      Approved Vehicles
                    </p>
                    <h2 className="text-4xl font-bold text-gray-900">
                      {totalVehicles.length}
                    </h2>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-full bg-blue-100 rounded-full h-2">
                        <div
                          className="bg-blue-900 h-2 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                      <span className="text-xs text-blue-900 font-medium">
                        75%
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <FaCar className="text-3xl text-blue-900" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Live Auctions */}
            <div className="group bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Link to={"/admin/live-auctions"}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      Live Auctions
                    </p>
                    <h2 className="text-4xl font-bold text-gray-900">
                      {liveAuctions.totalLiveAuctions}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-blue-900 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-900 font-medium">
                        Active Now
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <FaGavel className="text-3xl text-blue-900" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Total Users */}
            <div className="group bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Link to={"/admin/manage-users"}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      Total Users
                    </p>
                    <h2 className="text-4xl font-bold text-gray-900">
                      {totalCustomers.totalBuyers}
                    </h2>
                    <div className="text-xs text-blue-900 font-medium mt-2">
                      +12% from last month
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <FaUsers className="text-3xl text-blue-900" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Upcoming Auctions */}
            <div className="group bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Link to={"/admin/upcoming-auctions"}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      Upcoming Auctions
                    </p>
                    <h2 className="text-4xl font-bold text-gray-900">
                      {upcomingBid.totalUpcomingAuctions}
                    </h2>
                    <div className="text-xs text-blue-900 font-medium mt-2">
                      Scheduled this week
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <FaCalendarAlt className="text-3xl text-blue-900" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* SECOND ROW - 2 COLUMNS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - New Submissions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    Pending Approvals
                  </h3>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                    Action Required
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-2">
                      New submissions awaiting your approval
                    </p>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-5xl font-bold text-gray-900">
                        {awaitingStatus.length}
                      </h2>
                      <span className="text-gray-500">vehicles</span>
                    </div>
                    <Link
                      to={"/admin/approval"}
                      className="mt-6 bg-blue-900 hover:opacity-95 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <FaClipboardCheck /> Review Now
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="w-48 h-48">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full opacity-10"></div>
                      <FaClipboardCheck className="text-8xl text-blue-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Two Small Cards */}
            <div className="space-y-6">
              {/* Vehicle Snapshot */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCarSide className="text-blue-900" /> Vehicle Snapshot
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Non Approved Vehicles",
                      value: unapprovelVehicles.length,
                      color: "bg-red-500",
                      path: "/admin/approval",
                    },
                    {
                      label: "Vehicle Makes",
                      value: allBrands.length,
                      color: "bg-blue-500",
                      path: "/admin/addbrand",
                    },
                    {
                      label: "Auction Models",
                      value: allModels.length,
                      color: "bg-green-500",
                      path: "/admin/addmodel",
                    },
                  ].map((item, index) => (
                    <Link to={`${item.path}`}>
                      <div
                        key={index}
                        className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${item.color}`}
                          ></div>
                          <span className="text-gray-700">{item.label}</span>
                        </div>
                        <span className="font-bold text-gray-900 text-lg">
                          {item.value}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Auction Activity */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaChartLine className="text-blue-900" /> Latest Bid Activity
                </h3>
                {bidInfo.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FaUser className="text-blue-900" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Latest Bidder</p>
                          <p className="font-semibold">
                            {bidInfo[0].bidderName.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FaEnvelope className="text-blue-900" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Seller</p>
                          <p className="font-semibold">
                            {bidInfo[0].sellerName.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FaCarSide className="text-blue-900" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Vehicle</p>
                          <p className="font-semibold">
                            {bidInfo[0].vehicleName.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recent bid activity
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* BUSINESS STATS SECTION */}
          <div className="mt-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Business Performance
                </h1>
                <p className="text-gray-600 mt-1">
                  Key metrics and financial overview
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                <span className="text-sm text-gray-700">Real-time Data</span>
              </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total GMV */}
              <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Total GMV</h3>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FaChartBar className="text-blue-900" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {totalGMV?.custom} PKR
                </h2>
                <div className="space-y-3">
                  <div className="flex flex-col  gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-600 mb-1 block">
                        From Date
                      </label>
                      <input
                        type="date"
                        name="fromDate"
                        onChange={handlechange}
                        value={filterDate.fromDate}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-600 mb-1 block">
                        To Date
                      </label>
                      <input
                        type="date"
                        name="toDate"
                        onChange={handlechange}
                        value={filterDate.toDate}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Auction Completion */}
              <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="font-bold text-gray-800">
                    Auction Completion
                  </h3>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FaCheckCircle className="text-blue-900" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Today</span>
                    <span className="text-2xl font-bold text-blue-900">
                      {totalAuction?.today}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Month to Date</span>
                    <span className="text-2xl font-bold text-blue-900">
                      {totalAuction?.MTD}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Registration */}
              <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="font-bold text-gray-800">User Growth</h3>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FaUserPlus className="text-blue-900" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Today</span>
                    <span className="text-2xl font-bold text-blue-900">
                      {totalUsers?.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Last 30 Days</span>
                    <span className="text-2xl font-bold text-blue-900">
                      {totalMonthUsers?.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sold Rate & Compliance */}
              <div className="space-y-6">
                {/* Sold Rate */}
                <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-gray-800">Sold Rate</h3>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FaPercentage className="text-blue-900" />
                    </div>
                  </div>
                  <div className="text-center py-3">
                    <div className="text-4xl font-bold text-blue-900 mb-2">
                      {soldRate}%
                    </div>
                    <p className="text-sm text-gray-600">
                      Last 30 Days Average
                    </p>
                  </div>
                </div>

                {/* Compliance KPIs */}
                <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-gray-800">Compliance KPIs</h3>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FaShieldAlt className="text-blue-900" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Active Auctions</span>
                      <span className="font-bold text-lg text-gray-900">
                        {activeAuction}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Pending KYC</span>
                      <span className="font-bold text-lg text-red-600">
                        {pendingAuction}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
