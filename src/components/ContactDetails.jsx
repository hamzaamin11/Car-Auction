import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const ContactDetails = () => {
  const items = [
    "Discuss a total loss vehicle.",
    "Questions about a settlement figure.",
    "What happens after your vehicle is received by Copart.",
    "Insurance policy clarification",
  ];

  return (
    <div className="w-1/1 bg-gray-100 p-8 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-700 mb-4">Vehicle Claim</h2>
      <p className="text-lg text-gray-600 mb-6">
        Contact us for any queries regarding the following:
      </p>

      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start space-x-3">
            <FaCheckCircle className="text-[#ffbf00] text-sm mt-1" />
            <span className="text-gray-700 text-base">{item}</span>
          </li>
        ))}
      </ul>
      <p className='text-lg text-gray-600 mt-6'>
      Please contact us by filling in the online form below or by using the contact details provided.
      </p>
    </div>
  );
};

export default ContactDetails;
