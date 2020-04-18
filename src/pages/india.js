import React, { useEffect, useContext } from "react";
import { getIndiaData, getIndiaDistrictData, getIndiaDaily } from "../api";
import { AppContext } from "../App";
import { getFromLocalStorage, saveToLocalStorage } from "../utils";
import StateSearch from "../components/StateSearch/StateSearch";
import CaseSummary from "../components/CaseSummary/CaseSummary";
import { CASES_SUMMARY } from "../constants";
import LineChart from "../components/Charts/LineChart";
import moment from "moment";
import "./sass/india.scss";
import { Spin } from "antd";

export default function India() {
  const { state, dispatch } = useContext(AppContext);
  const indiaStats = state?.india?.indiaStats || {};
  const summaryArray = [
    { label: CASES_SUMMARY.CONFIRMED, count: indiaStats.confirmed },
    { label: CASES_SUMMARY.ACTIVE, count: indiaStats.active },
    { label: CASES_SUMMARY.DEATHS, count: indiaStats.deaths },
    { label: CASES_SUMMARY.RECOVERED, count: indiaStats.recovered }
  ];

  useEffect(() => {
    console.log("rendering.....");
    if (!state?.india?.casesByState && !state?.india?.isStateLoading) {
      debugger;
      dispatch({
        type: "LOAD_SATE_DATA"
      });
      (async function anyNameFunction() {
        let indiaInfo = {};
        const localStorageValue = getFromLocalStorage("india-info");
        if (localStorageValue) {
          indiaInfo = localStorageValue;
        } else {
          console.log("calling.....");
          const indiaResp = await getIndiaData();
          indiaInfo = indiaResp?.data || {};
          saveToLocalStorage("india-info", indiaInfo);
        }
        dispatch({ type: "SET_INDIA_CASES_BY_STATE", value: indiaInfo || {} });
        // dispatch({ type: "SET_WORLD_DATA", value: (worldData || {}).data });
      })();
    }
    if (!state?.india?.districtInfo) {
      dispatch({
        type: "LOAD_DISTRICT_DATA"
      });
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
  }, []);

  const filteredDaily = (state?.india?.daily || []).filter(item =>
    moment("01 March 2020", "DD MMMM YYYY").isSameOrBefore(item.date)
  );
  const xAxis = filteredDaily.map(item => moment(item.date).format("DD MMM"));

  const dataPlaceHolder = [
    { label: "Confirmed", borderColor: "#078AF9", data: [] },
    { label: "Deaths", borderColor: "#FC313F", data: [] },
    { label: "Recovered", borderColor: "#1DDDCC", data: [] }
  ];
  const dataSet = filteredDaily.reduce((acc, item) => {
    acc[0].data.push(item.totalconfirmed);
    acc[1].data.push(item.totaldeceased);
    acc[2].data.push(item.totalrecovered);
    return acc;
  }, dataPlaceHolder);
  return (
    <div>
      <Spin spinning={state?.india?.isDistrictLoading && state?.india?.isStateLoading}>
        <CaseSummary locationInfo={summaryArray} />
      </Spin>
      <Spin
        spinning={
          state?.india?.isDistrictLoading && state?.india?.isStateLoading
        }
      >
        <StateSearch />
      </Spin>
      <div style={{ width: "100%" }}>
        <Spin spinning={state?.india?.isDistrictLoading && state?.india?.isStateLoading}>
          <LineChart labels={xAxis} dataSet={dataSet} />
        </Spin>
      </div>
    </div>
  );
}
