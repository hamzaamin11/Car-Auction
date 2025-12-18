import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../Contant/URL";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

export const AddCommission = ({ handleClose, handleGetAllCommission }) => {
  const [commission, setCommission] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/commission`, {
        commission,
      });

      console.log(res.data);
      handleClose();
      handleGetAllCommission();
      await Swal.fire({
        title: "Success!",
        text: "The Commission has been added successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
    } catch (error) {
      console.error(error);

      await Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Add Commission %
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
              Enter Commission %
            </label>
            <input
              type="text"
              value={commission}
              onChange={(e) => {
                const value = e.target.value;

                // Allow only numbers + up to 3 decimals
                if (/^\d*\.?\d{0,3}$/.test(value)) {
                  setCommission(value);
                }
              }}
              placeholder="Enter Your Commission"
              required
              maxLength={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
          </div>

          <div className="flex justify-center">
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-950 hover:bg-blue-900 text-white px-4 py-2 rounded"
            >
              {loading ? "loading..." : "Add %"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
