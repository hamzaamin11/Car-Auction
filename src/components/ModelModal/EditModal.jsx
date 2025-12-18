import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../Contant/URL";
import Select from "react-select";
import Swal from "sweetalert2";
import CustomDropdown from "../../CustomDropdown";
import { useSelector } from "react-redux";
const initialState = {
  brandId: "",
  modelName: "",
};

export const EditModal = ({ handleClose, seleteModel, handleGetAllModels }) => {
  const { currentUser } = useSelector((state) => state?.auth);

  const [formData, setFormData] = useState(initialState);

  const [allBrands, setAllBrands] = useState([]);

  console.log("seleteModel =>", seleteModel);

  console.log("formData =>", formData);

  useEffect(() => {
    if (seleteModel) {
      setFormData({
        brandId: seleteModel.brandId || "",
        modelName: seleteModel.modelName || "",
      });
    }
  }, [seleteModel]);

  const handleGetAllBrands = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getBrands/${currentUser?.role}`
      );
      setAllBrands(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllBrands();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${BASE_URL}/updateModel/${seleteModel.modelId}`,
        formData
      );
      console.log("Updated:", res.data);
      handleClose();
      handleGetAllModels();
      await Swal.fire({
        title: "Success!",
        text: "The model has been updated successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
    } catch (error) {
      console.log("Error updating model:", error);
      await Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Update Model
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
            <CustomDropdown
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

          {/* Model Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model Name
            </label>
            <input
              type="text"
              name="modelName"
              value={formData.modelName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  modelName: e.target.value,
                }))
              }
              placeholder="Enter model name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-950 text-white px-4 py-2 rounded  hover:cursor-pointer"
            >
              Update Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
