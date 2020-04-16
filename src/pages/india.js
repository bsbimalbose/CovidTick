import React, { useEffect, useContext } from "react";
import { getIndiaData, getIndiaDistrictData, getIndiaDaily } from "../api";
import { AppContext } from "../App";
import { getFromLocalStorage, saveToLocalStorage } from "../utils";
import StateSearch from "../components/StateSearch/StateSearch";
import CaseSummary from "../components/CaseSummary/CaseSummary";
import { CASES_SUMMARY } from "../constants/CASES";
import LineChart from "../components/Charts/LineChart";
import moment from "moment";

export default function India() {
  const { state, dispatch } = useContext(AppContext);
  const summary = state?.indiaStats?.summary || {};
  const summaryArray = [
    { label: CASES_SUMMARY.CONFIRMED, count: summary.confirmed },
    { label: CASES_SUMMARY.ACTIVE, count: summary.active },
    { label: CASES_SUMMARY.DEATHS, count: summary.deaths },
    { label: CASES_SUMMARY.RECOVERED, count: summary.recovered }
  ];

  useEffect(() => {
    if (!state?.indiaStats?.summary) {
      (async function anyNameFunction() {
        let indiaInfo = {};
        const localStorageValue = getFromLocalStorage("india-info");
        if (localStorageValue) {
          indiaInfo = localStorageValue;
        } else {
          const indiaResp = await getIndiaData();
          indiaInfo = indiaResp?.data || {};
          saveToLocalStorage("india-info", indiaInfo);
        }
        dispatch({ type: "SET_INDIA_DATA", value: indiaInfo || {} });
        // dispatch({ type: "SET_WORLD_DATA", value: (worldData || {}).data });
      })();
    }
    if (!state?.indiaStats?.districtWise) {
      (async function anyNameFunction() {
        let indiaDistrictInfo = {};
        const localStorageValue = getFromLocalStorage("india-info-district");
        if (localStorageValue) {
          indiaDistrictInfo = localStorageValue;
        } else {
          const indiaResp = await getIndiaDistrictData();
          indiaDistrictInfo = indiaResp?.data || {};
          saveToLocalStorage("india-info-district", indiaDistrictInfo);
        }
        dispatch({
          type: "SET_INDIA_DISTRICT_DATA",
          value: indiaDistrictInfo || {}
        });
        // dispatch({ type: "SET_WORLD_DATA", value: (worldData || {}).data });
      })();
    }
    if (!state?.indiaStats?.daily) {
      (async function anyNameFunction() {
        let dailyInfo = {};
        const localStorageValue = getFromLocalStorage("india-daily");
        if (localStorageValue) {
          dailyInfo = localStorageValue;
        } else {
          const indiaResp = await getIndiaDaily();
          dailyInfo = indiaResp?.data || {};
          saveToLocalStorage("india-daily", dailyInfo);
        }
        dispatch({ type: "SET_INDIA_DAILY_DATA", value: dailyInfo || {} });
        // dispatch({ type: "SET_WORLD_DATA", value: (worldData || {}).data });
      })();
    }
  }, []);

  const filteredDaily = (state?.indiaStats?.daily || []).filter(item =>
    moment("01 March 2020", "DD MMMM YYYY").isSameOrBefore(item.date)
  );
  const xAxis = filteredDaily.map(item => moment(item.date).format("DD MMM"));

  const dataPlaceHolder = [
    { label: "Confirmed", borderColor: "#078AF9", data: [] },
    { label: "Deaths", borderColor: "#FC313F", data: [] },
    { label: "Recovered", borderColor: "#1DDDCC", data: [] }
  ];
  const dataSet = (filteredDaily).reduce((acc, item) => {
    acc[0].data.push(item.totalconfirmed);
    acc[1].data.push(item.totaldeceased);
    acc[2].data.push(item.totalrecovered);
    return acc;
  }, dataPlaceHolder);
  return (
    <div>
      <CaseSummary locationInfo={summaryArray} />
      <StateSearch />
      <div style={{ width: "500px" }}>
        <LineChart labels={xAxis} dataSet={dataSet} />
      </div>
    </div>
  );
}
