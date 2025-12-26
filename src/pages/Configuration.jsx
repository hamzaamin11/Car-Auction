import { useEffect, useState } from "react";
import { BASE_URL } from "../components/Contant/URL";
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 kept & used
import { AddCityModal } from "../components/CityModal/AddCity";
import { EditCityModal } from "../components/CityModal/EditCity";
import CustomAdd from "../CustomAdd";
import CustomSearch from "../CustomSearch";
import { AddCommission } from "../components/CommissionModal/AddCommission";
import { EditCommission } from "../components/CommissionModal/EditCommission";

export const Configuration = () => {
  const [isOpen, setIsOpen] = useState("");
  const [seleteCommission, setSeleteCommission] = useState();
  const [search, setSearch] = useState("");
  const [allCommission, setAllCommission] = useState(null);
  let getCommission = allCommission?.data;

  const handleToggleModal = (active) =>
    setIsOpen((prev) => (prev === active ? "" : active));

  const handleGetCommission = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getcommission`);
      console.log(res.data);
      setAllCommission(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCommission = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Are you sure to want delete this Commission?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#9333ea",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;

      const res = await axios.patch(
        `${BASE_URL}/deletecommission/${getCommission?.id}`
      );

      await Swal.fire({
        title: "Deleted!",
        text: "City deleted successfully",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        timerProgressBar: true,
      });
      handleGetCommission();
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  useEffect(() => {
    handleGetCommission();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 p-2 lg:p-6">
      {/* YOUR ORIGINAL HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800">
          Configure Commission
        </h2>
        <div className="relative w-full max-w-md">
          <CustomSearch
            placeholder="Search By commission..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CustomAdd text="Add %" onClick={() => handleToggleModal("Add")} />
      </div>

      {/* YOUR ORIGINAL TABLE */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-950 text-white text-base">
            <tr>
              <th className="py-3 px-6 text-left">SR#</th>
              <th className="py-3 px-6 text-center">Commission %</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          {getCommission && (
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{"1"}</td>
                <td className="py-3 px-6 text-center capitalize">
                  {getCommission?.commission}
                </td>
                <td className="py-3 px-6 text-center space-x-2">
                  <CustomAdd
                    text="Edit"
                    variant="edit"
                    onClick={() => {
                      handleToggleModal("Edit"),
                        setSeleteCommission(getCommission?.id);
                    }}
                  />
                  <CustomAdd
                    text="Delete"
                    variant="delete"
                    onClick={() => handleDeleteCommission(getCommission)}
                  />
                </td>
              </tr>
            </tbody>
          )}
        </table>
        {getCommission === null && (
          <span className="flex items-center justify-center p-2 text-gray-300">
            No Commission
          </span>
        )}
      </div>

      {isOpen === "Add" && (
        <AddCommission
          handleClose={() => handleToggleModal("")}
          handleGetAllCommission={handleGetCommission}
        />
      )}
      {isOpen === "Edit" && (
        <EditCommission
          handleClose={() => handleToggleModal("")}
          seleteCommission={seleteCommission}
          handleGetAllCommission={handleGetCommission}
        />
      )}
    </div>
  );
};
