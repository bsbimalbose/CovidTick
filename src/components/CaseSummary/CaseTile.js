import React from "react";

export default function CaseTile({ label, count, className }) {
  return (
    <div className={`case-tile ${className ? className : ""}`}>
      <div className="case-label">{label}</div>
      <div className="case-value">{count}</div>
    </div>
  );
}
