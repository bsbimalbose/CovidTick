import React, { useState } from "react";
import {
  MdArrowDropUp,
  MdArrowDropDown,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp
} from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import Table from "./Table";
import { districtColInfo } from "../../constants/INDIA";

export default function DetailedTable({
  colInfo,
  detailedColInfo,
  data,
  className = "",
  sortedInfo,
  handleHeadClick,
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
          <th width="10px"></th>
          {colInfo.map(col => (
            <th>
              <div className="cell">
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
                  {col.label}
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
          <>
            <tr
              onClick={() => {
                handleRowClick(rowIndex);
              }}
            >
              {
                <td>
                  {detailedKey && row[detailedKey] ? (
                    openRowIndexes.includes(rowIndex) ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )
                  ) : null}
                </td>
              }
              {colInfo.map(col => (
                <td>
                  <div className="cell">
                    {col.newId && Boolean(row[col.newId]) && (
                      <div
                        className={`new ${
                          col.newClassName ? col.newClassName : ""
                        }`}
                      >
                        <FaArrowUp /> {row[col.newId]}
                      </div>
                    )}
                    {row[col.id]}
                  </div>
                </td>
              ))}
            </tr>
            {openRowIndexes.includes(rowIndex) && (
              <tr className="detailed-info-row">
                <td colSpan={colInfo.length}>
                  <Table colInfo={districtColInfo} data={row[detailedKey]} />
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  );
}
