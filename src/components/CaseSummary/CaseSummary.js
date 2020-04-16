import React from "react";
import { LOCATION_META, CASES_SUMMARY } from "../../constants/CASES";
import CaseTile from "./CaseTile";

export default function CaseSummary({ locationInfo }) {
  return (
    <div>
      {locationInfo.map(item => (
        <CaseTile
          key={item.label}
          label={item.label}
          count={item.count}
          className="something"
        />
      ))}
    </div>
  );
}
