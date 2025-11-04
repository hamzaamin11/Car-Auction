import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../Contant/URL";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import Swal from "sweetalert2";

const initialState = {
  brandId: "",
  modelId: "",
  seriesName: "",
};

export const EditSeries = ({
  seleteSeries,
  handleClose,
  handleGetAllSeries,
}) => {
  const [formData, setFormData] = useState(seleteSeries);

  const [allBrands, setAllBrands] = useState([]);

  const [allModels, setAllModels] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetAllModels = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getModelById/${formData.brandId}`
      );
      setAllModels(res.data);
    } catch (error) {
      console.log(error);
    }
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

  useEffect(() => {
    if (formData.brandId) {
      handleGetAllModels();
    }
  }, [formData.brandId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/updateSeries/${formData.seriesId}`,
        formData
      );

      await Swal.fire({
        title: "Success!",
        text: "The series has been updated successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
      setFormData(initialState);
      handleClose();
      handleGetAllSeries();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
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
    handleGetAllSeries();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Update Vehicle Series
          </h2>
          <span
            onClick={handleClose}
            className="text-gray-500 hover:text-red-600 cursor-pointer text-xl font-bold"
          >
            X
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Brand Name
            </label>
            <Select
              options={[
                { label: "Select your brand", value: "" },
                ...allBrands.map((brand) => ({
                  label: brand.brandName,
                  value: brand.id,
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
                  brandId: selectedOption ? selectedOption.value : "",
                }))
              }
              placeholder="Select your brand"
            />
          </div>

          {/* Model Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Model Name
            </label>
            <Select
              options={[
                { label: "Select your model", value: "" },
                ...allModels.map((model) => ({
                  label: model.modelName,
                  value: model.modelId,
                })),
              ]}
              value={
                formData.modelId
                  ? {
                      label: allModels.find(
                        (m) => m.modelId === formData.modelId
                      )?.modelName,
                      value: formData.modelId,
                    }
                  : null
              }
              onChange={(selectedOption) =>
                setFormData((prev) => ({
                  ...prev,
                  modelId: selectedOption ? selectedOption.value : "",
                }))
              }
              placeholder="Select your model"
            />
          </div>

          {/* Series Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Series Name
            </label>
            <input
              type="text"
              name="seriesName"
              value={formData.seriesName}
              onChange={handleChange}
              placeholder="Enter series name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-950 text-white px-4 py-2 rounded hover:cursor-pointer"
            >
              {loading ? "Loading..." : "Update Series"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
