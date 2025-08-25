import React from "react";

const RuleDetails = ({ rule }) => (
  <div className="mt-4 bg-white p-4 shadow rounded-lg">
    <h2 className="text-lg font-semibold mb-2">Rule Details</h2>
    <p><strong>Name:</strong> {rule.name}</p>
    <p><strong>Status:</strong> {rule.status}</p>
  </div>
);

export default RuleDetails;
