import React from "react";

const PageLoader = () => (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <span className="animate-pulse text-lg font-semibold">Loading...</span>
    </div>
  </div>
);

export default PageLoader;
