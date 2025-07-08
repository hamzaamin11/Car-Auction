import React from "react";
import { Link } from "react-router-dom";

const BreadCrumb = ({ selectedPrice }) => {
  const crumbs = [
    { name: "Home", path: "/", position: 1 },
    { name: "Price List", path: "/saleslist", position: 2 },
    { name: "Audi", path: "/audi", position: 3 },
    {
      name: "Audi Q2 1.0 TFSI Standard Line",
      path: "",
      position: 5,
      active: true,
    },
  ];

  return (
    <nav
      className="text-sm text-gray-600 mt-0 bg-gray-50"
      aria-label="Breadcrumb"
      itemscope="itemscope"
      itemtype="https://schema.org/BreadcrumbList"
    >
      <ul className="flex flex-wrap gap-2 ml-5">
        {crumbs.map((crumb, index) => (
          <li
            key={index}
            itemprop="itemListElement"
            itemscope="itemscope"
            itemtype="https://schema.org/ListItem"
            className={`flex items-center ${
              crumb.active ? "font-semibold text-gray-900 mb-5 mt-5" : ""
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
  );
};

export default BreadCrumb;
