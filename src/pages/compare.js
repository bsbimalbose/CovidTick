import React, { useEffect, useContext } from "react";
import CompareSelector from "../components/CompareSelector/CompareSelector";
import CompareChart from "../components/CompareChart/CompareChart";
import "./sass/compare.scss";
import { AppContext } from "../App";
import { getIndiaStateDaily } from "../api";
import { getFromLocalStorage, saveToLocalStorage } from "../utils";

export default function Compare() {
  const { state, dispatch } = useContext(AppContext);
  const compareList = state?.compare?.current || [];

  const fetchDailyStateData = async () => {
    let stateDaily = getFromLocalStorage("COMPARE_INDIA_DAILY");
    if (!stateDaily) {
      stateDaily = (await getIndiaStateDaily())?.data?.states_daily || [];
      saveToLocalStorage("COMPARE_INDIA_DAILY", stateDaily);
    }
    dispatch({
      type: "SET_INDIA_HISTORY_STATES",
      value: stateDaily
    });
  };

  useEffect(() => {
    dispatch({ type: "SET_INDIA_HISTORY_STATES", value: [] });
    fetchDailyStateData();
  }, []);

  return (
    <div className="compare-page-wrap">
      <CompareSelector />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CompareChart />
      </div>
    </div>
  );
}
