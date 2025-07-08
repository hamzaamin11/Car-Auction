import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import { MdClose } from "react-icons/md";
// import userImg from "../../assets/userImg.webp"
import UserContext from "../../context/UserContext";

const ViewUserModal = ({ isOpen, closeModal }) => {
  const { userbyId } = useContext(UserContext);

  return (
    <Transition appear show={!!isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10 bg-black/20" onClose={closeModal}>
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
                  User Details
                  <div className="">
                  <button
                    type="button"
                    className="inline-flex justify-center cursor-pointer rounded-md  text-sm font-medium text-white "
                    onClick={closeModal}
                  >
                    <MdClose size={24} className="text-rose-800"/>
                  </button>
                </div>
                </Dialog.Title>

              <div className="flex flex-row justify-between mt-6 items-center">
                <div className="w-1/2">
                
                  <img src={userbyId?.image} alt="donor-img" className="h-32 w-32 rounded-full"/>
                
                </div>
                 <div className="h-50 w-px mr-6 bg-purple-800 self-stretch"></div>
                <div className="w-1/2">
                
                {userbyId ? (
                  <div className="py-3">
                    <p className="mb-1"><strong>Name:</strong> {userbyId?.name || "N/A"}</p>
                    <p className="mb-1"><strong>Contact:</strong> {userbyId?.contact || "N/A"}</p>
                    <p className="mb-1"><strong>Address:</strong> {userbyId?.address || "N/A"}</p>
                    <p className="mb-1"><strong>Email:</strong> {userbyId?.email || "N/A"}</p>
                    <p className="mb-1"><strong>Postcode:</strong> {userbyId?.postcode || "N/A"}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Loading user information...</p>
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
