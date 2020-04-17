import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import IconInput from "../IconInput";
import { FiSearch } from "react-icons/fi";
import Table from "../Table/Table";
import { indiaColInfo } from "../../constants";
import DetailedTable from "../Table/DetailedTable";

export default function StateSearch() {
  const { state, dispatch } = useContext(AppContext);
  const locations = state?.indiaStats?.statewise || [];
  const districtInfo = state?.indiaStats?.districtInfo || [];
  const locationWithDistrict = state?.indiaStats?.locationWithDistrict;
  const [sortObj, setSortObj] = useState({});

  useEffect(() => {
    return () => {
      dispatch({ type: "STATE_SEARCH", value: "" });
    };
  }, [dispatch]);

  useEffect(() => {
    if (true) {
      dispatch({
        type: "COMBINE_STATE_DISTRICT",
        state: locations,
        districtInfo
      });
    }
  }, [locations, districtInfo]);

  const handleHeadClick = id => {
    setSortObj(prevSort => {
      if (id === prevSort?.id) {
        return {
          id,
          order: prevSort?.order === "asc" ? "desc" : "asc"
        };
      }
      return {
        id,
        order: "desc"
      };
    });
  };

  const handleRowClick = row => {};

  const data = (locationWithDistrict || locations || [])
    .filter(countryInfo => !countryInfo.hidden)
    .sort((a, b) => {
      const sortKey = sortObj?.id || "cases";
      return sortObj?.order === "asc"
        ? a[sortKey] - b[sortKey]
        : b[sortKey] - a[sortKey];
    });

  return (
    <div>
      <div className="country-search">
        <div className="search-wrap">
          <IconInput
            icon={<FiSearch />}
            placeHolder="Search Country"
            onChange={value => dispatch({ type: "INDIA_SEARCH", value })}
          />
        </div>
        <div
          style={{
            overflow: "hidden",
            overflowY: "auto",
            height: "80vh"
          }}
        >
          <DetailedTable
            colInfo={indiaColInfo}
            data={data}
            sortedInfo={sortObj}
            handleHeadClick={handleHeadClick}
            handleRowClick={handleRowClick}
            detailedKey="districtDetails"
          />
        </div>
      </div>
      <div>hello</div>
    </div>
  );
}
