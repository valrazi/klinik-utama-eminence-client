// components/SpinnerOverlay.jsx
import React from "react";
import "./SpinnerOverlay.css"; // import CSS

export default function Loading({ show }) {
  if (!show) return null;

  return (
    <div className="overlay">
      <div className="spinner"></div>
    </div>
  );
}
