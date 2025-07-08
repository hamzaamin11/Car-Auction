

import React from "react";
import NewsCard from "./NewsCard";

const newsItems = [
  {
    title: "Electric Vehicles Are the Future",
    image: "https://source.unsplash.com/800x600/?electric-car",
    date: "May 20, 2025",
    summary: "Governments worldwide are investing in EV infrastructure to meet net-zero goals.",
  },
  {
    title: "Top 10 SUVs in 2025",
    image: "https://source.unsplash.com/800x600/?suv",
    date: "May 18, 2025",
    summary: "These SUVs stand out with performance, comfort, and fuel efficiency.",
  },
  {
    title: "Used Car Prices Drop in 2025",
    image: "https://source.unsplash.com/800x600/?used-car",
    date: "May 15, 2025",
    summary: "Market correction brings relief to buyers after a long spike in prices.",
  },
];

const NewsGrid = () => {
  return (
    <section className="bg-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Latest News</h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item, index) => (
            <NewsCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;
