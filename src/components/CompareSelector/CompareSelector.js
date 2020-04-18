import React, { useContext } from "react";
import AddComparison from "./AddComparison";
import { AppContext } from "../../App";
import { COMPARE_COLORS } from "../../constants";
import { MdClose } from "react-icons/md";

export default function CompareSelector() {
  const { state, dispatch } = useContext(AppContext);
  const compareList = state?.compare?.current || [];
  return (
    <div className="compare-selector">
      {compareList.map((location, index) => (
        <div className="compare-items">
          <div className="compare-item-name">
            <div
              className="color-badge"
              style={{ background: COMPARE_COLORS[index] }}
            ></div>
            <div>{location.label}</div>
          </div>
          <div className="compare-item-name">
            <div>{location.type}</div>

            <MdClose
              onClick={() =>
                !state.compare.isLoading &&
                dispatch({ type: "REMOVE_COMPARISON_HISTORY", value: location })
              }
            />
          </div>
        </div>
      ))}
      {compareList.length < 5 && <AddComparison />}
    </div>
  );
}
