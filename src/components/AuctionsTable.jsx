import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "./Contant/URL";

export default function AuctionsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [getAuctions, setGetAuctions] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/liveAuctions`)
      .then((res) => res.json())
      .then((data) => setSalesData(data))
      .catch((err) => console.error("Error fetching auctions:", err));
  }, []);

  const filteredSales = salesData.filter((sale) =>
    sale.locationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGetAuctions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/todayAuction`);
      setGetAuctions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAuctions();
  }, []);

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search Auctions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border rounded"
      />
      <table className="min-w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2 border-b">Sr#</th>
            <th className="px-4 py-2 border-b">Location</th>
            <th className="px-4 py-2 border-b">Auction Date</th>
            <th className="px-4 py-2 border-b">Sale Status</th>
          </tr>
        </thead>
        <tbody>
          {getAuctions?.map((sale, index) => (
            <tr key={sale.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2 font-semibold">{sale.locationId}</td>
              <td className="px-4 py-2">
                {sale.auctionDate ? sale.auctionDate.slice(0, 10) : "N/A"}
              </td>
              <td className="px-4 py-2">{sale.saleStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {getAuctions.length === 0 && (
        <div className="flex items-center justify-center font-bold py-1">
          No data found!
        </div>
      )}
      {expandedRow !== null && (
        <div className="mt-4 p-4 border bg-gray-100 rounded">
          <h2 className="text-lg font-bold mb-2">
            {filteredSales[expandedRow].saleName} - Insights
          </h2>
          <p className="mb-2">{filteredSales[expandedRow].saleInsights}</p>
          <Link
            to={filteredSales[expandedRow].link1}
            className="mr-4 text-white bg-blue-500 px-3 py-1 rounded"
          >
            Join Auction
          </Link>
          <Link
            to={filteredSales[expandedRow].link2}
            className="text-white bg-green-500 px-3 py-1 rounded"
          >
            View Sales List
          </Link>
        </div>
      )}
    </div>
  );
}
