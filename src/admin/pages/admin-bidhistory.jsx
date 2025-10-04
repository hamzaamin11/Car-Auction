import React, { useContext, useEffect, useState } from "react";
import AuctionsContext from "../../context/AuctionsContext";
import { IoMdClose } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import moment from "moment";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";

const AdminBidHistory = () => {
  const { aucHistory } = useContext(AuctionsContext);
  const [allBiders, setAllBiders] = useState([]);

  // modal states
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleGetAllBiders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/bidsForAdmin`);
      setAllBiders(res.data);
    } catch (error) {
      console.log(" =>", error);
    }
  };

  useEffect(() => {
    handleGetAllBiders();
  }, []);

  return (
    <>
      <div
        className={`min-h-screen bg-gray-50 p-6 md:p-12 ${
          selectedCustomer || selectedVehicle ? "overflow-hidden" : ""
        }`}
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Sold Vehicles</h1>

        {/* Bids Table */}
        <div className="overflow-x-auto max-w-6xl mx-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#191970] text-white">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">SR#</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Customer Name
                </th>
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
                allBiders.map(
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
                      contact,
                      cnic,
                      address,
                      year,
                      engine,
                      transmission,
                      color,
                    },
                    index
                  ) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition cursor-default"
                    >
                      <td className="text-center">{index + 1}</td>
                      <td
                        onClick={() =>
                          setSelectedCustomer({ name, contact, cnic, address })
                        }
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 cursor-pointer"
                      >
                        {name}
                      </td>
                      <td
                        onClick={() =>
                          setSelectedVehicle({
                            make,
                            model,
                            year,
                            engine,
                            transmission,
                            color,
                          })
                        }
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 cursor-pointer"
                      >
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
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No bids yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-2xl relative animate-fadeIn">
            <button
              className="absolute -top-3 -right-3 bg-blue-950 text-white p-2 rounded-full shadow-md hover:bg-blue-900 transition"
              onClick={() => setSelectedCustomer(null)}
            >
              <IoMdClose size={20} />
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Customer Details
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-black bg-white w-1/3">
                      Name
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {selectedCustomer.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-black bg-white">
                      Contact
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {selectedCustomer.contact || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-black bg-white">
                      CNIC
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {selectedCustomer.cnic || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-black bg-white">
                      Address
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {selectedCustomer.address || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-2xl relative animate-fadeIn">
            <button
              className="absolute -top-3 -right-3 bg-blue-950 text-white p-2 rounded-full shadow-md hover:bg-blue-900 transition"
              onClick={() => setSelectedVehicle(null)}
            >
              <IoMdClose size={20} />
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Vehicle Details
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-black bg-white w-1/3">
                      Make
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {selectedVehicle.make}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-black bg-white">
                      Model
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {selectedVehicle.model}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-black bg-white">
                      Year
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {selectedVehicle.year || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-black bg-white">
                      Engine
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {selectedVehicle.engine || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-black bg-white">
                      Transmission
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {selectedVehicle.transmission || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-black bg-white">
                      Color
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {selectedVehicle.color || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminBidHistory;