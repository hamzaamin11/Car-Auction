import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../components/Contant/URL";
import { useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaUpload,
  FaImage,
  FaSave,
  FaTimes,
} from "react-icons/fa";

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
      handleGetAllDocs();
      handleIsOpenToggle("");
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
          className="w-full h-full object-cover rounded-lg"
        />
      );

    if (serverImage)
      return (
        <img
          src={serverImage}
          alt={key}
          className="w-full h-full object-cover rounded-lg"
        />
      );

    return (
      <div className="flex flex-col items-center justify-center text-gray-400">
        <FaImage className="text-4xl mb-2" />
        <span className="text-sm">No Image</span>
      </div>
    );
  };

  const documentGroups = [
    {
      title: "Vehicle Registration Documents",
      items: [
        { key: "registrationImg", label: "Original Registration Book" },
        { key: "ownerCnicImg", label: "Owner Original CNIC" },
        { key: "transferOrderImg", label: "Transfer Order (T.O.) Form" },
        { key: "FormImg", label: "Form 'F' (Application)" },
      ],
    },
    {
      title: "Verification & Identification",
      items: [
        { key: "bioMetricSlipImg", label: "Biometric Verification Slip" },
        { key: "chassicImg", label: "Engine & Chassis Numbers" },
        { key: "nocImg", label: "NOC Certificate" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-95 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-900 text-white p-3 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleIsOpenToggle("")}
                className="hover:bg-blue-800 p-3 rounded-full transition"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h2 className="text-2xl font-bold">Vehicle Documents Upload</h2>
                <p className="text-blue-200 mt-1">
                  Upload all required inspection documents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {documentGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                {group.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.items.map(({ key, label }) => (
                  <div
                    key={key}
                    className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Preview Box */}
                      <div className="flex-shrink-0">
                        <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
                          {renderImage(key)}
                        </div>
                      </div>

                      {/* Upload Section */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {label}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          Upload clear image of the document. Supported formats:
                          JPG, PNG, PDF
                        </p>

                        <div className="mb-4">
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Choose File
                          </label>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2.5 rounded-lg cursor-pointer hover:opacity-95 transition">
                              <FaUpload />
                              <span>Browse</span>
                              <input
                                type="file"
                                name={key}
                                accept="image/*"
                                className="hidden"
                                onChange={handleUploadImage}
                              />
                            </label>
                            <span className="text-sm text-gray-500">
                              Max size: 5MB
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 p-3 bg-blue-50 rounded-lg">
                          📌 Ensure the document is valid, clear, and all
                          details are visible
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Note:</span> All documents must be
              clear and valid for inspection
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleIsOpenToggle("")}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <FaTimes />
                Cancel
              </button>

              <button
                onClick={handleUploadData}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-blue-900 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? (
                  <>⏳ Processing...</>
                ) : (
                  <>
                    <FaSave />
                    Save All Documents
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
