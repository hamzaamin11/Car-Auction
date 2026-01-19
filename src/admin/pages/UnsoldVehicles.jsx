import React, { useEffect, useState, useRef } from "react";
import {
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Car,
  CircleUser,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import Swal from "sweetalert2";
import CustomSearch from "../../CustomSearch";
import EditAdminVehicle from "./EditAdminVehicle";
import moment from "moment";
import { useSelector } from "react-redux";
import { UserDetailModal } from "../components/UserDetailModal/UserDetail";
import { ViewAdminCar } from "../../components/ViewAdminCar";

export const UnsoldVehicles = () => {
  const { currentUser } = useSelector((state) => state?.auth);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [search, setSearch] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUSerDetail] = useState(null);

  const currentDate = new Date().toISOString().split("T")[0];

  const initialState = {
    fromDate: currentDate,
    toDate: currentDate,
  };
  const [dateRange, setDateRange] = useState(initialState);

  const menuRef = useRef(null);
  const itemsPerPage = 10;

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setDateRange((prevState) => ({ ...prevState, [name]: value }));
    setPageNo(1);
  };

  const handleGetAllUnsoldVehicles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/UnsoldVehicleListbyDateRange/${currentUser.role}/${dateRange.fromDate}/${dateRange.toDate}/${currentUser?.id}`,
      );
      console.log(res.data);
      setVehicles(res.data || []);
    } catch (error) {
      console.log(error);
      setVehicles([]);
      Swal.fire({
        title: "Error!",
        text: "Failed to load vehicles. Please try again.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIsOpen = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleWanttoSoldVehicle = async (VehicleId) => {
    try {
      const result = await Swal.fire({
        title: "Move to Awaiting?",
        text: `Are you sure you want to Sold this Vehicle?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#172554",
        cancelButtonColor: "#dc2626",
        confirmButtonText: "Yes, Sold it!",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const res = await axios.post(
          `${BASE_URL}/markVehicleAsSold/${VehicleId}`,
        );
      }
      console.log(res.data);
      handleGetAllUnsoldVehicles();
      await Swal.fire({
        title: "Success!",
        text: "This vehicle has been Sold successfully.",
        icon: "success",
        confirmButtonColor: "#172554",
      });
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Something want Wrong",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleViewUserDetail = async (id) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getUserDetailsApprovedVehicleListById/${id}`,
      );

      setUSerDetail(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewDetails = (vehicle) => {
    console.log("View Details Clicked!", vehicle);
    setSelectedVehicle(vehicle);
    setCurrentImageIndex(0);
    setIsViewModalOpen(true);
    setActionMenuOpen(null);
  };

  const handleUpdateVehicle = (vehicle, openModel) => {
    console.log(vehicle, openModel);
    setSelectedVehicle(vehicle);
    handleIsOpen(openModel);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedVehicle(null);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    if (selectedVehicle?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedVehicle.images.length - 1 : prev - 1,
      );
    }
  };

  const handleNextImage = () => {
    if (selectedVehicle?.images) {
      setCurrentImageIndex((prev) =>
        prev === selectedVehicle.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActionMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredVehicles = vehicles.filter((v) => {
    const searchTerm = search.toLowerCase();
    return (
      (v.make && v.make.toLowerCase().includes(searchTerm)) ||
      (v.model && v.model.toLowerCase().includes(searchTerm)) ||
      (v.series && v.series.toLowerCase().includes(searchTerm)) ||
      (v.lot_number &&
        v.lot_number.toString().toLowerCase().includes(searchTerm))
    );
  });

  const totalItems = filteredVehicles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (pageNo - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentPageVehicles = filteredVehicles.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPageNo(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleViewReason = (reason) => {
    Swal.fire({
      title: "Info",
      text: reason || "No Reason",
      icon: "info",
      confirmButtonColor: "#172554",
    });
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

  useEffect(() => {
    handleGetAllUnsoldVehicles();
  }, [dateRange]);

  return (
    <div className="max-h-screen bg-gray-100 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800 text-center">
          UnSold Vehicles
        </h2>

        <div className="relative w-full sm:w-80 mt-4 sm:mt-0">
          <CustomSearch
            placeholder="Search by Car Name or Lot Number..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageNo(1);
            }}
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <div className="text-gray-800 font-semibold text-2xl">
          Total Vehicle: {totalItems}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-800 mb-1">
              From Date :
            </label>
            <input
              type="date"
              name="fromDate"
              onChange={handleChangeDate}
              value={dateRange.fromDate}
              max={dateRange.toDate}
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
              min={dateRange.fromDate}
              max={currentDate}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 lg:px-0">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            <p className="mt-4 text-gray-600">Loading vehicles...</p>
          </div>
        ) : currentPageVehicles?.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="p-4 text-start text-sm font-semibold">Sr</th>
                  {currentUser.role === "admin" && (
                    <>
                      <th className="p-1 text-left text-sm font-semibold">
                        Seller Name
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        Customer Name
                      </th>{" "}
                    </>
                  )}
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
              <tbody className="divide-y divide-gray-200">
                {currentPageVehicles.map((vehicle, index) => (
                  <tr
                    key={vehicle.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-start text-gray-600">
                      {startIndex + index + 1}
                    </td>
                    {currentUser.role === "admin" && (
                      <>
                        <td
                          className="hover:cursor-pointer"
                          onClick={() => {
                            handleIsOpen("detail");
                            handleViewUserDetail(vehicle.userId);
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <CircleUser
                              size={"30"}
                              style={{
                                color: "gray",
                              }}
                            />
                            <span className="text-sm text-gray-600 font-medium capitalize">
                              {vehicle.username || "--"}
                            </span>
                          </div>
                        </td>

                        <td
                          className="hover:cursor-pointer"
                          onClick={() => {
                            handleIsOpen("detail");
                            handleViewUserDetail(vehicle.highestUserId);
                          }}
                        >
                          {vehicle?.highestUserName ? (
                            <div className="flex items-center gap-1">
                              <CircleUser
                                size={"30"}
                                style={{
                                  color: "gray",
                                }}
                              />
                              <span className="text-sm text-gray-600 font-medium capitalize">
                                {vehicle?.highestUserName || "--"}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center text-gray-400 text-xs">
                              {"NIL"}
                            </div>
                          )}
                        </td>
                      </>
                    )}
                    <td className="p-1">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer border border-gray-200"
                          onClick={() => handleViewDetails(vehicle)}
                        >
                          {vehicle.images?.length > 0 ? (
                            <img
                              src={vehicle.images[0]}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <Car className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div
                          className="cursor-pointer min-w-0"
                          onClick={() => handleViewDetails(vehicle)}
                        >
                          <h2 className="text-sm font-bold text-gray-800 truncate">
                            {vehicle.make} {vehicle.model}
                          </h2>
                          <p className="text-xs text-gray-500 truncate">
                            {vehicle.series
                              ? vehicle.series.charAt(0).toUpperCase() +
                                vehicle.series.slice(1)
                              : "No series"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-1">
                      <span className="text-sm text-gray-600 font-medium">
                        {vehicle.lot_number || "N/A"}
                      </span>
                    </td>

                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.year || "--"}
                      </span>
                    </td>

                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.fuelType
                          ? vehicle.fuelType.charAt(0).toUpperCase() +
                            vehicle.fuelType.slice(1)
                          : "--"}
                      </span>
                    </td>

                    <td className="p-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {vehicle.color
                            ? vehicle.color.charAt(0).toUpperCase() +
                              vehicle.color.slice(1)
                            : "--"}
                        </span>
                      </div>
                    </td>

                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.cityName || "--"}
                      </span>
                    </td>

                    <td className="p-1">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-700">
                          {vehicle?.vehicleCreatedAt
                            ? new Date(
                                vehicle.vehicleCreatedAt,
                              ).toLocaleDateString("en-GB")
                            : "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {vehicle?.vehicleCreatedAt
                            ? moment(vehicle.vehicleCreatedAt)
                                .local()
                                .format("hh:mm A")
                            : "--"}
                        </span>
                      </div>
                    </td>

                    <td className="p-1">
                      <span className="text-sm font-semibold text-gray-700">
                        PKR {vehicle.buyNowPrice?.toLocaleString() || "0"}
                      </span>
                    </td>

                    <td className="p-1">
                      <span className="text-xs text-orange-500 bg-orange-50 rounded-full p-2 uppercase">
                        {vehicle.saleStatus}
                      </span>
                    </td>

                    <td className="p-1 flex gap-1">
                      <button
                        onClick={() => handleViewReason(vehicle?.reason)}
                        className="p-1.5 text-white bg-red-600 rounded hover:cursor-pointer"
                      >
                        Reason
                      </button>
                      <button
                        onClick={() => handleWanttoSoldVehicle(vehicle?.id)}
                        className="p-1.5 text-white bg-blue-950 rounded hover:cursor-pointer"
                      >
                        Sell Car
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No vehicles pending approval
            </h3>
            <p className="text-sm text-gray-500">
              All vehicles have been processed or there are no pending
              approvals.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{endIndex}</span> of{" "}
              <span className="font-medium">{totalItems}</span> entries
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={pageNo === 1}
                className={`px-3 py-2 rounded-lg border ${
                  pageNo === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50 hover:border-gray-300"
                }`}
                aria-label="First page"
              >
                {"<<"}
              </button>
              <button
                onClick={() => goToPage(pageNo - 1)}
                disabled={pageNo === 1}
                className={`px-3 py-2 rounded-lg border ${
                  pageNo === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50 hover:border-gray-300"
                }`}
                aria-label="Previous page"
              >
                {"<"}
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 min-w-[40px] rounded-lg border ${
                    pageNo === page
                      ? "bg-blue-950 text-white border-blue-950"
                      : "bg-white hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(pageNo + 1)}
                disabled={pageNo >= totalPages}
                className={`px-3 py-2 rounded-lg border ${
                  pageNo >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50 hover:border-gray-300"
                }`}
                aria-label="Next page"
              >
                {">"}
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={pageNo >= totalPages}
                className={`px-3 py-2 rounded-lg border ${
                  pageNo >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50 hover:border-gray-300"
                }`}
                aria-label="Last page"
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && (
        <ViewAdminCar
          handleClick={() => setIsViewModalOpen(false)}
          selectedVehicle={selectedVehicle}
          isViewModalOpen={isViewModalOpen}
        />
      )}

      {isOpen === "edit" && (
        <EditAdminVehicle
          open={() => handleIsOpen("edit")}
          setOpen={() => handleIsOpen("")}
          selectedVehicle={selectedVehicle}
          onVehicleUpdated={handleGetAllUnsoldVehicles}
        />
      )}
      {isOpen === "detail" && (
        <UserDetailModal
          isOpen={isOpen}
          closeModal={() => handleIsOpen("")}
          userDetail={userDetail}
        />
      )}
    </div>
  );
};
