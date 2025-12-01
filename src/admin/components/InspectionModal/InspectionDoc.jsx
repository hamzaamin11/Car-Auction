import React, { useState } from "react";

const initialState = {
  registrationImg: "",
  ownerCnicImg: "",
  transferOrderImg: "",
  FormImg: "",
  bioMetricSlipImg: "",
  chassicImg: "",
  nocImg: "",
};

export const InspectionDoc = ({ handleIsOpenToggle }) => {
  const [inspectionData, setInspectionData] = useState(initialState);

  console.log("inspection =>", inspectionData);

  // Upload handler
  const handleUploadImage = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview URL
    const preview = URL.createObjectURL(file);

    // Update state
    setInspectionData((prev) => ({
      ...prev,
      [name]: preview,
    }));
  };

  return (
    <div className="fixed  bg-white p-6 w-full  z-50 inset-0 ">
      <h3 className="font-bold text-lg mb-6 flex items-center gap-2 bg-blue-950 text-white p-2 p rounded">
        Upload Vehicle Documents
      </h3>

      {/* TOP ROW INPUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">
            Original Registration Book
          </label>
          <input
            type="file"
            name="registrationImg"
            className="border p-2 rounded-md"
            onChange={handleUploadImage}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Owner Original CNIC</label>
          <input
            type="file"
            name="ownerCnicImg"
            className="border p-2 rounded-md"
            onChange={handleUploadImage}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">
            Transfer Order (T.O.) Form
          </label>
          <input
            type="file"
            name="transferOrderImg"
            className="border p-2 rounded-md"
            onChange={handleUploadImage}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">
            Form 'F' (Application for Registration/Transfer)
          </label>
          <input
            type="file"
            name="FormImg"
            className="border p-2 rounded-md"
            onChange={handleUploadImage}
          />
        </div>
      </div>

      {/* MID IMAGE ROW */}
      <div className="flex justify-around items-center gap-4 mb-10">
        {["registrationImg", "ownerCnicImg", "transferOrderImg", "FormImg"].map(
          (key, i) => (
            <div
              key={i}
              className="w-28 h-28 bg-gray-300 rounded-md flex items-center justify-center text-3xl overflow-hidden"
            >
              {inspectionData[key] ? (
                <img
                  src={inspectionData[key]}
                  alt={key}
                  className="w-full h-full object-cover"
                />
              ) : (
                "📷"
              )}
            </div>
          )
        )}
      </div>

      {/* BOTTOM ROW INPUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">
            Biometric Verification Slip
          </label>
          <input
            type="file"
            name="bioMetricSlipImg"
            className="border p-2 rounded-md"
            onChange={handleUploadImage}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">
            Image of Engine & Chassis Numbers
          </label>
          <input
            type="file"
            name="chassicImg"
            className="border p-2 rounded-md"
            onChange={handleUploadImage}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">
            NOC (No Objection Certificate)
          </label>
          <input
            type="file"
            name="nocImg"
            className="border p-2 rounded-md"
            onChange={handleUploadImage}
          />
        </div>
      </div>

      {/* LAST IMAGE ROW */}
      <div className="flex justify-around gap-4">
        {["bioMetricSlipImg", "chassicImg", "nocImg"].map((key, i) => (
          <div
            key={i}
            className="w-28 h-28 bg-gray-300 rounded-md flex items-center justify-center text-3xl overflow-hidden"
          >
            {inspectionData[key] ? (
              <img
                src={inspectionData[key]}
                alt={key}
                className="w-full h-full object-cover"
              />
            ) : (
              "📷"
            )}
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-center gap-3 py-5 ">
          <button
            type="button"
            onClick={() => handleIsOpenToggle("")}
            className="px-6 py-2.5 text-white bg-red-600 rounded-md hover:opacity-95"
          >
            Cancel
          </button>
          <button
            type="button"
            // disabled={loading}
            // onClick={handleProfileSubmit}
            className="px-6 py-2.5 bg-blue-950 text-white rounded-md"
          >
            {"Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
