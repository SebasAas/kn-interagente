function minTommss(minutes: number) {
  var sign = minutes < 0 ? "-" : "";
  var min = Math.floor(Math.abs(minutes));
  var sec = Math.floor((Math.abs(minutes) * 60) % 60);
  return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}

function minTommssString(hour: string) {
  if (!hour || hour === null || hour === undefined) {
    return "00:00";
  }
  let internalHour = hour;

  // If hours is length 2 add a 0 in the beginning
  if (hour.toString().length === 2) {
    internalHour = `0${hour}`;
  }

  // If hour is a string, I want to return the same string

  let minutesInternal;
  let secondsInternal;

  if (hour?.toString().length === 4) {
    minutesInternal = hour?.toString().substring(0, 2);
    secondsInternal = hour?.toString().substring(2);
  } else {
    minutesInternal = hour?.toString().substring(0, 1);
    secondsInternal = hour?.toString().substring(1);
  }

  // if minutes length is 1 and seconds length is 1 return 00:minutesseconds
  if (minutesInternal?.length === 1 && secondsInternal?.length === 1) {
    return `00:${minutesInternal}${secondsInternal}`;
  }

  return `${minutesInternal}:${secondsInternal}`;
}

const handleChangeLineChart = () => {
  // Change productivity line stroke color
  const lineProductivity = document.querySelectorAll(
    'g[seriesname="produção"]'
  );
  const lineEstimateProductivity = document.querySelectorAll(
    'g[seriesname="produçãoxestimada"]'
  );
  // const linePotentialProductivity = document.querySelectorAll(
  //     'g[seriesname="produçãoxpotencial"]'
  // );

  // Loop through all SVG elements on the page
  if (
    !lineProductivity ||
    !lineEstimateProductivity
    // || !linePotentialProductivity
  ) {
    handleChangeLineChart();
  } else {
    // get first child of lineProductivity
    const lineProductivityFirstChild: any = lineProductivity[0]?.firstChild;
    const lineEstimateProductivityFirstChild: any =
      lineEstimateProductivity[0]?.firstChild;
    // const linePotentialProductivityFirstChild: any =
    //     linePotentialProductivity[0].firstChild;

    // change stoke color to hex orange
    if (lineProductivityFirstChild) {
      lineProductivityFirstChild.setAttribute("stroke", "#FF8C00");
      lineProductivityFirstChild.setAttribute("stroke-width", "2");
    }
    if (lineEstimateProductivityFirstChild) {
      lineEstimateProductivityFirstChild.setAttribute("stroke", "#DBAE58");
      lineEstimateProductivityFirstChild.setAttribute("stroke-width", "2");
      lineEstimateProductivityFirstChild.setAttribute("stroke-dasharray", "7");
    }
    // if (linePotentialProductivityFirstChild) {
    //     linePotentialProductivityFirstChild.setAttribute("stroke", "#FF0000");
    //     linePotentialProductivityFirstChild.setAttribute("stroke-width", "2");
    //     // dashed line
    //     linePotentialProductivityFirstChild.setAttribute("stroke-dasharray", "7");
    // }
  }
};

const handleChangeLineChartProductivityByHour = () => {
  // Change productivity line stroke color
  const lineProductivity = document.querySelectorAll(
    'g[seriesname="médiaxhorasxdiretas"]'
  );
  const lineEstimatedAvgDirectHours = document.querySelectorAll(
    'g[seriesname="médiaxhorasxdiretasxestimados"]'
  );
  const lineEstimateProductivity = document.querySelectorAll(
    'g[seriesname="targetxhorasxdiretas"]'
  );
  const linePotentialProductivity = document.querySelectorAll(
    'g[seriesname="targetxprodutividade"]'
  );

  // Loop through all SVG elements on the page
  if (
    !lineProductivity ||
    !lineEstimateProductivity ||
    !linePotentialProductivity ||
    !lineEstimatedAvgDirectHours
  ) {
    handleChangeLineChart();
  } else {
    // get first child of lineProductivity
    const lineProductivityFirstChild: any = lineProductivity[0]?.firstChild;
    const lineEstimateProductivityFirstChild: any =
      lineEstimateProductivity[0]?.firstChild;
    const linePotentialProductivityFirstChild: any =
      linePotentialProductivity[0]?.firstChild;
    const lineEstimatedAvgDirectHoursFirstChild: any =
      lineEstimatedAvgDirectHours[0]?.firstChild;

    // change stoke color to hex orange
    if (lineProductivityFirstChild) {
      lineProductivityFirstChild.setAttribute("stroke", "#6AB187");
      lineProductivityFirstChild.setAttribute("stroke-width", "2");
    }
    if (lineEstimateProductivityFirstChild) {
      lineEstimateProductivityFirstChild.setAttribute("stroke", "#003369");
      lineEstimateProductivityFirstChild.setAttribute("stroke-width", "2");
      lineEstimateProductivityFirstChild.setAttribute("stroke-dasharray", "7");
    }
    if (linePotentialProductivityFirstChild) {
      linePotentialProductivityFirstChild.setAttribute("stroke", "#FF0000");
      linePotentialProductivityFirstChild.setAttribute("stroke-width", "2");
      linePotentialProductivityFirstChild.setAttribute("stroke-dasharray", "7");
    }
    if (lineEstimatedAvgDirectHoursFirstChild) {
      lineEstimatedAvgDirectHoursFirstChild.setAttribute("stroke", "#FFF");
      lineEstimatedAvgDirectHoursFirstChild.setAttribute("stroke-width", "3");
      // dashed line
      lineEstimatedAvgDirectHoursFirstChild.setAttribute(
        "stroke-dasharray",
        "7"
      );
    }
  }
};

const updateCustomElementsChart = () => {
  handleChangeLineChart();
};

const updateCustomElementsChartProductivityByHours = () => {
  handleChangeLineChartProductivityByHour();
};

export const stateProductionxResources = {
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

    stroke: {
      colors: ["transparent"],
      width: 5,
    },
    xaxis: {
      type: "category",
      categories: [],
      labels: {
        formatter: function (val: string) {
          // Based in the date
          return `${val}`;
        },
        style: {
          fontSize: "12px",
          fontWeight: 600,
          colors: "#000",
        },
      },
    },
    yaxis: [
      {
        seriesName: "produtividade potencial",
        title: {
          text: "Recursos",
          style: {
            color: "#CCCCCC",
            fontSize: "14px",
            fontWeight: 500,
          },
        },
        labels: {
          formatter: (value: number) => {
            return value;
          },
          style: {
            colors: "#CCCCCC",
            fontWeight: "bold",
          },
        },
        forceNiceScale: true,
      },
      {
        seriesName: "produção",
        opposite: true,
        title: {
          text: "Produção",
          style: {
            color: "#CCCCCC",
            fontSize: "14px",
            fontWeight: 500,
          },
        },
        labels: {
          formatter: (value: number) => {
            // add the thousands separator
            if (!value) return undefined;
            const valueString = value?.toString();
            return valueString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          },
          style: {
            colors: "#CCCCCC",
            fontWeight: "bold",
          },
        },
        forceNiceScale: true,
      },
      {
        seriesName: "produção estimada",
        show: false,
        labels: {
          formatter: (value: number) => {
            if (
              !value ||
              value === null ||
              value === undefined ||
              value === 0
            ) {
              return undefined;
            }
            const valueString = value?.toString();
            return valueString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          },
          style: {
            colors: "#CCCCCC",
            fontWeight: "bold",
          },
        },
      },
      {
        seriesName: "produção potencial",
        show: false,
      },
    ],
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
      style: {
        colors: ["white"],
      },
      background: {
        enabled: true,
        borderColor: "transparent",
        colors: ["transparent"],
        foreColor: "#6AB187",
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: "#6AB187",
          opacity: 0.45,
        },
      },

      // dropShadow: {
      //   enabled: true,
      //   top: 0,
      //   left: 0,
      //   blur: 1,
      //   color: "#000",
      //   opacity: 1,
      // },
    },
    legend: {
      formatter: (val: string) => {
        // Val is the text, the text could have one, two or many words, I want to return uppercase every first letter
        const words = val.split(" ");
        const wordsUppercase = words.map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return wordsUppercase.join(" ");
      },
      offsetY: 5,
      fontWeight: "bold",
      labels: {
        colors: "#CCC",
      },
      markers: {
        offsetX: -5,
      },
      itemMargin: {
        horizontal: 10,
      },
      onItemClick: {
        toggleDataSeries: false,
      },
    },
    colors: [
      function (props: any) {
        // First column
        if (props.seriesIndex === 0) {
          return "#6AB187";
        }
        // First Line
        if (props.seriesIndex === 1) {
          return "#FF8C00";
        }
        // Second Line
        if (props.seriesIndex === 2) {
          return "#DBAE58";
        }
        if (props.seriesIndex === 3) {
          return "#FF0000";
        }
        if (props.seriesIndex === 4) {
          return "#FF0000";
        }
      },
    ],
    plotOptions: {
      bar: {
        columnWidth: "100%",
        dataLabels: {
          position: "bottom",
          total: {
            offsetY: 130,
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#333"],
        },
        offsetX: 30,
      },
    },
  },
  series: [
    {
      name: "recursos",
      type: "bar",
      data: [],
    },
    {
      name: "produção",
      type: "line",
      //   31 random numbers btw 800 and 200, not being the same as avobe
      data: [],
    },
    {
      name: "produção estimada",
      type: "line",
      //   31 random numbers btw 800 and 200, not being the same as avobe
      data: [],
    },
    {
      name: "produção potencial",
      type: "line",
      //   31 random numbers btw 800 and 200, not being the same as avobe
      data: [],
    },
  ],
};

export const stateProductivityxHour = {
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
          updateCustomElementsChartProductivityByHours();
        },
        updated: function () {
          updateCustomElementsChartProductivityByHours();
        },
      },
    },

    stroke: {
      colors: ["transparent"],
      width: 5,
    },
    xaxis: {
      type: "category",
      categories: [],
      labels: {
        formatter: function (val: string) {
          // Based in the date
          return `${val}`;
        },
        style: {
          fontSize: "12px",
          fontWeight: 600,
          colors: "#000",
        },
      },
    },
    yaxis: [
      {
        seriesName: "produtividade",
        min: 0,
        tickAmount: 5, // number of lines
        title: {
          text: "Produtividade",
          style: {
            color: "#CCCCCC",
            fontSize: "14px",
            fontWeight: 500,
          },
        },
        labels: {
          formatter: (value: number) => {
            return value;
          },
          style: {
            colors: "#CCCCCC",
            fontWeight: "bold",
          },
        },
        forceNiceScale: true,
      },
      {
        seriesName: "media horas diretas",
        opposite: true,
        title: {
          text: "Horas diretas",
          style: {
            color: "#CCCCCC",
            fontSize: "14px",
            fontWeight: 500,
          },
        },
        tickAmount: 5, // number of lines
        labels: {
          formatter: function (value: string) {
            if (!value || value === null || value === undefined) {
              return undefined;
            }
            // the value will be a 3 digits number, I want to separate the first digit is the minute and the last two are the seconds
            return minTommssString(value);
          },
          style: {
            colors: "#CCCCCC",
            fontWeight: "bold",
          },
        },
        forceNiceScale: true,
      },
      {
        seriesName: "media horas diretas estimados",
        show: false,
        opposite: true,
        labels: {
          formatter: function (value: string) {
            if (!value || value === null || value === undefined) {
              return undefined;
            }
            return minTommssString(value);
          },
        },
      },
    ],
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
      style: {
        colors: ["white"],
      },
      background: {
        enabled: true,
        borderColor: "transparent",
        colors: ["transparent"],
        foreColor: "#003369",
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: "#003369",
          opacity: 0.45,
        },
      },
    },
    legend: {
      formatter: (val: string) => {
        // Val is the text, the text could have one, two or many words, I want to return uppercase every first letter
        const words = val?.split(" ");
        const wordsUppercase = words?.map((word) => {
          return word?.charAt(0)?.toUpperCase() + word?.slice(1);
        });
        return wordsUppercase?.join(" ");
      },
      offsetY: 5,
      fontWeight: "bold",
      labels: {
        colors: "#CCC",
      },
      markers: {
        offsetX: -5,
      },
      itemMargin: {
        horizontal: 10,
      },
      onItemClick: {
        toggleDataSeries: false,
      },
    },
    colors: [
      function (props: any) {
        // First column
        if (props.seriesIndex === 0) {
          return "#003369";
        }
        // Second Line
        if (props.seriesIndex === 2) {
          return "#6AB187";
        }
        if (props.seriesIndex === 1) {
          return "#6AB187";
        }
      },
    ],
    plotOptions: {
      bar: {
        columnWidth: "100%",
        dataLabels: {
          position: "bottom",
          total: {
            offsetY: 130,
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#333"],
        },
        offsetX: 30,
      },
    },
  },
  series: [
    {
      name: "produtividade",
      type: "bar",
      data: [],
    },
    {
      // Pedir para Joao mandar as horas assim...
      name: "media horas diretas",
      type: "line",
      //   31 random numbers btw 800 and 200, not being the same as avobe
      data: [],
    },
    {
      name: "media horas diretas estimados",
      type: "line",
      //   31 random numbers btw 800 and 200, not being the same as avobe
      data: [],
    },
  ],
};
