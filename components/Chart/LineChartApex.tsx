import React from "react";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const dates = ["24/10", "25/10", "26/10"];

const xAxisLabel = [
  "1° turno;24/10",
  "2° turno;24/10",
  "3° turno;24/10",
  "1° turno;25/10",
  "2° turno;25/10",
  "3° turno;25/10",
  "1° turno;26/10",
  "2° turno;26/10",
  "3° turno;26/10",
];

const state = {
  options: {
    chart: {
      id: "mixed-chart",
      toolbar: {
        show: true,
        tools: {
          zoom: false,
          selection: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      zoom: {
        enabled: false,
      },
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
      colors: ["transparent"],
      width: 5,
    },
    xaxis: {
      type: "category",
      categories: xAxisLabel,
      labels: {
        formatter: function (val: string) {
          // Based in the date
          if (!val) return;

          const splittedVal = val.split(";");
          const value = splittedVal[0];
          const date = splittedVal[1];

          if (value === "1° turno" && date === "25/10") {
            return `_${value}_`;
          }

          // const columnProductivity = xAxisLabel[val]
          // const columnDemand = xAxisLabel[val + 1]

          return value;
        },
        style: {
          fontSize: "12px",
          fontWeight: 600,
          colors: "#c2c2c2",
        },
      },
    },
    tooltip: {
      //   custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
      //     return (
      //       '<div class="arrow_box">' +
      //       "<span>" +
      //       w.globals.labels[dataPointIndex] +
      //       ": " +
      //       series[seriesIndex][dataPointIndex] +
      //       "</span>" +
      //       "</div>"
      //     );
      //   },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "left",
      itemMargin: {
        vertical: 35,
      },
    },
    plotOptions: {
      bar: {
        colors: {
          backgroundBarColors: [
            "transparent",
            "transparent",
            "transparent",
            "rgb(250, 64, 64)",
            "transparent",
            "transparent",
            "transparent",
            "transparent",
            "transparent",
          ],
        },
        dataLabels: {
          // position: "bottom",
        },
      },
    },
    colors: [
      function (props: any) {
        // Column with alert
        // if (
        //   (props.seriesIndex === 0 && props.dataPointIndex === 3) ||
        //   (props.seriesIndex === 1 && props.dataPointIndex === 3)
        // ) {
        //   return "#FF0000";
        // }

        // First column
        if (props.seriesIndex === 0) {
          return "rgba(0, 227, 150, 0.85)";
        }
        // Second column
        if (props.seriesIndex === 1) {
          return "rgba(0, 143, 251, 0.85)";
        }
        // Line
        if (props.seriesIndex === 2) {
          return "#FF8C00";
        }
      },
    ],
  },
  series: [
    {
      name: "produtividade potencial",
      type: "bar",
      data: [400, 430, 448, 470, 540, 580, 690, 690, 258],
    },
    {
      name: "demanda",
      type: "bar",
      data: [200, 400, 150, 504, 238, 135, 623, 419, 350], // Bar chart data for demand
    },
    {
      name: "demanda realizada",
      type: "line",
      data: [400, 430, 448, 470, 540, 580, 690, 690, 258], // Line chart data for productivity
    },
  ],
};

const drawLineSecondXAxis = () => {
  // Draw lines in between the bars to set boundaries for the second x-axis
  const groupGraphicalChart = document.querySelector(".apexcharts-graphical");
  // Draw lines in between the bars to set boundaries for the second x-axis
  const groupInnerChart = document.querySelectorAll(".apexcharts-xaxis-tick");

  const childrenLength = groupInnerChart?.length;

  if (!childrenLength) return;

  for (let i = 2; i < childrenLength; i += 3) {
    if (i === 0) continue;

    console.log(i);

    const prevLine = groupInnerChart?.[i] as HTMLElement;
    const nextLine = groupInnerChart?.[i + 1] as HTMLElement;

    if (prevLine && nextLine) {
      const lineYStartAttribute = prevLine?.getAttribute("y1");
      const lineYEndAttribute = prevLine?.getAttribute("y2");
      const prevLineXAttribute = prevLine?.getAttribute("x1");
      const nextLineXAttribute = nextLine?.getAttribute("x1");

      if (lineYStartAttribute && lineYEndAttribute) {
        // Get the center of the two lines
        const centerOfTwoLines =
          (Number(prevLineXAttribute) + Number(nextLineXAttribute)) / 2;

        // Create a new line element and append it to the groupInnerChart with the center of the two lines
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", String(centerOfTwoLines));
        line.setAttribute("x2", String(centerOfTwoLines));
        line.setAttribute("y1", String(lineYStartAttribute));
        line.setAttribute("y2", String(Number(lineYEndAttribute) + 20));
        line.setAttribute("stroke", "#c2c2c2");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("class", `apexcharts-xcrosshairs-line-${i}`);
        groupGraphicalChart?.appendChild(line);
      }
    }
  }

  //   const prevLine = groupInnerChart?.childNodes[4] as HTMLElement;
  //   const nextLine = groupInnerChart?.childNodes[5] as HTMLElement;

  //   if (!prevLine || !nextLine) return;

  //   const lineYStartAttribute = prevLine?.getAttribute("y1");
  //   const lineYEndAttribute = prevLine?.getAttribute("y2");
  //   const prevLineXAttribute = prevLine?.getAttribute("x1");
  //   const nextLineXAttribute = nextLine?.getAttribute("x1");

  //   // Get the center of the two lines
  //   const centerOfTwoLines =
  //     (Number(prevLineXAttribute) + Number(nextLineXAttribute)) / 2;

  //   // Create a new line element and append it to the groupInnerChart with the center of the two lines
  //   const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  //   line.setAttribute("x1", String(centerOfTwoLines));
  //   line.setAttribute("x2", String(centerOfTwoLines));
  //   line.setAttribute("y1", String(lineYStartAttribute));
  //   line.setAttribute("y2", String(Number(lineYEndAttribute) + 20));
  //   line.setAttribute("stroke", "#c2c2c2");
  //   line.setAttribute("stroke-width", "1");
  //   line.setAttribute("class", "apexcharts-xcrosshairs-line");
  //   groupInnerChart?.appendChild(line);

  //   console.log(centerOfTwoLines);
};

const drawNewXAxis = () => {
  //   Adding new x-axis labels
  const groupLabels = document.querySelectorAll(
    'g[class="apexcharts-xaxis"]'
  )[0].firstChild;

  const secondLabelEachGroup = {
    1: groupLabels?.childNodes[1],
    4: groupLabels?.childNodes[4],
    7: groupLabels?.childNodes[7],
  };

  // Add new text elements in the groupLabels adding +21 to the y value (second x-axis refering to the dates)
  if (secondLabelEachGroup) {
    Object.values(secondLabelEachGroup).forEach((label: any, index: number) => {
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", label.getAttribute("x"));
      text.setAttribute("y", String(Number(label?.getAttribute("y")) + 25));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", "12px");
      text.setAttribute("font-weight", "700");
      text.setAttribute("fill", "#373d3f");
      text.setAttribute("class", "apexcharts-text apexcharts-xaxis-label");
      text.textContent = dates[index];
      groupLabels?.appendChild(text);
    });
  }
};

const handleChangeLineChart = () => {
  // Change productivity line stroke color
  const lineProductivity = document.querySelectorAll(
    'g[seriesname="demandaxrealizada"]'
  );

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

const changeColorLabelAlert = () => {
  const groupText = document.querySelector(".apexcharts-xaxis-texts-g");

  if (!groupText) return;

  const tspans = groupText.querySelectorAll("tspan");

  tspans.forEach((tspan) => {
    const text = tspan.textContent;
    const regex: any = /_(.*?)_/g;

    if (regex.test(text)) {
      // Remove underscores from text and change color to red
      if (!text) return;

      const newText = text.replace(/_/g, "");
      tspan.textContent = newText;
      tspan.style.fill = "red";
    }
  });
};

const updateCustomElementsChart = () => {
  handleChangeLineChart();
  drawNewXAxis();
  drawLineSecondXAxis();
  changeColorLabelAlert();
};

function BarChartApex() {
  return (
    <div className="mixed-chart">
      <Chart
        //   @ts-ignore
        options={state.options}
        series={state.series}
        type="line"
        height="480"
      />
    </div>
  );
}

export default BarChartApex;
