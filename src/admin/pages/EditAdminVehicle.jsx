import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
function EditAdminVehicle({
  open,
  setOpen,
  selectedVehicle,

  onVehicleUpdated,
}) {
  const initialVehicleState = {
    userId: "",
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
    image: null,
  };

  const [vehicleData, setVehicleData] = useState(initialVehicleState);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (selectedVehicle) {
      setVehicleData({
        vin: selectedVehicle.vin || "",
        year: selectedVehicle.year || "",
        make: selectedVehicle.make || "",
        model: selectedVehicle.model || "",
        series: selectedVehicle.series || "",
        bodyStyle: selectedVehicle.bodyStyle || "",
        engine: selectedVehicle.engine || "",
        transmission: selectedVehicle.transmission || "",
        driveType: selectedVehicle.driveType || "",
        fuelType: selectedVehicle.fuelType || "",
        color: selectedVehicle.color || "",
        mileage: selectedVehicle.mileage || "",
        vehicleCondition: selectedVehicle.vehicleCondition || "",
        keysAvailable: selectedVehicle.keysAvailable || "",
        locationId: selectedVehicle.locationId || "",
        saleStatus: selectedVehicle.saleStatus || "",
        auctionDate: selectedVehicle.auctionDate || "",
        currentBid: selectedVehicle.currentBid || "",
        buyNowPrice: selectedVehicle.buyNowPrice || "",
        certifyStatus: selectedVehicle.certifyStatus || "",
        image: selectedVehicle.image || null,
      });

      console.log("selectedVehicle", selectedVehicle);

      // Set image preview if image exists
      if (selectedVehicle.image) {
        setImagePreview(selectedVehicle.image);
      }
    }
  }, [selectedVehicle]);

  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setVehicleData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create preview for new image
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setVehicleData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("userId", selectedVehicle.userId);

    // Append all fields to formData
    Object.entries(vehicleData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== "id") {
        formData.append(key, value);
      }
    });

    try {
      const response = await fetch(
        `http://localhost:3001/seller/updateVehicle/${selectedVehicle?.id}`,
        {
          method: "PUT",
          body: formData, // Send the FormData directly
          // Don't set Content-Type header - let the browser set it with boundary
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update vehicle");
      }

      const data = await response.json();
      toast.success("Vehicle updated successfully!");
      onVehicleUpdated();
      setOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-30 px-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 rounded-lg relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit Vehicle</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-red-700 text-3xl"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              VIN
            </label>
            <input
              name="vin"
              value={vehicleData.vin}
              onChange={handleChange}
              placeholder="VIN"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              required
              maxLength={17}
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Year
            </label>
            <input
              name="year"
              value={vehicleData.year}
              onChange={handleChange}
              placeholder="Year"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Make
            </label>
            <input
              name="make"
              value={vehicleData.make}
              onChange={handleChange}
              placeholder="Make"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Model
            </label>
            <input
              name="model"
              value={vehicleData.model}
              onChange={handleChange}
              placeholder="Model"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Series
            </label>
            <input
              name="series"
              value={vehicleData.series}
              onChange={handleChange}
              placeholder="Series"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Body Style
            </label>
            <input
              name="bodyStyle"
              value={vehicleData.bodyStyle}
              onChange={handleChange}
              placeholder="Body Style"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Engine
            </label>
            <input
              name="engine"
              value={vehicleData.engine}
              onChange={handleChange}
              placeholder="Engine"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Engine
            </label>
            <input
              name="engine"
              value={vehicleData.engine}
              onChange={handleChange}
              placeholder="Engine"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Transmission
            </label>
            <input
              name="transmission"
              value={vehicleData.transmission}
              onChange={handleChange}
              placeholder="Transmission"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Drive Type
            </label>
            <input
              name="driveType"
              value={vehicleData.driveType}
              onChange={handleChange}
              placeholder="Drive Type"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Fuel Type
            </label>
            <input
              name="fuelType"
              value={vehicleData.fuelType}
              onChange={handleChange}
              placeholder="Fuel Type"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Color
            </label>
            <input
              name="color"
              value={vehicleData.color}
              onChange={handleChange}
              placeholder="Color"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Mileage
            </label>
            <input
              name="mileage"
              value={vehicleData.mileage}
              onChange={handleChange}
              placeholder="Mileage"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Mileage
            </label>
            <input
              name="mileage"
              value={vehicleData.mileage}
              onChange={handleChange}
              placeholder="Mileage"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Vehicle Condition
            </label>
            <input
              name="vehicleCondition"
              value={vehicleData.vehicleCondition}
              onChange={handleChange}
              placeholder="Vehicle Condition"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Keys Available
            </label>
            <input
              name="keysAvailable"
              value={vehicleData.keysAvailable}
              onChange={handleChange}
              placeholder="Keys Available"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Keys Available
            </label>
            <input
              name="keysAvailable"
              value={vehicleData.keysAvailable}
              onChange={handleChange}
              placeholder="Keys Available"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Location ID
            </label>
            <input
              name="locationId"
              value={vehicleData.locationId}
              onChange={handleChange}
              placeholder="Location ID"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Sale Status
            </label>
            <input
              name="saleStatus"
              value={vehicleData.saleStatus}
              onChange={handleChange}
              placeholder="Sale Status"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Auction Date
            </label>
            <input
              name="auctionDate"
              value={vehicleData.auctionDate.slice(0, 10)}
              onChange={handleChange}
              placeholder="Sale Status"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Current Bid
            </label>
            <input
              name="currentBid"
              value={vehicleData.currentBid}
              onChange={handleChange}
              placeholder="Current Bid"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Buy Now Price
            </label>
            <input
              name="buyNowPrice"
              value={vehicleData.buyNowPrice}
              onChange={handleChange}
              placeholder="Buy Now Price"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Buy Now Price
            </label>
            <input
              name="buyNowPrice"
              value={vehicleData.buyNowPrice}
              onChange={handleChange}
              placeholder="Buy Now Price"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2 font-semibold text-gray-700">
              Certify Status
            </label>
            <input
              name="certifyStatus"
              value={vehicleData.certifyStatus}
              onChange={handleChange}
              placeholder="Certify Status"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>

          {/* Image Upload */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <label className="block mb-2 font-semibold text-gray-700">
                Vehicle Image
              </label>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleChange}
                className="w-full text-sm file:px-4 file:py-2 file:bg-indigo-600 file:text-white file:rounded file:cursor-pointer"
              />
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Vehicle preview"
                  className="h-32 object-contain"
                />
                <p className="text-sm text-gray-500 mt-1">Current image</p>
              </div>
            )}
          </div>

          <div className="col-span-full flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAdminVehicle;
