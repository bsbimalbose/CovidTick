import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import "./country-search.scss";
import IconInput from "../IconInput";
import { FiSearch } from "react-icons/fi";
import Table from "../Table/Table";
import { worldColInfo } from "../../constants/WORLD";

export default function CountrySearch() {
  const { state, dispatch } = useContext(AppContext);
  const locations = state?.worldStats || [];

  const [sortObj, setSortObj] = useState({});

  useEffect(() => {
    return () => {
      dispatch({ type: "COUNTRY_SEARCH", value: "" });
    };
  }, [dispatch]);



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

  const data = locations
    .filter(countryInfo => !countryInfo.hidden)
    .sort((a, b) => {
      const sortKey = sortObj?.id || "cases";
      return sortObj?.order === "asc"
        ? a[sortKey] - b[sortKey] 
        : b[sortKey] - a[sortKey];
    });

  return (
    <div className="country-search">
      <div className="search-wrap">
        <IconInput
          icon={<FiSearch />}
          placeHolder="Search Country"
          onChange={value => dispatch({ type: "COUNTRY_SEARCH", value })}
        />
      </div>
      <div
        style={{
          overflow: "auto",
          height: "80vh"
        }}
      >
        <Table
          colInfo={worldColInfo}
          data={data}
          sortedInfo={sortObj}
          handleHeadClick={handleHeadClick}
        />
      </div>
    </div>
  );
}
