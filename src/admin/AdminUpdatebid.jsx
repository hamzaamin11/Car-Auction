import axios from "axios";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../components/Contant/URL";

export const AdminUpdatebid = ({
  setIsOpenBid,
  selectedVehicle,
  getAllVehicles,
}) => {
  const initialState = {
    startTime: "",
    endTime: "",
    vehicleId: selectedVehicle?.id || selectedVehicle?.newVehicleId,
    userId: selectedVehicle?.userId,
    saleStatus: "pending",
  };

  const [viewImage, setViewImage] = useState();

  const [formData, setFormData] = useState(initialState);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // agar ye datetime-local hai to backend ke liye UTC ISO string bana do
    if (name === "startTime" || name === "endTime") {
      updatedValue = new Date(value).toISOString();
      // Example: "2025-09-01T13:00" -> "2025-09-01T08:00:00.000Z"
    }

    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  useEffect(() => {
    if (selectedVehicle?.images?.length > 0) {
      setViewImage(selectedVehicle.images[0]);
    }
  }, [selectedVehicle]);



  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/seller/createBid`, formData);
      console.log("res", res.data);
      getAllVehicles();
      setIsOpenBid(false);
      toast.success("Vehicle has been added for bid");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur flex justify-center items-center">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow relative">
        {/* Header */}
        <button
          onClick={() => setIsOpenBid(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
        >
          <MdClose size={24} />
        </button>
        <h2 className="text-lg font-semibold mb-4 text-[#233D7B]">
          Update Vehicle Bid
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Left Side */}
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 space-y-2">
              <p>
                <strong>Model:</strong> {selectedVehicle?.model}
              </p>
              <p>
                <strong>Make:</strong> {selectedVehicle?.make}
              </p>
              <p>
                <strong>Year:</strong> {selectedVehicle?.year}
              </p>
              <p>
                <strong>Color:</strong> {selectedVehicle?.color}
              </p>
              <p>
                <strong>Fuel:</strong> {selectedVehicle?.fuelType}
              </p>
              <p>
                <strong>Transmission:</strong> {selectedVehicle?.transmission}
              </p>
              <p>
                <strong>Body Style:</strong> {selectedVehicle?.bodyStyle}
              </p>
              <p>
                <strong>Location:</strong> {selectedVehicle?.locationId}
              </p>
              <p>
                <strong>Demand Price:</strong> {selectedVehicle?.buyNowPrice}
              </p>
              <p>
                <strong>Condition:</strong> {selectedVehicle?.vehicleCondition}
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-3 mt-4">
              {/* Start Time */}
              <div>
                <label className="block text-xs mb-1 font-medium">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={
                    formData.startTime
                      ? moment(formData.startTime).format("YYYY-MM-DDTHH:mm") // UTC → local
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-xs mb-1 font-medium">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={
                    formData.endTime
                      ? moment(formData.endTime).format("YYYY-MM-DDTHH:mm") // UTC → local
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>

              {/* Submit */}
              <button
                disabled={loading}
                onClick={handleBidSubmit}
                className="mt-2 w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
              >
                {loading ? "Updating..." : "Update Bid"}
              </button>
            </div>
          </div>

          {/* Right Side (Images) */}
          <div className="flex flex-col items-center">
            <img
              src={viewImage}
              alt="Car"
              className="rounded mb-4 w-full h-52 object-cover"
            />
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedVehicle?.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`car-${index}`}
                  onClick={() => setViewImage(image)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                    viewImage === image ? "border-blue-500" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};
