import React from "react";
import Chart from "react-apexcharts";
import { Data } from "../Productivity/UserTable";

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

type ProductionValues = {
  AERO: number;
  HPC: number;
  FOODS: number;
};

function RadarChart({ data }: { data: Data }) {
  const productionValues: ProductionValues = {
    AERO: 0,
    HPC: 0,
    FOODS: 0,
  };

  data?.workloads?.forEach((workload) => {
    // Use a type guard to ensure the key is valid
    if (workload.product_type in productionValues) {
      const key = workload.product_type as keyof ProductionValues;
      productionValues[key] = workload.production;
    }
  });

  // Prepare series data for the chart
  const seriesData = [
    productionValues.AERO,
    productionValues.HPC,
    productionValues.FOODS,
  ];

  // State for the chart
  const state = {
    series: [
      {
        name: "Production",
        data: seriesData,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "radar",
      },
      dataLabels: {
        enabled: true,
        background: {
          enabled: true,
          borderRadius: 2,
        },
      },
      xaxis: {
        categories: ["AERO", "HPC", "FOODS"],
      },
      fill: {
        opacity: 0.5,
        colors: [],
      },
      yaxis: {
        show: false,
      },
    },
  };

  return (
    <div className="mixed-chart mt-5">
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
