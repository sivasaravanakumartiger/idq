import React from "react";

const PageHeader = ({ title, breadcrumb }) => (
  <div className="flex justify-between items-center border-b pb-3">
    <h1 className="text-xl font-bold">{title}</h1>
    <nav className="text-sm text-gray-500">
      {breadcrumb.join(" / ")}
    </nav>
  </div>
);

export default PageHeader;
