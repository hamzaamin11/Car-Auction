import React, { useEffect, useState } from "react";
import { AddBrandModal } from "../../components/BrandModal/AddBrandModal";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import { EditBrandModal } from "../../components/BrandModal/EditBrandModal";
import { toast, ToastContainer } from "react-toastify";

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

  useEffect(() => {
    handleGetAllBrands();
  }, [search, pageNo]);

  return (
    <div className="">
      <div className="flex flex-row justify-between items-center ">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Vehicle Make List
        </h2>
        <div class="relative w-full max-w-md mt-4 lg:mt-0 md:mt-0 lg:ml-[-100px] ml-0  mb-3">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Search by car brand..."
            onChange={(e) => setSearch(e.target.value)}
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => handleToggleModal("Add")}
          className="bg-[#191970] hover:bg-blue-900 hover:cursor-pointer text-white font-bold py-2 px-6 rounded-full shadow"
        >
          Add Brand
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#191970] text-white">
          <tr>
            <th className="py-3 px-4 text-left">SR#</th>

            <th className="py-3 px-4 text-left">Brand Image</th>

            <th className="py-3 px-4 text-left">Brand Name</th>

            <th className="px-4 py-3 text-center ">Actions</th>
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
              <td className="py-1 px-4">
                {brand.brandName.charAt(0) + brand.brandName.slice(1)}
              </td>
              <td className="py-1 mt-2 px-4 flex gap-2 justify-center">
                <button
                  onClick={() => handleEditBtn(brand)}
                  className="px-3 py-1 text-sm border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition hover:cursor-pointer"
                >
                  Edit
                </button>
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
      <div className="flex justify-between  mt-6">
        {/* Prev Button */}
        <button
          className={`bg-[#518ecb] text-white px-5 py-2 rounded hover:bg-[#518ecb] ${
            pageNo > 1 ? "block" : "hidden"
          }`}
          onClick={handlePrevPage}
        >
          ‹ Prev
        </button>

        {/* Next Button */}
        <div></div>
        <button
          className={`bg-[#518ecb] text-white px-5 py-2 rounded hover:bg-[#518ecb] ${
            allBrands.length === 0 ? "hidden" : "block"
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
