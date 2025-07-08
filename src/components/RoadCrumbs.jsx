import React from "react";
import { Link } from "react-router-dom";

const RoadCrumbs = () => {
  const crumbs = [
    { name: "Home", path: "/", position: 1 },
    { name: "Price List", path: "/saleslist", position: 2 },
    { name: "Audi", path: "/audi", position: 3 },
    { name: "Get Instant On Road Price of New Cars", path: "", position: 5, active: true },
  ];

  return (
    <div className="bg-[#f4f6fa] px-4 py-6 rounded-md shadow-sm">
      <nav
        className="text-sm text-gray-600"
        aria-label="Breadcrumb"
        itemscope="itemscope"
        itemtype="https://schema.org/BreadcrumbList"
      >
        <ul className="flex flex-wrap gap-2 ml-1 sm:ml-5 mt-2">
          {crumbs.map((crumb, index) => (
            <li
              key={index}
              itemprop="itemListElement"
              itemscope="itemscope"
              itemtype="https://schema.org/ListItem"
              className={`flex items-center ${
                crumb.active ? "font-semibold text-gray-900" : ""
              }`}
            >
              {crumb.path && !crumb.active ? (
                <Link to={crumb.path} itemprop="url" className="hover:underline">
                  <span itemprop="name">{crumb.name}</span>
                </Link>
              ) : (
                <span itemprop="name">{crumb.name}</span>
              )}
              <meta itemprop="position" content={crumb.position} />
              {index !== crumbs.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <h2 className="text-xl sm:text-2xl font-bold text-[#233D7B] mt-4 leading-snug ml-1 sm:ml-5">
        Get Instant On Road Price of New Cars
      </h2>
      <p className="text-sm text-gray-500 ml-1 sm:ml-5">
        Calculate the full Price of new car
      </p>
    </div>
  );
};

export default RoadCrumbs;
