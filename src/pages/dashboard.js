import React, { useEffect, useContext } from "react";
import CountrySearch from "../components/ContrySearch/CountrySearch";
import WorldMap from "../map/WorldMap";
import { getFromLocalStorage, saveToLocalStorage } from "../utils";
import { getCasesByCountryDataNew, getWorldStatsNew } from "../api";
import { AppContext } from "../App";
import "./sass/dashboard.scss";
import StatCard from "../components/StatCard/StatCard";
import { Spin, Card } from "antd";

export default function Dashboard() {
  const { state, dispatch } = useContext(AppContext);

  const fetchCasesByCountry = async () => {
    dispatch({ type: "LOAD_CASES_BY_COUNTRY" });
    let worldInfo = getFromLocalStorage("cases-by-country");
    if (!worldInfo) {
      worldInfo = (await getCasesByCountryDataNew())?.data || [];
      saveToLocalStorage("cases-by-country", worldInfo);
    }
    dispatch({ type: "SET_CASES_BY_COUNTRY", value: worldInfo });
  };
  const fetchWorldStat = async () => {
    dispatch({ type: "LOAD_WORLD_STATS" });
    let worldInfo = getFromLocalStorage("world-stats");
    if (!worldInfo) {
      worldInfo = (await getWorldStatsNew())?.data || [];
      saveToLocalStorage("world-stats", worldInfo);
    }
    dispatch({ type: "SET_WORLD_STATS", value: worldInfo });
  };

  useEffect(() => {
    if (!state?.dashboard?.casesByCountry) {
      fetchCasesByCountry();
    }
    if (!state?.dashboard?.worldStat) {
      fetchWorldStat();
    }
  }, []);

  return (
    <Card
      title={
        <div className="main-title">
          <i className="logo"></i>CovidTick - World Tracker
        </div>
      }
      bordered={false}
    >
      <div className="dash-map-tile">
        <div className="dash-left-wrap">
          <Spin spinning={!!state?.dashboard?.isWorldStatsLoading}>
            <div className="stat-card-wrap">
              <StatCard
                label="Confirmed"
                value={(
                  state?.dashboard?.worldStat?.cases || 0
                ).toLocaleString()}
                change={(
                  state?.dashboard?.worldStat?.new_cases || 0
                ).toLocaleString()}
              />
              <StatCard
                label="Deaths"
                value={(
                  state?.dashboard?.worldStat?.deaths || 0
                ).toLocaleString()}
                change={(
                  state?.dashboard?.worldStat?.new_deaths || 0
                ).toLocaleString()}
              />
              <StatCard
                label="Active"
                value={(
                  state?.dashboard?.worldStat?.active_cases || 0
                ).toLocaleString()}
              />
              <StatCard
                label="Recovered"
                value={(
                  state?.dashboard?.worldStat?.total_recovered || 0
                ).toLocaleString()}
              />
            </div>
          </Spin>
          <WorldMap />
        </div>
        <CountrySearch />
      </div>
    </Card>
  );
}
