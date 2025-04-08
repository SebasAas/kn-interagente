import { ArrowLeftIcon, ArrowRightIcon } from "@/app/(assets)/ArrowIcon";
import { useAppContext } from "@/app/(context)/AppContext";
import {
  formatDateToDDMM,
  formatDateToHHMM,
  handleGetDataFormat,
} from "@/app/(helpers)/dates";
import { isBackgroundLight } from "@/app/(helpers)/textColor";
import {
  downloadDemandFile,
  FamilyPropsResponse,
  UploadStatusType,
} from "@/app/(services)/demand";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Picking = {
  hour: string;
  truck_hour: string;
  delay: number;
  boxes: number;
  visits: string;
  truck: string;
  remaining: number;
};

const getFormatedNameFamily = (family: string) => {
  switch (family) {
    case "aero":
      return "Aero";
    case "hpc":
      return "HPC";
    case "foods":
      return "Foods";
    case "all":
      return "Total";
  }
};

const Swapper = ({ selectFamily }: { selectFamily: any }) => {
  const data = ["all", "hpc", "aero", "foods"];
  const [index, setIndex] = useState(0);

  const handleSwap = (direction: string) => {
    if (index === 0 && direction === "back") {
      setIndex(data.length - 1);
      selectFamily(data[data.length - 1]);
    } else if (index === data.length - 1 && direction === "next") {
      setIndex(0);
      selectFamily(data[0]);
    } else if (direction === "back") {
      setIndex(index - 1);
      selectFamily(data[index - 1]);
    } else if (direction === "next") {
      setIndex(index + 1);
      selectFamily(data[index + 1]);
    }
  };

  return (
    <div className="flex gap-2 mb-[7px]">
      <button onClick={() => handleSwap("back")}>
        <ArrowLeftIcon />
      </button>
      <p className="min-w-[55px] text-center font-medium text-base">
        {getFormatedNameFamily(data[index])}
      </p>
      <button onClick={() => handleSwap("next")}>
        <ArrowRightIcon />
      </button>
    </div>
  );
};

const isEndOfShift = (index: number) => {
  if (index === 7 || index === 15 || index === 23) return true;
  return false;
};

const ProductTable: React.FC<
  Partial<
    FamilyPropsResponse & {
      uploadStatus: UploadStatusType;
      setModalType: React.Dispatch<React.SetStateAction<string>>;
      handleSavePickingData: ({
        code,
        pickings,
        date,
      }: {
        code: string;
        pickings: Picking[];
        date: string;
      }) => void;
      buttonDisabled: boolean;
      simlulationDate: Date | null;
    }
  >
> = ({
  hours,
  statistics,
  trucks,
  uploadStatus,
  setModalType,
  handleSavePickingData,
  buttonDisabled,
  simlulationDate,
}) => {
  const { dispatch } = useAppContext();

  const [selectedFamily, setSelectedFamily] = useState<
    "hpc" | "aero" | "foods" | "all"
  >("all");

  //  renderiza os dados da família selecionada
  const getFamilyData = () => {
    if (!selectedFamily) return null;

    return Object.values(hours!)?.map((data, index) => (
      <>
        <tr className="!bg-[#07AC7E] text-center">
          <td colSpan={8} className="text-sm text-white py-1">
            {formatDateToDDMM(data.aero[0]?.hour)}
          </td>
        </tr>
        {data[selectedFamily].map((data, index) => (
          <tr
            key={index}
            className={`text-center ${
              isEndOfShift(index)
                ? "border-solid border-0 border-b-1.5 border-black"
                : ""
            }`}
            onClick={() => {
              trucks && trucks.length > 0 && console.log("datav", data);

              handleSavePickingData &&
                trucks &&
                trucks.length > 0 &&
                handleSavePickingData({
                  code: trucks[index].code,
                  pickings: data.pickings || [],
                  date: handleGetDataFormat(data.hour),
                });
              setModalType && setModalType("picking");
              dispatch({
                type: "SET_MODAL",
                payload: {
                  open: true,
                  header: "",
                  body: "",
                },
              });
            }}
          >
            <td>
              <div
                className={
                  !data.is_working_hour
                    ? isBackgroundLight(data.criticity)
                      ? "text-black"
                      : "text-white"
                    : ""
                }
                style={
                  !data.is_working_hour ? { backgroundColor: "#003369" } : {}
                }
              >
                {formatDateToHHMM(data.hour)}
              </div>
            </td>

            <td>
              <div
                className={!data.is_working_hour ? "text-white" : ""}
                style={
                  !data.is_working_hour ? { backgroundColor: "#003369" } : {}
                }
              >
                {data.demand}
              </div>
            </td>
            <td>
              <div
                className={!data.is_working_hour ? "text-white" : ""}
                style={
                  !data.is_working_hour ? { backgroundColor: "#003369" } : {}
                }
              >
                {data.boxes}
              </div>
            </td>
            <td>
              <div
                className={!data.is_working_hour ? "text-white" : ""}
                style={
                  !data.is_working_hour ? { backgroundColor: "#003369" } : {}
                }
              >
                {data.backlog}
              </div>
            </td>
            <td>
              <div
                className={
                  !data.is_working_hour
                    ? isBackgroundLight(data.criticity)
                      ? "text-black"
                      : "text-white"
                    : ""
                }
                style={
                  !data.is_working_hour ? { backgroundColor: "#003369" } : {}
                }
              >
                {data.visits}
              </div>
            </td>
            <td>
              <div
                className={
                  !data.is_working_hour
                    ? isBackgroundLight(data.criticity)
                      ? "text-black"
                      : "text-white"
                    : ""
                }
                style={
                  !data.is_working_hour ? { backgroundColor: "#003369" } : {}
                }
              >
                {data.pickings?.length || 0}
              </div>
            </td>

            <td className="py-1 text-center flex justify-center">
              <div
                className={`${
                  !data.is_working_hour
                    ? "w-full"
                    : "min-w-[70px] w-min rounded"
                } text-white`}
                style={
                  !data.is_working_hour
                    ? { backgroundColor: "#003369" }
                    : { backgroundColor: data.criticity }
                }
              >
                {data.workers}
              </div>
            </td>
          </tr>
        ))}
      </>
    ));
  };

  const getFormatedDate = (date: Date) => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const handleDownload = () => {
    const toastPromiseGraph = toast.promise(downloadDemandFile(), {
      pending: "Baixando arquivo",
    });

    // The response will be a blob
    toastPromiseGraph.then((response) => {
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        // Set the file name for the download with the current date
        const date = new Date();

        link.setAttribute(
          "download",
          `${
            simlulationDate
              ? getFormatedDate(simlulationDate)
              : getFormatedDate(date)
          }_programacao.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        toast.error("Erro ao baixar o arquivo!");
      }
    });
  };

  const familyTable = () => {
    return (
      <table
        cellSpacing="0"
        cellPadding="0"
        className="table-auto w-full border-separate border-spacing-0 rounded-md border-1 border-solid border-gray-300"
      >
        <thead>
          <tr className="text-sm bg-[#F2F2F2] ">
            <th>
              <p className="text-xs font-medium text-[#4D4D4D] py-3 rounded-t-lg">
                Hora
              </p>
            </th>

            <th>
              <p className="text-xs font-medium text-[#4D4D4D] py-3">
                Demandas
              </p>
            </th>
            <th>
              <p className="text-xs font-medium text-[#4D4D4D] py-3">Caixas</p>
            </th>
            <th>
              <p className="text-xs font-medium text-[#4D4D4D] py-3">Backlog</p>
            </th>
            <th>
              <p className="text-xs font-medium text-[#4D4D4D] py-3">Visitas</p>
            </th>
            <th>
              <p className="text-xs font-medium text-[#4D4D4D] py-3">Carga</p>
            </th>
            <th>
              <p className="text-xs font-medium text-[#4D4D4D] py-3 rounded-t-lg">
                Estimados
              </p>
            </th>
          </tr>
        </thead>
        <tbody className="relative">
          {getFamilyData()}
          <tr className={`w-full sticky -bottom-4 h-8 !bg-white `}>
            <td
              colSpan={8}
              className="border-solid border-b-0 border-x-0  border-t-2 !border-t-[#003369] rounded-t-lg"
            >
              <div className="mt-1 px-5">
                <button
                  className={`px-3 py-2 mt-4 text-[13px] items-center flex gap-2 rounded-md ${
                    buttonDisabled
                      ? "bg-gray-500 text-gray-400 cursor-not-allowed opacity-50"
                      : "bg-blue-900 text-white hover:bg-blue-800"
                  } text-sm  mt-2`}
                  onClick={() => (buttonDisabled ? () => {} : handleDownload())}
                >
                  <p>Download Programação</p>
                  <svg
                    width="12"
                    height="14"
                    viewBox="0 0 12 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.99992 7V11M5.99992 11L7.99992 9.66667M5.99992 11L3.99992 9.66667M6.66659 1.00058C6.60292 1 6.53144 1 6.44973 1H3.46672C2.71998 1 2.34633 1 2.06112 1.14532C1.81023 1.27316 1.60641 1.47698 1.47858 1.72786C1.33325 2.01308 1.33325 2.38673 1.33325 3.13346V10.8668C1.33325 11.6135 1.33325 11.9867 1.47858 12.2719C1.60641 12.5228 1.81023 12.727 2.06112 12.8548C2.34605 13 2.71925 13 3.46453 13H8.53531C9.28059 13 9.65325 13 9.93818 12.8548C10.1891 12.727 10.3936 12.5228 10.5214 12.2719C10.6666 11.987 10.6666 11.6143 10.6666 10.8691V5.21712C10.6666 5.13531 10.6666 5.06374 10.666 5M6.66659 1.00058C6.85701 1.00231 6.97748 1.00923 7.09248 1.03684C7.22853 1.0695 7.35849 1.12351 7.47778 1.19661C7.6123 1.27904 7.7278 1.39455 7.95825 1.625L10.0419 3.70866C10.2725 3.93926 10.3872 4.05424 10.4696 4.1888C10.5427 4.30809 10.5968 4.43817 10.6295 4.57422C10.6571 4.68917 10.6641 4.80967 10.666 5M6.66659 1.00058V2.86667C6.66659 3.6134 6.66659 3.98651 6.81191 4.27173C6.93974 4.52261 7.14357 4.72699 7.39445 4.85482C7.67939 5 8.05258 5 8.79786 5H10.666M10.666 5H10.6667"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-1 px-5">
                <span className="text-xs mt-3 text-gray-400">
                  Produtividade atualizada:{" "}
                  <span className="text-xs text-black">
                    {handleGetDataFormat(uploadStatus?.production_status || "")}
                  </span>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="">
      <div className="flex">
        <div className="flex flex-col items-center w-full">
          <Swapper selectFamily={setSelectedFamily} />
          {familyTable()}
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
