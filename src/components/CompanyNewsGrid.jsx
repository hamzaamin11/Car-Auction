
import React from "react";
import NewsCard from "./NewsCard";

const companyNews = [
  {
    title: "Chuhdary Cars Wins Best Seller Award 2025",
    summary: "We’re honored to be recognized for our service and customer satisfaction in vehicle sales.",
    date: "2025-04-10",
    image: "https://media.istockphoto.com/id/1365078635/vector/best-seller-golden-label-badge-isolated-on-white-background-quality-certificate-seal-vector.jpg?s=612x612&w=0&k=20&c=tfh3F4oWPmJy0rAHV4Ok4KSLmij5uNt7n2GUGYsPWns=",
  },
  {
    title: "New Auction Platform Launched",
    summary: "Our new real-time vehicle auction system is now live. Faster, smarter, better.",
    date: "2025-03-22",
    image: "https://www.bizpreneurme.com/wp-content/uploads/2024/04/Supercar-Blondie-launches-first-global-auction-platform.webp",
  },
  {
    title: "Opening of Our New Lahore Branch",
    summary: "We’ve expanded! Visit our latest branch with advanced vehicle evaluation services.",
    date: "2025-02-15",
    image: "https://news.remaxdoors.com/hubfs/2015_images/Blogging/new_car_showroom.jpg",
  },
];

const CompanyNewsGrid = () => {
  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-900">Latest From Our Company</h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {companyNews.map((item, index) => (
            <NewsCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyNewsGrid;
