import React from "react";
import "./input.scss";

export default function IconInput({ className, icon, onChange, placeHolder }) {
  return (
    <div className="input-wrap">
      {Boolean(icon) && <span className="input-icon">{icon}</span>}
      <input
        placeholder={placeHolder}
        className={className}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
