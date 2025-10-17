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

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPageNo(1); // Reset to first page on search
    }, 300),
    []
  );

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handlePrevPage = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleGetAllLive = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/liveAuctionsForAdmin?entry=10&page=${pageNo}`
      );
      console.log("API Response (Admin):", res.data);
      setAllLiveAuction(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllLivebySeller = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/liveAuctions/${id}`);
      console.log("API Response (Seller):", res.data);
      setAllLiveAuction(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser.role === "admin") {
      handleGetAllLive();
    }
    if (currentUser.role === "seller") {
      handleGetAllLivebySeller();
    }
  }, [pageNo]);

  useEffect(() => {
    const filtered = allLiveAuction.filter(
      (auction) =>
        auction.make?.toLowerCase().includes(search.toLowerCase()) ||
        auction.model?.toLowerCase().includes(search.toLowerCase()) ||
        auction.vehicleCondition?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAuctions(filtered);
  }, [search, allLiveAuction]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
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
            <input
              type="text"
              placeholder="Search by Make, Model, or Condition..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto shadow ring-1 ring-gray-300 rounded-lg">
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#191970] text-white">
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
                    Seller Offer
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
                {filteredAuctions?.map((user, idx) => (
                  <tr
                    key={user.id}
                    onClick={() => setselectedVehicle(user)}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : ""
                    } cursor-pointer hover:bg-gray-100`}
                  >
                    {currentUser.role === "admin" && (
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {user?.name}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <img
                        src={user?.images[0]}
                        alt={user?.name || "Vehicle"}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-700">{user?.make}</td>
                    <td className="px-4 py-3 text-gray-700">{user?.model}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {user?.vehicleCondition}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {user?.sellerOffer}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {user.endTime
                        ? moment(user.endTime).local().format("hh:mm:ss A")
                        : "--"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {user?.endTime?.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="block md:hidden space-y-4 p-3">
            {filteredAuctions?.map((user) => (
              <div
                key={user.id}
                onClick={() => setselectedVehicle(user)}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300"
              >
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between items-center">
                    <p className="text-gray-900 font-bold">Owner Name</p>
                    <span className="text-gray-500">{user?.name}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-900 font-bold">
                      Vehicle Model
                    </span>
                    <span className="text-gray-500">
                      {user?.make} / {user?.model}
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
                      Demand Price
                    </span>
                    <span className="text-gray-500">{user?.sellerOffer}</span>
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
                      {user?.endTime?.slice(0, 10)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredAuctions?.length === 0 && (
          <div className="flex items-center justify-center mt-1 font-medium lg:text-xl text-sm">
            No Live Bid yet!
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
        <ToastContainer />
      </div>
    </>
  );
}
