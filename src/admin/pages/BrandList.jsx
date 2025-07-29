import React, { useEffect, useState } from "react";
import { AddBrandModal } from "../../components/BrandModal/AddBrandModal";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import { EditBrandModal } from "../../components/BrandModal/EditBrandModal";
import { toast, ToastContainer } from "react-toastify";
import { RotateLoader } from "../../components/Loader/RotateLoader";

export const BrandList = () => {
  const [isOpen, setIsOpen] = useState("");

  const [loading, setLoading] = useState(false);

  const [allBrands, setAllBrands] = useState([]);

  const [seleteBrand, setSeleteBrand] = useState();

  console.log(allBrands);

  const handleGetAllBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBrands`);
      setAllBrands(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleToggleModal = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleEditBtn = (data) => {
    handleToggleModal("Edit");
    setSeleteBrand(data);
  };

  const handleDeleteBrand = async (id) => {
    try {
      const res = await axios.patch(`${BASE_URL}/admin/deleteBrand/${id}`);
      console.log(res.data);
      handleGetAllBrands();
      toast.success("Brand has been deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllBrands();
  }, []);

  if (loading) return <RotateLoader />;

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          List Vehicle Brand
        </h2>
        <button
          onClick={() => handleToggleModal("Add")}
          className="bg-[#191970] hover:bg-blue-900 hover:cursor-pointer text-white font-bold py-2 px-6 rounded-full shadow"
        >
          +Add Brand
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#191970] text-white">
          <tr>
            <th className="py-3 px-4 text-left">SR#</th>

            <th className="py-3 px-4 text-left">Brand Image</th>

            <th className="py-3 px-4 text-left">Brand Name</th>

            <th className="px-4 py-3 text-center text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {allBrands?.map((brand, index) => (
            <tr key={brand._id} className="border-b">
              <td className="py-1 px-4">{index + 1}</td>
              <td className="py-1 px-4">
                <img
                  src={brand.logo}
                  alt="logo"
                  className="w-12 h-12 object-contain"
                />
              </td>
              <td className="py-1 px-4">{brand.brandName}</td>
              <td className="py-1 mt-2 px-4 flex gap-2 justify-center">
                <button
                  onClick={() => handleEditBtn(brand)}
                  className="px-3 py-1 text-sm border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition hover:cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteBrand(brand?.id)}
                  className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition hover:cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isOpen === "Add" && (
        <AddBrandModal
          handleClose={() => handleToggleModal("")}
          handleGetAllBrands={handleGetAllBrands}
        />
      )}

      {isOpen === "Edit" && (
        <EditBrandModal
          handleClose={() => handleToggleModal("")}
          seleteBrand={seleteBrand}
          handleGetAllBrands={handleGetAllBrands}
        />
      )}

      <ToastContainer />
    </div>
  );
};
