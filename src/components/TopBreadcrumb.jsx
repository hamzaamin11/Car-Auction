import React from 'react';

const TopBreadcrumb = ({ onAddAuctionClick, onSizeChange }) => {
  return (
    <div className="container mx-auto text-xs">
      <ul className="flex flex-wrap items-center p-0 mb-0 list-none">
        <li className="px-2 border-r">Auction View :</li>

        <li className="px-2 border-r">
          <button
            onClick={() => onSizeChange('small')}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Small
          </button>
        </li>

        <li className="px-2 border-r">
          <button
            onClick={() => onSizeChange('large')}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Large
          </button>
        </li>

        <li className="px-2 border-r">
          <button
            onClick={onAddAuctionClick}
            className="text-green-600 hover:underline font-semibold focus:outline-none"
          >
            + Add Auction
          </button>
        </li>

        <li className="px-2 border-r flex items-center space-x-1">
          <span className="text-gray-700">Music Off</span>
          <span className="material-icons text-gray-600 text-base">volume_mute</span>
        </li>

        <li className="px-2 border-r">
          <span className="text-gray-700">Confetti On</span>
        </li>
      </ul>
    </div>
  );
};

export default TopBreadcrumb;
