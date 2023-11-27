import React from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const dates = ["24/10", "25/10", "26/10"];
const shifts = ["1° turno", "2° turno", "3° turno"];

const categories = dates.reduce((acc: any, date: any) => {
  shifts.forEach((shift) => {
    acc.push(`${date} ${shift}`);
  });
  return acc;
}, []);

const state = {
  options: {
    chart: {
      height: 350,
      type: "line",
      events: {
        mounted: function () {
          updateCustomElementsChart();
        },
        updated: function () {
          updateCustomElementsChart();
        },
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1],
    },
    stroke: {
      curve: "straight",
      colors: ["transparent"],
      width: 5,
    },
    fill: {
      type: "solid",
    },
    markers: {
      colors: "#FF8C00",
      strokeColors: "#FF8C00",
      size: 4,
    },
    tooltip: {
      shared: false,
      intersect: true,
    },
    // legend: {
    //   show: false,
    // },
    xaxis: {
      type: "category" as const,
      labels: {
        formatter: function (val: number) {
          return val;
        },
        style: {
          fontSize: "10px",
          fontWeight: 700,
        },
      },
      group: {
        style: {
          fontSize: "10px",
          fontWeight: 700,
        },
        groups: [
          { title: "24/10", cols: 3 },
          { title: "25/10", cols: 3 },
          { title: "26/10", cols: 3 },
        ],
      },
    },
  },
  series: [
    {
      name: "Bar",
      type: "bar",
      data: [
        {
          x: "1° turno",
          y: 400,
          goals: [
            {
              name: "Expected",
              value: 300,
              strokeWidth: 26,
              strokeHeight: 2,
              strokeLineCap: "round",
              strokeColor: "#775DD0",
            },
            {
              name: "Max",
              value: 350,
              strokeWidth: 26,
              strokeHeight: 2,
              strokeDashArray: 2,
              strokeColor: "#775DD0",
            },
            {
              name: "Min",
              value: 270,
              strokeWidth: 26,
              strokeHeight: 2,
              strokeDashArray: 2,
              strokeColor: "#775DD0",
            },
          ],
        },
        {
          x: "2° turno",
          y: 430,
        },
        {
          x: "3° turno",
          y: 448,
        },
        {
          x: "1° turno",
          y: 470,
        },
        {
          x: "2° turno",
          y: 540,
        },
        {
          x: "3° turno",
          y: 580,
        },
        {
          x: "1° turno",
          y: 690,
        },
        {
          x: "2° turno",
          y: 690,
        },
        {
          x: "3° turno",
          y: 258,
        },
      ],
    },
    {
      name: "Bar",
      type: "bar",
      data: [
        {
          x: "1° turno",
          y: 200,
          goals: [
            {
              name: "Expected",
              value: 300,
              strokeWidth: 27,
              strokeHeight: 2,
              strokeLineCap: "round",
              strokeColor: "#775DD0",
            },
            {
              name: "Max",
              value: 350,
              strokeWidth: 27,
              strokeHeight: 2,
              strokeDashArray: 2,
              strokeColor: "#775DD0",
            },
            {
              name: "Min",
              value: 270,
              strokeWidth: 27,
              strokeHeight: 2,
              strokeDashArray: 2,
              strokeColor: "#775DD0",
            },
          ],
        },
        {
          x: "2° turno",
          y: 400,
        },
        {
          x: "3° turno",
          y: 150,
        },
        {
          x: "1° turno",
          y: 504,
        },
        {
          x: "2° turno",
          y: 238,
        },
        {
          x: "3° turno",
          y: 135,
        },
        {
          x: "1° turno",
          y: 623,
        },
        {
          x: "2° turno",
          y: 419,
        },
        {
          x: "3° turno",
          y: 350,
        },
      ],
    },
    {
      name: "Line",
      type: "line",
      data: [
        {
          x: "1° turno",
          y: 400,
        },
        {
          x: "2° turno",
          y: 430,
        },
        {
          x: "3° turno",
          y: 448,
        },
        {
          x: "1° turno",
          y: 470,
        },
        {
          x: "2° turno",
          y: 540,
        },
        {
          x: "3° turno",
          y: 580,
        },
        {
          x: "1° turno",
          y: 690,
        },
        {
          x: "2° turno",
          y: 690,
        },
        {
          x: "3° turno",
          y: 258,
        },
      ],
    },
  ],
};

const handleChangeLineChart = () => {
  // Change productivity line stroke color
  const lineProductivity = document.querySelectorAll('g[seriesname="Line"]');

  // Loop through all SVG elements on the page
  if (!lineProductivity) {
    handleChangeLineChart();
  } else {
    // get first child of lineProductivity
    const lineProductivityFirstChild: any = lineProductivity[0].firstChild;
    // change stoke color to hex orange
    if (lineProductivityFirstChild) {
      lineProductivityFirstChild.setAttribute("stroke", "#FF8C00");
      lineProductivityFirstChild.setAttribute("stroke-width", "3");
    }
  }
};

const updateCustomElementsChart = () => {
  handleChangeLineChart();
};

function BarChartApex() {
  return (
    <div className="mixed-chart">
      <Chart
        // @ts-ignore
        options={state.options}
        series={state.series}
        type="bar"
        height={450}
      />
    </div>
  );
}

export default BarChartApex;
