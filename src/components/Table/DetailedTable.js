import React, { useState } from "react";
import {
  MdArrowDropUp,
  MdArrowDropDown,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp
} from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import { districtColInfo } from "../../constants";
import "./detailedTable.scss";
import { getDeviceLabel } from "../../utils";

export default function DetailedTable({
  colInfo,
  detailedColInfo,
  data,
  className = "",
  sortedInfo,
  handleHeadClick = () => {},
  detailedKey
}) {
  const [openRowIndexes, setOpenIndexes] = useState([]);

  const handleRowClick = rowIndex => {
    let newRowIndexes = [];
    if (openRowIndexes.includes(rowIndex)) {
      newRowIndexes = openRowIndexes.filter(index => index !== rowIndex);
    } else {
      newRowIndexes = [...openRowIndexes, rowIndex];
    }
    setOpenIndexes(newRowIndexes);
  };

  return (
    <table className={`table ${className}`}>
      <thead>
        <tr>
          {detailedKey && <th width="10px"></th>}
          {colInfo.map(col => (
            <th>
              <div className={`cell ${col.leftAlign ? "align-left" : ""}`}>
                {col.newId && (
                  <div
                    onClick={() => {
                      col.sortable && handleHeadClick(col.newId);
                    }}
                    className={`new ${
                      col.newClassName ? col.newClassName : ""
                    }`}
                  >
                    {sortedInfo?.id === col.newId ? (
                      sortedInfo?.order === "asc" ? (
                        <MdArrowDropUp />
                      ) : (
                        <MdArrowDropDown />
                      )
                    ) : null}
                    {col.newLabel}
                  </div>
                )}
                <div
                  className="head-label"
                  onClick={() => {
                    col.sortable && handleHeadClick(col.id);
                  }}
                >
                  {col[getDeviceLabel()]}
                  {sortedInfo?.id === col.id ? (
                    sortedInfo?.order === "asc" ? (
                      <MdArrowDropUp />
                    ) : (
                      <MdArrowDropDown />
                    )
                  ) : null}
                </div>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <React.Fragment key={row.country_name}>
            <tr
              onClick={() => {
                if (detailedKey && row[detailedKey]) {
                  handleRowClick(rowIndex);
                }
              }}
              className={detailedKey && row[detailedKey] ? "pointer-hand" : ""}
            >
              {detailedKey && (
                <td>
                  {detailedKey && row[detailedKey] ? (
                    openRowIndexes.includes(rowIndex) ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )
                  ) : null}
                </td>
              )}
              {colInfo.map(col => (
                <td>
                  <div className={`cell ${col.leftAlign ? "align-left" : ""}`}>
                    {col.newId && Boolean(row[col.newId]) && (
                      <div
                        className={`new ${
                          col.newClassName ? col.newClassName : ""
                        } `}
                      >
                        <FaArrowUp /> {(row[col.newId] || "").toLocaleString()}
                      </div>
                    )}
                    <div>
                      {isNaN(row[col.id]) && typeof row[col.id] === "number"
                        ? "N/A"
                        : (row[col.id] || "").toLocaleString()}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            {openRowIndexes.includes(rowIndex) && (
              <tr className="detailed-info-row">
                <td colSpan={colInfo.length + 1} className="detailed-info-cell">
                  {Boolean(row?.testedData) && (
                    <div className="tested-info">
                      Total Tested: {(row?.testedData).toLocaleString()}
                    </div>
                  )}
                  <DetailedTable
                    colInfo={districtColInfo}
                    data={row[detailedKey].sort((a, b) => {
                      const sortKey = "confirmed";
                      return b[sortKey] - a[sortKey];
                    })}
                  />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
