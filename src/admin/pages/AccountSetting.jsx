import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { ChangePasswordModal } from "../../components/ChangePasswordModal";
import { ProfileManage } from "../../components/ProfileManage";

export const AccountSetting = () => {
  const [isOpen, setIsOpen] = useState("profile"); // 'profile' or 'password'

  const handleIsOpenModal = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  return (
    <div className="flex gap-4 p-6">
      {/* Sidebar */}
      <div className="w-64 h-56 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <h1 className="bg-blue-950 text-white p-3 text-sm font-semibold">
          Menu
        </h1>

        <div className="bg-gray-50">
          {/* Manage Profile */}
          <div
            onClick={() => handleIsOpenModal("profile")}
            className={`px-6 py-3 text-gray-700 cursor-pointer text-sm transition 
          hover:bg-gray-100 
          ${
            isOpen === "profile"
              ? "bg-blue-100 font-semibold text-blue-900 border-l-4 border-blue-900"
              : ""
          }
        `}
          >
            Manage Profile
          </div>

          {/* Change Password */}
          <div
            onClick={() => handleIsOpenModal("password")}
            className={`px-6 py-3 text-gray-700 cursor-pointer text-sm transition 
          hover:bg-gray-100 
          ${
            isOpen === "password"
              ? "bg-blue-100 font-semibold text-blue-900 border-l-4 border-blue-900"
              : ""
          }
        `}
          >
            Change Password
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1  rounded-xl">
        <div className="bg-blue-950 text-white p-3 rounded-t-xl font-semibold">
          {isOpen === "profile" ? "Manage Profile" : "Change Password"}
        </div>
        {isOpen === "password" && (
          <ChangePasswordModal handleIsOpenModal={handleIsOpenModal} />
        )}

        {isOpen === "profile" && (
          <ProfileManage handleIsOpenModal={handleIsOpenModal} />
        )}
      </div>
    </div>
  );
};
