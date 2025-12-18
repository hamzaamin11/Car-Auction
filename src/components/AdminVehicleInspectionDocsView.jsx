import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "./Contant/URL";
import { FaArrowLeft } from "react-icons/fa";

const initialState = {
  registrationImg: "",
  ownerCnicImg: "",
  transferOrderImg: "",
  FormImg: "",
  bioMetricSlipImg: "",
  chassicImg: "",
  nocImg: "",
};

export const AdminVehicleInspectionDocsView = ({
  handleIsOpenToggle,
  selectedVehicle,
}) => {
  const { currentUser } = useSelector((state) => state?.auth);

  const [inspectionData, setInspectionData] = useState(initialState);
  const [previewImage, setPreviewImage] = useState(initialState);
  const [selectedImage, setSelectedImage] = useState({ data: {} });
  const [loading, setLoading] = useState(false);

  // 🔹 File Upload
  const handleUploadImage = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setInspectionData((prev) => ({ ...prev, [name]: file }));
    setPreviewImage((prev) => ({ ...prev, [name]: preview }));
  };

  // 🔹 Upload to Backend
  const handleUploadData = async () => {
    setLoading(true);
    const formData = new FormData();

    Object.keys(inspectionData).forEach((key) => {
      formData.append(key, inspectionData[key]);
    });

    try {
      await axios.post(
        `${BASE_URL}/seller/inspection/${currentUser?.id}/${selectedVehicle?.newVehicleId}`,
        formData
      );

      handleGetAllDocs();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Existing Images
  const handleGetAllDocs = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/seller/getInspection/${currentUser?.id}/${selectedVehicle?.newVehicleId}`
      );
      setSelectedImage(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllDocs();
  }, []);

  // 🔹 Helper Renderer
  const renderImage = (key) => {
    const localPreview = previewImage[key];
    const serverImage = selectedImage?.data?.[key];

    if (localPreview)
      return (
        <img
          src={localPreview}
          alt={key}
          className="w-full h-full object-cover"
        />
      );

    if (serverImage)
      return (
        <img
          src={serverImage}
          alt={key}
          className="w-full h-full object-cover"
        />
      );

    return <span className="text-4xl">📷</span>;
  };

  return (
    <div className="fixed bg-white p-4 sm:p-6 w-full z-50 inset-0 overflow-y-auto">
      {/* Header */}
      <h3 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-3 bg-blue-900 text-white p-3 rounded">
        <span
          onClick={() => handleIsOpenToggle("")}
          className="text-white text-lg"
        >
          <FaArrowLeft />
        </span>
        <span>Vehicle Documents</span>
      </h3>

      {/* -------- LABELS + IMAGES GRID -------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          ["registrationImg", "Original Registration Book"],
          ["ownerCnicImg", "Owner Original CNIC"],
          ["transferOrderImg", "Transfer Order (T.O.) Form"],
          ["FormImg", "Form 'F' Registration/Transfer Form"],
          ["bioMetricSlipImg", "Biometric Verification Slip"],
          ["chassicImg", "Engine & Chassis Numbers"],
          ["nocImg", "NOC (No Objection Certificate)"],
        ].map(([key, label]) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="font-semibold text-sm sm:text-base">
              {label}
            </label>

            <div className="relative w-full h-48 sm:h-56 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
              {renderImage(key)}
            </div>

            {/* Hidden File Input */}
          </div>
        ))}
      </div>

      {/* -------- ACTION BUTTONS -------- */}
      <div className="flex justify-center gap-3 py-6">
        <button
          type="button"
          onClick={() => handleIsOpenToggle("")}
          className="px-5 py-2 text-white bg-red-600 rounded-md text-sm sm:text-base hover:opacity-95 flex items-center gap-1"
        >
          <FaArrowLeft /> Back
        </button>
      </div>
    </div>
  );
};
