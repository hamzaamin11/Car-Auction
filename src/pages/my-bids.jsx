import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BASE_URL } from "../components/Contant/URL";

const MyBids = () => {
  const { currentUser } = useSelector((state) => state?.auth);
  const [allBiders, setAllBiders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleGetBidersHistory = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/customer/myBids/${currentUser?.id}`
      );
      setAllBiders(res.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  useEffect(() => {
    handleGetBidersHistory();
  }, []);

  // Pagination Logic
  const totalItems = allBiders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = allBiders.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }
  
    return pages;
  };
  console.log('totalPages:', totalPages);
console.log('currentPage:', currentPage);
console.log('pageNumbers:', getPageNumbers());

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="lg:text-3xl text-xl font-bold mb-2 text-gray-800 lg:text-start text-center">
          Auction History
        </h1>

        <div className="w-full bg-white rounded-2xl shadow-md border border-gray-200">
          {/* Desktop Table View  */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm table-fixed">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">SR#</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Vehicle</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Bid Amount
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-center font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems && currentItems.length > 0 ? (
                  currentItems.map((bid, index) => (
                    <tr key={index} className="transition duration-200">
                      <td className="px-6 py-4">{startIndex + index + 1}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {bid?.buyerDetails?.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {bid?.vehicleDetails?.make}/{bid?.vehicleDetails?.model}
                        /{bid?.vehicleDetails?.series}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#191970]">
                        PKR {bid?.bidDetails?.yourOffer || "0"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {bid?.bidDetails?.bidCreatedAt
                          ? new Date(bid.bidDetails.bidCreatedAt).toLocaleDateString("en-GB")
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                          Sold
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-400 font-medium"
                    >
                      No bids yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden p-4 space-y-4">
            {currentItems && currentItems.length > 0 ? (
              currentItems.map((bid, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-4"
                >
                  <div className="flex justify-end items-center mb-3">
                    <span className="inline-flex items-center justify-center px-3 py-1 text-xs rounded-full font-semibold bg-green-100 text-green-800">
                      Sold
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">Customer</span>
                      <span className="text-gray-800 cursor-pointer underline">
                        {bid?.buyerDetails?.name}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">Vehicle</span>
                      <span className="text-gray-800 cursor-pointer underline">
                        {bid?.vehicleDetails?.make}/{bid?.vehicleDetails?.model}
                        /{bid?.vehicleDetails?.series}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">
                        Bid Amount
                      </span>
                      <span className="text-[#191970] font-semibold">
                        PKR {bid?.bidDetails.yourOffer || "0"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-900 font-bold">Date</span>
                      <span className="text-gray-500">
                        {bid?.bidDetails?.bidCreatedAt
                          ? new Date(bid.bidDetails.bidCreatedAt).toLocaleDateString("en-GB")
                          : "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">No bids yet.</div>
            )}
          </div>

    
       {/* IMPROVED PAGINATION – RESPONSIVE ON BOTH MOBILE & DESKTOP */}
{totalItems > 0 && (
  <div className="border-t border-gray-200">
    <div className="p-4">
      {/* Info Text - Full Width on Mobile */}
      <div className="text-center sm:text-left text-sm text-gray-600 mb-3 sm:mb-4">
        Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
        <span className="font-medium">{endIndex}</span> of{" "}
        <span className="font-medium">{totalItems}</span> entries
      </div>

      {/* Pagination Controls - Centered and Wrapped */}
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {/* First Page Button */}
      {/* First Page Button */}
<button
  onClick={() => goToPage(1)}
  disabled={currentPage === 1}
  className={`px-2 sm:px-3 py-1.5 rounded border border-gray-300 text-sm sm:text-base font-medium transition-colors ${
    currentPage === 1
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-white hover:bg-gray-50 text-gray-700"
  }`}
>
  {"<<"}
</button>

<button
  onClick={() => goToPage(currentPage - 1)}
  disabled={currentPage === 1}
  className={`px-2 sm:px-3 py-1.5 rounded border border-gray-300 text-sm sm:text-base font-medium transition-colors ${
    currentPage === 1
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-white hover:bg-gray-50 text-gray-700"
  }`}
>
  {"<"}
</button>

{getPageNumbers().map((page) => (
  <button
    key={page}
    onClick={() => goToPage(page)}
    className={`px-2.5 sm:px-3.5 py-1.5 rounded border border-gray-300 text-sm sm:text-base font-medium transition-colors ${
      currentPage === page
        ? "bg-blue-950 text-white border-blue-950"
        : "bg-white hover:bg-gray-50 text-gray-700"
    }`}
  >
    {page}
  </button>
))}

<button
  onClick={() => goToPage(currentPage + 1)}
  disabled={currentPage >= totalPages}
  className={`px-2 sm:px-3 py-1.5 rounded border border-gray-300 text-sm sm:text-base font-medium transition-colors ${
    currentPage >= totalPages
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-white hover:bg-gray-50 text-gray-700"
  }`}
>
  {">"}
</button>

<button
  onClick={() => goToPage(totalPages)}
  disabled={currentPage >= totalPages}
  className={`px-2 sm:px-3 py-1.5 rounded border border-gray-300 text-sm sm:text-base font-medium transition-colors ${
    currentPage >= totalPages
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-white hover:bg-gray-50 text-gray-700"
  }`}
>
  {">>"}
</button>
        </div>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default MyBids;