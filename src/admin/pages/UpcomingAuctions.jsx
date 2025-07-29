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

export default function UpcomingAuctions() {
  // const [users, setUsers] = useState(initialUsers);
  const { comingAuc, UpComingAuctions } = useContext(AuctionsContext);

  console.log("=>", comingAuc);

  const [selectedVehicle, setselectedVehicle] = useState(null);

  const [selectedAuctionId, setSelectedAuctionId] = useState(null);

  const { loader } = useSelector((state) => state.navigateState);

  console.log("awais jani", comingAuc);

  const handleToggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleGoLive = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/admin/updateBidStatusAdmin/${id}`
      );
      toast.success("Your bid has gone live successfully.");

      UpComingAuctions();
    } catch (error) {
      console.log(error);
    }
  };

  const disptach = useDispatch();
  useEffect(() => {
    UpComingAuctions();
    disptach(navigationStart());
    setTimeout(() => {
      disptach(navigationSuccess("Upcoming"));
    }, 1000);
  }, []);

  if (loader) return <RotateLoader />;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">
          Upcoming Auctions
        </h1>

        <div className="overflow-x-auto shadow ring-1 ring-gray-300 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#191970] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Vehicle
                </th>

                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Condition
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Seller Offer
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Max. Bid
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {comingAuc?.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`idx % 2 === 0 ? "bg-gray-50" : "" cursor-pointer  hover:bg-gray-100 `}
                >
                  <td
                    onClick={() => setselectedVehicle(user)}
                    className="px-4 py-3 font-medium text-gray-900"
                  >
                    {user?.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{user.model}</td>

                  <td
                    onClick={() => setselectedVehicle(user)}
                    className="px-4 py-3 text-center space-x-2"
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
                    className="px-4 py-3 text-gray-700 "
                  >
                    {user.maxBid || "Pending"}
                  </td>
                  <td
                    onClick={() => setselectedVehicle(user)}
                    className="px-4 py-3 text-gray-700 "
                  >
                    {user.endTime?.slice(0, 10)}
                  </td>
                  <td>
                    <span
                      onClick={() => handleGoLive(user.bidId)}
                      className="px-2 py-1  bg-blue-500 text-white text-center rounded "
                    >
                      Go Live
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {comingAuc?.length === 0 && (
          <div className="flex items-center justify-center mt-1 font-medium text-xl">
            No Upcoming Bid yet!
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

        <ToastContainer />
      </div>
    </>
  );
}
