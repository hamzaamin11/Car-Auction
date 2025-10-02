import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../Contant/URL";
import { toast, ToastContainer } from "react-toastify";

export const EditCityModal = ({
  handleClose,
  handleGetAllCities,
  seleteCity,
}) => {
  const [cityName, setCityName] = useState(seleteCity);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(`${BASE_URL}/updateCity/${seleteCity?.id}`, {
        cityName,
      });

      console.log(res.data);
      handleClose();
      toast.success("City has been added successfully");
      handleGetAllCities();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add city");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Update City
          </h2>
          <span
            onClick={handleClose}
            className="text-gray-500 hover:text-red-600 cursor-pointer text-xl font-bold"
          >
            X
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City Name
            </label>
            <input
              type="text"
              value={cityName.cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="Enter city name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center">
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              {loading ? "loading..." : "Update City"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
