import React, { useEffect, useContext } from "react";
import CompareSelector from "../components/CompareSelector/CompareSelector";
import CompareChart from "../components/CompareChart/CompareChart";
import "./sass/compare.scss";
import { AppContext } from "../App";
import { getIndiaStateDaily } from "../api";
import { getFromLocalStorage, saveToLocalStorage } from "../utils";
import { Spin, Card } from "antd";

export default function Compare() {
  const { state, dispatch } = useContext(AppContext);
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
    if (!state?.compare?.stateDaily) {
      fetchDailyStateData();
    }
  }, []);

  return (
    <Card
      title={
        <div className="main-title">
          <i className="logo"></i>CovidTick - Compare
        </div>
      }
      bordered={false}
    >
      <div className="compare-page-wrap">
        <div style={{ textAlign: "center" }}>
          Add countries or Indian states to compare with each other by clicking
          the +Add comparison button
        </div>
        <CompareSelector />
        {/* <div style={{ display: "flex", justifyContent: "center" }}> */}
        <Spin spinning={state?.compare?.isLoading || false}>
          <CompareChart />
        </Spin>
        {/* </div> */}
      </div>
    </Card>
  );
}
