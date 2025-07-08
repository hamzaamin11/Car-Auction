
import React from 'react';

const RegisterDialog = ({ isOpen, onClose, isAddAuction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black">&times;</button>

        <h2 className="text-lg font-bold mb-4">{isAddAuction ? 'Add Auction' : 'Join Auction'}</h2>

        {isAddAuction && (
          <div className="mb-4 space-y-2">
            <input type="text" placeholder="Auction Title" className="w-full px-3 py-2 border rounded" />
            <input type="text" placeholder="Location" className="w-full px-3 py-2 border rounded" />
            <input type="time" className="w-full px-3 py-2 border rounded" />
          </div>
        )}

       <div className="mt-4 text-center">
  <h2 className="text-lg font-bold mb-2">
    Sign In or Become a Member to View Auctions
  </h2>
  <p className="text-gray-700 text-sm mb-4 max-w-md mx-auto">
    Please sign in to your account to view auctions. Not a Member yet? Register to view auctions, add vehicles to your Watchlist, bid and buy!
  </p>
  <div className="flex justify-center space-x-4">
    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
      Register
    </button>
    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Sign In
    </button>
  </div>
</div>
      </div>
    </div>
  );
};

export default RegisterDialog;
