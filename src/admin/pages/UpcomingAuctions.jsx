import { useContext, useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import AuctionsContext from "../../context/AuctionsContext";
import ViewAuctionModal from "./ViewAuctionModal";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import CustomAdd from "../../CustomAdd";
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
import { X, ChevronLeft, ChevronRight, CircleUser } from "lucide-react";
import CustomSearch from "../../CustomSearch";
import { UserDetailModal } from "../components/UserDetailModal/UserDetail";

const currentDate = new Date().toISOString().split("T")[0];

const initialState = {
  fromDate: currentDate,
  toDate: currentDate,
};

export default function UpcomingAuctions() {
  const { currentUser } = useSelector((state) => state?.auth);

  const [selectedVehicle, setselectedVehicle] = useState(null);
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const [allUpcoming, setAllUpcoming] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [isOpen, setIsOpen] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(initialState);
  const [userDetail, setUSerDetail] = useState(null);
  // NEW: Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // PAGINATION: Total count
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const id = currentUser?.id;

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPageNo(1);
    }, 300),
    []
  );

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setDateRange((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleGetAllUpcomingAuctions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/upcomingAuctionsForAdminbyDateRange/${dateRange.fromDate}/${dateRange.toDate}?entry=${itemsPerPage}&page=${pageNo}`
      );
      console.log("API Response (Admin):", res.data);
      const auctions = res.data?.data || res.data || [];
      const total = res.data?.total || res.data?.length || auctions.length || 0;
      setAllUpcoming(auctions);
      setTotalItems(total);
    } catch (error) {
      console.log("Error (Admin):", error);
      setAllUpcoming([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllUpcomingAuctionsbySeller = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/seller/upcomingAuctionsbyDateRange/${id}/${dateRange.fromDate}/${dateRange.toDate}`
      );
      console.log("API Response (Seller):", res.data);
      const auctions = Array.isArray(res.data) ? res.data : [];
      setAllUpcoming(auctions);
      setTotalItems(auctions.length);
    } catch (error) {
      console.log("Error (Seller):", error);
      setAllUpcoming([]);
      setTotalItems(0);
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
      Swal.fire({
        title: "Success!",
        text: "Your bid has gone live successfully.",
        icon: "success",
        confirmButtonColor: "#191970",
        timer: 2500,
        timerProgressBar: true,
      });
      handleGetAllUpcomingAuctions();
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Failed to update bid status",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
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

  const handleViewUserDetail = async (id) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getUserDetailsApprovedVehicleListById/${id}`
      );

      setUSerDetail(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      handleGetAllUpcomingAuctions();
    } else if (currentUser?.role === "seller") {
      handleGetAllUpcomingAuctionsbySeller();
    }
  }, [pageNo, currentUser?.role, dateRange]);

  useEffect(() => {
    const filtered = allUpcoming.filter(
      (auction) =>
        auction.make?.toLowerCase().includes(search.toLowerCase()) ||
        auction.model?.toLowerCase().includes(search.toLowerCase()) ||
        auction.vehicleCondition?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAuctions(filtered);
  }, [search, allUpcoming]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (pageNo - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPageNo(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (pageNo <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (pageNo >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = pageNo - 2; i <= pageNo + 2; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <>
      <div className="max-w-8xl mx-4 px-2 lg:py-6 py-3 ">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
          <h1 className="text-xl lg:text-3xl font-bold text-gray-900">
            Upcoming Auctions
          </h1>
          <div className="relative w-full max-w-md mb-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 ">
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
            <CustomSearch
              placeholder="Search by Make, Model, or Condition..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                debouncedSearch(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-800 mb-2 font-semibold text-2xl">
            Total Upcoming: {totalItems}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-800 mb-1">
                From Date :
              </label>
              <input
                type="date"
                name="fromDate"
                onChange={handleChangeDate}
                value={dateRange.fromDate}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-800 mb-1">
                To Date :
              </label>
              <input
                type="date"
                name="toDate"
                onChange={handleChangeDate}
                value={dateRange.toDate}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <>
          <div className="max-w-7xl mx-auto px-2 lg:px-0">
            {filteredAuctions?.length > 0 ? (
              <div className="overflow-x-auto rounded">
                <table className="w-full border-collapse border overflow-hidden">
                  <thead className="bg-blue-950 text-white">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold">
                        Sr
                      </th>
                      <th
                        className={`p-3 text-start text-sm font-semibold ${
                          currentUser?.role === "seller" && "hidden"
                        }`}
                      >
                        Seller Name
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        Vehicle Name
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        Lot#
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        Year
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        Fuel Type
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        Color
                      </th>

                      <th className="p-1 text-left text-sm font-semibold">
                        City
                      </th>

                      <th className="p-1 text-left text-sm font-semibold">
                        Date / Start Time
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        Reserve Price
                      </th>

                      {currentUser?.role === "seller" ? null : (
                        <th className="p-1 text-left text-sm font-semibold">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAuctions.map((auction, index) => (
                      <tr
                        key={auction.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="p-3">
                          <span className="text-sm text-gray-700">
                            {index + 1}
                          </span>
                        </td>

                        {/* Owner Name */}
                        <td
                          onClick={() => {
                            handleToggleModel("detail");
                            handleViewUserDetail(auction.userId);
                          }}
                          className={`p-3 text-sm text-gray-700 capitalize ${
                            currentUser?.role === "seller" && "hidden"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <CircleUser
                              size={"30"}
                              style={{
                                color: "gray",
                              }}
                            />
                            {auction?.name || "--"}
                          </div>
                        </td>

                        {/* Vehicle Column with Image and Name */}
                        <td
                          className="p-1"
                          onClick={() => handleViewDetails(auction)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer">
                              {auction?.images && auction?.images.length > 0 ? (
                                <img
                                  src={auction?.images[0]}
                                  alt={`${auction?.make} ${auction?.model}`}
                                  className="h-full w-full object-cover rounded-full"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div
                              className="cursor-pointer min-w-0"
                              onClick={() => handleViewClick(auction)}
                            >
                              <h2 className="text-sm font-bold text-gray-800 truncate">
                                {auction?.make.charAt(0).toUpperCase() +
                                  auction?.make.slice(1)}{" "}
                                {auction?.model.charAt(0).toUpperCase() +
                                  auction?.model.slice(1)}
                              </h2>
                              <p className="text-xs text-gray-500 truncate">
                                {auction?.series.charAt(0).toUpperCase() +
                                  auction?.series.slice(1)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Make */}
                        <td className="p-1">
                          <span className="text-sm text-gray-700">
                            {auction.lot_number || "--"}
                          </span>
                        </td>

                        {/* Model */}
                        <td className="p-1">
                          <span className="text-sm text-gray-700">
                            {auction.year || "--"}
                          </span>
                        </td>

                        {/* Condition */}

                        <td className="p-1">
                          <span className="text-sm text-gray-700">
                            {auction.fuelType.charAt(0).toUpperCase() +
                              auction.fuelType.slice(1) || "--"}
                          </span>
                        </td>

                        <td className="p-1">
                          <span className="text-sm text-gray-700">
                            {auction.color || "--"}
                          </span>
                        </td>

                        <td className="p-1">
                          <span className="text-sm text-gray-700">
                            {auction.locationId || "--"}
                          </span>
                        </td>

                        {/* Time Stamp */}
                        <td className="p-1 text-gray-700">
                          <div className="flex flex-col">
                            <span>
                              {auction?.startTime
                                ? new Date(
                                    auction.startTime
                                  ).toLocaleDateString("en-GB")
                                : "N/A"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {auction.startTime
                                ? moment(auction.startTime)
                                    .local()
                                    .format("hh:mm A")
                                : "--"}
                            </span>
                          </div>
                        </td>

                        {/* Reserve Price */}
                        <td className="p-1">
                          <span className="text-sm font-semibold text-gray-700">
                            PKR {auction.sellerOffer || "--"}
                          </span>
                        </td>

                        {/* Actions (for non-seller roles) */}
                        {currentUser?.role === "seller" ? null : (
                          <td className="p-1">
                            <div
                              className="relative"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <button
                                onClick={() => {
                                  handleToggleModel("update");
                                  setselectedVehicle(auction);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-950 hover:bg-blue-900 rounded-lg transition-colors flex items-center gap-2"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Edit
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No auctions found
                </h3>
                <p className="text-sm text-gray-500">
                  There are currently no auctions to display.
                </p>
              </div>
            )}
          </div>

          {/* PROFESSIONAL PAGINATION WITH ARROWS */}
          {totalItems > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
                <div className="text-gray-600">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to <span className="font-medium">{endIndex}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> entries
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={pageNo === 1}
                    className={`px-3 py-1 rounded border ${
                      pageNo === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {"<<"}
                  </button>
                  <button
                    onClick={() => goToPage(pageNo - 1)}
                    disabled={pageNo === 1}
                    className={`px-3 py-1 rounded border ${
                      pageNo === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {"<"}
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 rounded border ${
                        pageNo === page
                          ? "bg-blue-950 text-white"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(pageNo + 1)}
                    disabled={pageNo >= totalPages}
                    className={`px-3 py-1 rounded border ${
                      pageNo >= totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {">"}
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={pageNo >= totalPages}
                    className={`px-3 py-1 rounded border ${
                      pageNo >= totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {">>"}
                  </button>
                </div>
              </div>
            </div>
          )}
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
        {/* VIEW VEHICLE MODAL */}
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
                        <p className="text-sm font-bold text-gray-900">
                          Owner Name:
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.name || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Lot Number:
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.lot_number || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Make:</p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.make || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Model:
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.model || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Series:
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.series || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Color:
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.color || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Transmission:
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.transmission || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Fuel Type:
                        </p>
                        <p className="text-base text-gray-900 capitalize">
                          {selectedVehicle.fuelType || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Body Style:
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.bodyStyle || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Certify Status:
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.certifyStatus || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Drive Type:
                        </p>
                        <p className="text-base text-gray-900 uppercase">
                          {selectedVehicle.driveType || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Meter Reading:
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.mileage || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Year:</p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.year || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Condition:
                        </p>
                        <p className="text-base text-gray-900 capitalize">
                          {selectedVehicle.vehicleCondition || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Reserve Price:
                        </p>
                        <p className="text-base text-gray-900 capitalize">
                          {selectedVehicle.sellerOffer ||
                            selectedVehicle.buyNowPrice}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Start Time:
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.startTime
                            ? moment(selectedVehicle.startTime)
                                .local()
                                .format("hh:mm A")
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          End Time:
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedVehicle.endTime
                            ? moment(selectedVehicle.endTime)
                                .local()
                                .format("hh:mm A")
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Auction Status:
                        </p>
                        <p className="text-base text-gray-900 capitalize">
                          {selectedVehicle.auctionStatus || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Image Gallery */}
                  <div className="flex flex-col items-center">
                    {selectedVehicle.images &&
                    selectedVehicle.images.length > 0 ? (
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
                          {currentImageIndex + 1} /{" "}
                          {selectedVehicle.images.length}
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
        {isOpen === "detail" && (
          <UserDetailModal
            isOpen={isOpen}
            closeModal={() => handleToggleModel("")}
            userDetail={userDetail}
          />
        )}
      </div>
    </>
  );
}
