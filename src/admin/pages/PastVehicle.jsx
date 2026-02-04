import React, { useEffect, useState, useRef } from "react";
import { Search, CircleUser } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import Swal from "sweetalert2";
import CustomSearch from "../../CustomSearch";
import { useSelector } from "react-redux";
import moment from "moment";
import { UserDetailModal } from "../components/UserDetailModal/UserDetail";
import { ViewAdminCar } from "../../components/ViewAdminCar";

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
    fromDate: "",
    toDate: "",
  };
  const [dateRange, setDateRange] = useState(initialState);

  const handleGetAllUnapprovalVehicles = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/PastAuctionVehicleListbyDateRange/${currentUser.role}/${currentUser.id}?fromDate=${dateRange.fromDate}&toDate=${dateRange.toDate}`,
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
        `${BASE_URL}/admin/getUserDetailsApprovedVehicleListById/${id}`,
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

  const filteredVehicles = vehicles.filter((v) =>
    `${v.make} ${v.model} ${v.series} ${v.year} ${v.color} ${v.lot_number} ${v.cityName} `
      .toLowerCase()
      .includes(search.toLowerCase()),
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

      <div className="flex flex-col md:flex-row items-center justify-between mb-2">
        <div className="text-gray-800 mb-2 font-semibold  lg:text-2xl text-xl">
          Total Sold Vehicle: {totalItems}
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
                  {currentUser.role === "admin" && (
                    <>
                      <th className="p-1 text-left text-sm font-semibold">
                        Seller Name
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        Customer Name
                      </th>
                    </>
                  )}
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
                    Sold Price
                  </th>
                  <th className="p-1 text-left text-sm font-semibold">
                    Status
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
                      {(pageNo - 1) * itemsPerPage + index + 1}
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
                            handleIsOpen("customerdetail");
                            handleViewUserDetail(vehicle?.winnerUserId);
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
                              {vehicle.winnerUsername || "--"}
                            </span>
                          </div>
                        </td>
                      </>
                    )}

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
                          {vehicle?.endTime
                            ? new Date(vehicle?.endTime).toLocaleDateString(
                                "en-GB",
                              )
                            : "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {vehicle?.endTime
                            ? moment(vehicle?.endTime).local().format("hh:mm A")
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

                    {/* Reserve Price */}
                    <td className="p-1">
                      <span className="text-sm font-semibold text-gray-700">
                        PKR {vehicle?.winningBid}
                      </span>
                    </td>

                    <td className="p-1">
                      <span className="text-xs text-red-500 bg-red-50 rounded-full p-2 uppercase">
                        {vehicle?.saleStatus}
                      </span>
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

      {isViewModalOpen && (
        <ViewAdminCar
          handleClick={() => setIsViewModalOpen(false)}
          selectedVehicle={selectedVehicle}
          isViewModalOpen={isViewModalOpen}
        />
      )}
      {isOpen === "detail" && (
        <UserDetailModal
          isOpen={isOpen}
          closeModal={() => handleIsOpen("")}
          userDetail={userDetail}
        />
      )}

      {isOpen === "customerdetail" && (
        <UserDetailModal
          isOpen={isOpen}
          closeModal={() => handleIsOpen("")}
          userDetail={userDetail}
        />
      )}
    </div>
  );
};
