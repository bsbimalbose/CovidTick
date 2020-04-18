import React from "react";
import { LOCATION_META, CASES_SUMMARY } from "../../constants";
import CaseTile from "./CaseTile";
import StatCard from "../StatCard/StatCard";

export default function CaseSummary({ locationInfo }) {
  return (
    <div className="stats-wrap">
      {locationInfo.map(item => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.count}
          change={item.change}
        ></StatCard>
      ))}
    </div>
  );
}
