import { useContext, useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import AuctionsContext from "../../context/AuctionsContext";
import ViewAuctionModal from "./ViewAuctionModal";
import { useDispatch, useSelector } from "react-redux";
import {
  navigationStart,
  navigationSuccess,
} from "../../components/Redux/NavigationSlice";
import { RotateLoader } from "../../components/Loader/RotateLoader";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import { ViewBrandModal } from "../../components/BrandModal/ViewBrandModal";
import moment from "moment";
import { AdminAddBid } from "../../components/AdminAddBidComponent/AdminAddBid";
import { AdminUpdatebid } from "../AdminUpdatebid";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function UpcomingAuctions() {
  const { currentUser } = useSelector((state) => state?.auth);

  const [selectedVehicle, setselectedVehicle] = useState(null);
  const [selectCar, setSelectCar] = useState(null);
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const [allUpcoming, setAllUpcoming] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [isOpen, setIsOpen] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  // NEW: Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const id = currentUser?.id;

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPageNo(1);
    }, 300),
    []
  );

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handlePrevPage = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleGetAllUpcomingAuctions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/upcomingAuctionsForAdmin?entry=10&page=${pageNo}`
      );
      console.log("API Response (Admin):", res.data);
      setAllUpcoming(res.data);
    } catch (error) {
      console.log("Error (Admin):", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllUpcomingAuctionsbySeller = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/seller/upcomingAuctions/${id}`);
      console.log("API Response (Seller):", res.data);
      setAllUpcoming(res.data);
    } catch (error) {
      console.log("Error (Seller):", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleModel = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleUpdateBid = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/admin/updateBidStatusAdmin/${id}`
      );
      toast.success("Your bid has gone live successfully.");
      handleGetAllUpcomingAuctions();
    } catch (error) {
      console.log(error);
    }
  };

  // NEW: Handle view details - opens modal
  const handleViewDetails = (vehicle) => {
    console.log("View Details Clicked!", vehicle);
    setselectedVehicle(vehicle);
    setCurrentImageIndex(0);
    setIsViewModalOpen(true);
  };

  // NEW: Close modal
  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setselectedVehicle(null);
    setCurrentImageIndex(0);
  };

  // NEW: Image navigation
  const handlePrevImage = () => {
    if (selectedVehicle?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedVehicle.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedVehicle?.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedVehicle.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      handleGetAllUpcomingAuctions();
    } else if (currentUser?.role === "seller") {
      handleGetAllUpcomingAuctionsbySeller();
    }
  }, [pageNo]);

  useEffect(() => {
    const filtered = allUpcoming.filter(
      (auction) =>
        auction.make?.toLowerCase().includes(search.toLowerCase()) ||
        auction.model?.toLowerCase().includes(search.toLowerCase()) ||
        auction.vehicleCondition?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAuctions(filtered);
  }, [search, allUpcoming]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-2 lg:py-6 py-3 font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
          <h1 className="text-xl lg:text-3xl font-bold text-gray-900">
            Upcoming Auctions
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
              placeholder="Search by Make, Model, or Condition..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <>
          <div className="overflow-x-auto rounded-lg">
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#191970] text-white">
                  <tr>
                    <th
                      className={`px-4 py-3 text-left text-sm font-semibold ${
                        currentUser?.role === "seller" && "hidden"
                      }`}
                    >
                      Owner Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Make
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Model
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Condition
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Start Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Date
                    </th>
                    {currentUser.role === "seller" ? null : (
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAuctions?.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : ""
                      } cursor-pointer hover:bg-gray-100`}
                      onClick={() => handleViewDetails(user)}
                    >
                      <td
                        className={`px-4 py-3 font-medium text-gray-900 ${
                          currentUser?.role === "seller" && "hidden"
                        }`}
                      >
                        {user?.name}
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={user?.images[0]}
                          alt={user?.name || "Vehicle"}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {user.make}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {user.model}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {user?.vehicleCondition}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {user.sellerOffer}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {user.startTime
                          ? moment(user.startTime).local().format("hh:mm:ss A")
                          : "--"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {user.startTime?.slice(0, 10)}
                      </td>
                      {currentUser?.role === "seller" ? null : (
                        <td
                          className="px-4 py-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleModel("update");
                            setselectedVehicle(user);
                          }}
                        >
                          <span className="px-3 py-1 text-sm border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white transition hover:cursor-pointer">
                            Edit
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="block md:hidden space-y-0 ">
              {filteredAuctions?.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleViewDetails(user)}
                  className="bg-white rounded shadow-md border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer"
                >
                  <p className="flex justify-between space-y-1">
                    <p className="font-bold text-gray-900">Owner Name</p>
                    <span className="text-gray-500 font-medium">
                      {user?.name}
                    </span>
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">Vehicle</span>
                      <span className="text-gray-500">
                        {user?.make}/{user?.model}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">Condition</span>
                      <span className="text-gray-500">
                        {user?.vehicleCondition}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">
                        Price
                      </span>
                      <span className="text-gray-500">{user?.sellerOffer}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">
                        Start Time
                      </span>
                      <span className="text-gray-500">
                        {user?.startTime
                          ? moment(user.startTime).local().format("hh:mm A")
                          : "--"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">Date</span>
                      <span className="text-gray-500">
                        {user?.startTime?.slice(0, 10)}
                      </span>
                    </p>
                  </div>
                  {currentUser?.role !== "seller" && (
                    <div className="mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleModel("update");
                          setselectedVehicle(user);
                        }}
                        className="w-full py-2.5 bg-blue-950 text-white text-sm font-medium rounded-lg hover:cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {filteredAuctions?.length === 0 && (
            <div className="flex items-center justify-center font-medium lg:text-xl text-sm mt-1">
              No Upcoming Bid yet!
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              className={`bg-blue-950 text-white px-5 py-2 rounded ${
                pageNo > 1 ? "block" : "hidden"
              }`}
              onClick={handlePrevPage}
            >
              ‹ Prev
            </button>
            <div></div>
            <button
              className={`bg-blue-950 text-white px-5 py-2 rounded ${
                filteredAuctions.length === 10 ? "block" : "hidden"
              }`}
              onClick={handleNextPage}
            >
              Next ›
            </button>
          </div>
        </>

        {selectedAuctionId && (
          <ViewAuctionModal
            auctionId={selectedAuctionId}
            onClose={() => setSelectedAuctionId(null)}
          />
        )}
        
        {isOpen === "update" && (
          <AdminUpdatebid
            selectedVehicle={selectedVehicle}
            setIsOpenBid={() => handleToggleModel("update")}
            handleGetAllUpcomingAuctions={handleGetAllUpcomingAuctions}
          />
        )}

        {/* ============================================ */}
        {/* VIEW VEHICLE MODAL -  */}
        {/* ============================================ */}
        {isViewModalOpen && (document.body.style.overflow = "hidden")}
        {isViewModalOpen && selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blur backdrop-blur-md p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
              >
                <X className="h-6 w-6 text-gray-700 hover:text-red-500" />
              </button>

              {/* Modal Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  View Vehicle
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Side - Vehicle Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Owner Name:</p>
                        <p className="text-base text-gray-900">{selectedVehicle.name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Make:</p>
                        <p className="text-base text-gray-900">{selectedVehicle.make || "—"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Model:</p>
                        <p className="text-base text-gray-900">{selectedVehicle.model || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Series:</p>
                        <p className="text-base text-gray-900">{selectedVehicle.series || "—"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Color:</p>
                        <p className="text-base text-gray-900">{selectedVehicle.color || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Transmission:</p>
                        <p className="text-base text-gray-900">{selectedVehicle.transmission || "—"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Fuel Type:</p>
                        <p className="text-base text-gray-900 capitalize">{selectedVehicle.fuelType || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Body Style:</p>
                        <p className="text-base text-gray-900">{selectedVehicle.bodyStyle || "—"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Certify Status:</p>
                        <p className="text-base text-gray-900">{selectedVehicle.certifyStatus || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Drive Type:</p>
                        <p className="text-base text-gray-900 uppercase">{selectedVehicle.driveType || "—"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Meter Reading:</p>
                        <p className="text-base text-gray-900">{selectedVehicle.mileage || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Year:</p>
                        <p className="text-base text-gray-900">{selectedVehicle.year || "—"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Condition:</p>
                        <p className="text-base text-gray-900 capitalize">{selectedVehicle.vehicleCondition || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Price:</p>
                        <p className="text-base text-gray-900 capitalize">{selectedVehicle.sellerOffer || selectedVehicle.buyNowPrice}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Start Time:</p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.startTime
                            ? moment(selectedVehicle.startTime).local().format("hh:mm A")
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">End Time:</p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.endTime
                            ? moment(selectedVehicle.endTime).local().format("hh:mm A")
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Auction Status:</p>
                        <p className="text-base text-gray-900 capitalize">{selectedVehicle.auctionStatus || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Bid Status:</p>
                        <p className="text-base text-gray-900">{selectedVehicle.bidStatus || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Image Gallery */}
                  <div className="flex flex-col items-center">
                    {selectedVehicle.images && selectedVehicle.images.length > 0 ? (
                      <>
                        {/* Main Image */}
                        <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-4">
                          <img
                            src={selectedVehicle.images[currentImageIndex]}
                            alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Navigation Arrows and Thumbnails */}
                        <div className="flex items-center justify-center gap-4 w-full">
                          {/* Previous Button */}
                          <button
                            onClick={handlePrevImage}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg transition hover:cursor-pointer"
                            disabled={selectedVehicle.images.length <= 1}
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>

                          {/* Current Thumbnail */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500 bg-gray-100">
                            <img
                              src={selectedVehicle.images[currentImageIndex]}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Next Button */}
                          <button
                            onClick={handleNextImage}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg transition duration-200 ease-in-out transform hover:cursor-pointer"
                            disabled={selectedVehicle.images.length <= 1}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Image Counter */}
                        <p className="text-sm text-gray-600 mt-2">
                          {currentImageIndex + 1} / {selectedVehicle.images.length}
                        </p>
                      </>
                    ) : (
                      <div className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-400">No images available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </>
  );
}