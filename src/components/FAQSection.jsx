import React, { useState } from 'react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  const faqData = [
    {
      question: "How do I start bidding and buying in CHAUDHRY Cars  auctions?",
      answer:
        "The first step to bidding and buying in Copart’s auctions is to register to be a CHAUDHRY Cars Auction Member. Registration is completely free and only takes a few minutes. When you are ready to start bidding on and buying your favourite vehicles, just upload a copy of your photo ID and pay your membership fee. Then, once your documents and account information have been reviewed and approved, you will become an active bidder.",
    },
    {
      question: "How do I buy a vehicle from CHAUDHRY Cars Auction?",
      answer:
        "To buy a vehicle from CHAUDHRY Cars Auction, you need to create an account, browse the available lots, place a bid, and if you win, follow the payment and collection process.",
    },
    {
      question: "What are the payment methods?",
      answer:
        "CHAUDHRY Cars Auction provides several payment methods including bank transfers, credit/debit card payments, and other online payment methods. More details can be found in the payment section.",
    },
    {
      question: "How can I arrange vehicle transportation?",
      answer:
        "You can arrange transportation via CHAUDHRY's transportation app, or you can choose your own preferred transporter for the collection of your vehicle.",
    },
  ];

  return (
    <div className="faq-section bg-white text-gray-800 py-10 px-4 md:px-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
        <hr className="w-20 border-b-2 border-red-600 mx-auto mt-4" />
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border-b">
            <div
              onClick={() => toggleAccordion(index)}
              className="flex justify-between items-center cursor-pointer py-4 px-4 md:px-8 hover:bg-gray-100 transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-700">{item.question}</h3>
              <span className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#ffbf00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>

            {openIndex === index && (
              <div className="px-4 md:px-8 py-4 text-gray-600">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
