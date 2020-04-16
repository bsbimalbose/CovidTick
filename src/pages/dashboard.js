import React, { useEffect, useContext } from "react";
import CountrySearch from "../components/ContrySearch/CountrySearch";
import WorldMap from "../map/WorldMap";
import "./sass/dashboard.scss";
import { getFromLocalStorage, saveToLocalStorage } from "../utils";
import { getWorldData } from "../api";
import { AppContext } from "../App";

export default function Dashboard() {
  const { state, dispatch } = useContext(AppContext);

  const fetchWorldInfo = async () => {
    let worldInfo = getFromLocalStorage("world-info");
    if (!worldInfo) {
      worldInfo = (await getWorldData())?.data || [];
      saveToLocalStorage("world-info", worldInfo);
    }
    dispatch({ type: "SET_NEW_WORLD_DATA", value: worldInfo });
  };

  useEffect(() => {
    if (!state.worldInfo) {
      fetchWorldInfo();
    }
  }, []);

  return (
    <div className="dash-map-tile">
      <WorldMap />
      <CountrySearch />
    </div>
  );
}
