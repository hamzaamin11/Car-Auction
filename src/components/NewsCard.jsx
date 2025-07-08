import React from "react";

const NewsCard = ({ title, summary, date, image }) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition-all border border-gray-100">
      <img src={image} alt={title} className="w-full h-56 object-cover" />
      <div className="p-5">
        <span className="inline-block text-xs text-blue-600 font-semibold uppercase tracking-wide mb-2">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{summary}</p>
      </div>
    </div>
  );
};

export default NewsCard;
