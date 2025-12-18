import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../components/Contant/URL";
import { useSelector } from "react-redux";
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

export const InspectionDoc = ({ handleIsOpenToggle, selectedVehicle }) => {
  console.log(" =>>", selectedVehicle);
  const { currentUser } = useSelector((state) => state?.auth);

  const [inspectionData, setInspectionData] = useState(initialState);
  const [previewImage, setPreviewImage] = useState(initialState);
  const [selectedImage, setSelectedImage] = useState({ data: {} });
  const [loading, setLoading] = useState(false);

  // 🔹 Handle File Selection
  const handleUploadImage = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setInspectionData((prev) => ({
      ...prev,
      [name]: file,
    }));

    setPreviewImage((prev) => ({
      ...prev,
      [name]: preview,
    }));
  };

  // 🔹 Upload to Backend
  const handleUploadData = async () => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(inspectionData).forEach((key) => {
      formData.append(key, inspectionData[key]);
    });

    try {
      const res = await axios.post(
        `${BASE_URL}/seller/inspection/${currentUser?.id}/${selectedVehicle?.newVehicleId}`,
        formData
      );
      console.log("Upload Response:", res.data);

      // Refresh after upload
      handleGetAllDocs();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // 🔹 Fetch Existing Images
  const handleGetAllDocs = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/seller/getInspection/${currentUser?.id}/${selectedVehicle?.newVehicleId}`
      );

      console.log("Server data =>", res.data);
      setSelectedImage(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllDocs();
  }, []);

  // 🔹 Helper UI Renderer
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

    return "📷";
  };

  return (
    <div className="fixed bg-white p-6 w-full z-50 inset-0 overflow-y-auto">
      <h3 className="font-bold text-lg mb-6 flex items-center gap-3 bg-blue-950 text-white p-2 rounded ">
        <span onClick={() => handleIsOpenToggle("")}>
          <FaArrowLeft />
        </span>
        Upload Vehicle Documents
      </h3>

      {/* -------- TOP ROW INPUTS -------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          ["registrationImg", "Original Registration Book"],
          ["ownerCnicImg", "Owner Original CNIC"],
          ["transferOrderImg", "Transfer Order (T.O.) Form"],
          ["FormImg", "Form 'F' (Application for Registration/Transfer)"],
        ].map(([key, label]) => (
          <div key={key} className="flex flex-col">
            <label className="mb-1 font-semibold">{label}</label>
            <input
              type="file"
              name={key}
              accept="image/*"
              className="border p-2 rounded-md"
              onChange={handleUploadImage}
            />
          </div>
        ))}
      </div>

      {/* -------- PREVIEW ROW -------- */}
      <div className="flex justify-around items-center gap-4 mb-10">
        {["registrationImg", "ownerCnicImg", "transferOrderImg", "FormImg"].map(
          (key, i) => (
            <div
              key={i}
              className="w-56 h-56 bg-gray-200 rounded-md flex items-center justify-center text-3xl overflow-hidden"
            >
              {renderImage(key)}
            </div>
          )
        )}
      </div>

      {/* -------- BOTTOM ROW INPUTS -------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          ["bioMetricSlipImg", "Biometric Verification Slip"],
          ["chassicImg", "Image of Engine & Chassis Numbers"],
          ["nocImg", "NOC (No Objection Certificate)"],
        ].map(([key, label]) => (
          <div key={key} className="flex flex-col">
            <label className="mb-1 font-semibold">{label}</label>
            <input
              type="file"
              name={key}
              accept="image/*"
              className="border p-2 rounded-md"
              onChange={handleUploadImage}
            />
          </div>
        ))}
      </div>

      {/* -------- LOWER PREVIEW -------- */}
      <div className="flex justify-around gap-4 mb-6">
        {["bioMetricSlipImg", "chassicImg", "nocImg"].map((key, i) => (
          <div
            key={i}
            className="w-56 h-56 bg-gray-200 rounded-md flex items-center justify-center text-3xl overflow-hidden"
          >
            {renderImage(key)}
          </div>
        ))}
      </div>

      {/* -------- ACTION BUTTONS -------- */}
      <div className="flex justify-center gap-3 py-5">
        <button
          type="button"
          onClick={() => handleIsOpenToggle("")}
          className="px-6 py-2.5 text-white bg-red-600 rounded-md hover:opacity-95"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleUploadData}
          className="px-6 py-2.5 bg-blue-950 text-white rounded-md"
        >
          {loading ? "Loading..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
