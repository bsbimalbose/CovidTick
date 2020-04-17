import React, { useContext } from "react";
import AddComparison from "./AddComparison";
import { AppContext } from "../../App";

export default function CompareSelector() {
  const { state } = useContext(AppContext);
  const compareList = state?.compare?.current || [];
  return (
    <div className="compare-selector">
      {compareList.map(location => (
        <div className="compare-items">
          <div>{location.label}</div>
          <div>{location.type}</div>
          <div>{location.color}</div>
        </div>
      ))}
      {(compareList.length < 5) && <AddComparison />}
    </div>
  );
}
