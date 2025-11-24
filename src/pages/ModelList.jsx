import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../components/Contant/URL";
import { AddModel } from "../components/ModelModal/AddModel";
import { EditModal } from "../components/ModelModal/EditModal";
import CustomAdd from "../CustomAdd";
import CustomSearch from "../CustomSearch";

export const ModelList = () => {
  const [isOpen, setIsOpen] = useState("");
  const [loading, setLoading] = useState(false);
  const [allModels, setAllModels] = useState([]);        // All loaded models
  const [hasMore, setHasMore] = useState(true);          // More pages exist?
  const [seleteModel, setSeleteModel] = useState();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const itemsPerRequest = 10; // Backend fixed limit

  const handleToggleModal = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleEditBtn = (data) => {
    handleToggleModal("Edit");
    setSeleteModel(data);
  };

  const handleDeleteModel = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/deleteModel/${id}`);
      toast.success("Model deleted successfully");
      loadModels(true);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete model");
    }
  };

  // Fetch one page
  const fetchPage = async (page, searchTerm = "") => {
    try {
      const res = await axios.get(`${BASE_URL}/getModels`, {
        params: { search: searchTerm, page, limit: itemsPerRequest },
      });
      const data = res.data || [];
      if (data.length < itemsPerRequest) setHasMore(false);
      return data;
    } catch (error) {
      toast.error("Failed to load models");
      return [];
    }
  };

  // Load data — SAME LOGIC AS YOUR BRANDLIST
  const loadModels = async (reset = false) => {
    setLoading(true);
    const pageToLoad = reset ? 1 : Math.floor(allModels.length / itemsPerRequest) + 1;
    const newModels = await fetchPage(pageToLoad, search);

    if (reset) {
      setAllModels(newModels);
      setHasMore(newModels.length === itemsPerRequest);
    } else {
      setAllModels(prev => [...prev, ...newModels]);
    }
    setLoading(false);
  };

  // Reset on search or itemsPerPage change
  useEffect(() => {
    setAllModels([]);
    setHasMore(true);
    setCurrentPage(1);
    loadModels(true);
  }, [search, itemsPerPage]);

  // Auto-load more when needed
  useEffect(() => {
    const needed = currentPage * itemsPerPage;
    if (allModels.length < needed && hasMore && !loading) {
      loadModels(false);
    }
  }, [currentPage, itemsPerPage]);

  // PERFECT PAGINATION MATH — EXACT SAME AS BRANDLIST
  const totalItems = allModels.length + (hasMore ? 1 : 0);  // +1 keeps "Next" alive
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, allModels.length);
  const currentDisplay = allModels.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:p-6 p-2">
      {/* Header — YOUR ORIGINAL */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800">
          Vehicle Model List 
        </h2>
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </span>
          <CustomSearch
            placeholder="Search By Car Make or Model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CustomAdd text="Add Model" onClick={() => handleToggleModal("Add")} />
      </div>

      {/* Table — YOUR ORIGINAL */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="py-3 px-4 text-left">SR#</th>
              <th className="py-3 px-4 text-left">Make Name</th>
              <th className="py-3 px-4 text-left">Model Name</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && allModels.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-10">Loading...</td></tr>
            ) : currentDisplay.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-500">No models found</td></tr>
            ) : (
              currentDisplay.map((model, index) => (
                <tr key={model._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{startIndex + index + 1}</td>
                  <td className="py-3 px-4">
                    {model.brandName?.charAt(0).toUpperCase() + model.brandName?.slice(1)}
                  </td>
                  <td className="py-3 px-4">
                    {model.modelName?.charAt(0).toUpperCase() + model.modelName?.slice(1)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CustomAdd text="Edit" variant="edit" onClick={() => handleEditBtn(model)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ONLY THIS PART CHANGED — EXACT SAME PERFECT PAGINATION FROM BRANDLIST */}
      {allModels.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
            <div className="text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{endIndex}</span>{" "}
              <span className="font-medium"></span> entries
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => goToPage(1)} disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}>
                {"<<"}
              </button>
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}>
                {"<"}
              </button>

              {getPageNumbers().map(page => (
                <button key={page} onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded border ${currentPage === page ? "bg-blue-950 text-white" : "bg-white hover:bg-gray-50"}`}>
                  {page}
                </button>
              ))}

              <button onClick={() => goToPage(currentPage + 1)} disabled={!hasMore && currentPage >= totalPages}
                className={`px-3 py-1 rounded border ${(!hasMore && currentPage >= totalPages) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}>
                {">"}
              </button>
              <button onClick={() => goToPage(totalPages)} disabled={!hasMore && currentPage >= totalPages}
                className={`px-3 py-1 rounded border ${(!hasMore && currentPage >= totalPages) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}>
                {">>"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* You can add entries selector here later if you want */}
            </div>
          </div>
        </div>
      )}

      {/* Modals — YOUR ORIGINAL */}
      {isOpen === "Add" && (
        <AddModel handleClose={() => handleToggleModal("")} handleGetAllModels={() => loadModels(true)} />
      )}
      {isOpen === "Edit" && (
        <EditModal handleClose={() => handleToggleModal("")} seleteModel={seleteModel} handleGetAllModels={() => loadModels(true)} />
      )}

      <ToastContainer />
    </div>
  );
};