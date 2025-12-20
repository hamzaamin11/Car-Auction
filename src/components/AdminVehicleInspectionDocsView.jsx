import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "./Contant/URL";
import {
  FaArrowLeft,
  FaUpload,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { MdOutlineDocumentScanner } from "react-icons/md";

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
  const [activeDoc, setActiveDoc] = useState(null);

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

  // 🔹 Document Status Checker
  const getDocStatus = (key) => {
    const serverImage = selectedImage?.data?.[key];
    const localPreview = previewImage[key];

    if (serverImage || localPreview) {
      return {
        status: "verified",
        icon: <FaCheckCircle className="text-green-500" />,
        text: "Verified",
        color: "bg-green-50 border-green-200",
      };
    }
    return {
      status: "pending",
      icon: <FaTimesCircle className="text-amber-500" />,
      text: "Pending",
      color: "bg-amber-50 border-amber-200",
    };
  };

  // 🔹 Helper Renderer
  const renderImage = (key) => {
    const localPreview = previewImage[key];
    const serverImage = selectedImage?.data?.[key];

    if (localPreview)
      return (
        <div className="relative w-full h-full">
          <img
            src={localPreview}
            alt={key}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            New
          </div>
        </div>
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
        <MdOutlineDocumentScanner className="text-5xl my-3" />
        <span className="text-sm font-medium">No Document</span>
        <span className="text-xs mt-1">Click to upload</span>
      </div>
    );
  };

  // 🔹 Document List
  const documents = [
    { key: "registrationImg", label: "Original Registration Book", icon: "📔" },
    { key: "ownerCnicImg", label: "Owner Original CNIC", icon: "🆔" },
    {
      key: "transferOrderImg",
      label: "Transfer Order (T.O.) Form",
      icon: "📄",
    },
    {
      key: "FormImg",
      label: "Form 'F' Registration/Transfer Form",
      icon: "📋",
    },
    {
      key: "bioMetricSlipImg",
      label: "Biometric Verification Slip",
      icon: "👤",
    },
    { key: "chassicImg", label: "Engine & Chassis Numbers", icon: "🔧" },
    { key: "nocImg", label: "NOC (No Objection Certificate)", icon: "✅" },
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-lg z-50 overflow-y-auto rounded ">
      <div className="min-h-screen">
        {/* Header */}
        <div className=" mt-10  ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-2   bg-blue-900 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleIsOpenToggle("")}
                  className="flex items-center justify-center w-10 h-10  rounded-full hover:bg-white/30 transition-all duration-200"
                >
                  <FaArrowLeft className="text-lg" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold">
                    Vehicle Inspection Documents
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
          {/* Document Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {documents.map((doc, index) => {
              const status = getDocStatus(doc.key);

              return (
                <div
                  key={doc.key}
                  className={`relative rounded-xl border  shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                  onClick={() => setActiveDoc(doc.key)}
                >
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white px-2 py-1 rounded-full text-xs font-medium shadow">
                    {status.icon}
                    <span>{status.text}</span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12  bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                        {doc.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{doc.label}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Required for inspection
                        </p>
                      </div>
                    </div>

                    {/* Document Preview */}
                    <div className="relative w-full h-48 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden group cursor-pointer">
                      {renderImage(doc.key)}

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                          <FaEye />
                          <span>View Full</span>
                        </button>
                      </div>
                    </div>

                    {/* Upload Button */}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vehicle Info Card */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleIsOpenToggle("")}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
              >
                <FaArrowLeft />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {activeDoc && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
                <h3 className="font-bold">
                  {documents.find((d) => d.key === activeDoc)?.label}
                </h3>
                <button
                  onClick={() => setActiveDoc(null)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                {selectedImage?.data?.[activeDoc] || previewImage[activeDoc] ? (
                  <img
                    src={
                      selectedImage?.data?.[activeDoc] ||
                      previewImage[activeDoc]
                    }
                    alt="Preview"
                    className="w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <MdOutlineDocumentScanner className="text-6xl mx-auto mb-4" />
                    <p>No document available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
