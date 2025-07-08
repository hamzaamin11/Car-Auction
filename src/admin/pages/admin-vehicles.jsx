import React, { useContext, useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { SidebarClose } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VehicleContext from "../../context/VehicleContext";
import { useAuth } from "../../context/AuthContext";
import EditAdminVehicle from "./EditAdminVehicle";

function AddAdminVehicle({ open, setOpen, onVehicleUpdated }) {
  const initialVehicleState = {
    vin: "",
    year: "",
    make: "",
    model: "",
    series: "",
    bodyStyle: "",
    engine: "",
    transmission: "",
    driveType: "",
    fuelType: "",
    color: "",
    mileage: "",
    vehicleCondition: "",
    keysAvailable: "",
    locationId: "",
    saleStatus: "",
    auctionDate: "",
    currentBid: "",
    buyNowPrice: "",
    certifyStatus: "",
    image: null, // ✅ Added missing field
  };

  const [vehicle, setVehicle] = useState(initialVehicleState);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const { getVehicles, delVehicle, getAllVehicles } =
    useContext(VehicleContext); // ✅ Ensure VehicleContext is imported

  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setVehicle((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Authentication required");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    // Add userId only once
    formData.append("userId", user.id);

    // Add other fields (excluding userId)
    Object.entries(vehicle).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    // Debug: Log what's being sent
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    console.log("Submitting vehicle data:", formData); // ✅ Debugging line

    const loadingToast = toast.loading("Submitting...");
    try {
      const res = await fetch("http://localhost:3001/seller/addVehicle", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.update(loadingToast, {
          render: "Vehicle Added Successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setVehicle(initialVehicleState); // ✅ Reset to initial state
        getAllVehicles();
        setShowModal(false); // Make sure `setOpen` is declared and passed correctly
      } else {
        toast.update(loadingToast, {
          render: "Failed to add vehicle.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(loadingToast, {
        render: "An error occurred.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setEditModalOpen(true);
  };

  // const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* <Topbar />
      <Sidebar /> */}
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Vehicle List
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#191970] hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-full shadow"
          >
            + Add Vehicle
          </button>
        </div>

        <div className="text-center mb-6"></div>

        {/* Vehicle Form Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-30  px-4">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 rounded-lg relative">
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Add a New Vehicle
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-red-700   text-3xl"
                >
                  &times;
                </button>
              </div>

              {/* Form Starts */}
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <input
                  name="vin"
                  value={vehicle.vin}
                  onChange={handleChange}
                  placeholder="VIN"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  required
                  maxLength={17}
                />
                <input
                  name="year"
                  value={vehicle.year}
                  onChange={handleChange}
                  placeholder="Year"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="make"
                  value={vehicle.make}
                  onChange={handleChange}
                  placeholder="Make"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  required
                />
                <input
                  name="model"
                  value={vehicle.model}
                  onChange={handleChange}
                  placeholder="Model"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  required
                />
                <input
                  name="series"
                  value={vehicle.series}
                  onChange={handleChange}
                  placeholder="Series"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="bodyStyle"
                  value={vehicle.bodyStyle}
                  onChange={handleChange}
                  placeholder="Body Style"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="engine"
                  value={vehicle.engine}
                  onChange={handleChange}
                  placeholder="Engine"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="transmission"
                  value={vehicle.transmission}
                  onChange={handleChange}
                  placeholder="Transmission"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="driveType"
                  value={vehicle.driveType}
                  onChange={handleChange}
                  placeholder="Drive Type"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="fuelType"
                  value={vehicle.fuelType}
                  onChange={handleChange}
                  placeholder="Fuel Type"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="color"
                  value={vehicle.color}
                  onChange={handleChange}
                  placeholder="Color"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="mileage"
                  value={vehicle.mileage}
                  onChange={handleChange}
                  placeholder="Mileage"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="vehicleCondition"
                  value={vehicle.vehicleCondition}
                  onChange={handleChange}
                  placeholder="Vehicle Condition"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="keysAvailable"
                  value={vehicle.keysAvailable}
                  onChange={handleChange}
                  placeholder="Keys Available"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="locationId"
                  value={vehicle.locationId}
                  onChange={handleChange}
                  placeholder="Location ID"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="saleStatus"
                  value={vehicle.saleStatus}
                  onChange={handleChange}
                  placeholder="Sale Status"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="auctionDate"
                  value={vehicle.auctionDate}
                  onChange={handleChange}
                  placeholder="Auction Date"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="currentBid"
                  value={vehicle.currentBid}
                  onChange={handleChange}
                  placeholder="Current Bid"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="buyNowPrice"
                  value={vehicle.buyNowPrice}
                  onChange={handleChange}
                  placeholder="Buy Now Price"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <input
                  name="certifyStatus"
                  value={vehicle.certifyStatus}
                  onChange={handleChange}
                  placeholder="Certify Status"
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />

                {/* Image Upload */}

                {/* Submit Button */}
                <div className="col-span-1 sm:col-span-2 flex justify-center  mt-4">
                  <label className="font-bold pt-1 w-70 text-gray-700 mb-1 block">
                    Vehicle Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleChange}
                    className="w-full text-sm file:px-4 file:py-2 file:bg-indigo-600 file:text-white file:rounded file:cursor-pointer"
                  />
                  <button
                    type="submit"
                    className="  bg-indigo-600 text-white px-2 w-full rounded hover:bg-indigo-700"
                  >
                    Submit Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Vehicle List Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#191970] text-white">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Make</th>
                <th className="py-3 px-4 text-left">Model</th>
                <th className="py-3 px-4 text-left">Year</th>
                <th className="py-3 px-4 text-left">Series</th>
                <th className="py-3 px-4 text-left">Mileage</th>
                <th className="py-3 px-4 text-left">Buy Now Price</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {getVehicles?.length > 0 ? (
                getVehicles.map((vehicle, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{vehicle.make}</td>
                    <td className="py-3 px-4">{vehicle.model}</td>
                    <td className="py-3 px-4">{vehicle.year}</td>
                    <td className="py-3 px-4">{vehicle.series}</td>
                    <td className="py-3 px-4">{vehicle.mileage}</td>
                    <td className="py-3 px-4">{vehicle.buyNowPrice}</td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setEditModalOpen(true);
                        }}
                        className="px-3 py-1 text-sm border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition"
                      >
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm border border-[#191970] text-[#191970] rounded hover:bg-[#191970] hover:text-white transition">
                        View
                      </button>
                      <button
                        onClick={() => delVehicle(vehicle.id)}
                        className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No vehicles found. Please add a vehicle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditAdminVehicle
        open={editModalOpen}
        setOpen={setEditModalOpen}
        selectedVehicle={selectedVehicle}
        onVehicleUpdated={getAllVehicles} // Your data refresh function
      />

      <ToastContainer />
    </>
  );
}

export default AddAdminVehicle;
