import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Clock,
  User,
  MoreVertical,
  Edit,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { BASE_URL } from "../../components/Contant/URL";
import { AddEvent } from "../../components/EventModal/AddEvent";
import { EditEvent } from "../../components/EventModal/EditEvent";
import { AddAssignEvent } from "../../components/AssignEventModal/AddAssignEvent";
import moment from "moment";
import { EditAssignEvent } from "../../components/AssignEventModal/EditAssignModal";
import Swal from "sweetalert2";
import { Reauction } from "../../components/AssignEventModal/ReAuctionModal";
import { ViewAdminCar } from "../../components/ViewAdminCar";
import { UserDetailModal } from "../components/UserDetailModal/UserDetail";

// Dropdown Menu Component using Portal
const DropdownMenu = ({
  bid,
  isOpen,
  position,
  onClose,
  onEdit,
  onReauction,
  onDelete,
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
          onEdit(bid);
        }}
        className="w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors rounded-t-lg"
        type="button"
      >
        <Edit size={14} className="text-blue-950" />
        Edit
      </button>

      <button
        disabled={bid?.saleStatus !== "Unsold"}
        onClick={(e) => {
          e.stopPropagation();
          if (bid?.saleStatus === "Unsold") {
            onReauction(bid);
          }
        }}
        className={`
          w-full px-4 py-2.5 text-sm text-left flex items-center gap-2 transition-colors
          ${
            bid?.saleStatus === "Unsold"
              ? "text-orange-600 hover:bg-gray-100 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          }
        `}
        type="button"
      >
        <RefreshCw
          size={14}
          className={
            bid?.saleStatus === "Unsold" ? "text-orange-500" : "text-gray-400"
          }
        />
        Re-Auction
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(bid);
        }}
        className="w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-gray-100 flex items-center gap-2 transition-colors rounded-b-lg"
        type="button"
      >
        <Trash2 size={14} className="text-red-500" />
        Delete
      </button>
    </div>,
    document.body,
  );
};

const initialState = {
  fromDate: "",
  toDate: "",
};

export const AssignEvent = () => {
  const { currentUser } = useSelector((state) => state?.auth);
  const [allBiders, setAllBiders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState("");
  const [dateRange, setDateRange] = useState(initialState);
  const [selectEvent, setSelectEvent] = useState(null);
  const [selectReauction, setSelectReauction] = useState(null);
  const [selectVehicle, setSelectVehicle] = useState(null);
  const [userDetail, setUSerDetail] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [statsRecords, setStatsRecords] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [cardsStats, setCardsStats] = useState(null);

  const buttonRefs = useRef({});
  const itemsPerPage = 10;

  const handleIsOpenModal = (option) => {
    setIsOpen((prev) => (prev == option ? "" : option));
  };

  const handleGetAssignEvent = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getAssignedEvents`, {
        params: {
          fromDate: dateRange.fromDate || undefined,
          toDate: dateRange.toDate || undefined,
        },
      });
      setAllBiders(res.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  const handleDeleteAssignEvent = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This event will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.delete(
        `${BASE_URL}/admin/deleteAssignedEvents/${id}`,
      );
      await Swal.fire({
        title: "Deleted!",
        text: "The event has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
      handleGetAssignEvent();
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: error?.response.data.message,
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  const handleGetStatsRecords = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getVehicleEventCounts`);
      console.log(" counts =>>>", res?.data);
      setCardsStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAssignEvent();
  }, [dateRange]);

  const toggleDropdown = (id, index) => {
    if (dropdownOpenId === id) {
      setDropdownOpenId(null);
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
    const dropdownHeight = 150; // Approximate height of dropdown

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
    setDropdownOpenId(id);
  };

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

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setDateRange((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSelectVehicleforReauction = async (vehicleId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getVehicleNameById/${vehicleId}`,
      );

      setSelectReauction(res.data);
    } catch (error) {
      console.log(error);
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

  // Close dropdown when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (dropdownOpenId) {
        setDropdownOpenId(null);
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [dropdownOpenId]);

  const handleEditClick = (bid) => {
    setDropdownOpenId(null);
    handleIsOpenModal("edit");
    setSelectEvent(bid);
  };

  const handleReauctionClick = (bid) => {
    setDropdownOpenId(null);
    handleIsOpenModal("reauction");
    handleSelectVehicleforReauction(bid?.vehicle_id);
  };

  const handleDeleteClick = (bid) => {
    setDropdownOpenId(null);
    handleDeleteAssignEvent(bid?.id);
  };

  useEffect(() => {
    handleGetStatsRecords();
  }, []);

  return (
    <div className="max-h-screen bg-gray-100 p-4 md:p-6 pb-20">
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex items-center justify-between mb-2">
          <h1 className="lg:text-3xl text-xl font-bold mb-2 text-gray-800 lg:text-start text-center">
            Assign Event
          </h1>

          <div className="md:grid md:grid-cols-3  hidden  gap-3">
            <div className="bg-white rounded-lg  p-3 border border-gray-300 lg:w-64 md:max-w-64 ">
              <p className="text-xs text-gray-600">Total Vehicle</p>
              <p className="text-lg font-bold text-gray-900">
                {cardsStats?.totalVehicles}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-300">
              <p className="text-xs text-gray-600">Vehicles Assign to Event</p>
              <p className="text-lg font-bold text-gray-900">
                {cardsStats?.vehicleAssigned}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-300">
              <p className="text-xs text-gray-600">Vehicle Not Assign </p>
              <p className="text-lg font-bold text-gray-900">
                {cardsStats?.vehicleNotAssigned}
              </p>
            </div>
          </div>

          <button
            className="py-2 px-2 text-white bg-blue-950 rounded hover:cursor-pointer hover:opacity-90"
            onClick={() => handleIsOpenModal("add")}
          >
            Assign Event
          </button>
        </div>

        <div className="grid md:grid-cols-3  md:hidden  gap-3">
          <div className="bg-white rounded-lg  p-3 border border-gray-300 ">
            <p className="text-xs text-gray-600">Total Vehicle</p>
            <p className="text-lg font-bold text-gray-900">{0}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-300">
            <p className="text-xs text-gray-600">Vehicles Assign to Event</p>
            <p className="text-lg font-bold text-gray-900">{0}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-300">
            <p className="text-xs text-gray-600">Vehicle Not Assign </p>
            <p className="text-lg font-bold text-gray-900">{0}</p>
          </div>
        </div>
        <div className="flex items-center md:justify-end justify-between my-2 gap-4">
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

        <div className="w-full bg-white rounded shadow-md border border-gray-600 mb-8">
          {/* Desktop Table View */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm table-fixed">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="p-3 text-left font-semibold">Sr</th>
                  <th className="p-1 text-left font-semibold">Date</th>
                  <th className="p-1 text-left font-semibold">Event Name</th>
                  <th className="p-1 text-left font-semibold">Seller Name</th>
                  <th className="p-1 text-left font-semibold">Vehicle Name</th>
                  <th className="p-1 text-left font-semibold">Lot#</th>
                  <th className="p-1 text-left font-semibold">Year</th>
                  <th className="p-1 text-left font-semibold">Time</th>
                  <th className="p-1 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="p-1 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {currentItems && currentItems.length > 0 ? (
                  currentItems.map((bid, index) => (
                    <tr
                      key={index}
                      className="transition duration-200 hover:bg-gray-50"
                    >
                      <td className="p-3">{startIndex + index + 1}</td>
                      <td className="p-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">
                            {bid?.eventDate &&
                              (() => {
                                const date = new Date(bid.eventDate);
                                const day = String(date.getDate()).padStart(
                                  2,
                                  "0",
                                );
                                const month = String(
                                  date.getMonth() + 1,
                                ).padStart(2, "0");
                                const year = date.getFullYear();
                                return `${day}-${month}-${year}`;
                              })()}
                          </span>
                        </div>
                      </td>

                      <td className="p-1 ">
                        <span className="inline-flex items-center text-sm capitalize">
                          {bid?.eventName}
                        </span>
                      </td>

                      <td
                        className="p-1 hover:cursor-pointer"
                        onClick={() => {
                          handleIsOpenModal("detail");
                          handleViewUserDetail(bid?.userId);
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <CircleUser
                            size={"30"}
                            style={{
                              color: "gray",
                            }}
                          />
                          <span className="text-sm text-gray-600 capitalize">
                            {bid?.userName || ""}
                          </span>
                        </div>
                      </td>

                      <td
                        className="p-1"
                        onClick={() => {
                          setSelectVehicle(bid);
                          handleIsOpenModal("view");
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer">
                            {bid?.images && bid?.images.length > 0 ? (
                              <img
                                src={bid?.images[0]}
                                alt={`${bid?.make} ${bid?.model}`}
                                className="h-full w-full object-cover rounded-full"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="cursor-pointer min-w-0">
                            <h2 className="text-sm font-bold text-gray-800 truncate">
                              {bid.make.charAt(0).toUpperCase() +
                                bid.make.slice(1)}{" "}
                              {bid?.model.charAt(0).toUpperCase() +
                                bid?.model.slice(1)}
                            </h2>
                            <p className="text-xs text-gray-500 truncate">
                              {bid?.series.charAt(0).toUpperCase() +
                                bid?.series.slice(1)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-1 ">
                        <span className="inline-flex items-center p-1 text-sm capitalize">
                          {bid?.lot_number}
                        </span>
                      </td>
                      <td className="p-1">
                        <span className="inline-flex items-center p-1 text-sm capitalize">
                          {bid?.year}
                        </span>
                      </td>

                      <td className="p-1">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-600">
                            {bid.startTime
                              ? moment(bid.startTime).local().format("hh:mm A")
                              : "--"}
                          </span>
                          <span className="text-xs text-gray-500">to</span>
                          <span className="text-xs text-gray-600">
                            {bid.endTime
                              ? moment(bid.endTime).local().format("hh:mm A")
                              : "--"}
                          </span>
                        </div>
                      </td>

                      <td className="p-1">
                        {bid?.saleStatus === "upcoming" ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Live
                          </span>
                        ) : bid?.saleStatus === "sold" ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Sold
                          </span>
                        ) : bid?.saleStatus === "Unsold" ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-500 rounded-full">
                            UnSold
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            Available
                          </span>
                        )}
                      </td>

                      <td className="p-1 relative">
                        <div className="flex justify-center">
                          <div className="relative">
                            <button
                              ref={(el) => (buttonRefs.current[bid.id] = el)}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(bid.id, index);
                              }}
                              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                              type="button"
                            >
                              <MoreVertical
                                size={18}
                                className="text-gray-600"
                              />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="12"
                      className="text-center py-10 text-gray-400 font-medium"
                    >
                      No Assign Event
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalItems > 0 && (
            <div className="border-t border-gray-200">
              <div className="p-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
                  <div className="text-center lg:text-left text-sm text-gray-600 order-2 lg:order-1">
                    Showing{" "}
                    <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{endIndex}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> entries
                  </div>

                  <div className="flex justify-center lg:justify-end order-1 lg:order-2 overflow-x-auto">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className={`px-2 py-1.5 rounded border border-gray-300 text-sm font-medium transition-colors ${
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
                        className={`px-2 py-1.5 rounded border border-gray-300 text-sm font-medium transition-colors ${
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
                          className={`px-2.5 py-1.5 rounded border border-gray-300 text-sm font-medium transition-colors ${
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
                        className={`px-2 py-1.5 rounded border border-gray-300 text-sm font-medium transition-colors ${
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
                        className={`px-2 py-1.5 rounded border border-gray-300 text-sm font-medium transition-colors ${
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
            </div>
          )}
        </div>

        {/* Portal-based Dropdown Menu */}
        {dropdownOpenId && (
          <DropdownMenu
            bid={currentItems.find((b) => b.id === dropdownOpenId)}
            isOpen={true}
            position={dropdownPosition}
            onClose={() => setDropdownOpenId(null)}
            onEdit={handleEditClick}
            onReauction={handleReauctionClick}
            onDelete={handleDeleteClick}
          />
        )}

        {/* Modals */}
        {isOpen === "add" && (
          <AddAssignEvent
            Open={isOpen}
            setOpen={() => handleIsOpenModal("")}
            handleGetAssignEvent={handleGetAssignEvent}
          />
        )}
        {isOpen === "edit" && (
          <EditAssignEvent
            Open={isOpen}
            setOpen={() => handleIsOpenModal("")}
            selectEvent={selectEvent}
            handleGetAssignEvent={handleGetAssignEvent}
          />
        )}

        {isOpen === "view" && (
          <ViewAdminCar
            handleClick={() => handleIsOpenModal("")}
            selectedVehicle={selectVehicle}
            isViewModalOpen={isOpen}
          />
        )}

        {isOpen === "reauction" && (
          <Reauction
            Open={isOpen}
            setOpen={() => handleIsOpenModal("")}
            handleGetAssignEvent={handleGetAssignEvent}
            selectReauction={selectReauction}
          />
        )}

        {isOpen === "detail" && (
          <UserDetailModal
            isOpen={isOpen}
            closeModal={() => handleIsOpenModal("")}
            userDetail={userDetail}
          />
        )}
      </div>
    </div>
  );
};
