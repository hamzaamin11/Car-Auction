
import React from 'react';

const VehicleForm = () => {
  return (
    <section className="bg-white py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-6">Get a Quote for Your Vehicle</h2>
      <form className="max-w-xl mx-auto grid gap-4">
        <input type="text" placeholder="Full Name" className="border p-3 rounded" />
        <input type="email" placeholder="Email Address" className="border p-3 rounded" />
        <input type="text" placeholder="Vehicle Make & Model" className="border p-3 rounded" />
        <input type="number" placeholder="Year of Manufacture" className="border p-3 rounded" />
        <textarea placeholder="Additional Details" rows="4" className="border p-3 rounded"></textarea>
        <button type="submit" className="bg-[#233d7b] hover:bg-blue-900 text-white py-3 rounded font-semibold">
          Submit for Evaluation
        </button>
      </form>
    </section>
  );
};

export default VehicleForm;
