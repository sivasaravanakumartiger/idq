import React, { useState } from "react";

const MetadataOffcanvas = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow"
        onClick={() => setOpen(true)}
      >
        Metadata
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="bg-white w-96 h-full p-4 shadow-lg">
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h2 className="font-semibold">Metadata Explorer</h2>
              <button onClick={() => setOpen(false)}>X</button>
            </div>
            <p className="text-sm text-gray-600">Metadata details go here...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MetadataOffcanvas;
