import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import {
  MoreVertical,
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
import { UserDetailModal } from "../components/UserDetailModal/UserDetail";
import { ViewAdminCar } from "../../components/ViewAdminCar";

// Dropdown Menu Component using Portal
const DropdownMenu = ({
  vehicle,
  isOpen,
  position,
  onClose,
  onEdit,
  onApprove,
  onAwaiting,
  onReject,
  onViewDetails,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(vehicle);
        }}
        className="w-full px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 hover:text-orange-700 text-left flex items-center gap-2 rounded-t-lg transition"
        type="button"
      >
        <Edit className="h-4 w-4" />
        Edit
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onApprove(vehicle);
        }}
        className="w-full px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 hover:text-green-700 text-left flex items-center gap-2 transition"
        type="button"
      >
        <CheckCircle className="h-4 w-4" />
        Approve
      </button>

    

      <button
        onClick={(e) => {
          e.stopPropagation();
          onReject(vehicle);
        }}
        className={`w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 text-left flex items-center gap-2 transition ${vehicle.approval === "R" && "hidden"}`}
        type="button"
      >
        <XCircle className="h-4 w-4" />
        Reject
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(vehicle);
        }}
        className="w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-left flex items-center gap-2 rounded-b-lg transition"
        type="button"
      >
        <Eye className="h-4 w-4" />
        View Details
      </button>
    </div>,
    document.body,
  );
};

export const VehicleApproval = () => {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
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
    fromDate: "",
    toDate: "",
  };
  const [dateRange, setDateRange] = useState(initialState);

  const buttonRefs = useRef({});
  const tableRef = useRef(null);
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
        `${BASE_URL}/getUnApprovedVehiclesbyDateRange?fromDate=${dateRange.fromDate}&toDate=${dateRange.toDate}`,
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

  const toggleActionMenu = (id, index) => {
    if (actionMenuOpen === id) {
      setActionMenuOpen(null);
      return;
    }

    // Calculate dropdown position
    const button = buttonRefs.current[id];
    if (!button) return;

    const buttonRect = button.getBoundingClientRect();

    // Calculate position for dropdown
    // Open below the button by default
    let x = buttonRect.left;
    let y = buttonRect.bottom + 5;

    // Check if there's enough space at the bottom
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 200; // Approximate height of dropdown

    if (y + dropdownHeight > viewportHeight) {
      // If not enough space at bottom, open above the button
      y = buttonRect.top - dropdownHeight - 5;

      // Ensure it doesn't go above viewport
      if (y < 5) {
        y = 5;
      }
    }

    // Ensure it doesn't go beyond right edge
    const dropdownWidth = 192; // w-48 = 192px
    if (x + dropdownWidth > window.innerWidth) {
      x = window.innerWidth - dropdownWidth - 5;
    }

    setDropdownPosition({ x, y });
    setActionMenuOpen(id);
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
          `${BASE_URL}/ApprovedVehicles/${vehicle.id}`,
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
          `${BASE_URL}/AwaitingApprovedVehicles/${vehicle.id}`,
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
        input: "text",
        inputLabel: "Reason for rejection",
        inputPlaceholder: "Enter rejection reason...",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, reject it!",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "Rejection reason is required!";
          }
        },
      });

      if (result.isConfirmed) {
        const reason = result.value;

        console.log("Rejected Vehicle:", vehicle);
        console.log("Reason:", reason);

        const res = await axios.put(
          `${BASE_URL}/RejectedVehicles/${vehicle.id}`,
          {
            reason: reason,
          },
        );

        console.log("API Response:", res.data);

        Swal.fire("Rejected!", "Vehicle has been rejected.", "success");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleViewDetails = (vehicle) => {
    console.log("View Details Clicked!", vehicle);
    setSelectedVehicle(vehicle);
    setCurrentImageIndex(0);
    setIsViewModalOpen(true);
    setActionMenuOpen(null);
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

  const handleUpdateVehicle = (vehicle, openModel) => {
    console.log(vehicle, openModel);
    setSelectedVehicle(vehicle);
    setActionMenuOpen(null);
    handleIsOpen(openModel);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedVehicle(null);
    setCurrentImageIndex(0);
  };

  const filteredVehicles = vehicles.filter((v) => {
    const searchTerm = search.toLowerCase();
    return (
      (v.make && v.make.toLowerCase().includes(searchTerm)) ||
      (v.model && v.model.toLowerCase().includes(searchTerm)) ||
      (v.series && v.series.toLowerCase().includes(searchTerm)) ||
      (v.lot_number &&
        v.lot_number.toString().toLowerCase().includes(searchTerm)) ||
      (v.year && v.year.toString().toLowerCase().includes(searchTerm)) ||
      (v.color && v.color.toString().toLowerCase().includes(searchTerm)) ||
      (v.cityName && v.cityName.toString().toLowerCase().includes(searchTerm))
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

  // Close dropdown when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (actionMenuOpen) {
        setActionMenuOpen(null);
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [actionMenuOpen]);

  return (
    <div className="max-h-screen bg-gray-100 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800 text-center">
          Pending Vehicles
        </h2>

        <div className="relative w-full sm:w-80 mt-4 sm:mt-0">
          <CustomSearch
            placeholder="Search..."
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

      <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
        <div className="text-gray-800 font-semibold lg:text-2xl text-xl">
          Total Pending Vehicles: {totalItems}
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

      <div className="max-w-7xl mx-auto px-2 lg:px-0" ref={tableRef}>
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
                  <th className="p-1 text-left text-sm font-semibold">
                    Seller Name
                  </th>
                  <th className="p-1 text-left text-sm font-semibold">
                    Vehicle Name
                  </th>
                  <th className="p-1 text-left text-sm font-semibold">Lot#</th>
                  <th className="p-1 text-left text-sm font-semibold">Year</th>

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
                    <td className="px-4 text-start text-gray-600">
                      {startIndex + index + 1}
                    </td>

                    <td
                      className="p-1 hover:cursor-pointer"
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
                        {vehicle.cityName || "--"}
                      </span>
                    </td>

                    <td className="p-1">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-700">
                          {vehicle?.VehicleCreatedAt
                            ? new Date(
                                vehicle.VehicleCreatedAt,
                              ).toLocaleDateString("en-GB")
                            : "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {vehicle?.VehicleCreatedAt
                            ? moment(vehicle.VehicleCreatedAt)
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
                      {vehicle.approval === "N" ? (
                        <span className="text-xs text-orange-500 bg-orange-100 rounded-full p-2 uppercase">
                          Pending
                        </span>
                      ) : vehicle.approval === "R" ? (
                        <span className="text-xs text-red-500 bg-red-50 rounded-full p-2 uppercase">
                          Reject
                        </span>
                      ) : (
                        ""
                      )}
                    </td>

                    <td className="p-1">
                      <div className="relative">
                        <button
                          ref={(el) => (buttonRefs.current[vehicle.id] = el)}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleActionMenu(vehicle.id, index);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-200 transition"
                          aria-label="Actions"
                          type="button"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>
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

      {/* Portal-based Dropdown Menu */}
      {actionMenuOpen && (
        <DropdownMenu
          vehicle={currentPageVehicles.find((v) => v.id === actionMenuOpen)}
          isOpen={true}
          position={dropdownPosition}
          onClose={() => setActionMenuOpen(null)}
          onEdit={(vehicle) => handleUpdateVehicle(vehicle, "edit")}
          onApprove={handleApprove}
          onAwaiting={handleAwaiting}
          onReject={handleReject}
          onViewDetails={handleViewDetails}
        />
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
