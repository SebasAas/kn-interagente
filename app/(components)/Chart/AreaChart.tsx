import React from "react";

// Charts
import Chart from "react-apexcharts";

const data = {
  series: [
    {
      name: "Peso Liquido",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    },
  ],
  options: {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
  },
};
function AreaChart() {
  return (
    <Chart
      // @ts-ignore
      options={data.options}
      series={data.series}
      type="area"
      height={350}
    />
  );
}
export default AreaChart;
