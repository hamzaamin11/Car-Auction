import React, { useContext, useEffect, useState, useCallback } from "react";
import AuctionsContext from "../../context/AuctionsContext";
import { IoMdClose } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { debounce } from "lodash";
import moment from "moment";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";

const AdminBidHistory = () => {
  const { aucHistory } = useContext(AuctionsContext);
  const [allBiders, setAllBiders] = useState([]);
  const [filteredBiders, setFilteredBiders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // modal states
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setCurrentPage(1); // Reset to first page on search
    }, 300),
    []
  );

  const handleGetAllBiders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/bidsForAdmin`);
      console.log("API Response:", res.data);
      setAllBiders(res.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllBiders();
  }, []);

  useEffect(() => {
    const filtered = allBiders.filter(
      (bid) =>
        bid.make?.toLowerCase().includes(search.toLowerCase()) ||
        bid.model?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBiders(filtered);
  }, [search, allBiders]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBiders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBiders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedVehicle.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedVehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-1 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 px-3">
          <h1 className="text-3xl font-bold text-gray-800">
            Sold Vehicles
          </h1>
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by Make or Model..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <>
          <div className="hidden md:block overflow-x-auto max-w-7xl mx-auto bg-white rounded-lg shadow">
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
                {currentItems?.length > 0 ? (
                  currentItems.map(
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
                        date,
                        year,
                        engine,
                        transmission,
                        color,
                        email,
                      },
                      index
                    ) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition cursor-default"
                      >
                        <td className="text-center">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td
                          onClick={() =>
                            setSelectedCustomer({
                              name,
                              contact,
                              cnic,
                              address,
                              email,
                            })
                          }
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 cursor-pointer hover:text-blue-600"
                        >
                          {name}
                        </td>
                        <td
                          onClick={() => {
                            setSelectedVehicle({
                              make,
                              model,
                              year,
                              engine,
                              transmission,
                              color,
                              images: [],
                              ...allBiders[index],
                            });
                            setCurrentImageIndex(0);
                          }}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 cursor-pointer hover:text-blue-600"
                        >
                          {make}/{model}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-[#191970]">
                          PKR {MonsterBid || maxBid || "0000"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {date.slice(0, 10)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 text-xs rounded-full font-semibold ${
                              status === "Highest"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {status === "Y" ? <TiTick size={20} /> : "Sold"}
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
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-950 text-white rounded disabled:opacity-50 hover:bg-blue-800 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-950 text-white rounded disabled:opacity-50 hover:bg-blue-800 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden space-y-4 px-3">
            {currentItems?.length > 0 ? (
              currentItems.map(
                (
                  {
                    id,
                    name,
                    model,
                    MonsterBid,
                    maxBid,
                    date,
                    status,
                    make,
                    contact,
                    cnic,
                    address,
                    year,
                    engine,
                    transmission,
                    color,
                    email,
                  },
                  index
                ) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md border border-gray-200 p-4"
                  >
                    <div className="flex justify-end items-center mb-3">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 text-xs rounded-full font-semibold ${
                          status === "Highest"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {status === "Y" ? <TiTick size={20} /> : "Sold"}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-gray-900 font-bold">
                          Customer
                        </span>
                        <span
                          onClick={() =>
                            setSelectedCustomer({
                              name,
                              contact,
                              cnic,
                              address,
                            })
                          }
                          className="text-gray-800 cursor-pointer underline"
                        >
                          {name}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-900 font-bold">Vehicle</span>
                        <span
                          onClick={() => {
                            setSelectedVehicle({
                              make,
                              model,
                              year,
                              engine,
                              transmission,
                              color,
                              images: [],
                              ...currentItems[index],
                            });
                            setCurrentImageIndex(0);
                          }}
                          className="text-gray-800 cursor-pointer underline"
                        >
                          {make}/{model}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-900 font-bold">
                          Bid Amount
                        </span>
                        <span className="text-[#191970] font-semibold">
                          PKR {MonsterBid || maxBid || "0000"}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-900 font-bold">Date</span>
                        <span className="text-gray-500">
                          {date.slice(0, 10)}
                        </span>
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="text-center py-8 text-gray-400">No bids yet.</div>
            )}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-950 text-white rounded disabled:opacity-50 hover:bg-blue-800 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-950 text-white rounded disabled:opacity-50 hover:bg-blue-800 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blur backdrop-blur-md p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#191970]">
                  Customer Details
                </h2>
                <button
                  className="text-black hover:text-red-500 p-2 rounded-full shadow-md"
                  onClick={() => setSelectedCustomer(null)}
                >
                  <IoMdClose size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Name:</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCustomer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact:</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCustomer.contact || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">EMAIL:</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCustomer.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CNIC:</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCustomer.cnic || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address:</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCustomer.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Vehicle Details Modal */}
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blur backdrop-blur-md p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#191970]">
                  View Vehicle
                </h2>
                <button
                  className="text-black hover:text-red-500 p-2 rounded-full shadow-md"
                  onClick={() => {
                    setSelectedVehicle(null);
                    setCurrentImageIndex(0);
                  }}
                >
                  <IoMdClose size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Vehicle Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Location:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.locationId || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Make:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.make}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Model:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Series:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.series || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Color:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.color || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Transmission:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.transmission || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Fuel Type:</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {selectedVehicle.fuelType || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Body Style:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.bodyStyle || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Certify Status:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.certifyStatus || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Drive Type:</p>
                        <p className="font-semibold text-gray-900 uppercase">
                          {selectedVehicle.driveType || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Mileage:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.mileage || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Year:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.year || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Condition:</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {selectedVehicle.vehicleCondition || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price:</p>
                        <p className="font-semibold text-gray-900">
                          {selectedVehicle.buyNowPrice ||
                            selectedVehicle.MonsterBid ||
                            selectedVehicle.maxBid ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image Carousel */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-4">
                      {selectedVehicle.images &&
                      selectedVehicle.images.length > 0 ? (
                        <>
                          <img
                            src={selectedVehicle.images[currentImageIndex]}
                            alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                            className="w-full h-full object-cover"
                          />
                          {selectedVehicle.images.length > 1 && (
                            <>
                              <button
                                onClick={handlePrevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No images available
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Navigation */}
                    {selectedVehicle.images &&
                      selectedVehicle.images.length > 1 && (
                        <div className="flex gap-2 justify-center flex-wrap">
                          {selectedVehicle.images
                            .slice(0, 5)
                            .map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                                  currentImageIndex === idx
                                    ? "border-blue-600"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                <img
                                  src={img}
                                  alt={`Thumbnail ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminBidHistory;
