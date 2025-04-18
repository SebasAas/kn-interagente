"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
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
import DashboardWorkers, { getFormatedNameFamily } from "./DashboardWorkers";
import ModalComponent from "../Modal";
import ConfigIcon from "@/app/(assets)/ConfigIcon";

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

type Picking = {
  hour: string;
  truck_hour: string;
  truck: string;
  visits: string;
  delay: number;
  boxes: number;
  remaining: number;
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
  const [simulationDate, setSimulationDate] = useState<
    | {
        start: Date | undefined;
        end: Date | undefined;
      }
    | undefined
  >({
    start: new Date(),
    end: new Date(),
  });
  const [additionalData, setAdditionalData] = useState({
    visits_per_hour: 0,
  });
  const [dashDT, setDashDT] = useState(dashDTFetch || []);
  const [dashWorkers, setDashWorkers] = useState(dashWorkersFetch || {});
  const [hideCompleted, setHideCompleted] = useState(false);

  const [modalType, setModalType] = useState("");
  const [pickingData, setPickingData] = useState<{
    code: string;
    picking: Picking[];
    date: string;
  }>({
    code: "",
    picking: [],
    date: "",
  });

  const [simulation, setSimulation] = useState(
    simulationFetch || {
        hours: [],
        alarms: {},
        statistics: {},
        trucks: [],
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
      user: [4, 4, 4],
    },
    foods: {
      user: [6, 6, 6],
    },
    hpc: {
      user: [10, 10, 10],
    },
  });

  const [temporalData, setTemporalData] = useState(data);

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

  const handleSimulate = async () => {
    let period = { start: "", end: "" };
    if (simulationDate?.start && simulationDate?.end) {
      const simulationCopyStart = new Date(simulationDate.start.getTime());
      const simulationCopyEnd = new Date(simulationDate.end.getTime());

      // Subtract 3 hours from the copy
      simulationCopyStart.setHours(simulationCopyStart.getHours() - 3);
      simulationCopyEnd.setHours(simulationCopyEnd.getHours() - 3);

      // Convert the modified copy to an ISO string
      period = {
        start: simulationCopyStart.toISOString(),
        end: simulationCopyEnd.toISOString(),
      };
    }

    const dataToSend: DemandSimulationType = {
      families: data,
      ...additionalData,
      period: period || { start: "", end: "" },
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
          trucks: res?.trucks,
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

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "start" | "end"
  ) => {
    if (type === "start") {
      setSimulationDate({
        ...(simulationDate as { start: Date; end: Date }),
        start: e.target.value ? new Date(e.target.value) : undefined,
      });
    }

    if (type === "end") {
      setSimulationDate({
        ...(simulationDate as { start: Date; end: Date }),
        end: e.target.value ? new Date(e.target.value) : undefined,
      });
    }
  };

  const addShift = () => {
    setData((prev) => {
      const updatedData = { ...prev };
      for (const family in updatedData) {
        updatedData[family as "aero" | "hpc" | "foods"].user.push(0); // Add a default value (0) for the new shift
      }
      return updatedData;
    });
  };

  const maxShifts = Math.max(
    ...Object.values(data).map((family) => family.user.length)
  );

  const removeShift = (shiftIndex: number) => {
    setData((prev) => {
      const updatedData = { ...prev };
      for (const family in updatedData) {
        updatedData[family as "aero" | "hpc" | "foods"].user = updatedData[
          family as "aero" | "hpc" | "foods"
        ].user.filter((_, index) => index !== shiftIndex);
      }
      return updatedData;
    });
  };

  const handleSavePickingData = ({
    code,
    pickings,
    date,
  }: {
    code: string;
    pickings: Picking[];
    date: string;
  }) => {
    if (!pickings || pickings.length === 0) return;

    setPickingData({
      code,
      picking: pickings,
      date,
    });
  };

  return (
    <div className="flex flex-row gap-4 w-full h-full">
      <div className="flex flex-col gap-6 w-[240px]">
        <div className="p-4 h-fit flex flex-col px-4 bg-white border border-transparent shadow-medium rounded-md">
          <div className="p-0 pb-2 flex-col items-start">
            <Subtitle>Upload</Subtitle>
          </div>
          <div className="overflow-visible !p-0 !pt-2">
            <PlanningDropzone
              file={demandFile}
              maxFiles={100}
              setFile={onFileSelect}
              dateRangeChart={{
                latest_updated_visit: "",
                newest_updated_visit: "",
              }}
              isDisable={false}
            />
          </div>
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
        </div>
        {/* family as "aero" | "hpc" | "foods" */}
        <div className="p-4 h-auto flex flex-col px-4 bg-white border border-transparent shadow-medium rounded-md">
          <div className="overflow-visible !p-0 !pt-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Data de Simulação</p>
              <input
                type="datetime-local"
                value={
                  simulationDate && simulationDate.start
                    ? formatDateForInput(simulationDate.start)
                    : ""
                }
                onChange={(e) => handleDateChange(e, "start")}
                className="w-full mt-2 border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
              />
              <input
                type="datetime-local"
                value={
                  simulationDate && simulationDate.end
                    ? formatDateForInput(simulationDate.end)
                    : ""
                }
                onChange={(e) => handleDateChange(e, "end")}
                className="w-full mt-2 border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
              />
            </div>
            <div className="flex mt-5 flex-col gap-3">
              <p className="text-sm font-medium">Usuario do turno</p>
              <div className="flex flex-col gap-2">
                <table className="table-auto w-auto border-collapse border border-gray-300 text-center">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 invisible">
                        Turno
                      </th>
                      {Object.keys(data).map((family) => (
                        <th
                          key={`header-${family}`}
                          className="border border-gray-300 text-sm font-normal"
                        >
                          {getFormatedNameFamily(family)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: maxShifts }, (_, shiftIndex) => (
                      <tr key={`shift-${shiftIndex}`}>
                        <td className="border border-gray-300 ">
                          T{shiftIndex + 1}
                        </td>
                        {Object.keys(data).map((family) => (
                          <td
                            key={`${family}-${shiftIndex}`}
                            className="border border-gray-300 "
                          >
                            <input
                              type="number"
                              value={
                                data[family as "aero" | "hpc" | "foods"].user[
                                  shiftIndex
                                ] || 0
                              }
                              onChange={(e) => {
                                const newValue = Number(e.target.value);
                                if (isNaN(newValue)) return;

                                setData((prev) => ({
                                  ...prev,
                                  [family]: {
                                    ...prev[family as "aero" | "hpc" | "foods"],
                                    user: prev[
                                      family as "aero" | "hpc" | "foods"
                                    ].user.map((value, index) =>
                                      index === shiftIndex ? newValue : value
                                    ),
                                  },
                                }));
                              }}
                              className="w-12 border-1 border-solid border-gray-300 rounded-md p-1"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex mt-3 flex-col">
              <p className=" text-sm font-medium">Metas</p>
              <div className="flex mt-3 justify-between items-center">
                <p className="text-xs">Nº de visitas/hora</p>
                <input
                  type="text"
                  placeholder="0"
                  value={additionalData.visits_per_hour}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) return;

                    setAdditionalData({
                      ...additionalData,
                      visits_per_hour: Number(e.target.value),
                    });
                  }}
                  min={0}
                  className="w-16 border-1 border-solid border-gray-300 rounded-md p-1 text-center h-6"
                />
              </div>
            </div>
          </div>
          <button
            className={`px-2 py-1 mt-4 text-[13px] rounded-md ${
              buttonDisabled
                ? "bg-gray-500 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-blue-900 text-white hover:bg-blue-800"
            } text-sm  mt-2`}
            onClick={() => (buttonDisabled ? () => {} : handleSimulate())}
          >
            Reprogramar
          </button>
        </div>
        <Card className="p-4 overflow-y-scroll max-h-[800px] h-full">
          <Subtitle>Produção turno</Subtitle>
          <DashboardWorkers workers={dashWorkers} />
        </Card>
      </div>
      <div className="flex flex-col h-full flex-1 gap-6 max-w-[calc(100%-31rem)]">
        <Card className="pt-4 pb-2 px-4 overflow-x-auto">
          <Subtitle>Caminhões</Subtitle>

          <div className="flex">
            {dashDT &&
              dashDT.length > 0 &&
              dashDT
                ?.filter((item) => !hideCompleted || item.percentual !== 100)
                ?.map((dashDT) => (
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
                    <hr />
                    <div className="flex justify-between">
                      <p>Perfil</p>
                      <p>{dashDT.profile_all}</p>
                    </div>
                  </div>
                ))}
            {dashDT && "detail" in dashDT && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-400">{dashDT.detail as any}</p>
              </div>
            )}
          </div>
          <div className="mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hideCompleted}
                onChange={(e) => setHideCompleted(e.target.checked)}
                className="accent-blue-700"
              />
              Ocultar caminões concluídos
            </label>
          </div>
        </Card>
        <Card className="p-4 flex-1 h-[calc(100vh-5.5rem)] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="flex justify-start">
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
              statistics={simulation?.statistics || {}}
              trucks={simulation?.trucks || []}
              uploadStatus={uploadStatus}
              setModalType={setModalType}
              handleSavePickingData={handleSavePickingData}
              buttonDisabled={buttonDisabled}
              simlulationDate={simulationDate?.start || null}
            />
          </div>
        </Card>
      </div>

      <div className="flex flex-col h-full flex-1 gap-6 max-w-[250px] w-full">
        <Card className="pt-4 pb-2 px-4 overflow-x-auto">
          <AlertBoard alarms={simulation?.alarms} />
        </Card>
      </div>

      <ModalComponent>
        {modalType === "config" && (
          <div className="flex flex-col gap-4">
            <button
              className={`px-2 py-1 mt-5 mb-4 rounded-md ${
                buttonDisabled
                  ? "bg-gray-500 text-gray-400 cursor-not-allowed opacity-50"
                  : "bg-blue-900 text-white"
              } text-sm font-medium`}
              onClick={
                buttonDisabled
                  ? () => {}
                  : () => {
                      setData(temporalData);
                      dispatch({
                        type: "SET_MODAL",
                        payload: { open: false, header: null, body: null },
                      });
                    }
              }
            >
              Salvar
            </button>
          </div>
        )}
        {modalType === "picking" && (
          <div className="pb-6 ">
            <h2 className="text-lg font-bold mb-4">
              Demanda {pickingData.date}
            </h2>
            <table className="table-auto w-full border-collapse border border-gray-300 text-left text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 font-medium">
                    DT
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-medium">
                    Prazo
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-medium">
                    Atraso previsto
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-medium">
                    Visitas
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-medium">
                    Caixas
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-medium">
                    Caixas remanescente
                  </th>
                </tr>
              </thead>
              <tbody>
                {pickingData?.picking?.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {row.truck}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {formatDateToHHMM(row.truck_hour)}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 font-bold ${
                        row.delay <= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {row.delay}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.visits}
                    </td>

                    <td className="border border-gray-300 px-4 py-2">
                      {row.boxes}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.remaining || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ModalComponent>
    </div>
  );
};

export default Planning;
