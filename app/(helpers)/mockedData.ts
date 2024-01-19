function minTommss(minutes: number) {
    var sign = minutes < 0 ? "-" : "";
    var min = Math.floor(Math.abs(minutes));
    var sec = Math.floor((Math.abs(minutes) * 60) % 60);
    return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
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
        'g[seriesname="médiaxhorasxdiretasxestimadas"]'
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
            // dashed line
            linePotentialProductivityFirstChild.setAttribute("stroke-dasharray", "7");
        }
        if (lineEstimatedAvgDirectHoursFirstChild) {
            lineEstimatedAvgDirectHoursFirstChild.setAttribute("stroke", "#FF0000");
            lineEstimatedAvgDirectHoursFirstChild.setAttribute("stroke-width", "2");
            // dashed line
            lineEstimatedAvgDirectHoursFirstChild.setAttribute("stroke-dasharray", "7");
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
                    text: "Recursos1",
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
                seriesName: "produção estimada", // スケール合わせるためにわざと総数にしている
                show: false,
            },
            {
                seriesName: "produção potencial", // スケール合わせるためにわざと総数にしている
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
                enabled: false,
                borderColor: "transparent",
            },
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
                max: 30, // maximum value allowed
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
                    formatter: function (value: number) {
                        // the value will be a 3 digits number, I want to separate the first digit is the minute and the last two are the seconds
                        const minutes = value?.toString().substring(0, 1);
                        const seconds = value?.toString().substring(1);

                        const val = (Number(minutes) + Number(seconds) * 0.0168).toFixed(2);

                        if (minTommss(Number(val)) === 'NaN:NaN') {
                            return null
                        }

                        return minTommss(Number(val));
                    },
                    style: {
                        colors: "#CCCCCC",
                        fontWeight: "bold",
                    },
                },
                forceNiceScale: true,
            },

            {
                seriesName: "target horas directas", // スケール合わせるためにわざと総数にしている
                show: false,
                labels: {
                    formatter: function (value: number) {
                        const minutes = value?.toString().substring(0, 1);
                        const seconds = value?.toString().substring(1);

                        const val = (Number(minutes) + Number(seconds) * 0.0168).toFixed(2);

                        if (minTommss(Number(val)) === 'NaN:NaN') {
                            return null
                        }

                        return minTommss(Number(val));
                    },

                },
            },
            {
                seriesName: "target produtividade", // スケール合わせるためにわざと総数にしている
                show: false,
            },

        ],
        // tooltip: {
        //     shared: true,
        //     intersect: false,
        //     y: {
        //         formatter: function (val: any) {
        //             console.log(val)
        //             return val
        //             // if (typeof val !== "undefined" && val != null && isNaN(val) === false) {
        //             //     return val.toFixed(0);
        //             // }
        //             // return null;
        //         },
        //     },

        // },
        dataLabels: {
            enabled: true,
            enabledOnSeries: [0],
            style: {
                colors: ["white"],
            },
            background: {
                enabled: false,
                borderColor: "transparent",
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
        },
        colors: [
            function (props: any) {
                // First column
                if (props.seriesIndex === 0) {
                    return "#003369";
                }
                // First Line
                if (props.seriesIndex === 1) {
                    return "#6AB187";
                }
                // Second Line
                if (props.seriesIndex === 2) {
                    return "#003369";
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
            name: "target horas directas",
            type: "line",
            //   31 random numbers btw 800 and 200, not being the same as avobe
            data: [],
        },
        {
            name: "target produtividade",
            type: "line",
            //   31 random numbers btw 800 and 200, not being the same as avobe
            data: [],
        },
    ],
};