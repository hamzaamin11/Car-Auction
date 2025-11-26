import React from "react";
import UserContext from "./UserContext";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../components/Contant/URL";

function UserProvider({ children }) {
  const [getUsers, setGetUsers] = useState([]);
  const [userbyId, setUserById] = useState(null);

  const getAllUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/getRegisteredMembers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setGetUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const getUserbyId = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/getUsersById/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setUserById(data);
    } catch (error) {
      console.error("Failed to fetch user by ID:", error);
    }
  };

  const delUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `${BASE_URL}/admin/deleteRegisterUsers/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        await Swal.fire({
          title: "Deleted!",
          text: "User deleted successfully!",
          icon: "success",
          confirmButtonColor: "#10b981",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        getAllUsers(); // Refresh list
      } else {
        await Swal.fire({
          title: "Failed!",
          text: "Failed to delete the user.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the user.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{ getAllUsers, getUsers, getUserbyId, userbyId, delUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;


