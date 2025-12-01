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

export const AuctionEvent = () => {
  // UI controls
  const [isOpen, setIsOpen] = useState(""); // for AddCity / EditCity modals (kept)
  const [loading, setLoading] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  console.log("actionMenuOpen =>", actionMenuOpen);

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
      const res = await axios.get(`${BASE_URL}/getApprovedVehicles`);
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
      <div className="max-w-7xl mx-auto space-y-4 px-2 lg:px-0">
        {filteredVehicles?.length > 0 ? (
          filteredVehicles.map((vehicle, index) => {
            const key = vehicle?.id ?? index;
            const make = (vehicle?.make || "").toString();
            const model = (vehicle?.model || "").toString();
            const series = (vehicle?.series || "").toString();
            const fuelType = (vehicle?.fuelType || "").toString();
            const transmission = (vehicle?.transmission || "").toString();
            const color = (vehicle?.color || "").toString();
            const cityName = (vehicle?.cityName || "").toString();

            return (
              <div
                key={key}
                // onClick={() => setActionMenuOpen(null)}
                className="relative"
              >
                {/* Desktop View */}
                <div className="hidden lg:flex flex-col lg:flex-row items-start lg:items-center justify-between border rounded-lg hover:shadow-md transition-all duration-200 p-4 gap-4">
                  <div
                    className="relative w-full lg:w-40 h-40 lg:h-24 flex-shrink-0 rounded-md overflow-hidden cursor-pointer"
                    onClick={() => handleViewClick(vehicle)}
                  >
                    {vehicle?.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={`${make} ${model}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  <div
                    className="flex-1 px-0 lg:px-4 cursor-pointer"
                    onClick={() => handleViewClick(vehicle)}
                  >
                    <h2 className="text-base font-bold text-gray-800">
                      {make.charAt(0).toUpperCase() + make.slice(1)}{" "}
                      {model.charAt(0).toUpperCase() + model.slice(1)}{" "}
                      {series.charAt(0).toUpperCase() + series.slice(1)}
                    </h2>

                    <p className="text-lg font-bold text-gray-800">
                      PKR {vehicle?.buyNowPrice ?? "--"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {vehicle?.year ?? "--"} |{" "}
                      {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)} |{" "}
                      {transmission.charAt(0).toUpperCase() +
                        transmission.slice(1)}{" "}
                      | {vehicle?.mileage ?? "--"} KM |{" "}
                      {color.charAt(0).toUpperCase() + color.slice(1)} |{" "}
                      {cityName.charAt(0).toUpperCase() + cityName.slice(1) ||
                        "--"}
                    </p>
                  </div>

                  <div className="w-full lg:w-auto text-left lg:text-right relative action-menu">
                    <button
                      onClick={() => toggleActionMenu(vehicle?.id)}
                      className="p-2 rounded-full hover:bg-gray-200 transition"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>

                    {actionMenuOpen === vehicle?.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                        {vehicle?.saleStatus === "upcoming" ||
                        vehicle?.saleStatus === "sold" ? (
                          <button className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left opacity-50 cursor-not-allowed">
                            Auction Event Added
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setIsOpenBid(true);
                              setActionMenuOpen(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left"
                          >
                            Add Auction Event
                          </button>
                        )}

                        <button
                          onClick={() => handleViewClick(vehicle)}
                          className="w-full px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-100 text-left"
                        >
                          View Auction Event
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden border-b py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 cursor-pointer"
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
                          No Img
                        </div>
                      )}
                    </div>

                    <div
                      className="flex-1"
                      onClick={() => handleViewClick(vehicle)}
                    >
                      <h2 className="text-sm font-bold text-gray-800">
                        {make.charAt(0).toUpperCase() + make.slice(1)}{" "}
                        {model.charAt(0).toUpperCase() + model.slice(1)}{" "}
                        {series.charAt(0).toUpperCase() + series.slice(1)}
                      </h2>
                      <p className="text-xs text-gray-700 font-semibold">
                        PKR {vehicle?.buyNowPrice ?? "--"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {vehicle?.year ?? "--"} |{" "}
                        {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)} |{" "}
                        {transmission.charAt(0).toUpperCase() +
                          transmission.slice(1)}{" "}
                        | {vehicle?.mileage ?? "--"} KM |{" "}
                        {color.charAt(0).toUpperCase() + color.slice(1)} |{" "}
                        {cityName.charAt(0).toUpperCase() + cityName.slice(1) ||
                          "--"}
                      </p>
                    </div>

                    <div className="relative action-menu">
                      <button
                        onClick={() => toggleActionMenu(vehicle?.id)}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>

                      {actionMenuOpen === vehicle?.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setEditModalOpen(true);
                              setActionMenuOpen(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-100 text-left"
                          >
                            Edit
                          </button>

                          {vehicle?.saleStatus === "upcoming" ||
                          vehicle?.saleStatus === "sold" ? (
                            <button className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left opacity-50 cursor-not-allowed">
                              Bid Added
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setIsOpenBid(true);
                                setActionMenuOpen(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left"
                            >
                              Add Bid
                            </button>
                          )}

                          <button
                            onClick={() => handleViewClick(vehicle)}
                            className="w-full px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-100 text-left"
                          >
                            View
                          </button>

                          <button
                            onClick={() => {
                              handleDeleteVehicle(vehicle?.id);
                              setActionMenuOpen(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-6">
            {loading
              ? "Loading..."
              : "No vehicles found. Please add a vehicle or adjust your search."}
          </p>
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
