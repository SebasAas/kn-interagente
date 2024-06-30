"use client";

import React from "react";
// Charts
import Chart from "react-apexcharts";

function BarChartApex({ state }: { state: any }) {
  return (
    <div className="mixed-chart">
      <Chart
        //   @ts-ignore
        options={state.options}
        series={state.series}
        type="line"
        height="280"
      />
    </div>
  );
}

export default BarChartApex;
