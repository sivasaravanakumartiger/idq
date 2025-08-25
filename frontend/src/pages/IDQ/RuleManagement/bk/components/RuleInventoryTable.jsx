import React from "react";

const RuleInventoryTable = ({ onSelectRule }) => {
  const rules = [
    { id: 1, name: "Duplicate Check", status: "Active" },
    { id: 2, name: "Null Validation", status: "Inactive" },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">Rule Inventory</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Rule Name</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rules.map(rule => (
            <tr 
              key={rule.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectRule(rule)}
            >
              <td className="p-2">{rule.name}</td>
              <td className="p-2">{rule.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RuleInventoryTable;
