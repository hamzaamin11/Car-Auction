import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../Contant/URL";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import Swal from "sweetalert2";
import CustomDropdown from "../../CustomDropdown";
const initialState = {
  brandId: "",
  modelName: "",
};

export const AddModel = ({ handleClose, handleGetAllModels }) => {
  const [allBrands, setAllBrands] = useState([]);

  const [formData, setFormData] = useState(initialState);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetAllBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBrands`);
      setAllBrands(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/addModel`, formData);
      console.log(res.data);
      setFormData(initialState);
      handleClose();
      handleGetAllBrands();
      handleGetAllModels();
      await Swal.fire({
        title: "Success!",
        text: "The model has been added successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
    } catch (error) {
      console.log(error);
      await Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllBrands();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Add New Model
          </h2>
          <span
            onClick={handleClose}
            className="text-gray-500 hover:text-red-600 cursor-pointer text-xl font-bold"
          >
            X
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Brand Name
            </label>
            <CustomDropdown 
              options={[
                { label: "Select your brand", value: "" },
                ...allBrands.map((brand) => ({
                  label: brand.brandName, // 👈 UI me brand ka naam dikhega
                  value: brand.id, // 👈 backend me brand ka id jayega
                })),
              ]}
              value={
                formData.brandId
                  ? {
                      label: allBrands.find((b) => b.id === formData.brandId)
                        ?.brandName,
                      value: formData.brandId,
                    }
                  : null
              }
              onChange={(selectedOption) =>
                setFormData((prev) => ({
                  ...prev,
                  brandId: selectedOption ? selectedOption.value : "", // 👈 yaha id store hogi
                }))
              }
              placeholder="Select your brand"
            />
          </div>

          {/* Model Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Model Name
            </label>
            <input
              type="text"
              name="modelName"
              value={formData.modelName}
              onChange={handleChange}
              placeholder="Enter model name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-950 hover:bg-blue-900 text-white px-4 py-2 rounded "
            >
              {loading ? "Loading..." : "Add Model"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
