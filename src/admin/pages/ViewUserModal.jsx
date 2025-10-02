import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import { MdClose } from "react-icons/md";
import UserContext from "../../context/UserContext";
import UserImage from "../../assets/Avatar.png";

const ViewUserModal = ({ isOpen, closeModal }) => {
  const { userbyId } = useContext(UserContext);

  return (
    <Transition appear show={!!isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        {/* Background blur + dark overlay */}
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

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                {/* Header with close */}
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-bold text-blue-700 flex justify-between items-center mb-6"
                >
                  User Details
                  <button
                    onClick={closeModal}
                    className="text-rose-600 hover:text-rose-800"
                  >
                    <MdClose size={26} />
                  </button>
                </Dialog.Title>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Profile Image */}
                  <div className="flex flex-col items-center w-full md:w-1/2">
                    <img
                      src={userbyId?.image || UserImage}
                      alt="user-img"
                      className="h-40 w-40 rounded-full object-cover border-4 border-purple-300 shadow-md bg-blue-500"
                    />
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-px bg-gradient-to-b from-purple-300 to-purple-700" />

                  {/* Right: Info */}
                  <div className="w-full md:w-1/2">
                    {userbyId ? (
                      <div className="space-y-3 text-gray-800">
                        <p>
                          <strong>Name:</strong>{" "}
                          {userbyId.name.charAt(0).toUpperCase() +
                            userbyId.name.slice(1) || "N/A"}
                        </p>
                        <p>
                          <strong>Contact:</strong>{" "}
                          {userbyId.contact.slice(0, 13) || "N/A"}
                        </p>

                        <p>
                          <strong>Email:</strong>{" "}
                          {userbyId.email.charAt(0).toUpperCase() +
                            userbyId.email.slice(1) || "N/A"}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Loading user information...
                      </p>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewUserModal;
