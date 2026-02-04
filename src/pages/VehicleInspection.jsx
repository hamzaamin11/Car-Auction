import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../components/Contant/URL";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { ViewAdminCar } from "../components/ViewAdminCar";
import Swal from "sweetalert2";
import { AdminAddBid } from "../components/AdminAddBidComponent/AdminAddBid";
import CarSelector from "../components/CarSelector";
import CustomAdd from "../CustomAdd";
import CustomSearch from "../CustomSearch";
import {
  addMake,
  addModel,
  addSeries,
  addYear,
} from "../components/Redux/SelectorCarSlice";
import Select from "react-select";
import Dropdown from "../Dropdown";
import { InspectionDoc } from "../admin/components/InspectionModal/InspectionDoc";

const VehicleInspection = () => {
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";
  const { currentUser } = useSelector((state) => state?.auth);
  const [isSellerBidModalOpen, setIsSellerBidModalOpen] = useState(false);
  const [sellerBidData, setSellerBidData] = useState(null);
  const [isCustomerBidModalOpen, setIsCustomerBidModalOpen] = useState(false);
  const [customerBidData, setCustomerBidData] = useState({
    userId: "",
    vehicleId: "",
    maxBid: "",
    monsterBid: "",
  });

  const initialFields = {
    userId: currentUser?.id,
    year: "",
    make: "",
    model: "",
    series: "",
    bodyStyle: "",
    transmission: "Automatic",
    driveType: "fwd",
    fuelType: "petrol",
    color: "",
    mileage: "",
    vehicleCondition: "new",
    locationId: "",
    buyNowPrice: "",
    certifyStatus: "",
    image: [],
  };

  const currentDate = new Date().toISOString().split("T")[0];

  const initialState = {
    fromDate: "",
    toDate: "",
  };

  const [vehicleData, setVehicleData] = useState(initialFields);
  const selected = useSelector((state) => state.carSelector);
  const [vehicles, setVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [selectVehicle, setSelectVehicle] = useState();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);
  const [preview, setPreview] = useState([]);
  const [isOpen, setIsOpen] = useState("");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState(initialState);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage, setCarsPerPage] = useState(10);
  const [allCities, setAllCities] = useState([]);
  const dispatch = useDispatch();
  const [selectedCount, setSelectedCount] = useState(0);
  const [price, setPrice] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (editId) {
      if (files.length > 5) {
        Swal.fire({
          title: "Limit Exceeded",
          text: "You can add a maximum of 5 new images in edit mode.",
          icon: "warning",
          confirmButtonColor: "#9333ea",
        });
        return;
      }
      setVehicleData((prev) => ({
        ...prev,
        image: [...(prev.image || []), ...files],
      }));
      setSelectedCount(files.length);
    } else {
      const currentImageCount = vehicleData.image.length;
      if (currentImageCount + files.length > 5) {
        Swal.fire({
          title: "Limit Exceeded",
          text: "You can add a maximum of 5 images.",
          icon: "warning",
          confirmButtonColor: "#9333ea",
        });
        return;
      }
      setVehicleData((prev) => ({
        ...prev,
        image: [...prev.image, ...files],
      }));
      setSelectedCount(currentImageCount + files.length);
    }

    const Newpreviews = files.map((file) => URL.createObjectURL(file));
    setPreview([...preview, Newpreviews]);
    e.target.value = null;
  };

  const handleGetAllCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`);
      setAllCities(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setDateRange((prevState) => ({ ...prevState, [name]: value }));
  };

  const totalPages = Math.ceil(allVehicles.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = Math.min(startIndex + carsPerPage, allVehicles.length);
  const currentCars = allVehicles.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    handleGetAllCities();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      setVehicleData((prev) => ({ ...prev, userId: currentUser.id }));
    }
  }, [user]);

  const handleGetAllVehicleById = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getVehiclesByUserInspectionbyDateRange/${
          currentUser?.id
        }/${currentUser?.role}?fromDate=${dateRange.fromDate}&toDate=${
          dateRange.toDate
        }&search=${search}&Entry=${10}&page=${pageNo}`,
      );
      setAllVehicles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllVehicleById();
  }, [search, pageNo, dateRange]);

  useEffect(() => {
    if (formOpen && currentUser?.city && allCities.length > 0) {
      const userCity = allCities.find(
        (city) =>
          city.cityName.toLowerCase() === currentUser.city.toLowerCase(),
      );

      if (userCity) {
        setVehicleData((prev) => ({
          ...prev,
          locationId: userCity.id.toString(),
        }));
      }
    }
  }, [formOpen, currentUser?.city, allCities]);

  const handleIsOpenToggle = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleDelete = async (vehicleId, approval) => {
    if (approval === "Y") {
      await Swal.fire({
        title: "Cannot Delete Vehicle",
        text: "Your vehicle is approved now, you cannot delete it.",
        icon: "error",
        confirmButtonColor: "#9333ea",
        confirmButtonText: "OK",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This vehicle will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${BASE_URL}/seller/deleteVehicle/${vehicleId}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to delete vehicle");

      await Swal.fire({
        title: "Deleted!",
        text: "Vehicle has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });

      handleGetAllVehicleById();
    } catch (err) {
      await Swal.fire({
        title: "Error",
        text: err.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  const handleEndBidding = async (bidId) => {
    handleIsOpenToggle("bid");
    try {
      const res = await fetch(`${BASE_URL}/seller/endBidding/${bidId}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to end bidding");
      alert(`Bidding ended for bid ID: ${bidId}`);
    } catch (err) {
      console.error("End bidding error:", err);
      alert("Error: " + err.message);
    }
  };

  const toggleDropdown = (vehicleId, e) => {
    if (e) {
      e.stopPropagation();

      // Calculate dropdown position
      const buttonElement = buttonRefs.current[vehicleId];
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect();

        // Check if dropdown should open above or below
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const dropdownHeight = isCustomer ? 50 : 250; // Approximate dropdown height

        if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
          // Open above
          setDropdownPosition({
            top: rect.top - dropdownHeight,
            left: rect.right - 192, // 192 = dropdown width (48 * 4)
          });
        } else {
          // Open below
          setDropdownPosition({
            top: rect.bottom,
            left: rect.right - 192,
          });
        }
      }
    }

    setIsDropdownOpen((prev) => (prev === vehicleId ? null : vehicleId));
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(null);
  };

  const handleUploadDocs = (e, vehicle) => {
    e.stopPropagation();
    if (
      !(
        vehicle?.inspectionStatus === "approved" ||
        vehicle?.inspectionStatus === "rejected"
      )
    ) {
      setSelectVehicle(vehicle);
      handleIsOpenToggle("inspection");
    }
    setIsDropdownOpen(null);
  };

  const handleViewVehicle = (e, vehicle) => {
    e.stopPropagation();
    setSelectVehicle(vehicle);
    handleIsOpenToggle("View");
    setIsDropdownOpen(null);
  };

  const handleBidAdded = (e, vehicle) => {
    e.stopPropagation();
    if (vehicle.bidId) {
      handleEndBidding(vehicle.bidId);
      handleIsOpenToggle("bid");
    }
    setIsDropdownOpen(null);
  };

  const handleRejectVehicle = (e, vehicle) => {
    e.stopPropagation();
    console.log("Reject vehicle:", vehicle.newVehicleId);
    setIsDropdownOpen(null);
  };

  const handleDeleteVehicle = (e, vehicle) => {
    e.stopPropagation();
    handleDelete(vehicle.newVehicleId, vehicle.approval);
    setIsDropdownOpen(null);
  };

  const handleCreateBid = (e, vehicle) => {
    e.stopPropagation();
    setCustomerBidData({
      userId: user?.id,
      vehicleId: vehicle.id,
      maxBid: "",
      monsterBid: "",
    });
    setIsCustomerBidModalOpen(true);
    setIsDropdownOpen(null);
  };

  return (
    <div
      className="max-h-screen lg:p-6 px-2 bg-gradient-to-br from-gray-100 to-blue-50 relative"
      onClick={handleDropdownClose}
    >
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="lg:text-3xl text-xl font-bold text-gray-800 p-3">
            Inspection Vehicle List
          </h1>
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </span>
            <CustomSearch
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="flex items-center md:justify-end justify-between gap-4">
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

        <section
          className="lg:mt-6 pb-10 relative"
          style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-center text-indigo-900 font-semibold">
                Loading vehicles...
              </p>
            </div>
          ) : currentCars.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-center text-gray-600">No vehicles found.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-blue-950 text-white">
                      <tr>
                        <th className="p-3 text-start text-sm font-semibold">
                          Sr
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Vehicle Name
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Lot#
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Year
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Fuel Type
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          City
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Reserve Price
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Inspection Status
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y border-gray-600 border-b">
                      {currentCars?.map((vehicle, index) => (
                        <tr
                          key={vehicle.newVehicleId}
                          className="hover:bg-gray-50 transition-colors relative"
                        >
                          <td className="p-3 text-start text-gray-600">
                            {startIndex + index + 1}
                          </td>

                          <td className="p-1">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                                onClick={() => {
                                  setSelectVehicle(vehicle);
                                  handleIsOpenToggle("View");
                                }}
                              >
                                <img
                                  src={
                                    vehicle.images?.[0] || "/placeholder.jpg"
                                  }
                                  alt={`${vehicle.make} ${vehicle.model}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div
                                className="cursor-pointer min-w-0"
                                onClick={() => {
                                  setSelectVehicle(vehicle);
                                  handleIsOpenToggle("View");
                                }}
                              >
                                <h2 className="text-sm font-bold text-gray-800 truncate">
                                  {vehicle.make || "—"} {vehicle.model || "—"}
                                </h2>
                                <p className="text-sm text-gray-500 truncate">
                                  {vehicle.series?.charAt(0)?.toUpperCase() +
                                    vehicle.series?.slice(1) || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-1">
                            <span className="text-sm">
                              {vehicle.lot_number || "—"}
                            </span>
                          </td>

                          <td className="p-1">
                            <span className="text-sm">
                              {vehicle.year || "—"}
                            </span>
                          </td>

                          <td className="p-1">
                            <span className="text-sm">
                              {vehicle.fuelType?.charAt(0)?.toUpperCase() +
                                vehicle.fuelType?.slice(1) || "—"}
                            </span>
                          </td>

                          <td className="p-1">
                            <span className="text-sm">
                              {vehicle.cityName?.charAt(0)?.toUpperCase() +
                                vehicle.cityName?.slice(1) || "—"}
                            </span>
                          </td>

                          <td className="p-1">
                            <span className="text-sm">
                              PKR {vehicle.buyNowPrice?.toLocaleString() || "—"}
                            </span>
                          </td>

                          <td className="p-1">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  vehicle.approval === "Y"
                                    ? "bg-green-100 text-green-800"
                                    : vehicle.approval === "P"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {vehicle.approval === "Y"
                                  ? "Approved"
                                  : vehicle.approval === "P"
                                    ? "Pending"
                                    : "Rejected"}
                              </span>
                              <span
                                className={`text-xs text-center rounded px-2 py-1 ${
                                  vehicle.inspectionStatus === "approved"
                                    ? "bg-green-500 text-white"
                                    : vehicle.inspectionStatus === "pending"
                                      ? "bg-yellow-500 text-white"
                                      : "bg-red-500 text-white"
                                }`}
                              >
                                {vehicle.inspectionStatus === "approved"
                                  ? "Docs Approved"
                                  : vehicle.inspectionStatus === "pending"
                                    ? "Docs Pending"
                                    : "Docs Required"}
                              </span>
                            </div>
                          </td>

                          <td className="p-1">
                            <div className="relative">
                              <button
                                ref={(el) => {
                                  if (el) {
                                    buttonRefs.current[vehicle.newVehicleId] =
                                      el;
                                  }
                                }}
                                onClick={(e) =>
                                  toggleDropdown(vehicle.newVehicleId, e)
                                }
                                className="p-2 rounded-full hover:bg-gray-200 transition"
                              >
                                <BsThreeDotsVertical className="h-5 w-5 text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {currentCars.length > 0 && (
                  <div className="bg-white shadow-sm p-4 mt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
                      <div className="text-gray-600">
                        Showing{" "}
                        <span className="font-medium">
                          {startIndex + 1} to {endIndex}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {allVehicles.length}
                        </span>{" "}
                        entries
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setCurrentPage(1);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded border ${
                            currentPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {"<<"}
                        </button>

                        <button
                          onClick={goToPrevPage}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded border ${
                            currentPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {"<"}
                        </button>

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2)
                              pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;

                            return (
                              <button
                                key={pageNum}
                                onClick={() => {
                                  setCurrentPage(pageNum);
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                }}
                                className={`px-3 py-1 rounded border ${
                                  currentPage === pageNum
                                    ? "bg-blue-950 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          },
                        )}

                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded border ${
                            currentPage === totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {">"}
                        </button>

                        <button
                          onClick={() => {
                            setCurrentPage(totalPages);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded border ${
                            currentPage === totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {">>"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Global Dropdown - Table container se bahar */}
      {isDropdownOpen && (
        <div
          className="fixed w-48 bg-white border rounded-lg shadow-xl z-[9999]"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {currentCars
            .filter((vehicle) => vehicle.newVehicleId === isDropdownOpen)
            .map((vehicle) => (
              <div key={vehicle.newVehicleId}>
                {!isCustomer ? (
                  <>
                    <button
                      onClick={(e) => handleUploadDocs(e, vehicle)}
                      disabled={
                        vehicle?.inspectionStatus === "approved" ||
                        vehicle?.inspectionStatus === "rejected"
                      }
                      className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 rounded-t-lg ${
                        vehicle?.inspectionStatus === "approved" ||
                        vehicle?.inspectionStatus === "rejected"
                          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                          : "text-yellow-600 hover:bg-yellow-100"
                      }`}
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
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Upload Docs
                    </button>

                    {vehicle.bidId ? (
                      <button
                        onClick={(e) => handleBidAdded(e, vehicle)}
                        className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left flex items-center gap-2"
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Bid Added
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleViewVehicle(e, vehicle)}
                        className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 text-left flex items-center gap-2"
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
                        View Vehicle
                      </button>
                    )}

                    {vehicle.approval !== "N" && (
                      <button
                        onClick={(e) => handleRejectVehicle(e, vehicle)}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left flex items-center gap-2"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Reject Vehicle
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDeleteVehicle(e, vehicle)}
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
                  </>
                ) : (
                  <button
                    onClick={(e) => handleCreateBid(e, vehicle)}
                    className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 text-left flex items-center gap-2 rounded-lg"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Bid
                  </button>
                )}
              </div>
            ))}
        </div>
      )}

      {isOpen === "View" && (
        <ViewAdminCar
          handleClick={handleIsOpenToggle}
          selectedVehicle={selectVehicle}
          isViewModalOpen={selectVehicle}
        />
      )}
      {isOpen === "bid" && (
        <AdminAddBid
          selectedVehicle={sellerBidData}
          setIsOpenBid={setIsOpen}
          getAllVehicles={handleGetAllVehicleById}
        />
      )}

      {isOpen === "inspection" && (
        <InspectionDoc
          handleIsOpenToggle={handleIsOpenToggle}
          selectedVehicle={selectVehicle}
        />
      )}
    </div>
  );
};

export default VehicleInspection;
