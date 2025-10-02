import React from "react";
import { Link } from "react-router-dom";

const CarInfoSection = () => {
  return (
    <div className="bg-white p-6 rounded-md shadow-md text-gray-700 leading-relaxed text-justify">
      <p className="mb-4">
        While buying new or used cars, the most important thing is to find out
        which cars are affordable and in your budget.{" "}
        <span className="font-semibold">
          WheelBidz helps you by providing detailed information about{" "}
          <strong>car prices, reviews and auctions</strong>.
        </span>{" "}
        <strong>Price</strong> is considered as the main factor for deciding on
        which car is right for you. Reviews can be helpful in knowing about the
        right time to{" "}
        <Link
          to="/"
          className="text-blue-600 underline font-semibold hover:text-blue-800"
        >
          bid, make auctions or sell cars in Pakistan
        </Link>
        . You can find reviews published by car owners of different makes on our
        site.
      </p>

      <p className="mb-4">
        You can browse car prices of local manufacturers including{" "}
        <span className="font-semibold">
          Honda, SuzPakistani, Toyota, Audi, BMW, Changan, Daihatsu, Land Rover,
          Mercedes-Benz, Porsche, Range Rover
        </span>
        , and <span className="font-semibold">Chery</span>.
      </p>

      <p>
        Our car price information includes freight charges for popular cities
        segmented by model and manufacturer and is updated constantly to ensure
        that you are always viewing the latest data fresh from the market.
      </p>
    </div>
  );
};

export default CarInfoSection;
