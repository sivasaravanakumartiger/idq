import React from "react";

const Step2Review = ({ rules, onBack }) => (
  <div>
    <h2 className="text-lg font-semibold mb-3">Step 2: Review Selection</h2>
    <ul className="list-disc pl-5">
      {rules.map((rule, i) => (
        <li key={i}>{rule}</li>
      ))}
    </ul>
    <div className="mt-4 flex gap-2">
      <button 
        className="bg-gray-500 text-white px-4 py-2 rounded"
        onClick={onBack}
      >
        Back
      </button>
      <button 
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => alert("Rules submitted!")}
      >
        Submit
      </button>
    </div>
  </div>
);

export default Step2Review;
