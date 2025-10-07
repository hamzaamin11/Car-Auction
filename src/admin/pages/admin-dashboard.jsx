import { useEffect, useState } from "react";
import {
  FaCarSide,
  FaGavel,
  FaUsers,
  FaCalendarAlt,
  FaHistory,
  FaEnvelope,
  FaHandshake,
  FaCity,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import Card from "../../components/AdminCardComponent/Card";
import { MdBrandingWatermark } from "react-icons/md";

const barData = [
  { name: "Jan", sales: 300 },
  { name: "Feb", sales: 450 },
  { name: "Mar", sales: 700 },
  { name: "Apr", sales: 500 },
  { name: "May", sales: 750 },
];

const pieData = [
  { name: "Sold", value: 75 },
  { name: "Unsold", value: 25 },
];

const pieColors = ["#34D399", "#F87171"];

const initialBids = [
  { id: 1, vehicle: "Toyota Corolla", bidder: "Ali", amount: "$5,000" },
  { id: 2, vehicle: "Honda Civic", bidder: "Ahmed", amount: "$7,200" },
  { id: 3, vehicle: "Suzuki WagonR", bidder: "Sara", amount: "$4,500" },
];

const Dashboard = () => {
  const [bids, setBids] = useState(initialBids);
  const [newBid, setNewBid] = useState({ vehicle: "", bidder: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [totalVehicles, setTotalVehicles] = useState({});
  const [allBrands, setAllBrands] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [allSeries, setAllSeries] = useState([]);
  const [liveAuctions, setLiveAuctions] = useState({});
  const [upcomingBid, setUpcompingBid] = useState({});
  const [totalCustomers, setTotalCustomers] = useState({});

  const handleDelete = (id) => {
    setBids(bids.filter((bid) => bid.id !== id));
  };

  const handleAddBid = () => {
    if (newBid.vehicle && newBid.bidder && newBid.amount) {
      const newId = bids.length ? Math.max(...bids.map((b) => b.id)) + 1 : 1;
      setBids([...bids, { id: newId, ...newBid }]);
      setNewBid({ vehicle: "", bidder: "", amount: "" });
    }
  };

  const handleGetAllVehicle = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/customer/totalVehicles`);
      setTotalVehicles(res?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
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

  const handleGetCustomers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/customer/totalBuyers`);
      setTotalCustomers(res.data);
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

  useEffect(() => {
    handleGetAllVehicle();
    handleGetAllLiveAuction();
    handleUpcomingBid();
    handleGetCustomers();
    handleGetAllBrands();
    handleGetAllModels();
    handleGetAllSeries();
  }, []);

  return (
    <>
      <div className="p-6 bg-gray-50 space-y-8">
        <h2 className="text-3xl font-bold text-[#191970]">Welcome, Admin</h2>

        {/* Summary Stats (Desktop and Mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title={"Total Vehicles"}
            totalData={totalVehicles.totalVehicles}
            color={"bg-blue-200"}
            icon={<FaCarSide size={28} />}
            path={"/admin/vehicles"}
          />
          <Card
            title={"Live Auction"}
            totalData={liveAuctions.totalLiveAuctions}
            color={"bg-blue-200"}
            icon={<FaGavel size={28} />}
            path={"/admin/live-auctions"}
          />
          <Card
            title={"Upcoming Auction"}
            totalData={upcomingBid.totalUpcomingAuctions}
            color={"bg-blue-200"}
            icon={<FaCalendarAlt size={28} />}
            path={"/admin/upcoming-auctions"}
          />
          <Card
            title={"Total Users"}
            totalData={totalCustomers.totalBuyers}
            color={"bg-blue-200"}
            icon={<FaUsers size={28} />}
            path={"/admin/manage-users"}
          />
        </div>

        {/* Mobile-Only Cards */}
        <div className="lg:hidden grid grid-cols-2 gap-6">
          <Card
            title={"Bid History"}
            totalData={totalVehicles.totalVehicles}
            color={"bg-blue-200"}
            icon={<FaHistory size={28} />}
            path={"/admin/bid-history"}
          />
          <Card
            title={"Add Brand"}
            totalData={allBrands.length}
            color={"bg-blue-200"}
            icon={<MdBrandingWatermark size={28} />}
            path={"/admin/addbrand"}
          />
          <Card
            title={"Add Model"}
            totalData={allModels.length}
            color={"bg-blue-200"}
            icon={<FaCarSide size={28} />}
            path={"/admin/addmodel"}
          />
          <Card
            title={"Add Series"}
            totalData={allSeries.length}
            color={"bg-blue-200"}
            icon={<FaCarSide size={28} />}
            path={"/admin/addseries"}
          />
          <Card
            title={"Suggestions"}
            totalData={0} // Placeholder, update with actual data if available
            color={"bg-blue-200"}
            icon={<FaEnvelope size={28} />}
            path={"/admin/suggestionlist"}
          />
          <Card
            title={"Partnership Opportunities"}
            totalData={0} // Placeholder, update with actual data if available
            color={"bg-blue-200"}
            icon={<FaHandshake size={28} />}
            path={"/admin/becomepartnerlist"}
          />
          <Card
            title={"Get in Touch"}
            totalData={0} // Placeholder, update with actual data if available
            color={"bg-blue-200"}
            icon={<FaEnvelope size={28} />}
            path={"/admin/contactlist"}
          />
          <Card
            title={"Add City"}
            totalData={0} // Placeholder, update with actual data if available
            color={"bg-blue-200"}
            icon={<FaCity size={28} />}
            path={"/admin/city"}
          />
        </div>

        {/* Charts 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[#191970]">
              Monthly Vehicle Sales
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#191970" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[#191970]">
              Auction Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        */}
      </div>
    </>
  );
};

export default Dashboard;