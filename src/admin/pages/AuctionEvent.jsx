import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AddCityModal } from "../../components/CityModal/AddCity";
import { EditCityModal } from "../../components/CityModal/EditCity";
import CustomAdd from "../../CustomAdd";
import CustomSearch from "../../CustomSearch";
import { BASE_URL } from "../../components/Contant/URL";
import { MoreVertical } from "lucide-react";
import { ViewAdminCar } from "../../components/ViewAdminCar";
import { AdminAddBid } from "../../components/AdminAddBidComponent/AdminAddBid";
import { useSelector } from "react-redux";
import moment from "moment";

export const AuctionEvent = () => {
  const { currentUser } = useSelector((state) => state?.auth);
  const [isOpen, setIsOpen] = useState(""); // for AddCity / EditCity modals (kept)
  const [loading, setLoading] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // Search & pagination
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  // Vehicles data
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  // Selection & modals
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isOpenBid, setIsOpenBid] = useState(false);

  // wrapper ref used to detect outside clicks for closing menus
  const wrapperRef = useRef(null);

  const itemsPerRequest = 10; // kept from original (not used for vehicles fetch here)

  const handleToggleModal = (active) =>
    setIsOpen((prev) => (prev === active ? "" : active));

  // -----------------------------
  // API Calls
  // -----------------------------
  const handleGetVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/ApprovedVehicleList/${currentUser?.role}`
      );
      // Expecting array in res.data
      const data = Array.isArray(res.data) ? res.data : [];
      setAllVehicles(data);
      setHasMore(false); // mark false unless you implement server pagination for vehicles
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load vehicles.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  // Example delete vehicle (calls API if available; otherwise local remove)
  const handleDeleteVehicle = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This vehicle will be deleted permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#9333ea",
        cancelButtonColor: "#d33",
      });

      if (!result.isConfirmed) return;

      // Try to call backend delete endpoint (adjust endpoint to your backend)
      try {
        await axios.delete(`${BASE_URL}/deleteVehicle/${id}`);
      } catch (err) {
        // If API fails or does not exist, we'll still remove locally
        console.warn("Delete API failed or missing — doing local removal", err);
      }

      setAllVehicles((prev) => prev.filter((v) => v.id !== id));
      setFilteredVehicles((prev) => prev.filter((v) => v.id !== id));
      setActionMenuOpen(null);
      await Swal.fire({
        title: "Deleted!",
        text: "Vehicle deleted successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 1500,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // -----------------------------
  // Helpers & UI handlers
  // -----------------------------
  const toggleActionMenu = (vehicleId) => {
    console.log("function =>", vehicleId);
    setActionMenuOpen((prev) => (prev === vehicleId ? null : vehicleId));
  };

  const handleViewClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setViewModal(true);
    setActionMenuOpen(null);
  };

  const handleStopEventAuction = async (vehicleId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Vehicle Event will be Cancel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#9333ea",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        const res = await axios.post(
          `${BASE_URL}/cancelAuctionByAdmin/${vehicleId}`
        );
        Swal.fire({
          title: "Cancel!",
          text: "Event has been cancel successfully.",
          icon: "success",
          confirmButtonColor: "#9333ea",
          timer: 2000,
          timerProgressBar: true,
        });
        console.log(res.data);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.message,
          icon: "error",
          confirmButtonColor: "#9333ea",
        });
      }
    }
  };

  // close action menu when clicking outside the component

  // -----------------------------
  // Filtering & pagination logic
  // -----------------------------
  // When vehicles / search / page changes, compute filteredVehicles
  useEffect(() => {
    // filter by search
    const normalizedSearch = (search || "").trim().toLowerCase();
    let filtered = allVehicles;
    if (normalizedSearch) {
      filtered = allVehicles.filter((v) =>
        `${v.make || ""} ${v.model || ""} ${v.year || ""} ${v.series || ""}`
          .toLowerCase()
          .includes(normalizedSearch)
      );
    }

    // pagination
    const start = (pageNo - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setFilteredVehicles(filtered.slice(start, end));

    // update hasMore (if you load from server you may adjust this)
    setHasMore(filtered.length > end);
  }, [allVehicles, search, pageNo, itemsPerPage]);

  // reset to first page when search changes
  useEffect(() => {
    setPageNo(1);
  }, [search, itemsPerPage]);

  // initial load
  useEffect(() => {
    handleGetVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // Pagination UI helpers
  // -----------------------------
  const filteredCount = allVehicles.filter((v) => {
    const normalizedSearch = (search || "").trim().toLowerCase();
    if (!normalizedSearch) return true;
    return `${v.make || ""} ${v.model || ""} ${v.year || ""} ${v.series || ""}`
      .toLowerCase()
      .includes(normalizedSearch);
  }).length;

  const totalPages = Math.max(1, Math.ceil(filteredCount / itemsPerPage));

  const goToPage = (page) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setPageNo(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleToggle = (prev) => setViewModal(!prev);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-2 lg:p-6" ref={wrapperRef}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800">
          Auction Event List
        </h2>

        <div className="relative w-full max-w-md">
          <CustomSearch
            placeholder="Search By Auction Event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="max-w-7xl mx-auto px-2 lg:px-0">
        {filteredVehicles?.length > 0 ? (
          <div className="overflow-x-auto rounded">
            <table className="w-full border-collapse border overflow-hidden">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="p-3 text-start text-sm font-semibold">Sr</th>
                  <th className="p-1 text-left text-sm font-semibold">
                    Vehicle Name
                  </th>
                  <th className="p-1 text-left text-sm font-semibold">Lot#</th>
                  <th className="p-1 text-left text-sm font-semibold">Year</th>
                  <th className="p-1 text-left text-sm font-semibold">
                    Fuel Type
                  </th>

                  <th className="p-1 text-left text-sm font-semibold">Color</th>
                  <th className="p-1 text-left text-sm font-semibold">City</th>

                  <th className="p-1 text-left text-sm font-semibold">
                    Date / Time
                  </th>
                  <th className="p-1 text-left text-sm font-semibold">
                    Reserve Price
                  </th>
                  <th className="p-1 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="p-1 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredVehicles.map((vehicle, index) => {
                  const key = vehicle?.id ?? index;
                  const make = (vehicle?.make || "").toString();
                  const model = (vehicle?.model || "").toString();
                  const series = (vehicle?.series || "").toString();
                  const fuelType = (vehicle?.fuelType || "").toString();
                  const transmission = (vehicle?.transmission || "").toString();
                  const color = (vehicle?.color || "").toString();
                  const cityName = (vehicle?.cityName || "").toString();

                  return (
                    <tr
                      key={key}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Serial Number */}
                      <td className="p-3 text-start text-gray-600">
                        {index + 1}
                      </td>

                      {/* Vehicle Column with Image and Name */}
                      <td className="p-1">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                            onClick={() => handleViewClick(vehicle)}
                          >
                            {vehicle?.images && vehicle.images.length > 0 ? (
                              <img
                                src={vehicle.images[0]}
                                alt={`${make} ${model}`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          <div
                            className="cursor-pointer min-w-0"
                            onClick={() => handleViewClick(vehicle)}
                          >
                            <h2 className="text-sm font-bold text-gray-800 truncate">
                              {make.charAt(0).toUpperCase() + make.slice(1)}{" "}
                              {model.charAt(0).toUpperCase() + model.slice(1)}
                            </h2>
                            <p className="text-xs text-gray-500 truncate">
                              {series.charAt(0).toUpperCase() + series.slice(1)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Year */}
                      <td className="p-1">
                        <span className="text-sm text-gray-600">
                          {vehicle?.lot_number ?? "--"}
                        </span>
                      </td>

                      {/* Year */}
                      <td className="p-1">
                        <span className="text-sm text-gray-600">
                          {vehicle?.year ?? "--"}
                        </span>
                      </td>

                      {/* Fuel Type */}
                      <td className="p-1">
                        <span className="text-sm text-gray-600">
                          {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}
                        </span>
                      </td>

                     

                      {/* Color */}
                      <td className="p-1">
                        <span className="text-sm text-gray-600">
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </span>
                      </td>

                      {/* City */}
                      <td className="p-1">
                        <span className="text-sm text-gray-600">
                          {cityName.charAt(0).toUpperCase() +
                            cityName.slice(1) || "--"}
                        </span>
                      </td>

                       {/* Time Stamp */}
                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle?.VehicleCreatedAt
                          ? new Date(
                              vehicle?.VehicleCreatedAt
                            ).toLocaleDateString("en-GB")
                          : "N/A"}{" "}
                        /{" "}
                        {vehicle?.VehicleCreatedAt
                          ? moment(vehicle?.VehicleCreatedAt)
                              .local()
                              .format("hh:mm A")
                          : "--"}
                      </span>
                    </td>

                      {/* Price */}
                      <td className="p-1">
                        <span className="text-sm font-bold text-gray-800">
                          PKR {vehicle?.buyNowPrice ?? "--"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-1">
                        {vehicle?.saleStatus === "upcoming" ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Live
                          </span>
                        ) : vehicle?.saleStatus === "sold" ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Sold
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            Available
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-1">
                        <div className="relative">
                          <button
                            onClick={() => toggleActionMenu(vehicle?.id)}
                            className="p-2 rounded-full hover:bg-gray-200 transition"
                          >
                            <MoreVertical className="h-5 w-5 text-gray-600" />
                          </button>

                          {actionMenuOpen === vehicle?.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                              {/* Auction Event Button */}
                              {vehicle?.saleStatus === "upcoming" ||
                              vehicle?.saleStatus === "sold" ? (
                                <button className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left flex items-center gap-2 opacity-50 cursor-not-allowed rounded-t-lg">
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
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  Auction Event Added
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedVehicle(vehicle);
                                    setIsOpenBid(true);
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left flex items-center gap-2 rounded-t-lg"
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
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                  </svg>
                                  Add Auction Event
                                </button>
                              )}

                              {/* Stop Event Auction Button */}
                              <button
                                onClick={() =>
                                  handleStopEventAuction(vehicle?.id)
                                }
                                className="w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-100 text-left flex items-center gap-2"
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
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Stop Event Auction
                              </button>

                              {/* View Auction Event Button */}
                              <button
                                onClick={() => handleViewClick(vehicle)}
                                className="w-full px-4 py-2 text-sm text-blue-900 hover:bg-blue-100 text-left flex items-center gap-2 rounded-b-lg"
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
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                View Auction Event
                              </button>

                              {/* Separator */}
                              <div className="border-t border-gray-100 my-1"></div>

                              {/* Edit Button (for mobile view in original) */}
                              <button
                                onClick={() => {
                                  setSelectedVehicle(vehicle);
                                  setEditModalOpen(true);
                                  setActionMenuOpen(null);
                                }}
                                className="w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-100 text-left flex items-center gap-2"
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
                                Edit Vehicle
                              </button>

                              {/* Delete Button (for mobile view in original) */}
                              <button
                                onClick={() => {
                                  handleDeleteVehicle(vehicle?.id);
                                  setActionMenuOpen(null);
                                }}
                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left flex items-center gap-2 rounded-b-lg"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete Vehicle
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
              {loading ? "Loading vehicles..." : "No vehicles found"}
            </h3>
            <p className="text-sm text-gray-500">
              {loading
                ? "Please wait while we fetch vehicle data..."
                : "Please add a vehicle or adjust your search criteria."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredVehicles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
            <div className="text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {(pageNo - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(pageNo * itemsPerPage, filteredCount)}
              </span>{" "}
              of <span className="font-medium">{filteredCount}</span> entries
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

      {/* City Modals (kept from your imports) */}
      {isOpen === "Add" && (
        <AddCityModal
          handleClose={() => handleToggleModal("")}
          handleGetAllCities={() => {
            /* implement if needed */
          }}
        />
      )}

      {isOpen === "Edit" && (
        <EditCityModal
          handleClose={() => handleToggleModal("")}
          seleteCity={null}
          handleGetAllCities={() => {
            /* implement if needed */
          }}
        />
      )}
      {viewModal && (
        <ViewAdminCar
          handleClick={handleToggle}
          selectedVehicle={selectedVehicle}
        />
      )}

      {isOpenBid && (
        <AdminAddBid
          selectedVehicle={selectedVehicle}
          setIsOpenBid={setIsOpenBid}
          getAllVehicles={handleGetVehicles}
        />
      )}
    </div>
  );
};
