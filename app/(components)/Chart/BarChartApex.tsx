import React from "react";
import Chart from "react-apexcharts";

const state = {
  options: {
    chart: {
      id: "basic-bar",
    },
    stroke: {
      colors: ["transparent"],
      width: 5,
    },
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
      name: "productivity",
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
      name: "demand",
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
  ],
};
function BarChartApex() {
  return (
    <div className="mixed-chart">
      <Chart
        // @ts-ignore
        options={state.options}
        series={state.series}
        type="bar"
        height="450"
      />
    </div>
  );
}

export default BarChartApex;
