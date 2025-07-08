
import React from 'react';

const steps = [
  { title: 'Step 1', desc: 'Submit your vehicle details' },
  { title: 'Step 2', desc: 'We inspect and certify your car' },
  { title: 'Step 3', desc: 'Your car is listed in our live auction' },
  { title: 'Step 4', desc: 'Highest bidder wins and you get paid' },
];

const AuctionSteps = () => {
  return (
    <section className="py-16 px-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
      <div className="grid gap-8 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition duration-300"
          >
            <div className="text-4xl font-extrabold text-[#233d7b] mb-2">{step.title}</div>
            <p className="text-gray-700">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AuctionSteps;
