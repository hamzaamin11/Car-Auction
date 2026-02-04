import React, { useEffect, useState } from "react";
import {
  MdArrowBack,
  MdEdit,
  MdBlock,
  MdCheckCircle,
  MdStar,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdCalendarToday,
  MdAttachMoney,
  MdDirectionsCar,
  MdSell,
  MdReviews,
  MdBarChart,
  MdWarning,
  MdPerson,
  MdVerified,
  MdAccessTime,
  MdTrendingUp,
  MdTrendingDown,
  MdClose,
} from "react-icons/md";
import {
  FaUserTag,
  FaCar,
  FaRegStar,
  FaStarHalfAlt,
  FaStar,
  FaMoneyBillAlt,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import { useSelector } from "react-redux";
import { CircleUser } from "lucide-react";
import moment from "moment";
import { ViewAdminCar } from "../../components/ViewAdminCar";
import { UserDetailModal } from "../components/UserDetailModal/UserDetail";

const SellerDetailsModal = ({ isOpen, onClose, sellerId }) => {
  const { currentUser } = useSelector((state) => state?.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [sellerDetails, setSellerDetails] = useState(null);
  const [totalVehicles, setTotalVehicles] = useState([]);
  const [soldVehicles, setSoldVehicles] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [allCommission, getAllCommission] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState("");
  const [selectVehicle, setSelectVehicle] = useState(null);
  const [userDetail, setUSerDetail] = useState(null);
  console.log("vehicles total data ->", selectVehicle);

  const handleSellerId = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getUsersById/${sellerId}`);
      console.log(res.data);
      setSellerDetails(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTotalVehicles = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getVehiclesByUserbyDateRange/${sellerId}`,
      );

      setTotalVehicles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIsOpenToggle = (active) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };
  const handleViewDetails = (vehicle) => {
    setSelectVehicle(vehicle);
    setIsOpenModal("view");
  };

  const handleTotalSoldVehicles = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/PastAuctionVehicleListbyDateRange/${"seller"}/${sellerId}`,
      );
      setSoldVehicles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAccountLists = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getSellerLedger?sellerId=${sellerId}`,
      );

      setAllAccounts(res.data);
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

  const handleGetCommissionList = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getCommissionAmountListBySeller?sellerId=${sellerId}`,
      );
      getAllCommission(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) return null;

  useEffect(() => {
    handleSellerId();
    handleTotalVehicles();
    handleTotalSoldVehicles();
    handleGetAccountLists();
    handleGetCommissionList();
  }, []);
  // Sample seller data
  const sellerData = {
    name: "John Smith",
    role: "Premium Seller",
    rating: 4.7,
    totalReviews: 128,
    joinDate: "2022-05-15",
    location: "New York, USA",
    contact: "+1 (555) 123-4567",
    email: "john.smith@example.com",
    status: "active",
    totalVehicles: 24,
    soldVehicles: 18,
    pendingVehicles: 7,
    totalRevenue: "$245,850",
    avgRating: 4.5,
    responseRate: "98%",
    avgResponseTime: "2 hours",
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <MdPerson />, count: null },
    {
      id: "vehicles",
      label: "Total Vehicles",
      icon: <MdDirectionsCar />,
      count: totalVehicles.length,
    },
    {
      id: "sold",
      label: "Sold Vehicles",
      icon: <MdSell />,
      count: soldVehicles?.length,
    },
    {
      id: "accounts",
      label: "Accounts",
      icon: <FaMoneyBillAlt />,
      count: allAccounts?.length,
    },
    {
      id: "commission",
      label: "Commission",
      icon: <MdBarChart />,
      count: allCommission?.length,
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return dateString.slice(0, 10).split("-").reverse().join("-");
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === "")
      return "0 PKR";
    const num = parseFloat(amount);
    return isNaN(num) ? "0 PKR" : `${num.toLocaleString()} PKR`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <InfoField
                    label="Full Name"
                    value={sellerDetails?.name}
                    icon={<MdPerson />}
                  />
                  <InfoField
                    label="Contact Number"
                    value={sellerDetails?.contact}
                    icon={<MdPhone />}
                  />
                  <InfoField
                    label="Email Address"
                    value={sellerDetails?.email}
                    icon={<MdEmail />}
                  />
                </div>
                <div className="space-y-4">
                  <InfoField
                    label="Location"
                    value={sellerDetails?.location || "Nil"}
                    icon={<MdLocationOn />}
                  />
                  <InfoField
                    label="Member Since"
                    value={new Date(sellerDetails?.date).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                    icon={<MdCalendarToday />}
                  />
                  <InfoField
                    label="Account Status"
                    value={
                      <span
                        className={`inline-flex items-center gap-1 ${
                          sellerData.status === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {sellerData.status === "active" ? (
                          <MdCheckCircle />
                        ) : (
                          <MdWarning />
                        )}
                        {sellerData.status.charAt(0).toUpperCase() +
                          sellerData.status.slice(1)}
                      </span>
                    }
                    icon={<MdVerified />}
                  />
                </div>
              </div>
            </div>{" "}
          </div>
        );

      case "vehicles":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    All Vehicles ({totalVehicles.length})
                  </h3>
                </div>
              </div>
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
                        Color
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        City
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        Date / Time
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        Reserve Price
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y border-gray-600 border-b">
                    {totalVehicles?.map((vehicle, index) => (
                      <tr
                        key={vehicle.newVehicleId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Serial Number */}
                        <td className="p-3 text-start text-gray-600">
                          {index + 1}
                        </td>

                        {/* Vehicle with Image and Details */}
                        <td className="p-1">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                              onClick={() => handleViewDetails(vehicle)}
                            >
                              <img
                                src={vehicle.images?.[0]}
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
                                {vehicle.make} {vehicle.model}
                              </h2>
                              <p className="text-xs text-gray-500 truncate">
                                {vehicle.series?.charAt(0)?.toUpperCase() +
                                  vehicle.series?.slice(1) || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Lot Number */}
                        <td className="p-1">
                          <span className="text-sm text-gray-600">
                            {vehicle.lot_number || "—"}
                          </span>
                        </td>

                        {/* Year */}
                        <td className="p-1">
                          <span className="text-sm text-gray-600">
                            {vehicle.year || "—"}
                          </span>
                        </td>

                        {/* Fuel Type */}
                        <td className="p-1">
                          <span className="text-sm text-gray-600 ">
                            {vehicle.fuelType?.charAt(0)?.toUpperCase() +
                              vehicle.fuelType?.slice(1) || "—"}
                          </span>
                        </td>

                        {/* Color */}
                        <td className="p-1">
                          <span className="text-sm text-gray-600">
                            {vehicle.color?.charAt(0)?.toUpperCase() +
                              vehicle.color?.slice(1) || "—"}
                          </span>
                        </td>

                        {/* City */}
                        <td className="p-1">
                          <span className="text-sm text-gray-600">
                            {vehicle.cityName || "—"}
                          </span>
                        </td>

                        {/* Date/Time */}
                        <td className="p-1 text-gray-700">
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {vehicle?.createdAt
                                ? new Date(
                                    vehicle?.createdAt,
                                  ).toLocaleDateString("en-GB")
                                : "N/A"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {vehicle?.createdAt
                                ? new Date(
                                    vehicle?.createdAt,
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                : "--"}
                            </span>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="p-1">
                          <span className="text-sm font-semibold text-gray-700">
                            PKR {vehicle.buyNowPrice || "—"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-1">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              vehicle.approval === "Y"
                                ? "bg-green-100 text-green-800"
                                : vehicle.approval === "P"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : vehicle.approval === "R"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {vehicle.approval === "Y"
                              ? "Approved"
                              : vehicle.approval === "P"
                                ? "Pending"
                                : vehicle.approval === "R"
                                  ? "Reject"
                                  : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {isOpenModal === "view" && (
                <ViewAdminCar
                  handleClick={() => handleIsOpenToggle("")}
                  selectedVehicle={selectVehicle}
                  isViewModalOpen={isOpenModal}
                />
              )}
            </div>
          </div>
        );

      case "sold":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    All Vehicles ({soldVehicles?.length})
                  </h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border overflow-hidden">
                  <thead className="bg-blue-950 text-white">
                    <tr>
                      <th className="p-3 text-start text-sm font-semibold">
                        Sr
                      </th>
                      {currentUser.role === "admin" && (
                        <>
                          <th className="p-1 text-left text-sm font-semibold">
                            Customer Name
                          </th>
                        </>
                      )}
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
                        Color
                      </th>
                      <th className="p-1 text-left text-sm font-semibold">
                        City
                      </th>

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
                    {soldVehicles?.map((vehicle, index) => (
                      <tr
                        key={vehicle.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Serial Number */}
                        <td className="p-3 text-start text-gray-600">
                          {index + 1}
                        </td>
                        {currentUser.role === "admin" && (
                          <>
                            <td
                              className="hover:cursor-pointer"
                              onClick={() => {
                                handleIsOpenToggle("detail");
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
                                    vehicle?.VehicleCreatedAt,
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
            </div>
            {isOpenModal === "view" && (
              <ViewAdminCar
                handleClick={() => handleIsOpenToggle("")}
                selectedVehicle={selectVehicle}
                isViewModalOpen={isOpenModal}
              />
            )}

            {isOpenModal === "detail" && (
              <UserDetailModal
                isOpen={isOpenModal}
                closeModal={() => handleIsOpenToggle("")}
                userDetail={userDetail}
              />
            )}
          </div>
        );

      case "accounts":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Account List ({allAccounts?.length})
              </h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden"></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-950 text-white">
                  <tr>
                    <th className="p-3 text-left">Sr#</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Transaction No</th>
                    <th className="p-3 text-left">Debit</th>
                    <th className="p-3 text-left">Credit</th>
                    <th className="p-3 text-left">Pre Balance</th>
                    <th className="p-3 text-left">Net Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {allAccounts?.map((c, i) => (
                    <tr
                      key={c.id || i}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-gray-600">{i + 1}</td>
                      <td className="p-3 text-gray-700">
                        {formatDate(c.date)}
                      </td>
                      <td className="p-3 text-gray-700 font-medium">
                        {c.transactionNo || "N/A"}
                      </td>
                      <td className="p-3 text-red-600 font-medium">
                        {formatCurrency(c.debit)}
                      </td>
                      <td className="p-3 text-green-600 font-medium">
                        {formatCurrency(c.credit)}
                      </td>
                      <td className="p-3 text-gray-700">
                        {formatCurrency(c.preBalance)}
                      </td>
                      <td
                        className={`p-3 font-semibold ${
                          parseFloat(c.netBalance || 0) > 0
                            ? "text-green-700"
                            : parseFloat(c.netBalance || 0) < 0
                              ? "text-red-700"
                              : "text-gray-700"
                        }`}
                      >
                        {formatCurrency(c.netBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "commission":
        return (
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Commission List ({allCommission?.length})
              </h3>
            </div>

            <div className="hidden md:block">
              <table className="w-full bg-white shadow rounded-lg overflow-hidden text-sm">
                <thead className="bg-blue-950 text-white">
                  <tr>
                    <th className="p-3 text-left">Sr#</th>
                    <th className="p-1 text-left">Customer Name</th>
                    <th className="p-1 text-left">Seller Name</th>
                    <th className="p-1 text-left">Vehicle Name</th>
                    <th className="p-1 text-left">Lot#</th>
                    <th className="p-1  text-left">Year</th>
                    <th className="p-1 text-left">City</th>
                    <th className="p-1  text-left">Date </th>
                    <th className="p-1  text-left">Sold Price </th>
                    <th className="p-1  text-left">Commission %</th>
                    <th className="p-1 text-left">Commission Acc</th>
                  </tr>
                </thead>

                <tbody>
                  {allCommission?.length > 0 ? (
                    allCommission?.map((c, i) => (
                      <tr
                        key={c.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        {/* Serial Number */}
                        <td className="p-3 text-gray-600">{i + 1}</td>

                        <td
                          className="hover:cursor-pointer"
                          onClick={() => {
                            handleIsOpenToggle("detail");
                            handleViewUserDetail(c?.customerId);
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
                              {c?.customerName}
                            </span>
                          </div>
                        </td>

                        <td
                          className="hover:cursor-pointer"
                          onClick={() => {
                            handleIsOpenToggle("detail");
                            handleViewUserDetail(c?.sellerId);
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
                              {c?.sellerName}
                            </span>
                          </div>
                        </td>

                        {/* Vehicle with Image */}
                        <td
                          onClick={() => handleViewDetails(c)}
                          className="p-1"
                        >
                          <div className="flex items-center gap-3">
                            {/* Vehicle Image */}
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                              {c.images ? (
                                <img
                                  src={c.images[0]}
                                  alt={c.vehicleName || "Vehicle"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Vehicle Name and Details */}
                            <div className="cursor-pointer min-w-0">
                              <h2 className="text-sm font-bold text-gray-800 truncate">
                                {c.make.charAt(0).toUpperCase() +
                                  c.make.slice(1)}{" "}
                                {c.model.charAt(0).toUpperCase() +
                                  c.model.slice(1)}
                              </h2>
                              <p className="text-xs text-gray-500 truncate">
                                {c.series.charAt(0).toUpperCase() +
                                  c.series.slice(1)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-1 ">
                          <span className="text-gray-700">{c?.lotNumber}</span>
                        </td>
                        <td className="p-1 ">
                          <span className="text-gray-700">{c?.year}</span>
                        </td>
                        <td className="p-1 ">
                          <span className="text-gray-700">{c?.cityName}</span>
                        </td>
                        {/* Date */}
                        <td className="p-1">
                          <span className="text-gray-700">
                            {c.date.slice(0, 10).split("-").reverse().join("-")}
                          </span>
                        </td>

                        <td className="p-1">
                          <span className="text-gray-700">
                            {c.soldAmount
                              ? `${c.soldAmount.toLocaleString()} PKR`
                              : "0 PKR"}
                          </span>
                        </td>

                        {/* Debit */}
                        <td className="p-1 ">
                          <span className="text-red-600 font-medium">
                            {c?.commission_percent
                              ? `${c?.commission_percent?.toLocaleString()} PKR`
                              : "0 PKR"}
                          </span>
                        </td>

                        {/* Credit */}
                        <td className="p-1 ">
                          <span className="text-green-600 font-medium">
                            {c?.commission_amount
                              ? `${c?.commission_amount?.toLocaleString()} PKR`
                              : "0 PKR"}
                          </span>
                        </td>

                        {/* Balance */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="12"
                        className="py-8 text-center text-gray-400"
                      >
                        No Accounts Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {isOpenModal === "view" && (
              <ViewAdminCar
                handleClick={() => handleIsOpenToggle("")}
                selectedVehicle={selectVehicle}
                isViewModalOpen={isOpenModal}
              />
            )}

            {isOpenModal === "detail" && (
              <UserDetailModal
                isOpen={isOpenModal}
                closeModal={() => handleIsOpenToggle("")}
                userDetail={userDetail}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] ">
        <div className=" flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-900 text-white p-4 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <MdClose size={24} />
              </button>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Seller Details
                  </h1>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)] p-6">
              {/* Seller Summary Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 bg-gradient-to-br from-blue-900 to-blue-950 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      <img
                        className="object-cover rounded-full max-h-full w-full"
                        src={sellerDetails?.image}
                        alt={sellerDetails?.name}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 capitalize">
                          {sellerDetails?.name}
                        </h2>
                        <div className="flex items-center gap-3 mt-2 capitalize">
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">
                            <FaUserTag />
                            {sellerDetails?.role}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">
                            {totalVehicles.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Vehicles
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {soldVehicles?.length}
                          </div>
                          <div className="text-sm text-gray-600">Sold</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {allAccounts?.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            Account List
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-950">
                            {allCommission?.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            Commission List
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden shadow-sm">
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-blue-900 text-blue-900 bg-blue-50"
                          : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {tab.icon}
                      <span className="font-medium">{tab.label}</span>
                      {tab.count !== null && (
                        <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Reusable Components
const InfoField = ({ label, value, icon }) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <div className="flex items-center gap-2">
      {icon}
      <p className="text-gray-800 font-medium capitalize">{value}</p>
    </div>
  </div>
);

export default SellerDetailsModal;
