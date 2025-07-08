

import React from 'react';
import { FaRegCalendarCheck, FaTruckMoving, FaSmile } from 'react-icons/fa';

const steps = [
  {
    icon: <FaRegCalendarCheck className="text-[#233d7b] w-8 h-8" />,
    title: 'Schedule Pickup',
    description: 'Choose a convenient date and time for vehicle pickup.',
  },
  {
    icon: <FaTruckMoving className="text-[#233d7b] w-8 h-8" />,
    title: 'In Transit',
    description: 'Your vehicle is transported safely to the destination.',
  },
  {
    icon: <FaSmile className="text-[#233d7b] w-8 h-8" />,
    title: 'Delivery Confirmation',
    description: 'Receive your vehicle and confirm its condition upon arrival.',
  },
];

const DeliverySteps = () => (
  <section className="py-16 px-6 bg-gray-100">
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-12">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4 text-[#233d7b]">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DeliverySteps;
