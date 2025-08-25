import React from "react";

const RuleSelectorPanel = ({ onSelect }) => {
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Select Dataset</h2>
      <select className="w-full p-2 border rounded mb-2">
        <option>Catalog</option>
      </select>
      <select className="w-full p-2 border rounded mb-2">
        <option>Schema</option>
      </select>
      <select className="w-full p-2 border rounded">
        <option>Table</option>
      </select>
    </div>
  );
};

export default RuleSelectorPanel;
