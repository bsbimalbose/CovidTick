import React from "react";
import { FaArrowUp } from "react-icons/fa";
export default function CountryRow({ countryInfo }) {
  return (
    <tr className="country-row">
      <td className="country-name"> {countryInfo?.country_name || "-"}</td>
      <td>
        <div className="table-cell-info">
          {Boolean(parseInt(countryInfo?.new_cases || "0")) && (
            <span className="new-cases">
              <FaArrowUp />
              {countryInfo?.new_cases}
            </span>
          )}
          <span>{countryInfo?.cases}</span>
        </div>
      </td>
      <td>
        <div>{countryInfo?.active_cases}</div>
      </td>
      <td>
        <div className="table-cell-info">
          {Boolean(parseInt(countryInfo?.new_deaths || "0")) && (
            <span className="new-deaths">
              <FaArrowUp />
              {countryInfo?.new_deaths}
            </span>
          )}
          <span> {countryInfo?.deaths}</span>
        </div>
      </td>
      <td>
        <div>{countryInfo?.total_recovered}</div>
      </td>
    </tr>
  );
}
