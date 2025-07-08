import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MakeBidding = ({ setMyBids }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bidAmount: '',
    message: '',
  });

  const vehicle = {
    make: 'Toyota',
    model: 'Corolla',
    year: 2021,
    mileage: '15,000 km',
    location: 'Lahore, Pakistan',
    image: '/images/toyota1.jpg',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bid = {
      ...formData,
      vehicle,
      date: new Date().toLocaleString(),
    };
    setMyBids(prev => [...prev, bid]);
    navigate('/my-bids');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">
        
       
        <div className="p-6 md:p-10 bg-gray-50 border-r">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Vehicle Details</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li><strong>Make:</strong> {vehicle.make}</li>
            <li><strong>Model:</strong> {vehicle.model}</li>
            <li><strong>Year:</strong> {vehicle.year}</li>
            <li><strong>Mileage:</strong> {vehicle.mileage}</li>
            <li><strong>Location:</strong> {vehicle.location}</li>
          </ul>
          <img src={vehicle.image} alt="Car" className="mt-6 rounded-lg w-full object-cover" />
        </div>

        <div className="p-6 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Place Your Bid</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded px-4 py-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded px-4 py-2"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Bid Amount (PKR)"
              className="w-full border rounded px-4 py-2"
              value={formData.bidAmount}
              onChange={(e) => setFormData({ ...formData, bidAmount: e.target.value })}
              required
            />
            <textarea
              placeholder="Message (optional)"
              rows="3"
              className="w-full border rounded px-4 py-2"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Bid
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeBidding;
