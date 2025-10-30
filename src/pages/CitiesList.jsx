import { useEffect, useState } from "react";
import { BASE_URL } from "../components/Contant/URL";
import axios from "axios";
import { toast } from "react-toastify";
import { AddCityModal } from "../components/CityModal/AddCity";
import { EditCityModal } from "../components/CityModal/EditCity";
import CustomAdd from "../CustomAdd";
import CustomSearch from "../CustomSearch";
export const CitiesList = () => {
  const [isOpen, setIsOpen] = useState("");
  const [loading, setLoading] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [seleteCity, setSeleteCity] = useState();
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);

  console.log(pageNo);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPageNo(1); // Reset to page 1 on search
  };

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handlePrevPage = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleGetAllCities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`, {
        params: {
          search: search,
          page: pageNo,
          limit: 10,
        },
      });

      setAllCities(res.data);
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
    setSeleteCity(data);
  };

  const handleDeleteBrand = async (id) => {
    try {
      const res = await axios.patch(`${BASE_URL}/admin/deleteBrand/${id}`);
      console.log(res.data);
      handleGetAllCities();
      toast.success("Brand has been deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllCities();
  }, [search, pageNo]);

  return (
    <div className="min-h-screen bg-gray-100 p-2 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800">
          Cities List
        </h2>
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
  placeholder="Search By City Name..."
  value={search}
  onChange={handleSearchChange}
/>
        </div>
      <CustomAdd text="Add City" onClick={() => handleToggleModal("Add")} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden table-auto">
          <thead className="bg-blue-950 text-white text-base">
            <tr>
              <th className="py-3 px-6 text-left w-1/12">SR#</th>
              <th className="py-3 px-6 text-center w-full">City Name</th>
              <th className="py-3 px-6 text-center w-4/12">Action</th>
            </tr>
          </thead>

          <tbody>
            {allCities?.map((city, index) => (
              <tr
                key={city.id}
                className="border-b hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 text-gray-700">
                  {(pageNo - 1) * 10 + index + 1}
                </td>

                <td className="py-3 px-6 text-gray-800 capitalize  text-center w-full">
                  {city.cityName}
                </td>

                <td className="py-3 px-6 text-center">
               <CustomAdd text="Edit" variant="edit" onClick={() => handleEditBtn(city)} />

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allCities.length === 0 && (
        <div className="text-center text-gray-500 py-4">No cities found</div>
      )}

      {isOpen === "Add" && (
        <AddCityModal
          handleClose={() => handleToggleModal("")}
          handleGetAllCities={handleGetAllCities}
        />
      )}

      {isOpen === "Edit" && (
        <EditCityModal
          handleClose={() => handleToggleModal("")}
          seleteCity={seleteCity}
          handleGetAllCities={handleGetAllCities}
        />
      )}

      <div className="flex justify-between mt-6">
        <button
          className={`bg-blue-950 text-white px-5 py-2 rounded-md ${
            pageNo > 1 ? "block" : "hidden"
          }`}
          onClick={handlePrevPage}
        >
          ‹ Prev
        </button>
        <div></div>
        <button
          className={`bg-blue-950 text-white px-5 py-2 rounded-md ${
            allCities.length === 10 ? "block" : "hidden"
          }`}
          onClick={handleNextPage}
        >
          Next ›
        </button>
      </div>
    </div>
  );
};
