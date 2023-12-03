import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScriptableContext,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
      text: "Produtividade",
      display: true,
      color: "#000",
      font: {
        size: 18,
      },
    },
  },
  options: {},
};

const data = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dez",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dez",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dez",
  ],
  datasets: [
    {
      label: "First dataset",
      data: [
        33, 53, 85, 41, 44, 65, 23, 76, 43, 65, 23, 76, 55, 35, 84, 23, 76, 43,
        65, 10, 33, 53, 85, 41, 44, 65, 23, 76, 43, 65, 23, 76, 55, 35, 84, 23,
      ],
      fill: true,
      lineTension: 0.1,
      backgroundColor: (context: ScriptableContext<"line">) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "rgba(0, 153, 218, 1)");
        gradient.addColorStop(1, "rgba(0, 153, 218, 0)");
        return gradient;
      },
      borderColor: "rgba(0, 131, 187, 1)",
    },
  ],
};

function LineChart() {
  return <Line options={options} data={data} height={80} />;
}

export default LineChart;
