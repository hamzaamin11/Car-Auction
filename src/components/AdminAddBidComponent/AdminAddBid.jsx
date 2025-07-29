import axios from "axios";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { BASE_URL } from "../Contant/URL";

export const AdminAddBid = ({
  setIsOpenBid,
  selectedVehicle,
  getAllVehicles,
}) => {
  const initialState = {
    sellerOffer: "",
    startTime: "",
    endTime: "",
    vehicleId: selectedVehicle.id,
    userId: selectedVehicle.userId,
    saleStatus: "pending",
  };
  const [viewImage, setViewImage] = useState();

  const [formData, setFormData] = useState(initialState);

  console.log("love dose", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (selectedVehicle?.images?.length > 0) {
      setViewImage(selectedVehicle.images[0]);
    }
  }, [selectedVehicle]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/seller/createBid`, formData);
      console.log("res", res.data);
      getAllVehicles();
      setIsOpenBid(false);
    } catch (error) {
      console.log(error);
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
          Add Vehicle Bid
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Left Side (Info + Form) */}
          <div className="space-y-2 text-sm">
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

            {/* Inputs Section */}
            <div className="space-y-3 mt-4">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                {/* Bid Amount */}
                <div className="flex-1">
                  <label className="block text-xs mb-1 font-medium">
                    Bid Amount
                  </label>
                  <input
                    type="number"
                    name="sellerOffer"
                    value={formData.sellerOffer}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded text-sm"
                  />
                </div>

                {/* Start Date & Time */}
                <div className="flex-1">
                  <label className="block text-xs mb-1 font-medium">
                    Start Date & Time
                  </label>
                  <input
                    name="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded text-sm"
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div>
                <label className="block text-xs mb-1 font-medium">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleBidSubmit}
                className="mt-2 w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
              >
                Submit Bid
              </button>
            </div>
          </div>
          {/* Right Side (Image) */}
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
      </div>
    </div>
  );
};
