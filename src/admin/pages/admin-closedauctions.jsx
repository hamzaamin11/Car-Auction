
import React from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

const closedAuctions = [
  {
    id: 1,
    title: "Toyota Corollas 2019",
    image: "/images/corola.jpg",
    finalBid: 3100000,
    closedOn: "2025-05-10T14:30:00",
  },
  {
    id: 2,
    title: "Nissan Note e-Power",
    image: "/images/nissan.webp",
    finalBid: 2800000,
    closedOn: "2025-05-07T17:45:00",
  },
  {
    id: 3,
    title: "Suzuki WagonR 2020",
    image: "/images/wagonr.avif",
    finalBid: 2100000,
    closedOn: "2025-05-05T12:00:00",
  },
  {
    id: 4,
    title: "Honda City Aspire",
    image: "/images/hondacity.jpg",
    finalBid: 2900000,
    closedOn: "2025-05-02T15:00:00",
  },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const AdminClosedAuctions = () => {
  return (
    <>
    {/* <Topbar />
    <Sidebar /> */}
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
     Closed Auctions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 bg-white shadow rounded-xl">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Final Bid (PKR)</th>
              <th className="py-3 px-4 text-left">Closed On</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {closedAuctions.map((auction, index) => (
              <tr
                key={auction.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">
                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="w-20 h-14 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-4 font-medium">{auction.title}</td>
                <td className="py-3 px-4 text-red-600 font-semibold">
                  {auction.finalBid.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {formatDate(auction.closedOn)}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Closed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default AdminClosedAuctions;
