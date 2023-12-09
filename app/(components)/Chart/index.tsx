import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

// Components
import LineChartApex from "./LineChartApex";
import LineChart2Apex from "./LineChart2Apex";

function Chart() {
  const [chart, setChart] = useState("bar");
  const handleChangeChart = () => {
    setChart(chart === "bar" ? "line" : "bar");
  };

  return (
    <Card className="p-4 h-fit ">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <button type="button" onClick={handleChangeChart}>
          Change chart to {chart === "bar" ? "line v2" : "line"}
        </button>
        <h2 className="">Base Produtividade</h2>
      </CardHeader>
      <CardBody className="overflow-visible">
        {/* <LineChart2Apex /> */}
        {chart === "bar" ? <LineChart2Apex /> : <LineChartApex />}
        {/* <LineChartApex /> */}
      </CardBody>
    </Card>
  );
}

export default Chart;
