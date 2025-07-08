import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { MdClose, MdPassword } from "react-icons/md";
// import userImg from "../../assets/userImg.webp"
import UserContext from "../../context/UserContext";
import { toast } from "react-toastify";

const EditUserModal = ({ Open, setOpen, selectedUser }) => {
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
console.log("hit me",selectedUser?.id)
  useEffect(() => {
    if (selectedUser) {
      setUser({
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({
        ...prev,
        image: file, // Store the file object directly
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
    if (user.image) {
      formData.append("image", user.image);
    }
console.log("user to edit:", selectedUser.id)
    try {
      const response = await fetch(
        `http://localhost:3001/admin/updateRegisterUsers/${selectedUser.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      console.log("form ka data",formData);
      
        toast.success("User updated successfully!", {
          autoClose: 3000,
        });
        setOpen(false);
        getAllUsers();
        console.log("User updated successfully:", response);
      }
   catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const { getAllUsers } = useContext(UserContext);
  const closeModal = () => setOpen(false)

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
          <div className="fixed inset-0  bg-opacity-20" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl flex flex-row justify-between items-center font-bold  leading-6 text-red-500 mb-4"
                >
                  Edit User
                  <div className="">
                    <button
                      type="button"
                      className="inline-flex justify-center cursor-pointer rounded-md  text-sm font-medium text-white "
                      onClick={closeModal}
                    >
                      <MdClose size={24} className="text-rose-800" />
                    </button>
                  </div>
                </Dialog.Title>

                <form
                  onSubmit={handleEditUser}
                  className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-4"
                >
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
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+123456789"
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
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Postcode
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={user.postcode}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CNIC
                    </label>
                    <input
                      type="text"
                      name="cnic"
                      value={user.cnic}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <option value="">Select Gender</option>
                      <option value="admin">Admin</option>
                      <option value="seller">Seller</option>
                      <option value="customer">Customer</option>
                    </select>
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
                      rows="4"
                      className="mt-1 w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your message..."
                    />
                    {user.image && typeof user.image === "string" && user.image !== "null" && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Current Image:</p>
                        <img
                          src={user.image}
                          alt="Profile"
                          className="h-20 w-20 object-cover rounded mt-1"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300"
                  >
                    Update User
                  </button>
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
