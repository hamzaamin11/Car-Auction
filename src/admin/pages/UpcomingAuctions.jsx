import { useContext, useEffect, useState } from "react";
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

export default function UpcomingAuctions() {
  const { currentUser } = useSelector((state) => state?.auth);

  const [selectedVehicle, setselectedVehicle] = useState(null);

  const [selectCar, setSelectCar] = useState(null);

  const [selectedAuctionId, setSelectedAuctionId] = useState(null);

  const [allUpcoming, setAllUpcoming] = useState([]);

  console.log("", allUpcoming);

  const [isOpen, setIsOpen] = useState("");

  const [pageNo, setPageNo] = useState(1);

  console.log(pageNo);

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handlePrevPage = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const id = currentUser?.id;

  // const handleToggleModal = (user) => {
  //   setIsOpen((prev) => !prev);
  //   setSelectCar(user);
  // };

  const handleGetAllUpcomingAuctions = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/upcomingAuctionsForAdmin?entry=${10}&page=${pageNo}`
      );
      console.log(" =>", res.data);
      setAllUpcoming(res.data);
    } catch (error) {
      console.log("=>", error);
    }
  };

  const handleGetAllUpcomingAuctionsbySeller = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/seller/upcomingAuctions/${id}`);
      setAllUpcoming(res.data);
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    if (currentUser?.role === "admin") {
      handleGetAllUpcomingAuctions();
    } else if (currentUser?.role === "seller") {
      handleGetAllUpcomingAuctionsbySeller();
    }
  }, [pageNo]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        <h1 className="lg:text-3xl text-xl font-bold mb-8 text-gray-900">
          Upcoming Auctions
        </h1>

        <div className="overflow-x-auto shadow ring-1 ring-gray-300 rounded-lg ">
          {/* Desktop Table */}
          <div className="hidden md:block ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#191970] text-white">
                <tr>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold ${
                      currentUser?.role === "seller" && "hidden"
                    } `}
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
                {allUpcoming?.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : ""
                    } cursor-pointer hover:bg-gray-100`}
                  >
                    <td
                      onClick={() => {
                        handleToggleModel("view"), setselectedVehicle(user);
                      }}
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

                    <td
                      onClick={() => setselectedVehicle(user)}
                      className="px-4 py-3 text-gray-700"
                    >
                      {user.make}
                    </td>
                    <td
                      onClick={() => setselectedVehicle(user)}
                      className="px-4 py-3 text-gray-700"
                    >
                      {user.model}
                    </td>
                    <td
                      onClick={() => setselectedVehicle(user)}
                      className="px-4 py-3 text-center text-gray-700"
                    >
                      {user?.vehicleCondition}
                    </td>
                    <td
                      onClick={() => setselectedVehicle(user)}
                      className="px-4 py-3 text-gray-700"
                    >
                      {user.sellerOffer}
                    </td>
                    <td
                      onClick={() => setselectedVehicle(user)}
                      className="px-4 py-3 text-gray-700"
                    >
                      {user.startTime
                        ? moment(user.startTime).local().format("hh:mm:ss A")
                        : "--"}
                    </td>
                    <td
                      onClick={() => setselectedVehicle(user)}
                      className="px-4 py-3 text-gray-700"
                    >
                      {user.startTime?.slice(0, 10)}
                    </td>
                    {currentUser?.role === "seller" ? null : (
                      <td
                        className="px-4 py-3"
                        onClick={(e) => {
                          handleToggleModel("update"), setselectedVehicle(user);
                        }}
                      >
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded cursor-pointer hover:bg-blue-600 transition">
                          Edit
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden space-y-4 p-3">
            {allUpcoming?.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg text-gray-900">Seller</h3>
                  <span className="text-gray-700 font-medium">
                    {user?.name}
                  </span>
                </div>

                {/* Vehicle Info */}
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
                      Seller Offer
                    </span>
                    <span className="text-gray-900">{user?.sellerOffer}</span>
                  </p>

                  <p className="flex justify-between">
                    <span className="text-gray-900 font-bold">Start Time</span>
                    <span className="text-gray-500">
                      {user?.startTime?.slice(11, 19)}
                    </span>
                  </p>

                  <p className="flex justify-between">
                    <span className="text-gray-900 font-bold">Date</span>
                    <span className="text-gray-500">
                      {user?.startTime?.slice(0, 10)}
                    </span>
                  </p>
                </div>

                {/* Action Button */}
                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      handleToggleModel("update"), setselectedVehicle(user);
                    }}
                    className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 hover:cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {allUpcoming?.length === 0 && (
          <div className="flex items-center justify-center font-medium lg:text-xl  text-sm ">
            No Upcoming Bid yet!
          </div>
        )}

        <div className="flex justify-between  mt-6">
          {/* Prev Button */}
          <button
            className={`bg-[#518ecb] text-white px-5 py-2 rounded hover:bg-[#518ecb] ${
              pageNo > 1 ? "block" : "hidden"
            }`}
            onClick={handlePrevPage}
          >
            ‹ Prev
          </button>

          {/* Next Button */}
          <div></div>
          <button
            className={`bg-[#518ecb] text-white px-5 py-2 rounded hover:bg-[#518ecb] ${
              allUpcoming.length === 0 ? "hidden" : "block"
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
        {isOpen === "view" && (
          <ViewBrandModal
            selectedVehicle={selectedVehicle}
            handleClick={() => handleToggleModel("view")}
          />
        )}

        {isOpen === "update" && (
          <AdminUpdatebid
            selectedVehicle={selectedVehicle}
            setIsOpenBid={() => handleToggleModel("update")}
          />
        )}

        <ToastContainer />
      </div>
    </>
  );
}
