import React, { useState } from "react";

const faqData = [
  {
    question: "Audi Q2 1.0 TFSI Standard Line comes in how many colors?",
    answer:
      "Audi Q2 1.0 TFSI Standard Line comes in 7 different colors i.e Ibis White, Mythos Black, Floret Silver, Daytona Gray, Arabian Blue, Tango Red, Nano Gray.",
  },
  {
    question: "What is the fuel average of Audi Q2 1.0 TFSI Standard Line?",
    answer:
      'The <a href="/new-cars/audi/q2/fuel-average/">Fuel Average of Audi Q2 1.0 TFSI Standard Line</a> is 13 - 15 KM/L.',
  },
  {
    question: "Does Audi Q2 1.0 TFSI Standard Line have Air Bags in it?",
    answer: "It has 6 air bags in it.",
  },
  {
    question: "Find out Audi Q2 1.0 TFSI Standard Line for sale in your city",
    answer:
      'Check Out <a href="/used-cars/audi-q2-1-0-tfsi-standard-line-islamabad/349566">Audi Q2 1.0 TFSI Standard Line for sale in Islamabad</a>, <a href="/used-cars/audi-q2-1-0-tfsi-standard-line-karachi/438493">Karachi</a>, <a href="/used-cars/audi-q2-1-0-tfsi-standard-line-lahore/247331">Lahore</a>, <a href="/used-cars/audi-q2-1-0-tfsi-standard-line-rawalpindi/2624049">Rawalpindi</a>.',
  },
  {
    question: "What is the Fuel Tank Capacity of Audi Q2 1.0 TFSI Standard Line?",
    answer: "The Audi Q2 1.0 TFSI Standard Line has a fuel tank capacity of 65 Liters.",
  },
];

const FAQAcordian = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-blue-800 text-center mb-8">
        Audi Q2 1.0 TFSI Standard Line FAQs
      </h2>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md shadow-sm"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center px-6 py-4 bg-blue-50 hover:bg-blue-100 text-left transition duration-300"
            >
              <span className="text-gray-800 font-medium">{item.question}</span>
              <span className="text-blue-700 text-xl">
                {activeIndex === index ? "−" : "+"}
              </span>
            </button>
            {activeIndex === index && (
              <div className="px-6 py-4 text-gray-700 bg-white border-t text-sm">
                <div
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQAcordian;
