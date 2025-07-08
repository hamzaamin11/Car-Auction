import { useContext, useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import AuctionsContext from "../../context/AuctionsContext";
import ViewAuctionModal from "./ViewAuctionModal";

export default function LiveAuctions() {
  // const [users, setUsers] = useState(initialUsers);
  const { getLiveAuctions, AllLiveAuctions, AuctionById } =
    useContext(AuctionsContext);
  console.log("live auctions:", getLiveAuctions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);

  //   const handleView = async (user) => {
  //     await getUserbyId(user.id); // ✅ correct function call
  //     setIsViewModalOpen(true);
  //   };

  return (
    <>
      {/* <Topbar />
      <Sidebar /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">
          Live Auctions
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

                <th className="px-4 py-3 text-left text-sm font-semibold">
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {getLiveAuctions?.map((user, idx) => (
                <tr key={user.id} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {user?.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{user.model}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {user?.vehicleCondition}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {user.sellerOffer}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{"Pending"}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {user.date?.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedAuctionId && (
          <ViewAuctionModal
            auctionId={selectedAuctionId}
            onClose={() => setSelectedAuctionId(null)}
          />
        )}

        <ToastContainer />
      </div>
    </>
  );
}
