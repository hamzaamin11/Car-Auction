
import React from 'react';

const SupportDetails = ({ title, steps }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title} - Guide</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-700">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default SupportDetails;
