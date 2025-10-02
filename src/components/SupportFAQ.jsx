import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    q: "How do I register an account?",
    a: "Click on Sign Up and follow the simple steps to create your account. You will receive a verification email after registration.",
  },
  {
    q: "How can I contact customer support?",
    a: "You can email us at support@WheelBidz.com, use our 24/7 live chat, or fill out the contact form below.",
  },
  {
    q: "Can I cancel my vehicle listing?",
    a: 'Yes, you can cancel your listing before any bids are placed. Go to your dashboard and click "Cancel Listing".',
  },
];

const SupportFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-10 px-6 bg-gray-100">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
        Frequently Asked Questions
      </h2>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md transition hover:shadow-lg"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
            >
              <span className="text-lg font-medium text-[#233d7b]">
                {faq.q}
              </span>
              {activeIndex === index ? (
                <ChevronUpIcon className="w-6 h-6 text-[#233d7b]" />
              ) : (
                <ChevronDownIcon className="w-6 h-6 text-[#233d7b]" />
              )}
            </button>
            {activeIndex === index && (
              <div className="px-6 pb-4 text-gray-700 transition duration-300 ease-in-out">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SupportFAQ;
