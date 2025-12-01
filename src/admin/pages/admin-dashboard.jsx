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

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state?.auth);
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

  const handleGetAllBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBrands`);
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

  return (
    <>
      <div className="flex bg-[#F5F8FC] min-h-screen ">
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
    </>
  );
};

export default Dashboard;
