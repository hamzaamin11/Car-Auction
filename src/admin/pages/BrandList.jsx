import React, { useEffect, useState } from "react";
import { AddBrandModal } from "../../components/BrandModal/AddBrandModal";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import { EditBrandModal } from "../../components/BrandModal/EditBrandModal";
import { toast, ToastContainer } from "react-toastify";
import CustomAdd from "../../CustomAdd";
import CustomSearch from "../../CustomSearch";
export const BrandList = () => {
  const [isOpen, setIsOpen] = useState("");

  const [loading, setLoading] = useState(false);

  const [allBrands, setAllBrands] = useState([]);

  const [seleteBrand, setSeleteBrand] = useState();

  const [search, setSearch] = useState("");

  const [pageNo, setPageNo] = useState(1);

  console.log(pageNo);

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handlePrevPage = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleGetAllBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBrands`, {
        params: {
          search: search,
          page: pageNo,
          limit: 10,
        },
      });

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

  // Handle search change and reset page to 1
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPageNo(1); // Reset to first page when searching
  };

  useEffect(() => {
    handleGetAllBrands();
  }, [search, pageNo]);

  return (
    <div className="min-h-screen bg-gray-100 lg:p-6 p-2">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800">Vehicle Brand List</h2>
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </span>
                <CustomSearch
          placeholder="Search By Car Brand..."
          value={search}
          onChange={handleSearchChange}
        />
        </div>
       <CustomAdd
  text="Add Brand"
  onClick={() => handleToggleModal("Add")}
/>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-950 text-white">
          <tr>
            <th className="py-3 px-4 text-left">SR#</th>
            <th className="py-3 px-4 text-left">Brand Image</th>
            <th className="py-3 px-4 text-left">Brand Name</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allBrands?.map((brand, index) => (
            <tr key={brand._id} className="border-b">
              <td className="py-2 px-4">{(pageNo - 1) * 10 + index + 1}</td>
              <td className="py-2 px-4">
                <img
                  src={brand.logo}
                  alt="logo"
                  className="w-12 h-12 object-contain"
                />
              </td>
              <td className="py-2 px-4">
                {brand.brandName.charAt(0) + brand.brandName.slice(1)}
              </td>
       <td className="pt-4 px-4 flex gap-2 justify-center items-center">
  <CustomAdd
    text="Edit"
    variant="edit"
    onClick={() => handleEditBtn(brand)}
  />
</td>
            </tr>
          ))}
        </tbody>
      </table>

      {allBrands.length === 0 && (
        <div className="text-center text-gray-500 py-4">No brands found</div>
      )}

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
      <div className="flex justify-between mt-6">
        {/* Prev Button */}
        <button
          className={`bg-blue-950 text-white px-5 py-2 rounded-md  ${
            pageNo > 1 ? "block" : "hidden"
          }`}
          onClick={handlePrevPage}
        >
          ‹ Prev
        </button>
        <div></div>
        {/* Next Button */}
        <button
          className={`bg-blue-950 text-white px-5 py-2 rounded-md  ${
            allBrands.length === 10 ? "block" : "hidden"
          }`}
          onClick={handleNextPage}
        >
          Next ›
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};