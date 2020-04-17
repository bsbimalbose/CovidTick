import React, { useState, useRef, useEffect, useContext } from "react";
import { AutoComplete } from "antd";
import { COMPARE_LOCATIONS, countries } from "../../constants";
import { AppContext } from "../../App";
import { getCountryHistory } from "../../api";
import {
  getFormattedCountryHistory,
  getFormattedStateHistory
} from "../../utils/formatData";

const getCompareList = searchText =>
  COMPARE_LOCATIONS.filter(location =>
    location.toLowerCase().includes(searchText.trim().toLowerCase())
  ).map(value => ({ value }));

export default function AddComparison() {
  const { state, dispatch } = useContext(AppContext);
  const stateHistory = state?.compare?.stateDaily || [];

  const [isInput, setInput] = useState(false);
  const wrapperRef = useRef();
  const inputRef = useRef();

  useEffect(() => inputRef?.current?.focus(), [isInput]);

  const [options, setOptions] = useState([]);

  const onSearch = searchText => {
    setOptions(!searchText ? [] : getCompareList(searchText));
  };

  const fetchCountryHistory = async country => {
    const resp = (await getCountryHistory(country))?.data;
    const countryInfo = resp?.stat_by_country || [];

    dispatch({
      type: "ADD_COMPARISON_HISTORY",
      value: getFormattedCountryHistory(countryInfo, country)
    });
  };

  const fetchStateHistory = stateName => {
    const stateInfo = stateHistory.find(state => state.longKey === stateName);
    stateInfo &&
      dispatch({
        type: "ADD_COMPARISON_HISTORY",
        value: getFormattedStateHistory(stateInfo)
      });
  };

  const onSelect = item => {
    const itemType = countries.find(country => country === item)
      ? "country"
      : "state";
    dispatch({ type: "ADD_COMPARE_ITEM", value: item, itemType });
    itemType === "country"
      ? fetchCountryHistory(item)
      : fetchStateHistory(item);
    setInput(false);
  };

  const onChange = data => {
    // setValue(data);
  };

  return (
    <div className="add-comparison" ref={wrapperRef}>
      {isInput ? (
        <AutoComplete
          defaultActiveFirstOption={true}
          className="add-compare-input"
          options={options}
          ref={inputRef}
          style={{
            width: 200
          }}
          onSelect={onSelect}
          onSearch={onSearch}
          onChange={onChange}
          placeholder="Add a country or state"
        />
      ) : (
        <button
          className="invisible-btn"
          type="button"
          onClick={() => setInput(true)}
        >
          + Add Comparison
        </button>
      )}
    </div>
  );
}
