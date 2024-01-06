import React from "react";
import Chart from "react-apexcharts";

const state = {
  series: [
    {
      name: "Series 1",
      data: [80, 50, 30, 40, 100, 20],
    },
  ],
  options: {
    chart: {
      height: 350,
      type: "radar",
    },
    xaxis: {
      categories: ["January", "February", "March", "April", "May", "June"],
    },
  },
};

function RadarChart() {
  return (
    <div className="mixed-chart mt-4">
      <Chart
        // @ts-ignore
        options={state.options}
        series={state.series}
        type="radar"
        height={350}
      />
    </div>
  );
}

export default RadarChart;
