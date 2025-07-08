import React from "react";

const CertificateCreation = ({
  certificateNumber = "123456",
  issuedDate = "2024-01-01",
  validUntil = "2025-01-01",
  logoUrl = "/images/logo.png",
}) => {
  return (
    <div className="max-w-md w-full bg-white text-center rounded-xl shadow-md overflow-hidden border border-gray-200 mb-10 mt-10">
     
      <div className="bg-green-600 text-white text-center font-semibold py-2 tracking-wide uppercase">
        Certified by Chuhdary Cars Auction
      </div>

      <div className="flex p-6 items-center gap-5">
   
        <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-4 border-green-600 shadow-lg">
          <img
            src={logoUrl}
            alt="Chuhdary Cars Auction Logo"
            className="w-full h-full object-contain"
          />
        </div>

    
        <div className="flex flex-col flex-grow space-y-2">
          <h2 className="text-xl font-bold text-gray-800">Vehicle Certified</h2>

          <div className="text-gray-600 text-sm space-y-1">
            <p>
              <span className="font-semibold text-gray-700">Certificate #:</span>{" "}
              {certificateNumber}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Issued:</span>{" "}
              {new Date(issuedDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Valid Until:</span>{" "}
              {new Date(validUntil).toLocaleDateString()}
            </p>
          </div>
        </div>

     
        <div className="flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CertificateCreation;
