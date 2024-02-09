"use client";

import React, { useEffect, useState } from "react";

// Next
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

// Auth
import { useSession } from "next-auth/react";

// Components
import Table from "../(components)/Table";
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import DateFilter from "../(components)/DateFilter/DateFilter";
import UserProfile from "../(components)/Productivity/UserProfile";

// Helpers
import { getBaseUrl } from "../(helpers)/env";
import Subtitle from "../(components)/Text/Subtitle";
import Text from "../(components)/Text/Text";
import Loader from "../(components)/Loader";
import Medal from "../(assets)/MedalIcon";
import UserCard from "../(components)/Productivity/UserCard";
import Dropzone from "../(components)/Dropzone";
import {
  stateProductionxResources,
  stateProductivityxHour,
} from "../(helpers)/mockedData";
import {
  checkNewestDateUploadFiles,
  fetchProductionCharts,
  uploadFiles,
} from "../(services)/productivity";
import { toast } from "react-toastify";
import { fetchRanking } from "../(services)/ranking";
import { WebSocket } from "../(components)/WSS";
import { WebSocketRanking } from "../(components)/WSS/WebSocketRanking";

const MixedChart = dynamic(() => import("../(components)/Chart/MixedChart"), {
  ssr: false,
  loading: () => (
    <Loader className="h-[350px] flex justify-center items-center" />
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
}

// Define the order of the indicators
const indicatorOrder = [
  "Recursos",
  "Produção",
  "Produção estimada",
  "Produção potencial",
  "Produtividade",
  "Target produtividade",
  "Média horas diretas",
  "Target horas diretas",
  "Média horas diretas estimados",
];

// Function to reorder the JSON data based on the indicator order
const reorderJsonData = (data: any, order: any) => {
  // Create a mapping of indicators to their order index
  const orderMap = new Map(
    order.map((indicator: any, index: any) => [indicator, index])
  );

  // Sort the data based on the order of the indicators
  return data.sort((a: any, b: any) => {
    const orderA = orderMap.get(a.indicator) ?? order.length; // Fallback to a value after the last if not found
    const orderB = orderMap.get(b.indicator) ?? order.length; // Fallback to a value after the last if not found
    return orderA - orderB;
  });
};

export default function Productivity() {
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

  const [dateRangeChart, setDateRangeChart] = useState<any>({
    latest_updated_visit: "",
    newest_updated_visit: "",
  });

  const [rankingData, setRankingData] = useState<any[]>([]);

  const [wssChartFinished, setWSSChartFinished] = useState(false);
  const [wssRankingFinished, setWSSRankingFinished] = useState(false);

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const [productivityFile, setProductivityFile] = useState<File | null>(null);
  const [demandFile, setDemandFile] = useState<File | null>(null);
  const [dateInfo, setDateInfo] = useState({
    year: "2024",
    month: "01",
    shift: "0",
  });

  const [dateInfoCallback, setDateInfoCallback] = useState({
    year: "",
    month: "",
    shift: "",
  });

  const getNewestDateChart = async () => {
    await checkNewestDateUploadFiles().then((res) => {
      if (res && Object.keys(res).length > 0) {
        setDateRangeChart(res);
      } else {
        toast.error(
          <div>
            <h2>
              Algo deu errado obtendo ultima data da carga de arquivo, tente
              buscar novamente!
            </h2>
            <p className="text-xs"> {res?.error?.data?.code} </p>
          </div>
        );
      }
    });
  };

  useEffect(() => {
    if (wssChartFinished) {
      onFileSelect(null);

      setDateInfo({
        year: dateInfoCallback.year,
        month: dateInfoCallback.month,
        shift: dateInfoCallback.shift,
      });

      // handleGetInfoByData();
    }
  }, [wssChartFinished]);

  useEffect(() => {
    if (!session && status === "unauthenticated") {
      console.log("session", session, "status", status);
      const url = new URL("/login", getBaseUrl());
      url.searchParams.append("callbackUrl", "/");
      redirect(url.toString());
    }
  }, [session, status]);

  // Handler for file upload
  const handleFileUpload = async (file: File) => {
    if (file) {
      const toastPromise = toast.promise(uploadFiles([file]), {
        pending: "Enviando arquivo...",
      });

      await toastPromise
        .then((response) => response.json())
        .then((res: any) => {
          if (res === null) {
            return;
          }
          toast.error(
            <div>
              <h2>Algo deu errado enviando o arquivo, tente novamente!</h2>
            </div>
          );
          setProductivityFile(null);
        })
        .catch((err) => {
          toast.error("Algo deu errado enviando o arquivo, tente novamente!");
          setProductivityFile(null);
        });
    }
  };

  // Trigger the upload process when the file is selected
  const onFileSelect = (file: File | null) => {
    setProductivityFile(file);
    if (file) {
      handleFileUpload(file);
    }
  };

  useEffect(() => {
    getNewestDateChart();
    handleGetInfoByData();
  }, []);

  const handleGetInfoByData = async () => {
    setButtonDisabled(true);
    setWSSRankingFinished(false);
    setWSSChartFinished(false);
    setDateInfoCallback({
      year: "",
      month: "",
      shift: "",
    });
    // Fetch fetchProductionCharts & fetchProductionVisits passing year, month and shift
    const toastPromiseGraph = toast.promise(
      fetchProductionCharts(dateInfo.month, dateInfo.year, dateInfo.shift),
      {
        pending: "Obtendo dados dos graficos...",
      }
    );

    await toastPromiseGraph
      .then((res: any) => {
        if (res.detail) {
          if (res.detail.includes("Não tem dados")) {
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

          setProductivityFile(null);
        } else {
          const reorderedData = reorderJsonData(res, indicatorOrder);

          handleBuildChart(reorderedData);
        }

        if (res.error) {
        } else {
          // toast.success("Arquivos enviados com sucesso!");
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Algo deu errado obtendo graficos, tente novamente!");
        setProductivityFile(null);
      });

    const toastPromiseRanking = toast.promise(
      fetchRanking(dateInfo.month, dateInfo.year, dateInfo.shift),
      {
        pending: "Obtendo dados dos ranking...",
      }
    );

    await toastPromiseRanking
      .then((res: any) => {
        if (res.detail) {
          if (res.detail.includes("No ranking data found")) {
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
          setProductivityFile(null);
        } else {
          setRankingData(res);
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Algo deu errado obtendo ranking, tente novamente!");
        setProductivityFile(null);
        setRankingData([]);
        setSelectedKeys(new Set([]));
      });
    setButtonDisabled(false);
  };

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

  const handleBuildChart = (data: ChartData[]) => {
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
      "target horas diretas",
      "target produtividade",
    ];
    const prodctivityBarIndicators = [
      "produtividade",
      "produtividade estimada",
    ];

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

    // Special check for second chart
    let mergedProductivitySeries;

    const serieProductivity = filteredSeriesProductivityBarsChart[0].data;

    if (serieProductivity.includes(null)) {
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
      },
      series: [
        mergedProductivitySeries,
        ...filteredSeriesProductivityLinesChart,
      ],
    };

    setChartDataProdByResource(resourceChart);
    setChartDataProductivityByHour(productivityChart);
  };

  useEffect(() => {
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
  }, [chartDataProdByResource]);

  // const handleRefreshData = (year: string, month: string, shift: string) => {
  //   if (year === "" || month === "" || shift === "") {
  //     return;
  //   }

  //   if(wssChartFinished && wssRankingFinished) {

  //   }
  //   handleGetInfoByData();
  // };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <div className="flex flex-1 flex-col gap-6">
          <Card className="p-4 h-full flex-col w-full">
            <CardBody className="overflow-visible">
              <div>
                {/* <Subtitle>Produtividade</Subtitle> */}
                <Subtitle>Produção x Recurso em atividade</Subtitle>
              </div>
              <MixedChart state={chartDataProdByResource} />
              <Divider />
              <div className="mt-3">
                {/* <Subtitle>Produtividade</Subtitle> */}
                <Subtitle>Produtividade x Horas diretas</Subtitle>
              </div>
              <MixedChart state={chartDataProductivityByHour} />
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-col h-full w-[20%] gap-6">
          <Card className="p-4 h-fit">
            <CardHeader className="p-0 pb-2 flex-col items-start">
              <Subtitle>Filtros</Subtitle>
            </CardHeader>
            <CardBody className="overflow-visible !p-0 !pt-2 gap-3">
              {/* Create two select with the years 2023, 2024 and a select with the months */}
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
              <button
                className={`px-2 py-1 rounded-md ${
                  buttonDisabled
                    ? "bg-gray-500 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-blue-900 text-white"
                } text-sm font-medium mt-2`}
                onClick={handleGetInfoByData}
                disabled={buttonDisabled}
              >
                Buscar
              </button>
            </CardBody>
          </Card>
          <Card className="p-4 h-fit ">
            <CardHeader className="p-0 pb-2 flex-col items-start">
              <Subtitle>Base Produtividade</Subtitle>
            </CardHeader>
            <CardBody className="overflow-visible !p-0 !pt-2">
              <Dropzone
                file={productivityFile}
                setFile={onFileSelect}
                dateRangeChart={dateRangeChart}
                setWSSChartFinished={setWSSChartFinished}
                setWSSRankingFinished={setWSSRankingFinished}
                setDateInfo={setDateInfoCallback}
              />
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="flex flex-row gap-4 mt-4 justify-between">
        <div className="w-1/2">
          <Card className="p-4 w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <div className="flex w-full justify-between">
                <div className="w-1/2">
                  <Subtitle>Ranking de usuários</Subtitle>
                </div>
              </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2 gap-6">
              <div className="flex gap-4 mt-5 justify-around">
                <UserCard
                  name={rankingData[0]?.worker_code || ""}
                  position={1}
                  medal="gold"
                  score={rankingData[0]?.score || ""}
                />
                <UserCard
                  name={rankingData[1]?.worker_code || ""}
                  position={2}
                  medal="silver"
                  score={rankingData[1]?.score || ""}
                />
                <UserCard
                  name={rankingData[2]?.worker_code || ""}
                  position={3}
                  medal="bronze"
                  score={rankingData[2]?.score || ""}
                />
              </div>
              <div>
                <Table
                  rankingTable={rankingData}
                  selectedKeys={selectedKeys}
                  setSelectedKeys={setSelectedKeys}
                />
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="flex justify-center w-1/2">
          <Card className="p-4 w-full h-min">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <Subtitle>Informações do Usuário</Subtitle>
            </CardHeader>
            <CardBody>
              <UserProfile
                rankingData={rankingData}
                user={selectedKeys}
                date={{
                  month: dateInfo.month,
                  year: dateInfo.year,
                  shift: dateInfo.shift,
                }}
                selectedKeys={selectedKeys}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
