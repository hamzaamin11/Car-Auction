import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaCarSide,
  FaGavel,
  FaMoneyBillAlt,
  FaChartLine,
  FaTrash,
  FaPlus,
  FaUser,
} from "react-icons/fa";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import Card from "../../components/AdminCardComponent/Card";
import { RotateLoader } from "../../components/Loader/RotateLoader";

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

  const [liveAuctions, setLiveAuctions] = useState({});

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

  const handleGetBid = () => {};

  useEffect(() => {
    handleGetAllVehicle();
    handleGetAllLiveAuction();
  }, []);

  if (loading) return <RotateLoader />;
  return (
    <>
      {/* <Topbar />
    <Sidebar /> */}
      <div className="p-6 bg-gray-50  space-y-8">
        <h2 className="text-3xl font-bold text-[#191970]">Welcome, Admin</h2>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title={"Total Vehicles"}
            totalData={totalVehicles.totalVehicles}
            color={"bg-[#191970]"}
            icon={<FaCarSide size={28} />}
          />

          <Card
            title={"Live Auctions"}
            totalData={liveAuctions.totalLiveAuctions}
            color={"bg-green-500"}
            icon={<FaGavel size={28} />}
          />

          <Card
            title={"Bids Placed"}
            totalData={totalVehicles.totalVehicles}
            color={"bg-yellow-500"}
            icon=<FaChartLine size={28} />
          />

          <Card
            title={"Total Users"}
            totalData={totalVehicles.totalVehicles}
            color={"bg-purple-600"}
            icon={<FaUser size={28} />}
          />
        </div>

        {/* Charts */}
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

        {/* Recent Bids Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[#191970]">
            Recent Bids
          </h3>

          <div className="overflow-x-auto rounded-md">
            <table className="min-w-full border text-sm">
              <thead className="bg-[#E6E6FA] text-[#191970]">
                <tr>
                  <th className="p-2 text-left">Vehicle</th>
                  <th className="p-2 text-left">Bidder</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid) => (
                  <tr key={bid.id} className="border-t">
                    <td className="p-2">{bid.vehicle}</td>
                    <td className="p-2">{bid.bidder}</td>
                    <td className="p-2">{bid.amount}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(bid.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add New Bid Form */}
          <div className="mt-6">
            <h4 className="text-md font-semibold text-[#191970] mb-2">
              Add New Bid
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Vehicle"
                className="p-2 border border-gray-300 rounded"
                value={newBid.vehicle}
                onChange={(e) =>
                  setNewBid({ ...newBid, vehicle: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Bidder"
                className="p-2 border border-gray-300 rounded"
                value={newBid.bidder}
                onChange={(e) =>
                  setNewBid({ ...newBid, bidder: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Amount"
                className="p-2 border border-gray-300 rounded"
                value={newBid.amount}
                onChange={(e) =>
                  setNewBid({ ...newBid, amount: e.target.value })
                }
              />
              <button
                onClick={handleAddBid}
                className="bg-[#191970] text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-[#000080] transition"
              >
                <FaPlus /> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
