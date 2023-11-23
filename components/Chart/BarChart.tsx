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

export const options = {
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        padding: 30,
        usePointStyle: true,
      },
    },
    labels: {
      boxWidth: 3,
      usePointStyle: true,
      pointStyle: "circle" as const,
    },
    title: {
      text: "Sales Report",
      display: true,
      color: "#000",
      font: {
        size: 18,
      },
    },
  },
  maintainAspectRatio: false,
  options: {
    scales: {
      yAxes: [
        {
          labels: ["A", "B", "C", "A", "B", "C", "A", "B", "C"],
        },
        {
          ticks: {
            min: 0,
            max: 80,
            stepSize: 20,
          },
          scaleLabel: {
            display: true,
            labelString: "Percent (%)",
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
          },
        },
      ],
    },
  },
};

const labels = [
  "24/09",
  "25/09",
  "26/09",
  "27/09",
  "28/09",
  "29/09",
  "30/09",
  "01/10",
  "01/10",
  "02/10",
  "03/10",
  "04/10",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Productividade Potencial",
      yAxisID: "yAxis1",
      stack: "Stack 0",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: "rgb(62,149,205)",
      borderColor: "#3e95cd",
      borderWidth: 1,
    },
    {
      label: "Demanda Prvista",
      yAxisID: "yAxis1",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      stack: "Stack 1",
      borderColor: "#ffa500",
      backgroundColor: "#ffa500",
      borderWidth: 1,
    },
  ],
};

function BarChart() {
  return <Bar options={options} data={data} height={400} />;
}

export default BarChart;
