"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Progress,
  Switch,
} from "@nextui-org/react";
import AlertBoard from "../../(components)/Planning/AlertBoard";
import ProductTable from "../../(components)/Planning/ProductTable";
import Subtitle from "../../(components)/Text/Subtitle";
import { toast } from "react-toastify";
import {
  DashDTTypes,
  DashWorkersTypes,
  demandFiles,
  DemandSimulationType,
  FamilyPropsResponse,
  fetchUploadStatus,
  SimulationType,
  UploadStatusType,
} from "../../(services)/demand";
import { useAppContext } from "../../(context)/AppContext";
import { useSession } from "next-auth/react";
import { getBaseUrl } from "../../(helpers)/env";
import { redirect } from "next/navigation";
import PlanningDropzone from "../../(components)/Dropzone/PlanningDropzone";

import {
  formatDateToDDMM,
  formatDateToHHMM,
  handleGetDataFormat,
} from "../../(helpers)/dates";
import useDemandSimulation from "@/app/(hooks)/useDemandSimulation";
import {
  generateDates,
  getDashDT,
  getDashWorkers,
} from "@/app/(helpers)/generateDates";
import DashboardWorkers from "./DashboardWorkers";

const transformDate = (isoString: string) => {
  const date = new Date(isoString);

  // Array of month names in Portuguese (abbreviated)
  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  // Get day, month (in letters), hours, and minutes
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()]; // Get month in Portuguese
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${hours}:${minutes}`;
};

const Planning = ({
  simulationFetch,
  uploadStatusFetch,
  dashDTFetch,
  dashWorkersFetch,
}: {
  simulationFetch: FamilyPropsResponse;
  uploadStatusFetch: UploadStatusType;
  dashDTFetch: DashDTTypes[];
  dashWorkersFetch: DashWorkersTypes;
}) => {
  const { data: session, status } = useSession();
  const { dispatch } = useAppContext();
  const [demandFile, setDemandFile] = useState<File | File[] | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [simulationDate, setSimulationDate] = useState<Date | undefined>(
    new Date()
  );
  const [additionalData, setAdditionalData] = useState({
    flow: 0,
  });
  const [dashDT, setDashDT] = useState(dashDTFetch || []);
  const [dashWorkers, setDashWorkers] = useState(dashWorkersFetch || {});

  const [simulation, setSimulation] = useState(
    simulationFetch || {
        hours: [],
        alarms: {},
        statistics: {},
      } || {
        detail: "",
        error: "",
      }
  );

  const [uploadStatus, setUploadStatus] = useState(
    uploadStatusFetch || {
      upload_status: [{ date: "" }],
      planning_status: "",
      production_status: "",
    }
  );

  const { handleSendSimulation, isLoading, error } = useDemandSimulation();

  const [data, setData] = useState({
    aero: {
      user: 0,
    },
    hpc: {
      user: 0,
    },
    foods: {
      user: 0,
    },
  });

  useEffect(() => {
    // @ts-ignore
    if (simulation.detail as unknown as any) {
      toast.error(
        // @ts-ignore
        `${simulation.detail} ${simulation.error}`
      );
    }
  }, []);

  useEffect(() => {
    if (!session && status === "unauthenticated") {
      console.log("session", session, "status", status);
      const url = new URL("/login", getBaseUrl());
      url.searchParams.append("callbackUrl", "/");
      redirect(url.toString());
    }
  }, [session, status]);

  // Handler for file upload
  const handleFileUpload = async (file: File[] | File) => {
    console.log("filefile", file);
    let fileToSent = file as File[];

    if (file) {
      const toastPromise = toast.promise(demandFiles(fileToSent), {
        pending: "Enviando arquivo...",
        success: "Arquivos enviados com sucesso",
      });

      await toastPromise
        .then((response) => response.json())
        .then(async (res: any) => {
          if (res?.detail) {
            toast.error(
              <div>
                <h2>Algo deu errado enviando o arquivo, {res.detail}</h2>
              </div>
            );
            setDemandFile(null);
            return;
          }

          if (res === null) {
            dispatch({
              type: "SET_UPLOAD_STATUS",
              payload: await fetchUploadStatus(),
            });
            return;
          }

          toast.error(
            <div>
              <h2>Algo deu errado enviando o arquivo, {res.detail}</h2>
            </div>
          );
          setDemandFile(null);
          // uploadStatus();
        })
        .catch((err) => {
          toast.error(
            `Algo deu errado enviando o arquivo, tente novamente! ${err.detail}`
          );
          setDemandFile(null);
        });
    }
  };

  // Trigger the upload process when the file is selected
  const onFileSelect = (file: File[] | File | null) => {
    setDemandFile(file);
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleGetInformation = async () => {
    console.log("handleGetInformation");
  };

  const handleSimulate = async () => {
    let formatedData = "";
    if (simulationDate) {
      const simulationCopy = new Date(simulationDate.getTime());

      // Subtract 3 hours from the copy
      simulationCopy.setHours(simulationCopy.getHours() - 3);

      // Convert the modified copy to an ISO string
      formatedData = simulationCopy.toISOString();
    }

    const dataToSend: DemandSimulationType = {
      families: data,
      ...additionalData,
      simulation_date: formatedData || "",
    };

    setButtonDisabled(true);

    toast
      .promise(handleSendSimulation(dataToSend), {
        pending: "Simulando...",
      })
      .then(async (res) => {
        if (res && "detail" in res) {
          toast.error(
            <div>
              <h2>Algo deu errado simulando, tente novamente!</h2>
            </div>
          );
          return;
        }

        setSimulation({
          hours: res.hours,
          alarms: res?.alarms,
          statistics: res?.statistics,
        });

        const uploadDates = await generateDates();

        setUploadStatus(uploadDates);

        const dashDT = await getDashDT();
        const dashWorkers = await getDashWorkers();

        setDashDT(dashDT || []);
        setDashWorkers(dashWorkers || {});
      })
      .catch((err) => {
        toast.error(
          `Algo deu errado simulando, tente novamente! ${err.detail}`
        );
      })
      .finally(() => {
        setButtonDisabled(false);
      });
  };

  const getRange = (data: SimulationType) => {
    // Get first data of the first element and the last that will be the range in simulationData?.simulation

    if (!data || Object.keys(data).length === 0) return "-";

    const first = data[Object?.keys(data)[0]];
    const last = data[Object?.keys(data)[Object?.keys(data).length - 1]];

    const firstDateDDMM = formatDateToDDMM(first?.all[0]?.hour);
    const lastDateDDMM = formatDateToDDMM(
      last?.all[last?.all?.length - 1]?.hour
    );

    const firstDateHHMM = formatDateToHHMM(first?.all[0]?.hour);
    const lastDateHHMM = formatDateToHHMM(
      last?.all[last?.all?.length - 1]?.hour
    );

    return `${firstDateDDMM} as ${firstDateHHMM} até ${lastDateDDMM} as ${lastDateHHMM}`;
  };

  const formatDateForInput = (date: Date) => {
    if (!date) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSimulationDate(e.target.value ? new Date(e.target.value) : undefined);
  };

  return (
    <div className="flex flex-row gap-4 w-full h-full">
      <div className="flex flex-col gap-6 w-[240px]">
        <Card className="p-4 h-fit ">
          <CardHeader className="p-0 pb-2 flex-col items-start">
            <Subtitle>Upload</Subtitle>
          </CardHeader>
          <CardBody className="overflow-visible !p-0 !pt-2">
            <PlanningDropzone
              file={demandFile}
              maxFiles={2}
              setFile={onFileSelect}
              dateRangeChart={{
                latest_updated_visit: "",
                newest_updated_visit: "",
              }}
              isDisable={false}
            />
          </CardBody>
          {/* <button
            className={`px-2 py-1 mt-3 rounded-md ${
              buttonDisabled
                ? "bg-gray-500 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-blue-900 text-white"
            } text-sm font-medium mt-2`}
            onClick={() => (buttonDisabled ? () => {} : handleGetInformation())}
          >
            Enviar
          </button> */}
          <span className="text-xs mt-3 text-gray-400">
            Ultimo upload:{" "}
            <span className="text-xs text-black">
              {uploadStatus &&
              uploadStatus.upload_status &&
              uploadStatus.upload_status.length > 0
                ? handleGetDataFormat("")
                : "-"}
            </span>
          </span>
        </Card>
        <Card className="p-4 h-fit ">
          <CardBody className="overflow-visible !p-0 !pt-2">
            {/* <div className="flex justify-between items-center">
              <p className="text-xs">Backlog Prioritario</p>
              <Switch
                isSelected={additionalData.backlog_priority}
                onValueChange={(value) =>
                  setAdditionalData({
                    ...additionalData,
                    backlog_priority: value,
                  })
                }
                size="sm"
                defaultSelected
                aria-label="Backlog Prioritario"
                classNames={{
                  wrapper: ["group-data-[selected=true]:bg-blue-900"],
                }}
              />
            </div> */}

            <div className="flex flex-col justify-between items-start mt-3">
              <p className="text-xs">Data de Simulação</p>
              <input
                type="datetime-local"
                value={simulationDate ? formatDateForInput(simulationDate) : ""}
                onChange={handleDateChange}
                className="w-full mt-2 border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
              />
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-[#4D4D4D] text-sm font-medium">
                Usuario do turno
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p>HPC</p>
                  <input
                    type="text"
                    placeholder="0"
                    value={data.hpc.user}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.value))) return;
                      setData({
                        ...data,
                        hpc: { user: Number(e.target.value) },
                      });
                    }}
                    className="w-12 ml-7 text-xs border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p>Foods</p>
                  <input
                    type="text"
                    placeholder="0"
                    value={data.foods.user}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.value))) return;
                      setData({
                        ...data,
                        foods: { user: Number(e.target.value) },
                      });
                    }}
                    className="w-12 ml-7 text-xs border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p>Aero</p>
                  <input
                    type="text"
                    placeholder="0"
                    value={data.aero.user}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.value))) return;
                      setData({
                        ...data,
                        aero: { user: Number(e.target.value) },
                      });
                    }}
                    className="w-12 ml-7 text-xs border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
                  />
                </div>
              </div>
            </div>
            <div className="flex mt-5 flex-col">
              <p className="text-[#4D4D4D] text-sm font-medium">
                Limite de stage
              </p>
              <div className="flex mt-3 justify-between items-center">
                <p className="text-xs">Nº de caixas</p>
                <input
                  type="text"
                  placeholder="0"
                  value={additionalData.flow}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) return;

                    setAdditionalData({
                      ...additionalData,
                      flow: Number(e.target.value),
                    });
                  }}
                  min={0}
                  className="w-20 border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
                />
              </div>
            </div>
          </CardBody>
          <button
            className={`px-2 py-1 mt-4 rounded-md ${
              buttonDisabled
                ? "bg-gray-500 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-blue-900 text-white"
            } text-sm font-medium mt-2`}
            onClick={() => (buttonDisabled ? () => {} : handleSimulate())}
          >
            Reprogramar
          </button>
        </Card>
        <Card className="p-4 overflow-y-scroll max-h-[800px] h-full">
          <Subtitle>Produção turno</Subtitle>
          <DashboardWorkers workers={dashWorkers} />
        </Card>
      </div>
      <div className="flex flex-col h-full flex-1 gap-6 max-w-[calc(100%-19rem)]">
        <Card className="p-4 overflow-x-auto">
          <Subtitle>Caminhões</Subtitle>
          <div className="flex">
            {dashDT?.map((dashDT) => (
              <div
                key={dashDT.dt}
                className="flex flex-col gap-2 mr-4 border border-neutral-900 rounded-md p-3"
              >
                <div className="bg-gray-100 text-blue-700 font-medium p-0.5 text-center">
                  {dashDT.dt}
                </div>
                <div className="flex justify-center items-center gap-2">
                  <Progress
                    value={dashDT.percentual}
                    size="md"
                    color="primary"
                  />
                  {dashDT.percentual}%
                </div>
                <p className="text-xs whitespace-nowrap">
                  {transformDate(dashDT.estimated_end_complexity)}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4 flex-1 h-[calc(100vh-5.5rem)] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <Subtitle>Separação de Caixas</Subtitle>
                <span className="text-xs mt-2 text-gray-400">
                  Range: {getRange(simulation?.hours || [])}
                </span>
              </div>
            </div>

            {/* <div className="flex flex-col">
            <div className="flex flex-row gap-1 ">
              <p>Políticas</p>
              <a className="tooltip-politicas">
                <TooltipIcon />
              </a>
              <button
                onClick={() => setIsVisible(!isVisible)}
                className={isVisible ? "rotate-180" : ""}
              >
                <ArrowDownIcon />
              </button>

              <Tooltip
                anchorSelect=".tooltip-politicas"
                content="Defina aqui as regras de negócio por família e gere novas simulações"
              />
            </div>
            <PoliticsForm isVisible={isVisible} />
          </div> */}
            {/* <div className="flex relative w-full"> */}
            <ProductTable
              hours={simulation?.hours || []}
              statistics={simulation.statistics}
              uploadStatus={uploadStatus}
            />
          </div>
        </Card>
      </div>

      <Card className="p-4 h-fit w-fit max-w-[300px]">
        <AlertBoard alarms={simulation?.alarms} />
      </Card>
    </div>
  );
};

export default Planning;
