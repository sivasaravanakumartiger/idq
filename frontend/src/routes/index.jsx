// frontend/src/routes/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import RuleManagement from "../pages/IDQ/RuleManagement/RuleManagementPage";
import TestSuite from '../pages/IDQ/TestSuite/TestSuite';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/manage_rulesets" element={<RuleManagement />} />
      <Route path="/test_suite_configuration" element={<TestSuite />} />
    </Routes>
  );
}

export default AppRoutes;