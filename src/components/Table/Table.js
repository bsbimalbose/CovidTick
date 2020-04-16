import React from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";

import "./table.scss";

export default function Table({
  colInfo,
  data,
  className = "",
  sortedInfo,
  handleHeadClick,
  handleRowClick
}) {
  return (
    <table className={`table ${className}`}>
      <thead>
        <tr>
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
        {data.map(row => (
          <tr onClick={handleRowClick}>
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
        ))}
      </tbody>
    </table>
  );
}

// colData[ label, key]
