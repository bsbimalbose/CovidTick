import React, { useRef, useEffect, useState, useContext } from "react";
import { select, geoPath, geoMercator, max, scaleSqrt } from "d3";
import useResizeObserver from "./useResizeObserver";
import { get } from "../utils";
import { AppContext } from "../App";
import { Spin } from "antd";

function GeoChart({ mapData, property, countryDetails }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const { state, dispatch } = useContext(AppContext);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const { width, height } = dimensions || wrapper.getBoundingClientRect();

    const svg = select(svgRef.current);

    const maxProp =
      max(Object.values(countryDetails), country => country.cases) || 20000;
    const colorScale = scaleSqrt()
      .domain([0, maxProp])
      .range(["#ddd", "#FC312F"]);

    const projection = geoMercator().fitSize([width, height], mapData);
    const pathGenerator = geoPath().projection(projection);

    // render each country
    svg
      .selectAll(".country")
      .data(mapData.features)
      .join("path")
      .on("mouseover", function(feature) {
        select(this)
          .transition()
          .style("stroke", "red");
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .on("mouseleave", function() {
        select(this)
          .transition()
          .style("stroke", "unset");
        setSelectedCountry(null);
      })
      .attr("class", "country")
      // .attr("stroke", "#eee")
      .transition()
      .attr("fill", feature => {
        let color = "#ccc";
        if (feature) {
          color = colorScale(
            (
              get(countryDetails, feature.properties["iso_a3"], false) ||
              get(countryDetails, feature.properties["geounit"], false) ||
              get(countryDetails, feature.properties["name"], false) ||
              {}
            ).cases || 0
          );
        }
        return color;
      })
      .attr("d", feature => pathGenerator(feature));
  }, [mapData, dimensions, countryDetails]);

  let selectedCountryDetails = null;
  if (selectedCountry) {
    selectedCountryDetails =
      countryDetails?.[selectedCountry.properties?.["iso_a3"]] ||
      countryDetails?.[selectedCountry.properties?.["geounit"]] ||
      countryDetails?.[selectedCountry.properties?.["name"]] ||
      {};
  }

  return (
    <div className="world-map-wrap">
      <Spin spinning={state?.dashboard?.isCountryStatsLoading || false}>
        {selectedCountry && (
          <div className="selected-country">
            <span className="country-name">
              {selectedCountry.properties?.name}
            </span>{" "}
            :{" "}
            <span className="country-value">
              {selectedCountryDetails.cases || 0}
            </span>
          </div>
        )}
        <div ref={wrapperRef} style={{ width: "100%" }}>
          <svg
            style={{
              width: "100%",
              background: "#F9F3F3",
              color: "grey",
              borderRadius: "15px",
              minHeight: "300px"
            }}
            ref={svgRef}
          ></svg>
        </div>
      </Spin>
    </div>
  );
}

export default GeoChart;
