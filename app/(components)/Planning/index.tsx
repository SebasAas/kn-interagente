"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Switch,
} from "@nextui-org/react";
import AlertBoard from "../../(components)/Planning/AlertBoard";
import ProductTable from "../../(components)/Planning/ProductTable";
import Subtitle from "../../(components)/Text/Subtitle";
import { toast } from "react-toastify";
import {
  demandFiles,
  DemandSimulationType,
  FamilyPropsResponse,
  fetchUploadStatus,
  getSimulation,
  SimulationType,
  UploadStatusType,
} from "../../(services)/demand";
import { useAppContext } from "../../(context)/AppContext";
import { useSession } from "next-auth/react";
import { getBaseUrl } from "../../(helpers)/env";
import { redirect } from "next/navigation";
import PlanningDropzone from "../../(components)/Dropzone/PlanningDropzone";

// import simulationData from "./fakeDataSimulation.json";
import {
  formatDateToDDMM,
  formatDateToHHMM,
  handleGetDataFormat,
} from "../../(helpers)/dates";
import useDemandSimulation from "@/app/(hooks)/useDemandSimulation";

const Planning = ({
  simulationFetch,
  uploadStatusFetch,
}: {
  simulationFetch: FamilyPropsResponse;
  uploadStatusFetch: UploadStatusType;
}) => {
  const { data: session, status } = useSession();
  const { dispatch } = useAppContext();
  const [demandFile, setDemandFile] = useState<File | File[] | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [additionalData, setAdditionalData] = useState({
    backlog_priority: false,
    max_storage: 0,
  });

  const [simulation, setSimulation] = useState(
    simulationFetch || {
      simulation: [],
      alarms: {},
      statistics: {},
    }
  );

  const [uploadStatus, setUploadStatus] = useState(
    uploadStatusFetch || {
      upload_status: [{ date: "" }],
      planning_status: { date: "" },
    }
  );

  const { handleSendSimulation, isLoading, error } = useDemandSimulation();

  const [data, setData] = useState({
    aero: {
      shift_1: {
        user: 0,
        synergy: 0,
      },
      shift_2: {
        user: 0,
        synergy: 0,
      },
      shift_3: {
        user: 0,
        synergy: 0,
      },
    },
    hpc: {
      shift_1: {
        user: 0,
        synergy: 0,
      },
      shift_2: {
        user: 0,
        synergy: 0,
      },
      shift_3: {
        user: 0,
        synergy: 0,
      },
    },
    foods: {
      shift_1: {
        user: 0,
        synergy: 0,
      },
      shift_2: {
        user: 0,
        synergy: 0,
      },
      shift_3: {
        user: 0,
        synergy: 0,
      },
    },
  });

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
    let fileToSent = file as File[];

    if (file) {
      const toastPromise = toast.promise(demandFiles(fileToSent), {
        pending: "Enviando arquivo...",
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
    const dataToSend: DemandSimulationType = {
      families: [
        {
          ...data,
        },
      ],
      ...additionalData,
    };

    setButtonDisabled(true);

    toast
      .promise(handleSendSimulation(dataToSend), {
        pending: "Simulando...",
        success: "Simulação realizada com sucesso",
        error: "Erro ao realizar simulação",
      })
      .then(async (res) => {
        if (res?.detail) {
          toast.error(
            <div>
              <h2>Algo deu errado enviando o arquivo, {res.detail}</h2>
            </div>
          );
          return;
        }

        const response = await getSimulation();

        const data = response?.simulation;

        setSimulation({
          simulation: data,
          alarms: response?.alarms,
          statistics: response?.statistics,
        });
      })
      .catch((err) => {
        toast.error(
          `Algo deu errado enviando o arquivo, tente novamente! ${err.detail}`
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
          <button
            className={`px-2 py-1 mt-3 rounded-md ${
              buttonDisabled
                ? "bg-gray-500 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-blue-900 text-white"
            } text-sm font-medium mt-2`}
            onClick={() => (buttonDisabled ? () => {} : handleGetInformation())}
          >
            Enviar
          </button>
          <span className="text-xs mt-3 text-gray-400">
            Ultimo upload:{" "}
            <span className="text-xs text-black">
              {/* {handleGetDataFormat(uploadStatus.upload_status[0].date || "")} */}
              -
            </span>
          </span>
        </Card>
        <Card className="p-4 h-fit ">
          <CardBody className="overflow-visible !p-0 !pt-2">
            <div className="flex justify-between items-center">
              <p className="text-xs">Backlog Primario</p>
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
                aria-label="Backlog Primario"
                classNames={{
                  wrapper: ["group-data-[selected=true]:bg-blue-900"],
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs">Stage (n de caixas)</p>
              <input
                type="text"
                placeholder="0"
                value={additionalData.max_storage}
                onChange={(e) => {
                  if (isNaN(Number(e.target.value))) return;

                  setAdditionalData({
                    ...additionalData,
                    max_storage: Number(e.target.value),
                  });
                }}
                min={0}
                className="w-12 border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
              />
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {Object.keys(data).map((key) => (
                <>
                  <div className="flex gap-3 items-center">
                    <p className="font-medium capitalize">{key}</p>
                    <div
                      className={`p-1 ml-8 w-1/2 text-center text-xs text-gray-400`}
                    >
                      <p>Usuario</p>
                    </div>
                    <div
                      className={`p-1 w-1/2 text-center text-xs text-gray-400`}
                    >
                      <p>Sinergia</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <p className="text-xs whitespace-nowrap">Turno 1</p>
                    <div className="w-1/2">
                      <input
                        type="text"
                        placeholder="0"
                        value={
                          data[key as "aero" | "hpc" | "foods"].shift_1.user
                        }
                        onChange={(e) => {
                          if (isNaN(Number(e.target.value))) return;

                          setData({
                            ...data,
                            [key]: {
                              ...data[key as "aero" | "hpc" | "foods"],
                              shift_1: {
                                ...data[key as "aero" | "hpc" | "foods"]
                                  .shift_1,
                                user: Number(e.target.value),
                              },
                            },
                          });
                        }}
                        className="w-12 ml-7 text-xs border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
                      />
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        placeholder="0"
                        value={
                          data[key as "aero" | "hpc" | "foods"].shift_1.synergy
                        }
                        onChange={(e) => {
                          if (isNaN(Number(e.target.value))) return;

                          setData({
                            ...data,
                            [key]: {
                              ...data[key as "aero" | "hpc" | "foods"],
                              shift_1: {
                                ...data[key as "aero" | "hpc" | "foods"]
                                  .shift_1,
                                synergy: Number(e.target.value),
                              },
                            },
                          });
                        }}
                        className="w-12 ml-2 text-xs border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <p className="text-xs whitespace-nowrap">Turno 2</p>
                    <div className="w-1/2">
                      <input
                        type="text"
                        placeholder="0"
                        value={
                          data[key as "aero" | "hpc" | "foods"].shift_2.user
                        }
                        onChange={(e) => {
                          if (isNaN(Number(e.target.value))) return;
                          setData({
                            ...data,
                            [key]: {
                              ...data[key as "aero" | "hpc" | "foods"],
                              shift_2: {
                                ...data[key as "aero" | "hpc" | "foods"]
                                  .shift_2,
                                user: Number(e.target.value),
                              },
                            },
                          });
                        }}
                        className="w-12 ml-7 text-xs border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
                      />
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        placeholder="0"
                        value={
                          data[key as "aero" | "hpc" | "foods"].shift_2.synergy
                        }
                        onChange={(e) => {
                          if (isNaN(Number(e.target.value))) return;
                          setData({
                            ...data,
                            [key]: {
                              ...data[key as "aero" | "hpc" | "foods"],
                              shift_2: {
                                ...data[key as "aero" | "hpc" | "foods"]
                                  .shift_2,
                                synergy: Number(e.target.value),
                              },
                            },
                          });
                        }}
                        className="w-12 ml-2 text-xs border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <p className="text-xs whitespace-nowrap">Turno 3</p>
                    <div className="w-1/2">
                      <input
                        type="text"
                        placeholder="0"
                        value={
                          data[key as "aero" | "hpc" | "foods"].shift_3.user
                        }
                        onChange={(e) => {
                          if (isNaN(Number(e.target.value))) return;

                          setData({
                            ...data,
                            [key]: {
                              ...data[key as "aero" | "hpc" | "foods"],
                              shift_3: {
                                ...data[key as "aero" | "hpc" | "foods"]
                                  .shift_3,
                                user: Number(e.target.value),
                              },
                            },
                          });
                        }}
                        className="w-12 ml-7 text-xs border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
                      />
                    </div>
                    <div className="w-1/2">
                      <input
                        type="text"
                        placeholder="0"
                        value={
                          data[key as "aero" | "hpc" | "foods"].shift_3.synergy
                        }
                        onChange={(e) => {
                          if (isNaN(Number(e.target.value))) return;

                          setData({
                            ...data,
                            [key]: {
                              ...data[key as "aero" | "hpc" | "foods"],
                              shift_3: {
                                ...data[key as "aero" | "hpc" | "foods"]
                                  .shift_3,
                                synergy: Number(e.target.value),
                              },
                            },
                          });
                        }}
                        min={0}
                        className="w-12 ml-2 text-xs border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
                      />
                    </div>
                  </div>
                </>
              ))}
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
            Simular
          </button>
        </Card>
      </div>

      <Card className="p-4 flex-1 h-[calc(100vh-5.5rem)] overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Subtitle>Separação de Caixas</Subtitle>
            <span className="text-xs mt-2 text-gray-400">
              Range: {getRange(simulation.simulation)}
            </span>
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
            simulation={simulation?.simulation || []}
            statistics={simulation.statistics}
            uploadStatus={uploadStatus}
          />
        </div>
      </Card>

      <Card className="p-4 h-fit w-fit max-w-[300px]">
        <AlertBoard simulation={simulation.alarms} />
      </Card>
    </div>
  );
};

export default Planning;
