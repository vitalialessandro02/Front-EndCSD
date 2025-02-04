import { useState } from "react";

const FileUploader = ({ onUpload }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        onUpload(jsonData);
      } catch (error) {
        console.error("Errore nel parsing del JSON", error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <input type="file" accept="application/json" onChange={handleFileUpload} />
    </div>
  );
};

export default FileUploader;
