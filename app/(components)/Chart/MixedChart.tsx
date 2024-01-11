import React from "react";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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
