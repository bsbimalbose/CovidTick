import React from "react";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

import "./statcard.scss";

export default function StatCard({ label, value, change, isDown, good }) {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className={`change ${good ? "green" : ""}`}>
        {change || change === 0 ? (
          !isDown ? (
            <TiArrowSortedUp />
          ) : (
            <TiArrowSortedDown />
          )
        ) : null}
        {change}
      </div>
    </div>
  );
}
