
import React from 'react';

const reasons = [
  "Instant cash offer within minutes",
  "Free vehicle inspection",
  "No hidden fees",
  "Trusted and certified buyers",
];

const WhySellSection = () => {
  return (
    <section className="py-12 px-6 bg-gray-100 text-gray-800">
      <h2 className="text-3xl font-bold text-center mb-6">Why Sell to Us?</h2>
      <ul className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {reasons.map((reason, index) => (
          <li key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            ✅ {reason}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WhySellSection;
