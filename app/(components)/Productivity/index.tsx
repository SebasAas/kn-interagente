"use client";

import React, { useEffect, useState } from "react";

// Next
import dynamic from "next/dynamic";

// Auth
import { useSession } from "next-auth/react";

// Components
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";

// Helpers
import {
  stateProductionxResources,
  stateProductivityxHour,
} from "../../(helpers)/mockedData";
import { toast } from "react-toastify";
import { useAppContext } from "@/app/(context)/AppContext";
import { fetchProductionCharts } from "@/app/(services)/productivity";
import { fetchRanking } from "@/app/(services)/ranking";
import DropzoneProductivity from "./Dropzone";
import Subtitle from "../Text/Subtitle";
import Ranking from "./Ranking";
import User from "./User";
import ToolIcon from "@/app/(assets)/ToolIcon";

const MixedChart = dynamic(() => import("../Chart/MixedChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] flex justify-center items-center">
      <p>Carregando grafico...</p>
    </div>
  ),
});

interface ChartData {
  indicator: string;
  data: number[];
  label: number[];
}

interface Series {
  name: string;
  type: string;
  data: (number | null)[];
  zIndex?: number;
}

// Define the order of the indicators
const indicatorOrder = [
  "Recursos",
  "Produção",
  "Produção estimada",
  "Produção potencial",
  "Produtividade",
  "Target produtividade",
  "Média horas diretas estimados",
  "Média horas diretas",
  "Target horas diretas",
];

const filterSeriesByIndicators = (
  series: Series[],
  indicators: string[]
): Series[] => {
  return series.filter((s) => indicators.includes(s.name));
};

const mergeArrays = (
  series: Series[],
  name: string,
  seriesName: string
): Series => {
  const recursos =
    series.find((s) => s.name?.toLowerCase() === name?.toLowerCase())?.data ||
    [];
  const recursosEstimados =
    series.find((s) => s.name?.toLowerCase() === seriesName?.toLowerCase())
      ?.data || [];

  // Replace nulls in 'recursos' with values from 'recursos estimados'
  for (let i = 0; i < recursos.length; i++) {
    if (recursos[i] === null && recursosEstimados[i] !== undefined) {
      recursos[i] = recursosEstimados[i];
    }
  }

  // Append any remaining 'recursos estimados' values to 'recursos'
  if (recursosEstimados.length > recursos.length) {
    const additionalData = recursosEstimados.slice(recursos.length);
    recursos.push(...additionalData);
  }

  return {
    name: name,
    type: "bar",
    data: recursos,
  };
};

const handleBuildChart = (
  data: ChartData[],
  setEstimatedLengthSeries: React.Dispatch<
    React.SetStateAction<{ resource: number; productivity: number }>
  >,
  dispatch: React.Dispatch<React.SetStateAction<any>>,
  setChartDataProdByResource: React.Dispatch<React.SetStateAction<any>>,
  setChartDataProductivityByHour: React.Dispatch<React.SetStateAction<any>>
) => {
  const totalLabels = Math.max(...data.flatMap((obj) => obj.label));

  const getMergedLabels = (
    regularIndicator: string,
    estimatedIndicator: string
  ): number[] => {
    const regularLabels =
      data.find((obj) => obj.indicator.toLowerCase() === regularIndicator)
        ?.label || [];
    const estimatedLabels =
      data.find((obj) => obj.indicator.toLowerCase() === estimatedIndicator)
        ?.label || [];

    return [...regularLabels, ...estimatedLabels];
  };

  // Adjusts data array by filling with nulls up to the total number of labels
  const adjustDataArray = (
    dataArray: number[],
    totalLabels: number
  ): (number | null)[] => {
    const adjustedArray: (number | null)[] = [...dataArray];
    while (adjustedArray.length < totalLabels) {
      adjustedArray.push(null); // Append nulls without removing existing data
    }
    return adjustedArray;
  };

  const prependNullsToEstimatedData = (
    estimatedData: number[],
    regularDataLength: number
  ): (number | null)[] => {
    const nullArray = Array(regularDataLength).fill(null);
    return [...nullArray, ...estimatedData];
  };

  // Combines regular and estimated data for an indicator
  const getAdjustedEstimatedData = (
    estimatedIndicator: string,
    regularIndicator: string
  ): (number | null)[] => {
    const regularData =
      data.find((obj) => obj.indicator === regularIndicator)?.data || [];
    const estimatedData =
      data.find((obj) => obj.indicator === estimatedIndicator)?.data || [];
    return prependNullsToEstimatedData(estimatedData, regularData.length);
  };

  // Process each indicator
  const series: Series[] = data.map((indicatorData) => {
    let combinedData: (number | null)[];

    if (
      indicatorData.indicator.endsWith("estimada") ||
      indicatorData.indicator.endsWith("estimados") ||
      indicatorData.indicator.endsWith("estimadas")
    ) {
      const indicatorParts = indicatorData.indicator.split(" ");
      indicatorParts.pop();
      const regularIndicator = indicatorParts.join(" ");
      combinedData = getAdjustedEstimatedData(
        indicatorData.indicator,
        regularIndicator
      );
    } else {
      combinedData = adjustDataArray(indicatorData.data, totalLabels);
    }

    return {
      name: indicatorData.indicator.toLowerCase(),
      type: indicatorData.indicator.includes("Recursos") ? "bar" : "line",
      data: combinedData,
    };
  });

  const resourceIndicators = ["produção", "produção estimada"];
  const prodctivityLineIndicators = [
    "média horas diretas",
    "média horas diretas estimados",
  ];
  const prodctivityBarIndicators = ["produtividade", "produtividade estimada"];

  const filteredSeriesResourceChart = filterSeriesByIndicators(
    series,
    resourceIndicators
  );

  const filteredSeriesProductivityLinesChart = filterSeriesByIndicators(
    series,
    prodctivityLineIndicators
  );

  const filteredSeriesProductivityBarsChart = filterSeriesByIndicators(
    series,
    prodctivityBarIndicators
  );

  // Get all the not null values from the resource and productivity serie to remove bg from barchart
  const estimatedProdValues = series.filter((s) =>
    ["produção estimada"].includes(s.name)
  ) as Array<any>;

  const lengthEstimatedProd = estimatedProdValues[0]?.data?.filter(
    (item: any) => {
      return item !== null;
    }
  ).length;

  setEstimatedLengthSeries({
    resource: lengthEstimatedProd || 0,
    productivity: lengthEstimatedProd || 0,
  });

  dispatch({
    type: "SET_LENGTH_SERIES",
    payload: {
      resource: lengthEstimatedProd || 0,
      productivity: lengthEstimatedProd || 0,
    },
  });

  // Special check for second chart
  let mergedProductivitySeries;

  const serieProductivity = filteredSeriesProductivityBarsChart[0]?.data;

  if (serieProductivity?.includes(null)) {
    const productivity = filteredSeriesProductivityBarsChart[0].data;
    const productivityEstimate = filteredSeriesProductivityBarsChart[1].data;

    const productivityWithoutNull = productivity.filter(
      (item) => item !== null
    );

    const productivityEstimateWithoutNull = productivityEstimate.filter(
      (item) => item !== null
    );

    const productivityMerged = productivityWithoutNull.concat(
      productivityEstimateWithoutNull
    );

    mergedProductivitySeries = {
      name: "produtividade",
      type: "bar",
      data: productivityMerged,
    };
  } else {
    mergedProductivitySeries = {
      name: "produtividade",
      type: "bar",
      data: serieProductivity,
    };
  }

  const getLabelsRecursos = getMergedLabels("produção", "produção estimada");

  const mergedRecursosSeries = mergeArrays(
    series,
    "recursos",
    "recursos estimados"
  );

  // Remove all the nulls from [mergedRecursosSeries, ...filteredSeriesResourceChart][0].data
  const mergedRecursosSeriesWithoutNull = mergedRecursosSeries?.data?.filter(
    (item) => item !== null
  );

  mergedRecursosSeries.data = mergedRecursosSeriesWithoutNull;

  const mergedProductivitysSeries = mergeArrays(
    series,
    "média horas diretas",
    "média horas diretas estimados"
  );

  const mergedProductivitysSeriesWithoutNull =
    mergedProductivitysSeries?.data?.filter((item) => item !== null);

  mergedProductivitysSeries.data = mergedProductivitysSeriesWithoutNull;

  // Add to the filteredSeriesProductivityLinesChart.name.média horas diretas estimados the zIndex 100
  const productivityEstimados = filteredSeriesProductivityLinesChart.find(
    (item) => item.name === "média horas diretas estimados"
  );

  if (productivityEstimados) {
    productivityEstimados.zIndex = 100;
  }

  // Have to swap the order of the series in order to show the dotted estimated line on top of the productivity line
  const temp = filteredSeriesProductivityLinesChart[0];
  filteredSeriesProductivityLinesChart[0] =
    filteredSeriesProductivityLinesChart[1];
  filteredSeriesProductivityLinesChart[1] = temp;

  const resourceChart = {
    options: {
      ...stateProductionxResources.options,
      xaxis: {
        type: "category",
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
        categories: getLabelsRecursos,
      },
      tooltip: {
        y: {
          title: {
            formatter: function (
              value: any,
              { series, seriesIndex, dataPointIndex, w }: any
            ) {
              const max = series[0].length || 0;
              const min = max - lengthEstimatedProd;

              if (
                dataPointIndex >= min &&
                dataPointIndex <= max &&
                value === "recursos"
              ) {
                return "recursos estimados";
              }
              return value;
            },
          },
        },
      },
    },
    series: [mergedRecursosSeries, ...filteredSeriesResourceChart],
  };

  const productivityChart = {
    options: {
      ...stateProductivityxHour.options,
      xaxis: {
        type: "category",
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
        categories: getLabelsRecursos,
      },
      tooltip: {
        hideEmptySeries: true,
        z: {
          formatter: function (
            value: any,
            { series, seriesIndex, dataPointIndex, w }: any
          ) {
            const max = series[0].length || 0;
            const min = max - lengthEstimatedProd;

            if (
              dataPointIndex >= min &&
              dataPointIndex <= max &&
              value === "média horas diretas"
            ) {
              return null;
            }
            return value;
          },
          title: "",
        },
        y: {
          title: {
            formatter: function (
              value: any,
              { series, seriesIndex, dataPointIndex, w }: any
            ) {
              const max = series[0].length || 0;
              const min = max - lengthEstimatedProd;

              if (
                dataPointIndex >= min &&
                dataPointIndex <= max &&
                value === "média horas diretas"
              ) {
                return "média horas diretas estimados";
              }
              if (
                dataPointIndex >= min &&
                dataPointIndex <= max &&
                value === "produtividade"
              ) {
                return "produtividade estimada";
              }
              return value;
            },
          },
        },
      },
    },
    series: [mergedProductivitySeries, ...filteredSeriesProductivityLinesChart],
  };

  setChartDataProdByResource(resourceChart);
  setChartDataProductivityByHour(productivityChart);
};

// Function to reorder the JSON data based on the indicator order
const reorderJsonData = (data: any, order: any) => {
  // Create a mapping of indicators to their order index
  const orderMap = new Map(
    order.map((indicator: any, index: any) => [indicator, index])
  );

  if (data?.detail.includes("Não tem dados")) {
    return [];
  }

  // Sort the data based on the order of the indicators
  return data.sort((a: any, b: any) => {
    const orderA = orderMap.get(a.indicator) ?? order.length; // Fallback to a value after the last if not found
    const orderB = orderMap.get(b.indicator) ?? order.length; // Fallback to a value after the last if not found
    return orderA - orderB;
  });
};

export default function Productivity({
  charts,
  date,
  ranking,
  lastUpdate,
}: {
  charts: any;
  date: {
    month: string;
    year: string;
    shift: string;
  };
  ranking: any[];
  lastUpdate: {
    latest_updated_visit: string;
    newest_updated_visit: string;
  };
}) {
  const { dispatch, chartData, lengthSeries } = useAppContext();
  const { data: session, status } = useSession();

  const [chartDataProdByResource, setChartDataProdByResource] = useState<any>({
    options: {},
    series: [],
  });
  const [chartDataProductivityByHour, setChartDataProductivityByHour] =
    useState<any>({
      options: {},
      series: [],
    });

  const [estimatedLengthSeries, setEstimatedLengthSeries] = useState<{
    resource: number;
    productivity: number;
  }>({
    resource: 0,
    productivity: 0,
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [rankingData, setRankingData] = useState<any[]>(ranking);

  const [wssChartFinished, setWSSChartFinished] = useState(false);

  const [dateRangeChart, setDateRangeChart] = useState<any>(lastUpdate);

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const [dateInfo, setDateInfo] = useState({
    year: date?.year,
    month: date?.month,
    shift: date?.shift,
  });

  useEffect(() => {
    dispatch({ type: "SET_CHART_DATA", payload: charts });

    const reorderedData = reorderJsonData(charts, indicatorOrder);

    handleBuildChart(
      reorderedData,
      setEstimatedLengthSeries,
      dispatch,
      setChartDataProdByResource,
      setChartDataProductivityByHour
    );
  }, [charts, indicatorOrder]);

  useEffect(() => {
    setTimeout(() => {
      updateEstimatedBarStyle();
    }, 1000);
  }, [chartDataProdByResource]);

  // const getNewestDateChart = async () => {
  //   await checkNewestDateUploadFiles().then((res) => {
  //     if (res && Object.keys(res).length > 0) {
  //       setDateRangeChart(res);
  //       setDateInfo({
  //         year: res.newest_updated_visit.split("-")[0],
  //         month: res.newest_updated_visit.split("-")[1],
  //         shift: "0",
  //       });

  //       handleGetInfoByData({
  //         year: res.newest_updated_visit.split("-")[0],
  //         month: res.newest_updated_visit.split("-")[1],
  //         shift: "0",
  //       });
  //     } else {
  //       toast.error(
  //         <div>
  //           <h2>
  //             Algo deu errado obtendo ultima data da carga de arquivo, tente
  //             buscar novamente!
  //           </h2>
  //           <p className="text-xs"> {res?.error?.data?.code} </p>
  //         </div>
  //       );
  //     }
  //   });
  // };

  const handleGetInfoByData = async ({
    year,
    month,
    shift,
  }: {
    year: string;
    month: string;
    shift: string;
  }) => {
    setButtonDisabled(true);
    setWSSChartFinished(false);

    // Fetch fetchProductionCharts & fetchProductionVisits passing year, month and shift
    const toastPromiseGraph = toast.promise(
      fetchProductionCharts(month, year, shift),
      {
        pending: "Obtendo dados dos graficos...",
      }
    );

    await toastPromiseGraph
      .then((res: any) => {
        if (res?.detail) {
          if (res?.detail.includes("Não tem dados")) {
            toast.info(
              <div>
                <h2>Não encontramos dados de grafico para essa data</h2>
              </div>
            );
          } else {
            toast.error(
              <div>
                <h2>Algo deu errado obtendo graficos, tente novamente!</h2>
              </div>
            );
          }
        } else {
          dispatch({ type: "SET_CHART_DATA", payload: res });

          const reorderedData = reorderJsonData(res, indicatorOrder);

          handleBuildChart(
            reorderedData,
            setEstimatedLengthSeries,
            dispatch,
            setChartDataProdByResource,
            setChartDataProductivityByHour
          );
        }

        if (res.error) {
        } else {
          // toast.success("Arquivos enviados com sucesso!");
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Algo deu errado obtendo graficos, tente novamente!");
      });

    const toastPromiseRanking = toast.promise(
      fetchRanking(month, year, shift),
      {
        pending: "Obtendo dados dos ranking...",
      }
    );

    await toastPromiseRanking
      .then((res: any) => {
        if (res?.detail) {
          if (res?.detail.includes("No ranking data found")) {
            toast.info(
              <div>
                <h2>Não encontramos dados de ranking para essa data</h2>
              </div>
            );
          } else {
            toast.info(
              <div>
                <h2>Algo deu errado obtendo ranking, tente novamente!</h2>
                <p className="text-xs"> {res?.detail} </p>
              </div>
            );
          }

          setRankingData([]);
          setSelectedKeys(new Set([]));
        } else {
          setRankingData(res);
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Algo deu errado obtendo ranking, tente novamente!");
        setRankingData([]);
        setSelectedKeys(new Set([]));
      })
      .finally(() => {
        setButtonDisabled(false);
      });
  };

  const updateEstimatedBarStyle = () => {
    if (estimatedLengthSeries.resource === 0) return;

    const lineResources = document.querySelector('g[seriesname="recursos"]');
    const lineProductivity = document.querySelector(
      'g[seriesname="produtividade"]'
    );

    if (!lineResources) return;

    // Select all path elements inside the lineProductivity element
    const pathsResource = lineResources.querySelectorAll("path");

    if (pathsResource.length < estimatedLengthSeries.resource) return;

    // Get the last two path elements
    const lastTwoPathsResource = Array.from(pathsResource).slice(
      -estimatedLengthSeries.resource
    );

    // Apply styles to the last two path elements
    lastTwoPathsResource.forEach((path) => {
      path.style.fill = "transparent";
      path.style.stroke = "#6AB187";
      path.style.strokeWidth = "2";
    });

    if (!lineProductivity) return;

    // Select all path elements inside the lineProductivity element
    const pathsProductivity = lineProductivity.querySelectorAll("path");

    if (pathsProductivity.length < estimatedLengthSeries.productivity) return;

    // Get the last two path elements
    const lastTwoPathsProductivity = Array.from(pathsProductivity).slice(
      -estimatedLengthSeries.resource
    );

    // Apply styles to the last two path elements
    lastTwoPathsProductivity.forEach((path) => {
      path.style.fill = "transparent";
      path.style.stroke = "#003369";
      path.style.strokeWidth = "2";
    });
  };

  const handleOpenConfigurationModal = () => {
    dispatch({
      type: "SET_MODAL",
      payload: {
        open: true,
        header: <h2>Configurações</h2>,
        body: (
          <div className="flex flex-col">
            <p className="text-xs">Horas diretas</p>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">de:</p>
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    input: "w-14",
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
                  placeholder="2º"
                  value="0"
                  onChange={(e) => console.log(e.target.value)}
                  min={0}
                />
              </div>
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">até:</p>
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    input: "w-14",
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
                  placeholder="2º"
                  value="0"
                  onChange={(e) => console.log(e.target.value)}
                  min={0}
                />
              </div>
            </div>
            <p className="text-xs mt-3">Visitas</p>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">de:</p>
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    input: "w-14",
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
                  placeholder="2º"
                  value="0"
                  onChange={(e) => console.log(e.target.value)}
                  min={0}
                />
              </div>
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">até:</p>
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    input: "w-14",
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
                  placeholder="2º"
                  value="0"
                  onChange={(e) => console.log(e.target.value)}
                  min={0}
                />
              </div>
            </div>
            <p className="text-xs mt-3">Caixas</p>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">de:</p>
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    input: "w-14",
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
                  placeholder="2º"
                  value="0"
                  onChange={(e) => console.log(e.target.value)}
                  min={0}
                />
              </div>
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">até:</p>
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    input: "w-14",
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
                  placeholder="2º"
                  value="0"
                  onChange={(e) => console.log(e.target.value)}
                  min={0}
                />
              </div>
            </div>
            <button
              className={`px-2 py-1 mt-7 mb-4 rounded-md ${
                buttonDisabled
                  ? "bg-gray-500 text-gray-400 cursor-not-allowed opacity-50"
                  : "bg-blue-900 text-white"
              } text-sm font-medium`}
              onClick={() => console.log("click")}
            >
              Salvar
            </button>
          </div>
        ),
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col h-full w-[20%] gap-6 max-w-[240px]">
          <Card className="p-4 h-fit">
            <CardHeader className="p-0 pb-2 flex-col items-start">
              <Subtitle>Filtros</Subtitle>
            </CardHeader>
            <CardBody className="overflow-visible !p-0 !pt-2 gap-3">
              {/* Create two select with the years 2023, 2024 and a select with the months */}

              <div className="flex justify-between gap-2">
                <select
                  name="year"
                  className="p-1 rounded-md text-sm bg-[#F1F0F9] w-full"
                  onChange={(e) =>
                    setDateInfo({ ...dateInfo, year: e.target.value })
                  }
                  value={dateInfo.year}
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
                <select
                  name="month"
                  className="p-1 rounded-md text-sm bg-[#F1F0F9] w-full"
                  onChange={(e) =>
                    setDateInfo({ ...dateInfo, month: e.target.value })
                  }
                  value={dateInfo.month}
                >
                  <option value="1">Janeiro</option>
                  <option value="2">Fevereiro</option>
                  <option value="3">Março</option>
                  <option value="4">Abril</option>
                  <option value="5">Maio</option>
                  <option value="6">Junho</option>
                  <option value="7">Julho</option>
                  <option value="8">Agosto</option>
                  <option value="9">Setembro</option>
                  <option value="10">Outubro</option>
                  <option value="11">Novembro</option>
                  <option value="12">Dezembro</option>
                </select>
              </div>
              <select
                name="shift"
                id=""
                className="p-1 bg-[#F1F0F9] rounded-md text-sm"
                onChange={(e) =>
                  setDateInfo({ ...dateInfo, shift: e.target.value })
                }
                value={dateInfo.shift}
              >
                <option value="0">Todos</option>
                <option value="1">1° turno</option>
                <option value="2">2° turno</option>
                <option value="3">3° turno</option>
              </select>
              <button
                className="flex gap-1 text-gray-500 items-center mt-2 border-none bg-transparent"
                onClick={handleOpenConfigurationModal}
              >
                <ToolIcon />
                <p className="text-xs">Configurações avançadas</p>
              </button>
              <button
                className={`px-2 py-1 rounded-md ${
                  buttonDisabled
                    ? "bg-gray-500 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-blue-900 text-white"
                } text-sm font-medium mt-2`}
                onClick={() =>
                  handleGetInfoByData({
                    month: dateInfo?.month || "01",
                    year: dateInfo?.year || "2024",
                    shift: dateInfo?.shift || "0",
                  })
                }
              >
                Buscar
              </button>
            </CardBody>
          </Card>
          <DropzoneProductivity
            setDateInfo={setDateInfo}
            setWSSChartFinished={setWSSChartFinished}
            wssChartFinished={wssChartFinished}
            buttonDisabled={buttonDisabled}
            dateRangeChart={dateRangeChart}
          />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <Card className="p-4 h-full flex-col w-full">
            <CardBody className="overflow-visible">
              <div>
                <Subtitle>Produção x Recurso em atividade</Subtitle>
              </div>
              <MixedChart state={chartDataProdByResource} />
              <Divider />
              <div className="mt-3">
                <Subtitle>Produtividade x Horas diretas</Subtitle>
              </div>
              <MixedChart state={chartDataProductivityByHour} />
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="flex flex-row gap-4 mt-4 justify-between">
        <div className="w-1/2">
          <Ranking
            rankingData={rankingData}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
          />
        </div>
        <User
          rankingData={rankingData}
          dateInfo={{
            month: dateInfo.month,
            year: dateInfo.year,
            shift: dateInfo.shift,
          }}
          selectedKeys={selectedKeys}
        />
      </div>
    </div>
  );
}
