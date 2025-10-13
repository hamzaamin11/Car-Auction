import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../components/Contant/URL";
import { RotateLoader } from "../components/Loader/RotateLoader";
import { AddModel } from "../components/ModelModal/AddModel";
import { EditModal } from "../components/ModelModal/EditModal";

export const ModelList = () => {
  const [isOpen, setIsOpen] = useState("");

  const [loading, setLoading] = useState(false);

  const [allBrands, setAllBrands] = useState([]);

  const [allModels, setAllModels] = useState([]);

  const [seleteModel, setSeleteModel] = useState();

  const [search, setSearch] = useState("");

  const [pageNo, setPageNo] = useState(1);

  console.log(pageNo);

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handlePrevPage = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleGetAllModels = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getModels`, {
        params: {
          search: search,
          page: pageNo,
          limit: 10,
        },
      });
      console.log(res.data);
      setAllModels(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleModal = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleEditBtn = (data) => {
    handleToggleModal("Edit");
    setSeleteModel(data);
  };

  const handleDeleteBrand = async (id) => {
    try {
      const res = await axios.patch(`${BASE_URL}/deleteModel/${id}`);
      console.log(res.data);
      handleGetAllModels();
      toast.success("Model has been deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllModels();
  }, [search, pageNo]);

  if (loading) return <RotateLoader />;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Vehicle Model List</h2>
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
          <input
            type="text"
            placeholder="Search By Car Model..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => handleToggleModal("Add")}
          className="bg-[#191970] hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-md shadow transition duration-200 hover:cursor-pointer"
        >
          Add Model
        </button>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#191970] text-white">
          <tr>
            <th className="py-3 px-4 text-left">SR#</th>
            <th className="py-3 px-4 text-left">Make Name</th>
            <th className="py-3 px-4 text-left">Model Name</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allModels?.map((brand, index) => (
            <tr key={brand._id} className="border-b">
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">
                {brand.brandName.charAt(0).toUpperCase() +
                  brand.brandName.slice(1)}
              </td>
              <td className="py-2 px-4">
                {brand.modelName.charAt(0).toUpperCase() +
                  brand.modelName.slice(1)}
              </td>
              <td className="py-2 px-4 flex gap-2 justify-center">
                <button
                  onClick={() => handleEditBtn(brand)}
                  className="px-3 py-1 text-sm border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white transition hover:cursor-pointer"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {allModels?.length === 0 && (
        <div className="flex justify-center items-center text-gray-500 pt-2">
          No series found
        </div>
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
        {/* Next Button */}
        <div></div>
        <button
          className={`bg-blue-950 text-white px-5 py-2 rounded-md  ${
            allModels.length === 10 ? "block" : "hidden"
          }`}
          onClick={handleNextPage}
        >
          Next ›
        </button>
      </div>
      {isOpen === "Add" && (
        <AddModel
          handleClose={() => handleToggleModal("")}
          handleGetAllModels={handleGetAllModels}
        />
      )}
      {isOpen === "Edit" && (
        <EditModal
          handleClose={() => handleToggleModal("")}
          seleteModel={seleteModel}
          handleGetAllModels={handleGetAllModels}
        />
      )}
    </div>
  );
};
