import React, { useEffect, useState, useRef } from "react";
import {
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  CircleUser,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import Swal from "sweetalert2";
import CustomSearch from "../../CustomSearch";
import { useSelector } from "react-redux";
import moment from "moment";
import { UserDetailModal } from "../components/UserDetailModal/UserDetail";

export const PastVehicle = () => {
  const { currentUser } = useSelector((state) => state?.auth);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [search, setSearch] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [isOpen, setIsOpen] = useState("");
  const [userDetail, setUSerDetail] = useState(null);

  const menuRef = useRef(null);
  const itemsPerPage = 10;

  const currentDate = new Date().toISOString().split("T")[0];

  const initialState = {
    fromDate: currentDate,
    toDate: currentDate,
  };
  const [dateRange, setDateRange] = useState(initialState);

  const handleGetAllUnapprovalVehicles = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/PastAuctionVehicleListbyDateRange/${currentUser.role}/${dateRange.fromDate}/${dateRange.toDate}`
      );
      console.log(res.data);
      setVehicles(res.data);
    } catch (error) {
      console.log(error);
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

  const toggleActionMenu = (id) => {
    setActionMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setDateRange((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleApprove = async (vehicle) => {
    try {
      const res = await axios.put(`${BASE_URL}/ApprovedVehicles/${vehicle.id}`);
      setActionMenuOpen(null);
      console.log(res.data);
      handleGetAllUnapprovalVehicles();
      await Swal.fire({
        title: "Success!",
        text: "This vehicle has been approved successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  const handleIsOpen = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleReject = async (vehicle) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to reject ${vehicle.make} ${vehicle.model}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, reject it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        setActionMenuOpen(null);
        handleGetAllUnapprovalVehicles();

        await Swal.fire({
          title: "Rejected!",
          text: `${vehicle.make} ${vehicle.model} has been rejected successfully.`,
          icon: "success",
          confirmButtonColor: "#9333ea",
        });
      }
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Error!",
        text: "Something went wrong while rejecting the vehicle.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  const handleViewDetails = (vehicle) => {
    console.log("View Details Clicked!", vehicle);
    setSelectedVehicle(vehicle);
    setCurrentImageIndex(0);
    setIsViewModalOpen(true);
    setActionMenuOpen(null);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedVehicle(null);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    if (selectedVehicle?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedVehicle.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedVehicle?.images) {
      setCurrentImageIndex((prev) =>
        prev === selectedVehicle.images.length - 1 ? 0 : prev + 1
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

  const filteredVehicles = vehicles.filter((v) =>
    `${v.make} ${v.model} ${v.series}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalItems = filteredVehicles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (pageNo - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentPageVehicles = filteredVehicles.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setPageNo(page);
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

  useEffect(() => {
    handleGetAllUnapprovalVehicles();
  }, [dateRange]);

  return (
    <div className="max-h-screen bg-gray-100 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800 text-center">
          Sold Vehicles
        </h2>

        <div className="relative w-full sm:w-80 mt-4 sm:mt-0">
          <CustomSearch
            placeholder="Search by Car Name..."
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

      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-800 mb-2 font-semibold text-2xl">
          Total Pending: {totalItems}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-800 mb-1">
              From Date :
            </label>
            <input
              type="date"
              name="fromDate"
              onChange={handleChangeDate}
              value={dateRange.fromDate}
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 lg:px-0">
        {currentPageVehicles?.length > 0 ? (
          <div className="overflow-x-auto rounded">
            <table className="w-full border-collapse border overflow-hidden">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="p-3 text-start text-sm font-semibold">Sr</th>
                  <th className="p-1 text-left text-sm font-semibold">
                    Seller Name
                  </th>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentPageVehicles.map((vehicle, index) => (
                  <tr
                    key={vehicle.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Serial Number */}
                    <td className="p-3 text-start text-gray-600">
                      {index + 1}
                    </td>

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

                    {/* Vehicle Column with Image and Name */}
                    <td className="p-1">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                          onClick={() => handleViewDetails(vehicle)}
                        >
                          {vehicle.images?.length > 0 ? (
                            <img
                              src={vehicle.images[0]}
                              alt={`${vehicle.make} ${vehicle.model}`}
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
                          onClick={() => handleViewDetails(vehicle)}
                        >
                          <h2 className="text-sm font-bold text-gray-800 truncate">
                            {vehicle.make} {vehicle.model}
                          </h2>
                          <p className="text-xs text-gray-500 truncate">
                            {vehicle.series.charAt(0).toUpperCase() +
                              vehicle.series.slice(1)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Year */}
                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.lot_number}
                      </span>
                    </td>

                    {/* Year */}
                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.year}
                      </span>
                    </td>

                    {/* Fuel Type */}
                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.fuelType?.charAt(0)?.toUpperCase() +
                          vehicle.fuelType?.slice(1) || "--"}
                      </span>
                    </td>

                    {/* Color */}
                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.color?.charAt(0)?.toUpperCase() +
                          vehicle.color?.slice(1) || "--"}
                      </span>
                    </td>

                    {/* City */}
                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.cityName || "--"}
                      </span>
                    </td>

                    {/* Time Stamp */}
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex flex-col">
                        <span>
                          {vehicle?.VehicleCreatedAt
                            ? new Date(
                                vehicle?.VehicleCreatedAt
                              ).toLocaleDateString("en-GB")
                            : "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {vehicle?.VehicleCreatedAt
                            ? moment(vehicle?.VehicleCreatedAt)
                                .local()
                                .format("hh:mm A")
                            : "--"}
                        </span>
                      </div>
                    </td>

                    {/* Reserve Price */}
                    <td className="p-1">
                      <span className="text-sm font-semibold text-gray-700">
                        PKR {vehicle.buyNowPrice}
                      </span>
                    </td>

                    <td className="p-1">
                      <div
                        className="relative"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <button
                          onClick={() => {
                            handleViewDetails(vehicle);
                            setActionMenuOpen(null);
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-950 hover:bg-blue-900 rounded-lg transition-colors flex items-center gap-2"
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
                          View Details
                        </button>
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
              No vehicles found
            </h3>
            <p className="text-sm text-gray-500">
              There are currently no vehicles to display.
            </p>
          </div>
        )}
      </div>

      {/* PAGINATION WITH ARROWS ONLY (<< < > >>) */}
      {totalItems > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
            <div className="text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{endIndex}</span> of{" "}
              <span className="font-medium">{totalItems}</span> entries
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

      {/* View Modal - 100% unchanged */}
      {isViewModalOpen && selectedVehicle && (
        <div className="fixed inset-0 z-500 flex items-center justify-center  backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                View Vehicle
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Lot Number:
                      </p>
                      <p className="text-base text-gray-900">
                        {selectedVehicle.lot_number || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Location:
                      </p>
                      <p className="text-base text-gray-900">
                        {selectedVehicle.cityName || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Make:</p>
                      <p className="text-base text-gray-900">
                        {selectedVehicle.make || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Model:</p>
                      <p className="text-base text-gray-900">
                        {selectedVehicle.model || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Series:</p>
                      <p className="text-base text-gray-900">
                        {selectedVehicle.series || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Color:</p>
                      <p className="text-base text-gray-900">
                        {selectedVehicle.color || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Transmission:
                      </p>
                      <p className="text-base text-gray-900">
                        {selectedVehicle.transmission || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Fuel Type:
                      </p>
                      <p className="text-base text-gray-900 capitalize">
                        {selectedVehicle.fuelType || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Body Style:
                      </p>
                      <p className="text-base text-gray-900">
                        {selectedVehicle.bodyStyle || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Certify Status:
                      </p>
                      <p className="text-base text-gray-900">
                        {selectedVehicle.certifyStatus || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Drive Type:
                      </p>
                      <p className="text-base text-gray-900 uppercase">
                        {selectedVehicle.driveType || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Meter Reading:
                      </p>
                      <p className="text-base text-gray-900">
                        {selectedVehicle.mileage || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Year:</p>
                      <p className="text-base text-gray-900">
                        {selectedVehicle.year || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Condition:
                      </p>
                      <p className="text-base text-gray-900 capitalize">
                        {selectedVehicle.vehicleCondition || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Reserve Price:
                      </p>
                      <p className="text-base text-gray-700 font-semibold">
                        {selectedVehicle.buyNowPrice}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  {selectedVehicle.images &&
                  selectedVehicle.images.length > 0 ? (
                    <>
                      <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-4">
                        <img
                          src={selectedVehicle.images[currentImageIndex]}
                          alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex items-center justify-center gap-4 w-full">
                        <button
                          onClick={handlePrevImage}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={selectedVehicle.images.length <= 1}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500 bg-gray-100">
                          <img
                            src={selectedVehicle.images[currentImageIndex]}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <button
                          onClick={handleNextImage}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={selectedVehicle.images.length <= 1}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>

                      <p className="text-sm text-gray-600 mt-2">
                        {currentImageIndex + 1} /{" "}
                        {selectedVehicle.images.length}
                      </p>
                    </>
                  ) : (
                    <div className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-400">No images available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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
