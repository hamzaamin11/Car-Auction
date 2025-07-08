import React from 'react'
import UserContext from './UserContext'
import PropTypes from 'prop-types'
import { useState } from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';

function UserProvider({children}) {
    const [getUsers, setGetUsers] = useState([]);
    const [userbyId, setUserById] = useState(null);

    const getAllUsers = async () => {
        const res = await fetch("http://localhost:3001/admin/getRegisteredMembers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const data = await res.json();
        setGetUsers(data);
    }

    const getUserbyId = async (id) => {
        const res = await fetch (`http://localhost:3001/admin/getUsersById/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await res.json();
        setUserById(data);

    }


 const delUser = async (id) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This user will be permanently deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#9333ea", // Purple
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
    
      if (!result.isConfirmed) return;
    
      try {
        const res = await fetch(`http://localhost:3001/admin/deleteRegisterUsers/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (res.ok) {
          toast.success("User deleted successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          getAllUsers();
        } else {
          toast.error("Failed to delete the user.");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the user.");
        console.error(error);
      }
    };



useEffect(() => {
    getAllUsers();
}, [])

  return (
    <UserContext.Provider value={{getAllUsers, getUsers, getUserbyId, userbyId, delUser}}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider

UserProvider.prototype = {
    children: PropTypes.node.isRequired
}