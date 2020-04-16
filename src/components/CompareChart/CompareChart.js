import React, { useContext } from "react";
import LineChart from "../Charts/LineChart";
import { AppContext } from "../../App";
import moment from "moment";

export default function CompareChart() {
  const { state } = useContext(AppContext);
  const comparisonHistory = state?.compare?.comparisonHistory || [];
  const colors = ["#4285F4", "#DB4437", "#FFCA28", "#43A047", "#9C27B0"];

  const oldestDataSet = comparisonHistory.reduce((oldest, current) => {
    if (!oldest) {
      return current;
    }
    const oldDate = oldest?.Confirmed?.[0].date;
    const currentDate = current?.Confirmed?.[0].date;
    if (oldDate && currentDate) {
      const totalDaysMissing = currentDate.diff(oldDate, "days");
      return totalDaysMissing > 0 ? oldest : current;
    }
    return current;
  }, {});

  debugger;
  const xAxis = (oldestDataSet?.Confirmed || []).map(item =>
    moment(item.date).format("DD-MMM-YY")
  );

  const getDataList = (item, biggestDataSet) => {
    debugger;
    const oldestStartDate = biggestDataSet?.Confirmed?.[0]?.date;
    const itemStartDate = item?.Confirmed?.[0]?.date;
    if (oldestStartDate && itemStartDate) {
      const totalDaysMissing = itemStartDate.diff(oldestStartDate, "days");
      return totalDaysMissing > 0
        ? [
            ...Array.from({ length: totalDaysMissing }),
            ...(item?.Active || []).map(item => item.value)
          ]
        : (item?.Active || []).map(obj => obj.value);
    }
    return [];
  };

  const dataPlaceHolder = comparisonHistory.map((item, index) => ({
    label: item.label,
    borderColor: colors[index],
    data: getDataList(item, oldestDataSet)
  }));

  return (
    <div style={{ width: "60%" }}>
      <LineChart
        labels={xAxis}
        dataSet={dataPlaceHolder}
        options={{
          legend: {
            onClick: null
          }
        }}
      />
    </div>
  );
}
