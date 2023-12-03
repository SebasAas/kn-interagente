"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// export const options = {
//   plugins: {
//     legend: {
//       position: "top" as const,
//       align: "start" as const,
//       labels: {
//         boxWidth: 3,
//         usePointStyle: true,
//         pointStyle: "circle",
//       },
//       title: {
//         text: "Sales Report",
//         display: true,
//         color: "#000",
//         font: {
//           size: 18,
//         },
//       },
//     },
//   },

//   scales: {
//     xAxis: {
//       display: false,
//     },
//     yAxis: {
//       max: 1,
//     },
//   },
// };

var options = {
  scales: {
    yAxes: [
      {
        id: "A",
        position: "left",
        display: true,
        gridLines: { color: "rgba(53,81,103,.4)" },
      },
    ],
    xAxes: [
      {
        barPercentage: 0.4,
        display: true,
        id: "1",
        position: "bottom",

        ticks: {
          fontColor: "rgb(0, 0, 0)",
        },
        fontSize: 500,
      },
      {
        stacked: false,
        barPercentage: 1,
        display: true,
        type: "linear",
        id: "2",
        position: "bottom",
        ticks: {
          fontColor: "rgb(0, 0, 0)",
        },
        fontSize: 500,
      },
    ],
  },
};

const labels = [
  "1° turno;24/09",
  "2° turno;24/09",
  "3° turno;24/09",
  "1° turno;25/09",
  "2° turno;25/09",
  "3° turno;25/09",
  "1° turno;26/09",
  "2° turno;26/09",
  "3° turno;26/09",
  "1° turno;27/09",
  "2° turno;27/09",
  "3° turno;27/09",
];

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: "Productividade Potencial",
//       xAxisID: "xAxis1",
//       stack: "Stack 0",
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       backgroundColor: "rgb(62,149,205)",
//       borderColor: "#3e95cd",
//       borderWidth: 1,
//     },
//     {
//       label: "Demanda Prvista",
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       stack: "Stack 1",
//       borderColor: "#ffa500",
//       backgroundColor: "#ffa500",
//       borderWidth: 1,
//     },
//   ],
// };

var data = {
  labels: ["Label1", "Label2", "Label3", "Label4", "Label5"],
  datasets: [
    {
      label: "Total V",
      yAxisID: "A",
      backgroundColor: "rgba(53,81,103,1)",
      borderColor: "rgba(53,81,103,.4)",
      data: [100, 40, 30, 70, 60],
    },
    {
      label: "Total C",
      xAxisID: "2",
      backgroundColor: "rgba(255,153,0,1)",
      borderColor: "rgba(255,153,0,.4)",
      data: [9, 9, 8, 7, 6],
    },
  ],
};

function BarChart() {
  // @ts-ignore
  return <Bar options={options} data={data} height={80} />;
}

export default BarChart;
