import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "./Contant/URL";

export default function CalendarAuctionTable({ showTime, allAuctions }) {
  console.log("hey all Auctions", allAuctions);

  return (
    <div className="overflow-x-auto mt-8 ">
      <table className="min-w-full border-collapse rounded-xl overflow-hidden shadow-md ">
        <thead className="bg-[#b73439] text-white text-left text-sm sm:text-base">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Day</th>
            <th className="px-4 py-3">Auction Locations</th>
          </tr>
        </thead>
        <tbody className="bg-white text-gray-700 divide-y max-h-full overflow-y-auto">
          {allAuctions?.map((loca, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium">
                {loca?.date?.slice(0, 10)}
              </td>
              <td className="px-4 py-3">{loca.day}</td>
              <td className="px-4 py-3">
                <ul className="list-disc list-inside space-y-1">
                  {loca.location.map((lo) => (
                    <li>{lo}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
