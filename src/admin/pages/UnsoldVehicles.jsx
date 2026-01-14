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

  const handleGetAllUnapprovalVehicles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/UnsoldVehicleListbyDateRange/${currentUser.role}/${dateRange.fromDate}/${dateRange.toDate}/${currentUser?.id}`
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

  const toggleActionMenu = (id) => {
    setActionMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleApprove = async (vehicle) => {
    try {
      const result = await Swal.fire({
        title: "Approve Vehicle?",
        text: `Are you sure you want to approve ${vehicle.make} ${vehicle.model}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, approve it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const res = await axios.put(
          `${BASE_URL}/ApprovedVehicles/${vehicle.id}`
        );
        setActionMenuOpen(null);
        console.log(res.data);
        handleGetAllUnapprovalVehicles();
        await Swal.fire({
          title: "Success!",
          text: "This vehicle has been approved successfully.",
          icon: "success",
          confirmButtonColor: "#9333ea",
        });
      }
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Error!",
        text: "Something went wrong while approving the vehicle.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  const handleAwaiting = async (vehicle) => {
    try {
      const result = await Swal.fire({
        title: "Move to Awaiting?",
        text: `Are you sure you want to move ${vehicle.make} ${vehicle.model} to awaiting approval?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#f59e0b",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, move it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const res = await axios.put(
          `${BASE_URL}/AwaitingApprovedVehicles/${vehicle.id}`
        );
        setActionMenuOpen(null);
        console.log(res.data);
        handleGetAllUnapprovalVehicles();
        await Swal.fire({
          title: "Success!",
          text: "This vehicle has been added in awaiting approval.",
          icon: "success",
          confirmButtonColor: "#9333ea",
        });
      }
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
        // FIXED: Added API call for reject
        const res = await axios.put(`${BASE_URL}/rejectVehicle/${vehicle.id}`);
        console.log(res.data);
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
                  <th className="p-4 text-left text-sm font-semibold">
                    Seller Name
                  </th>
                  <th className="p-4 text-left text-sm font-semibold">
                    Vehicle Name
                  </th>
                  <th className="p-4 text-left text-sm font-semibold">Lot#</th>
                  <th className="p-4 text-left text-sm font-semibold">Year</th>
                  <th className="p-4 text-left text-sm font-semibold">
                    Fuel Type
                  </th>
                  <th className="p-4 text-left text-sm font-semibold">Color</th>
                  <th className="p-4 text-left text-sm font-semibold">City</th>
                  <th className="p-4 text-left text-sm font-semibold">
                    Date / Time
                  </th>
                  <th className="p-4 text-left text-sm font-semibold">
                    Reserve Price
                  </th>
                  <th className="p-4 text-left text-sm font-semibold">
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
                          {vehicle?.bidCreatedAt
                            ? new Date(vehicle.bidCreatedAt).toLocaleDateString(
                                "en-GB"
                              )
                            : "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {vehicle?.bidCreatedAt
                            ? moment(vehicle.bidCreatedAt)
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
                      <div className="relative">
                        <button
                          onClick={() => toggleActionMenu(vehicle.id)}
                          className="p-2 rounded-lg hover:bg-gray-200 transition"
                          aria-label="Actions"
                          type="button"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>

                        {actionMenuOpen === vehicle.id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <button
                              onClick={() =>
                                handleUpdateVehicle(vehicle, "edit")
                              }
                              className="w-full px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 hover:text-orange-700 text-left flex items-center gap-2 rounded-t-lg transition"
                              type="button"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              onClick={() => handleApprove(vehicle)}
                              className="w-full px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 hover:text-green-700 text-left flex items-center gap-2 transition"
                              type="button"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </button>

                            <button
                              onClick={() => handleAwaiting(vehicle)}
                              className="w-full px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 text-left flex items-center gap-2 transition"
                              type="button"
                            >
                              <Clock className="h-4 w-4" />
                              Awaiting
                            </button>

                            <button
                              onClick={() => handleReject(vehicle)}
                              className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 text-left flex items-center gap-2 transition"
                              type="button"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </button>

                            <button
                              onClick={() => handleViewDetails(vehicle)}
                              className="w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-left flex items-center gap-2 rounded-b-lg transition"
                              type="button"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
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

      {/* View Modal */}
      {isViewModalOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 backdrop-blur p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative border border-gray-500">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Vehicle Details
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Lot Number:
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedVehicle.lot_number || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Location:
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedVehicle.cityName || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Make:</p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedVehicle.make || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Model:
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedVehicle.model || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Series:
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedVehicle.series || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Color:
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedVehicle.color || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Transmission:
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedVehicle.transmission || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Fuel Type:
                      </p>
                      <p className="text-base font-semibold text-gray-900 capitalize">
                        {selectedVehicle.fuelType || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Body Style:
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedVehicle.bodyStyle || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Certify Status:
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedVehicle.certifyStatus || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Drive Type:
                      </p>
                      <p className="text-base font-semibold text-gray-900 uppercase">
                        {selectedVehicle.driveType || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Mileage:
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedVehicle.mileage?.toLocaleString() || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Year:</p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedVehicle.year || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Condition:
                      </p>
                      <p className="text-base font-semibold text-gray-900 capitalize">
                        {selectedVehicle.vehicleCondition || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Price:
                      </p>
                      <p className="text-lg font-bold text-blue-900">
                        PKR{" "}
                        {selectedVehicle.buyNowPrice?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  {selectedVehicle.images &&
                  selectedVehicle.images.length > 0 ? (
                    <>
                      <div className="w-full h-72 rounded-xl overflow-hidden bg-gray-100 mb-6">
                        <img
                          src={selectedVehicle.images[currentImageIndex]}
                          alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex items-center justify-between w-full mb-4">
                        <button
                          onClick={handlePrevImage}
                          className="bg-blue-900 hover:bg-blue-800 text-white rounded-full p-3 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={selectedVehicle.images.length <= 1}
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex-1 text-center">
                          <p className="text-sm font-medium text-gray-700">
                            Image {currentImageIndex + 1} of{" "}
                            {selectedVehicle.images.length}
                          </p>
                        </div>

                        <button
                          onClick={handleNextImage}
                          className="bg-blue-900 hover:bg-blue-800 text-white rounded-full p-3 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={selectedVehicle.images.length <= 1}
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-2 w-full">
                        {selectedVehicle.images.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              index === currentImageIndex
                                ? "border-blue-900"
                                : "border-gray-300"
                            }`}
                          >
                            <img
                              src={img}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-72 rounded-xl bg-gray-100 flex flex-col items-center justify-center">
                      <Car className="w-16 h-16 text-gray-400 mb-4" />
                      <p className="text-gray-500">No images available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpen === "edit" && (
        <EditAdminVehicle
          open={() => handleIsOpen("edit")}
          setOpen={() => handleIsOpen("")}
          selectedVehicle={selectedVehicle}
          onVehicleUpdated={handleGetAllUnapprovalVehicles}
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
