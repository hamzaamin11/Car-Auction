import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../Contant/URL";
import Swal from "sweetalert2";

export const EditBrandModal = ({
  handleClose,
  seleteBrand,
  handleGetAllBrands,
}) => {
  const [updateName, setUpdateName] = useState("");
  const [logo, setLogo] = useState(null);

  const id = seleteBrand?.id;

  useEffect(() => {
    if (seleteBrand?.brandName) {
      setUpdateName(seleteBrand.brandName);
    }
  }, [seleteBrand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("brandName", updateName);
      if (logo) {
        formData.append("logo", logo);
      }

      const res = await axios.put(
        `${BASE_URL}/admin/updateBrand/${id}`,
        formData
      );

      console.log(res.data);
      handleClose();
      handleGetAllBrands();
      await Swal.fire({
        title: "Success!",
        text: "The brand has been updated successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
    } catch (error) {
      console.log("Error updating brand:", error);
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
            Update Brand
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
              Brand Name
            </label>
            <input
              type="text"
              name="update"
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
              placeholder="Enter brand name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setLogo(e.target.files[0]);
                }
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-950 text-white px-4 py-2 rounded hover:cursor-pointer"
            >
              Update Brand
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
