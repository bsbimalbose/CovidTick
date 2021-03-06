import React, { useState, useContext } from "react";
import GeoChart from "./GeoChart";
import mapData from "./world.geo.json";
import { AppContext } from "../App";
import { get } from "../utils";
import './map.scss';

export default function WorldMap() {
  const [property, setProperty] = useState("pop_est");
  const { state, dispatch } = useContext(AppContext);
  const locations = state?.dashboard?.casesByCountry || [];

  const countryCodeCasesMap = locations.reduce((acc, location)=>{
    acc[(location?.countryInfo?.iso3||"_").replace(/[. ]+/g,"")] = location;
    return acc;
  },{})

  return (
      <GeoChart mapData={mapData} countryDetails={countryCodeCasesMap} property={property} />
  );
}
