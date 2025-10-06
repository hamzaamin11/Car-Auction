import React, { useContext, useEffect, useState } from "react";

import moment from "moment";
import { TiTick } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../components/Contant/URL";

const formatDate = (date) =>
  new Date(date).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const MyBids = () => {
  const { currentUser } = useSelector((state) => state?.auth);

  const [allBiders, setAllBiders] = useState([]);

  const handleGetBidersHistory = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/customer/myBids/${currentUser?.id}`
      );

      console.log(" =>", res.data);
      setAllBiders(res.data);
    } catch (error) {
      console.log(" =>", error);
    }
  };
  useEffect(() => {
    handleGetBidersHistory();
  }, []);
  return (
    <>
      {/* <Topbar />
      <Sidebar /> */}
      <div className="max-h- overflow-auto bg-gray-50 p-6 md:p-9">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Sold Vehicles</h1>

        {/* Bids Table */}
        <div className="overflow-x-auto max-w-6xl mx-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#191970] text-white">
              <tr>
                <th className="px-6 py-3  text-sm font-semibold">SR#</th>
              
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Bid Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allBiders?.length > 0 ? (
                aucHistory.map(
                  (
                    {
                      id,
                      name,
                      model,
                      MonsterBid,
                      maxBid,
                      endTime,
                      status,
                      make,
                    },
                    index
                  ) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition cursor-default"
                    >
                      <td className="text-center">{index + 1}</td>
                    
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {make}/{model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#191970]">
                        PKR {MonsterBid || maxBid || "0000"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {endTime &&
                          moment(endTime).local().format("YYYY-MM-DD HH:mm")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 text-xs rounded-full font-semibold ${
                            status === "Highest"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {status === "Y" ? (
                            <TiTick size={20} />
                          ) : (
                            <IoMdClose size={20} />
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    No bids yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MyBids;
