import React, { useState } from "react";

const Step1Rules = ({ onNext }) => {
  const [selectedRules, setSelectedRules] = useState([]);

  const availableRules = ["Null Check", "Duplicate Check", "Length Validation"];

  const toggleRule = (rule) => {
    setSelectedRules(prev =>
      prev.includes(rule) ? prev.filter(r => r !== rule) : [...prev, rule]
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Step 1: Select Rules</h2>
      <ul>
        {availableRules.map(rule => (
          <li key={rule} className="mb-2">
            <label>
              <input 
                type="checkbox" 
                checked={selectedRules.includes(rule)} 
                onChange={() => toggleRule(rule)} 
              />
              <span className="ml-2">{rule}</span>
            </label>
          </li>
        ))}
      </ul>
      <button 
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => onNext(selectedRules)}
      >
        Next
      </button>
    </div>
  );
};

export default Step1Rules;
