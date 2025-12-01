import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export const ChangePasswordModal = ({ handleIsOpenModal }) => {
  const { currentUser } = useSelector((state) => state?.auth);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      await Swal.fire({
        title: "Error!",
        text: "New password and confirm password do not match!",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
      return;
    }
    try {
      await axios.put(`${BASE_URL}/updatePassword/${currentUser?.id}`, {
        password: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      await Swal.fire({
        title: "Success!",
        text: "Password changed successfully!",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
      setPasswordModalOpen(false);
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: "Failed to change password. Please try again.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 w-full  shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900"
              required
            />
          </div>
          <div className="boder border-t mb-4"></div>
          <div className="flex justify-center gap-3  ">
            <button
              type="button"
              onClick={() => handleIsOpenModal("")}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-950 text-white rounded-lg hover:bg-blue-900"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
