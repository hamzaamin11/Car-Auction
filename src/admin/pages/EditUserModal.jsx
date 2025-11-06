import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { BASE_URL } from "../../components/Contant/URL";

const EditUserModal = ({ Open, setOpen, selectedUser, onUserUpdated }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
    cnic: "",
    postcode: "",
    address: "",
    image: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setUser({
        id: selectedUser.id || "",
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        contact: selectedUser.contact || "",
        postcode: selectedUser.postcode || "",
        address: selectedUser.address || "",
        image: selectedUser.image || "",
        cnic: selectedUser.cnic || "",
        password: selectedUser.password || "",
        role: selectedUser.role || "",
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove all non-digits
    if (value.startsWith("92")) {
      value = "+" + value;
    } else if (!value.startsWith("+92")) {
      value = "+92" + value;
    }
    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 6 && value.length <= 10) {
      value = value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6);
    } else if (value.length > 10) {
      value = value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 15);
    }
    setUser({ ...user, contact: value });
  };

  const handleCNICChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5 && value.length <= 12) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    } else if (value.length > 12) {
      value = value.slice(0, 5) + "-" + value.slice(5, 12) + "-" + value.slice(12, 13);
    }
    setUser({ ...user, cnic: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("contact", user.contact);
    formData.append("postcode", user.postcode);
    formData.append("address", user.address);
    formData.append("cnic", user.cnic);
    formData.append("password", user.password);
    formData.append("role", user.role);
    if (user.image && user.image instanceof File) {
      formData.append("image", user.image);
    }

    try {
      const response = await fetch(
        `${BASE_URL}/admin/updateRegisterUsers/${selectedUser.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      toast.success("User updated successfully!", {
        autoClose: 3000,
      });
      onUserUpdated(updatedUser); // Call the callback with updated user data
      setOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user.");
    }
  };

  const closeModal = () => setOpen(false);

  return (
    <Transition appear show={!!Open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 bg-black/20"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto top-20">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl flex flex-row justify-between items-center font-bold leading-6 mb-4"
                >
                  Edit User
                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center cursor-pointer rounded-md text-sm font-medium text-white"
                      onClick={closeModal}
                    >
                      <MdClose size={24} className="text-rose-600" />
                    </button>
                  </div>
                </Dialog.Title>

                <form onSubmit={handleEditUser}>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="contact"
                        value={user.contact}
                        onChange={handleMobileChange}
                        placeholder="+92-300-1234567"
                        className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={15}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <select
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="seller">Seller</option>
                        <option value="customer">Customer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        CNIC
                      </label>
                      <input
                        type="tel"
                        placeholder="00000-0000000-0"
                        name="cnic"
                        value={user.cnic}
                        onChange={handleCNICChange}
                        className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        maxLength={15}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123 Main St"
                        maxLength={20}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        User Image
                      </label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {user.image && typeof user.image === "string" && user.image !== "null" && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                          <img
                            src={user.image}
                            alt="Profile"
                            className="h-24 w-24 object-cover rounded-full border-2 border-indigo-400 shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center pt-3">
                    <button
                      type="submit"
                      className="p-6 flex justify-center bg-blue-950 text-white py-3 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 font-semibold hover:cursor-pointer"
                    >
                      Update User
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditUserModal;