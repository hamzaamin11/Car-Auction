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
} from "react-icons/fa";
import { useSelector } from "react-redux";

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
      <div className="flex bg-[#F5F8FC]  ">
        {/* MAIN CONTENT */}
        <div className="flex-1 p-8 space-y-10 text-blue-950">
          <h1 className="text-3xl font-bold text-blue-950">Welcome, Admin</h1>

          {/* TOP ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Approved Vehicles */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center">
              <div>
                <p className="text-blue-950 text-xl">Total Approved Vehicles</p>
                <h2 className="text-4xl font-bold mt-3">
                  {totalVehicles.length}
                </h2>
              </div>
              <FaCar className=" text-6xl" />
            </div>

            {/* Live Auctions */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center">
              <div>
                <p className=" text-xl">Live Auctions Now</p>
                <h2 className="text-4xl font-bold mt-3">
                  {liveAuctions.totalLiveAuctions}
                </h2>
              </div>
              <FaGavel className=" text-6xl" />
            </div>

            {/* Total Users */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center">
              <div>
                <p className="text-xl">Total Users</p>
                <h2 className="text-4xl font-bold mt-3">
                  {totalCustomers.totalBuyers}
                </h2>
              </div>
              <FaUsers className=" text-6xl" />
            </div>

            {/* Upcoming Auctions */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center">
              <div>
                <p className=" text-xl">Upcoming Auctions</p>
                <h2 className="text-4xl font-bold mt-3">
                  {upcomingBid.totalUpcomingAuctions}
                </h2>
              </div>
              <FaCalendarAlt className=" text-6xl" />
            </div>
          </div>

          {/* SECOND ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New Submissions */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center">
              <div>
                <p className=" text-xl">New Submissions Awaiting Approval</p>
                <h2 className="text-4xl font-bold mt-3">
                  {awaitingStatus.length}
                </h2>
              </div>
              <FaClipboardCheck className=" text-6xl" />
            </div>

            {/* Operations Snapshot */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-4">
              <h3 className="font-semibold  text-lg">Vehicle Snapshot</h3>

              <div className="flex justify-between text-gray-700 text-sm">
                <span>Non Approved Vehicles</span>{" "}
                <b> {unapprovelVehicles.length}</b>
              </div>

              <div className="flex justify-between text-gray-700 text-sm">
                <span>Vehicle Makes</span> <b>{allBrands.length}</b>
              </div>

              <div className="flex justify-between text-gray-700 text-sm">
                <span>Auction Models</span> <b>{allModels.length}</b>
              </div>
            </div>

            {/* Auction Activity */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-4">
              <h3 className="font-semibold  text-lg">Auction Activity</h3>
              {bidInfo.length > 0 && (
                <ul className="space-y-3 text-gray-700 text-sm">
                  <li className="flex items-center gap-2">
                    <FaUser /> Customer who placed the latest bid
                    <b>{bidInfo[0].bidderName.toUpperCase()}</b>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaEnvelope /> Name of the seller
                    <b>{bidInfo[0].sellerName.toUpperCase()}</b>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCarSide /> Vehicle Name{" "}
                    <b>{bidInfo[0].vehicleName.toUpperCase()}</b>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-blue-950 pb-4">
          Busniess Stats
        </h1>

        <div className="flex lg:flex-row flex-col gap-6 text-blue-950">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center w-full">
            <div className="space-y-3">
              <p className="text-xl font-semibold">Total GMV</p>

              <h2 className="text-lg font-bold">{totalGMV?.custom} PKR</h2>

              <div className="flex items-center gap-3 pt-2">
                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-gray-800 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    onChange={handlechange}
                    value={filterDate.fromDate}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-[10px] focus:border-blue-900 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-gray-800 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    onChange={handlechange}
                    value={filterDate.toDate}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-[10px] focus:border-blue-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center w-full">
            <div className="space-y-5">
              <p className="text-xl font-semibold">Total Auction Completed</p>

              <h2 className="text-sm font-semibold">
                Today Auction Completed{""}
                <span className="px-4 text-lg font-semibold">
                  {totalAuction?.today}
                </span>
              </h2>
              <h2 className="text-sm font-semibold">
                MTD Auction Completed{""}
                <span className="px-4 text-lg font-semibold">
                  {totalAuction?.MTD}
                </span>
              </h2>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center w-full">
            <div className="space-y-5">
              <p className="text-xl font-semibold">Total Registered Users</p>

              <h2 className="text-sm font-semibold">
                Today Register Users{""}
                <span className="px-4 text-lg font-semibold">
                  {totalUsers?.total}
                </span>
              </h2>
              <h2 className="text-sm font-semibold">
                Last 30 Days Register Users{""}
                <span className="px-4 text-lg font-semibold">
                  {totalMonthUsers?.total}
                </span>
              </h2>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex justify-between items-center w-full">
            <div className="space-y-5">
              <p className="text-xl font-semibold">Sold Rate Average</p>

              <h2 className="text-sm font-semibold">
                Last 30 Days Sold Rate{""}
                <span className="px-4 text-lg font-semibold">{soldRate}</span>
              </h2>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl text-blue-950 p-6 flex justify-between items-center w-[295px] mt-6">
          <div className="space-y-5">
            <p className="text-xl font-semibold">Compliance KPIs</p>

            <h2 className="text-sm font-semibold">
              Total Active Auctions{""}
              <span className="px-4 text-lg font-semibold">
                {activeAuction}
              </span>
            </h2>
            <h2 className="text-sm font-semibold">
              Pending KYC{""}
              <span className="px-4 text-lg font-semibold">
                {pendingAuction}
              </span>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
