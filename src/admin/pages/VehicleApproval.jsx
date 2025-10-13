import React, { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import Swal from "sweetalert2";

export const VehicleApproval = () => {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [search, setSearch] = useState("");

  const [vehicles, setVehicles] = useState([]);

  // const [vehicles] = useState([
  //   {
  //     id: 1,
  //     make: "Toyota",
  //     model: "Corolla",
  //     series: "Altis",
  //     year: 2020,
  //     fuelType: "Petrol",
  //     transmission: "Automatic",
  //     mileage: 42000,
  //     color: "White",
  //     cityName: "Karachi",
  //     buyNowPrice: "3,200,000",
  //     images: [
  //       "https://images.unsplash.com/photo-1616128618694-96f6d5d1e0b3?auto=format&fit=crop&w=800&q=80",
  //     ],
  //   },
  //   {
  //     id: 2,
  //     make: "Honda",
  //     model: "Civic",
  //     series: "Oriel",
  //     year: 2019,
  //     fuelType: "Petrol",
  //     transmission: "Manual",
  //     mileage: 56000,
  //     color: "Black",
  //     cityName: "Lahore",
  //     buyNowPrice: "3,600,000",
  //     images: [
  //       "https://images.unsplash.com/photo-1605559424843-9a1fdd9c5a25?auto=format&fit=crop&w=800&q=80",
  //     ],
  //   },
  // ]);

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
      console.log(res.data);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
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
            🔍
          </span>
        </div>
      </div>

      {/* Responsive Vehicle List */}
      {filteredVehicles.length > 0 ? (
        <div className="space-y-4">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id}>
              {/* ✅ Desktop View */}
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
                    {vehicle.year} | {vehicle.fuelType} | {vehicle.transmission}{" "}
                    | {vehicle.mileage} KM | {vehicle.color} |{" "}
                    {vehicle.cityName}
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
                        className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left"
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
                        onClick={() =>
                          alert(`Viewing details for ${vehicle.make}`)
                        }
                        className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 text-left"
                      >
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ✅ Mobile View */}
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
                      {vehicle.year} | {vehicle.fuelType} |{" "}
                      {vehicle.transmission} | {vehicle.mileage} KM |{" "}
                      {vehicle.color} | {vehicle.cityName}
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
                          className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left"
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
                          onClick={() =>
                            alert(`Viewing details for ${vehicle.make}`)
                          }
                          className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 text-left"
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
    </div>
  );
};
