import React, { useRef, useEffect } from "react";
import { Line, defaults } from "react-chartjs-2";

export default function LineChart({ labels, dataSet, options = {} }) {
  const lineRef = useRef();
  defaults.global.legend.position = "bottom";

  useEffect(() => {
    console.log("LineChart", lineRef.current);
  }, []);
  const dataSetDefaults = {
    fill: false,
    lineTension: 0.1,
    backgroundColor: "rgba(75,192,192,0.4)",
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: "miter",
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    gridLines: false
  };

  const data = {
    labels: labels,
    datasets: (dataSet || []).map(item => ({
      ...dataSetDefaults,
      ...item
    }))
  };

  return (
    <Line
      data={data}
      ref={lineRef}
      options={{
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "MMM DD",
                stepSize: 7,
                displayFormats: {
                  millisecond: "MMM DD",
                  second: "MMM DD",
                  minute: "MMM DD",
                  hour: "MMM DD",
                  day: "MMM DD",
                  week: "MMM DD",
                  month: "MMM DD",
                  quarter: "MMM DD",
                  year: "MMM DD"
                }
              },

              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              type: "linear",
              ticks: {
                // stepSize: 2000,
              },
              gridLines: {
                // display: false,
                tickMarkLength: 5
              }
            }
          ]
        },
        ...options
      }}
    />
  );
}
