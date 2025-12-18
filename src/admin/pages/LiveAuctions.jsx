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

export default function LiveAuctions() {
  const { getLiveAuctions, AllLiveAuctions, AuctionById } =
    useContext(AuctionsContext);

  const [selectedVehicle, setselectedVehicle] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const [allLiveAuction, setAllLiveAuction] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);

  console.log(filteredAuctions.length);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

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
      <div className="min-h-screen bg-gray-100 p-3 lg:p-6">
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

        <div className="overflow-x-auto rounded-lg">
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-950 text-white">
                <tr>
                  {currentUser.role === "admin" && (
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Owner Name
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Make
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Model
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Condition
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    End Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredAuctions?.length > 0 ? (
                  filteredAuctions.map((user, idx) => (
                    <tr
                      key={user.id}
                      onClick={() => setselectedVehicle(user)}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : ""
                      } cursor-pointer hover:bg-gray-100`}
                    >
                      {currentUser.role === "admin" && (
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {user?.name || "--"}
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <img
                          src={user?.images?.[0] || "/placeholder.jpg"}
                          alt={user?.make || "Vehicle"}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {user?.make || "--"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {user?.model || "--"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {user?.vehicleCondition || "--"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {user?.sellerOffer || "--"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {user.endTime
                          ? moment(user.endTime).local().format("hh:mm A")
                          : "--"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {user?.endTime
                          ? new Date(user.endTime).toLocaleDateString("en-GB")
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-500">
                      No live auctions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="block md:hidden space-y-2">
            {filteredAuctions?.length > 0 ? (
              filteredAuctions.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setselectedVehicle(user)}
                  className="bg-white rounded shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300"
                >
                  <div className="space-y-2 text-sm">
                    {currentUser.role === "admin" && (
                      <p className="flex justify-between items-center">
                        <p className="text-gray-900 font-bold">Owner Name</p>
                        <span className="text-gray-500">
                          {user?.name || "--"}
                        </span>
                      </p>
                    )}
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">
                        Vehicle Model
                      </span>
                      <span className="text-gray-500">
                        {user?.make || "--"} / {user?.model || "--"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">Condition</span>
                      <span className="text-gray-500">
                        {user?.vehicleCondition || "--"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">
                        Current Bid
                      </span>
                      <span className="text-gray-500">
                        {user?.sellerOffer || "--"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">End Time</span>
                      <span className="text-gray-500">
                        {user.endTime
                          ? moment(user.endTime).local().format("hh:mm A")
                          : "--"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">Date</span>
                      <span className="text-gray-500">
                        {user?.endTime
                          ? new Date(user.endTime).toLocaleDateString("en-GB")
                          : "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                No live auctions found.
              </div>
            )}
          </div>
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
      </div>
    </>
  );
}
