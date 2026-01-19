import { useContext, useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import AuctionsContext from "../../context/AuctionsContext";
import ViewAuctionModal from "./ViewAuctionModal";
import { useDispatch, useSelector } from "react-redux";
import {
  navigationStart,
  navigationSuccess,
} from "../../components/Redux/NavigationSlice";
import { RotateLoader } from "../../components/Loader/RotateLoader";
import { ViewBrandModal } from "../../components/BrandModal/ViewBrandModal";
import moment from "moment/moment";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import CustomSearch from "../../CustomSearch";
import CustomAdd from "../../CustomAdd";
import Swal from "sweetalert2";
import { LiveBidModal } from "../components/ViewAdminBidModal/LiveBidModal";
import { CircleUser } from "lucide-react";
import { UserDetailModal } from "../components/UserDetailModal/UserDetail";

export default function LiveAuctions() {
  const [selectedVehicle, setselectedVehicle] = useState(null);

  console.log();
  const { currentUser } = useSelector((state) => state.auth);
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const [allLiveAuction, setAllLiveAuction] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [bidData, setBiddata] = useState([]);
  const [userDetail, setUSerDetail] = useState(null);

  const id = currentUser?.id;
  const [pageNo, setPageNo] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // Total count from API

  const itemsPerPage = 10;

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPageNo(1);
    }, 300),
    []
  );

  const handleGetAllLive = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/liveAuctionsForAdmin?entry=${itemsPerPage}&page=${pageNo}`
      );
      console.log("API Response (Admin):", res.data);
      // Handle both { data: [], total: X } and direct array response
      const auctions = res.data?.data || res.data || [];
      const total = res.data?.total || res.data?.length || auctions.length || 0;
      setAllLiveAuction(auctions);
      setTotalItems(total);
    } catch (error) {
      console.log(error);
      setAllLiveAuction([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleIsOpenModal = (active) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleStopAuction = async (vehicleId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Bid will be permanently Stop!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#9333ea",
      confirmButtonText: "Yes, Stop it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${BASE_URL}/endAuctionByAdmin`, {
          vehicleId: vehicleId,
        });
        Swal.fire({
          title: "Deleted!",
          text: "Bid has been Stop successfully.",
          icon: "success",
          confirmButtonColor: "#9333ea",
          timer: 2000,
          timerProgressBar: true,
        });
        handleGetAllLive();
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.message,
          icon: "error",
          confirmButtonColor: "#9333ea",
        });
      }
    }
  };

  const handleGetVehicleBid = async (vehicleId) => {
    try {
      const res = await axios.post(`${BASE_URL}/LiveBidUpdates`, {
        vehicleId: vehicleId,
      });
      console.log(res.data);
      setBiddata(res.data);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
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

  const handleViewDetails = (acution) => {
    setselectedVehicle(acution);
  };

  const handleGetAllLivebySeller = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/liveAuctions/${id}`);
      console.log("API Response (Seller):", res.data);
      const auctions = Array.isArray(res.data) ? res.data : [];
      setAllLiveAuction(auctions);
      setTotalItems(auctions.length);
    } catch (error) {
      console.log(error);
      setAllLiveAuction([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      handleGetAllLive();
    }
    if (currentUser?.role === "seller") {
      handleGetAllLivebySeller();
    }
  }, [pageNo, currentUser?.role, currentUser?.id]);

  // Client-side search filter
  useEffect(() => {
    const filtered = allLiveAuction.filter(
      (auction) =>
        (auction.make || "").toLowerCase().includes(search.toLowerCase()) ||
        (auction.model || "").toLowerCase().includes(search.toLowerCase()) ||
        (auction.vehicleCondition || "")
          .toLowerCase()
          .includes(search.toLowerCase())
    );
    setFilteredAuctions(filtered);
  }, [search, allLiveAuction]);

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
      <div className="max-h-screen bg-gray-100 p-3 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3">
          <h1 className="lg:text-3xl text-xl font-bold text-gray-900">
            Live Auctions
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

        <div className="text-gray-800 mb-4 font-semibold text-xl">
          Total Live Auctions: {totalItems}
        </div>

        <div className="max-w-7xl mx-auto px-2 lg:px-0">
          {filteredAuctions?.length > 0 ? (
            <div className="overflow-x-auto rounded">
              <table className="w-full border-collapse border overflow-hidden">
                <thead className="bg-blue-950 text-white">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold">Sr</th>
                    {currentUser.role === "admin" && (
                      <th className="p-1 text-start text-sm font-semibold">
                        Seller Name
                      </th>
                    )}
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
                      City
                    </th>
                    <th className="p-1 text-left text-sm font-semibold">
                      Date
                    </th>
                    <th className="p-1 text-left text-sm font-semibold">
                      Time Range
                    </th>
                    <th className="p-1 text-left text-sm font-semibold">
                      Reverse Price
                    </th>
                    <th className="p-1 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredAuctions.map((auction, index) => (
                    <tr
                      key={auction.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-left text-sm text-gray-600">
                        {index + 1}
                      </td>

                      {/* Owner Name (Admin only) */}
                      {currentUser.role === "admin" && (
                        <td
                          className="p-1 hover:cursor-pointer"
                          onClick={() => {
                            handleIsOpenModal("detail");
                            handleViewUserDetail(auction.userId);
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <CircleUser
                              size={"30"}
                              style={{
                                color: "gray",
                              }}
                            />

                            <span className="text-sm text-gray-600">
                              {auction?.name?.charAt(0)?.toUpperCase() +
                                auction?.name?.slice(1) || "--"}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Vehicle Name with Image */}
                      <td
                        className="p-1"
                        onClick={() => handleViewDetails(auction)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer">
                            {auction.images?.length > 0 ? (
                              <img
                                src={auction.images[0]}
                                alt={`${auction.make} ${auction.model}`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="cursor-pointer min-w-0">
                            <h2 className="text-sm font-bold text-gray-800 truncate">
                              {auction.make} {auction.model}
                            </h2>
                            <p className="text-xs text-gray-500 truncate">
                              {auction.series?.charAt(0)?.toUpperCase() +
                                auction.series?.slice(1) || "--"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Lot Number */}
                      <td className="p-1">
                        <span className="text-sm text-gray-600">
                          {auction.lot_number || "--"}
                        </span>
                      </td>

                      {/* Year */}
                      <td className="p-1">
                        <span className="text-sm text-gray-600">
                          {auction.year || "--"}
                        </span>
                      </td>

                      {/* City */}
                      <td className="p-1">
                        <span className="text-sm text-gray-600">
                          {auction.locationId || "--"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-1">
                        <span className="text-sm text-gray-600">
                          {auction?.endTime
                            ? new Date(auction.endTime).toLocaleDateString(
                                "en-GB"
                              )
                            : "N/A"}
                        </span>
                      </td>

                      {/* Time Range */}
                      <td className="p-1">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-600">
                            {auction.startTime
                              ? moment(auction.startTime)
                                  .local()
                                  .format("hh:mm A")
                              : "--"}
                          </span>
                          <span className="text-xs text-gray-500">to</span>
                          <span className="text-sm text-gray-600">
                            {auction.endTime
                              ? moment(auction.endTime)
                                  .local()
                                  .format("hh:mm A")
                              : "--"}
                          </span>
                        </div>
                      </td>

                      {/* Reverse Price */}
                      <td className="p-1">
                        <span className="text-sm font-semibold text-gray-700">
                          PKR {auction.sellerOffer || "--"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-1">
                        <div className="flex gap-2">
                          {/* View Bid Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGetVehicleBid(auction?.vehicleId);
                              handleIsOpenModal("liveBid");
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-950 hover:bg-blue-900 rounded transition-colors"
                          >
                            View Bid
                          </button>

                          {/* End Bid Button (Admin only) */}
                          {currentUser.role === "admin" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStopAuction(auction?.vehicleId);
                              }}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                            >
                              End Bid
                            </button>
                          )}
                        </div>
                      </td>
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
                No live auctions found
              </h3>
              <p className="text-sm text-gray-500">
                There are currently no live auctions to display.
              </p>
            </div>
          )}
        </div>

        {/* CLEAN ARROW PAGINATION */}
        {totalItems > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
              <div className="text-gray-600">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {filteredAuctions.length > 0 ? endIndex : 0}
                </span>{" "}
                of <span className="font-medium">{totalItems}</span> entries
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

        {selectedAuctionId && (
          <ViewAuctionModal
            auctionId={selectedAuctionId}
            onClose={() => setSelectedAuctionId(null)}
          />
        )}
        {selectedVehicle && (
          <ViewBrandModal
            selectedVehicle={selectedVehicle}
            handleClick={() => setselectedVehicle(null)}
          />
        )}
        {isOpenModal === "liveBid" && (
          <LiveBidModal
            vehicle={bidData}
            onClose={() => handleIsOpenModal("")}
            handleGetVehicleBid={handleGetVehicleBid}
          />
        )}

        {isOpenModal === "detail" && (
          <UserDetailModal
            isOpen={isOpenModal}
            closeModal={() => handleIsOpenModal("")}
            userDetail={userDetail}
          />
        )}
      </div>
    </>
  );
}
