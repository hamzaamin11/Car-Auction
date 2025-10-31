import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "./Contant/URL";
import { Link } from "react-router-dom";

export default function CalendarAuctionTable({ showTime, allAuctions }) {
  console.log(
    "hey all Auctions",
    allAuctions.length === 0 && "nooooooooooooooo"
  );

  return (
    <div className="overflow-x-auto lg:mt-6 mt-2  ">
      <table className="min-w-full border-collapse rounded-xl overflow-hidden shadow-md ">
        <thead className="bg-blue-950 text-white text-left text-sm sm:text-base">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Day</th>
            <th className="px-4 py-3">Auction Locations</th>
          </tr>
        </thead>
        <tbody className="bg-white text-gray-700 divide-y max-h-full overflow-y-auto">
          {allAuctions?.map((loca, index) => (
            <tr key={loca.index} className="hover:bg-gray-50 transition">
             <td className="px-4 py-3 font-medium">
  {loca?.date ? new Date(loca.date).toLocaleDateString("en-GB") : "N/A"}
</td>

              <td className="px-4 py-3">{loca.day}</td>
              <Link to={"/join"} className="px-4 py-3">
                <ul className="list-disc list-inside space-y-1">
                  {loca.location.map((lo, index) => (
                    <li key={index}>{lo}</li>
                  ))}
                </ul>
              </Link>
            </tr>
          ))}
        </tbody>
      </table>
      {allAuctions.length === 0 && (
        <div className="font-semibold text-gray-500 mt-1 flex items-center justify-center">
          {" "}
          NO Auction Date yet
        </div>
      )}
    </div>
  );
}
