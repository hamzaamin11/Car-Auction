import React, { useEffect, useState, useRef } from "react";
import { MoreVertical, X, ChevronLeft, ChevronRight,Search } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import Swal from "sweetalert2";

export const VehicleApproval = () => {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [search, setSearch] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const menuRef = useRef(null);

  const handleGetAllUnapprovalVehicles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getUnApprovedVehicles`);
      console.log(res.data);
      setVehicles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleActionMenu = (id) => {
    setActionMenuOpen((prev) => (prev === id ? null : id));
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

  const handleReject = (vehicle) => {
    alert(`${vehicle.make} ${vehicle.model} has been rejected ❌`);
    setActionMenuOpen(null);
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

  useEffect(() => {
    handleGetAllUnapprovalVehicles();
  }, []);

  return (
   <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800 text-center">
          Pending Vehicle Approvals
        </h2>

        <div className="relative w-full sm:w-80 mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search by Car Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-5 w-5" /> {/* Replaced 🔍 with Search icon */}
          </span>
        </div>
      </div>

      {filteredVehicles.length > 0 ? (
        <div className="space-y-4">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id}>
              <div className="hidden lg:flex flex-col md:flex-row items-start md:items-center justify-between border rounded-lg bg-white hover:shadow-md transition-all duration-200 p-4 gap-4 relative">
                <div className="w-full md:w-48 h-32 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                  {vehicle.images?.length > 0 ? (
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 md:px-4">
                  <h2 className="text-lg font-bold text-gray-800">
                    {vehicle.make} {vehicle.model} {vehicle.series}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {vehicle.year} | {vehicle.fuelType} | {vehicle.transmission} |{" "}
                    {vehicle.mileage} KM | {vehicle.color} | {vehicle.cityName}
                  </p>
                  <p className="text-md font-semibold text-blue-700 mt-1">
                    PKR {vehicle.buyNowPrice}
                  </p>
                </div>

                <div className="relative">
                  <button
                    onClick={() => toggleActionMenu(vehicle.id)}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>

                  {actionMenuOpen === vehicle.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => handleApprove(vehicle)}
                        className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left rounded-t-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(vehicle)}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleViewDetails(vehicle)}
                        className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 text-left rounded-b-lg"
                      >
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:hidden border-b py-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                        No Img
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-gray-800">
                      {vehicle.make} {vehicle.model} {vehicle.series}
                    </h2>
                    <p className="text-xs text-gray-700 font-semibold">
                      PKR {vehicle.buyNowPrice}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vehicle.year} | {vehicle.fuelType} | {vehicle.transmission}{" "}
                      | {vehicle.mileage} KM | {vehicle.color} |{" "}
                      {vehicle.cityName}
                    </p>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => toggleActionMenu(vehicle.id)}
                      className="p-2 rounded-full hover:bg-gray-200 transition"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>
                    {actionMenuOpen === vehicle.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleApprove(vehicle)}
                          className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left rounded-t-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(vehicle)}
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleViewDetails(vehicle)}
                          className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 text-left rounded-b-lg"
                        >
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">
          No vehicles pending approval.
        </p>
      )}

      {isViewModalOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blur-md backdrop-blur-md p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
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
                      <p className="text-sm font-bold text-gray-900">Location:</p>
                      <p className="text-base text-gray-900">{selectedVehicle.cityName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Make:</p>
                      <p className="text-base text-gray-900">{selectedVehicle.make || "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Model:</p>
                      <p className="text-base text-gray-900">{selectedVehicle.model || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Series:</p>
                      <p className="text-base text-gray-900">{selectedVehicle.series || "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Color:</p>
                      <p className="text-base text-gray-900">{selectedVehicle.color || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Transmission:</p>
                      <p className="text-base text-gray-900">{selectedVehicle.transmission || "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Fuel Type:</p>
                      <p className="text-base text-gray-900 capitalize">{selectedVehicle.fuelType || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Body Style:</p>
                      <p className="text-base text-gray-900">{selectedVehicle.bodyStyle || "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Certify Status:</p>
                      <p className="text-base text-gray-900">{selectedVehicle.certifyStatus || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Drive Type:</p>
                      <p className="text-base text-gray-900 uppercase">{selectedVehicle.driveType || "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Meter Reading:</p>
                      <p className="text-base text-gray-900">{selectedVehicle.mileage || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Year:</p>
                      <p className="text-base text-gray-900">{selectedVehicle.year || "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Condition:</p>
                      <p className="text-base text-gray-900 capitalize">{selectedVehicle.vehicleCondition || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Price:</p>
                      <p className="text-base text-gray-700 font-semibold">{selectedVehicle.buyNowPrice}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  {selectedVehicle.images && selectedVehicle.images.length > 0 ? (
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
                        {currentImageIndex + 1} / {selectedVehicle.images.length}
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
    </div>
  );
};