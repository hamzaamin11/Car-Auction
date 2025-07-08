
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const SupportModal = ({ topic, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{topic.title}</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          {topic.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default SupportModal;
