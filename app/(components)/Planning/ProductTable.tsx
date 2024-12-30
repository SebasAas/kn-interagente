import { ArrowLeftIcon, ArrowRightIcon } from "@/app/(assets)/ArrowIcon";
import { useAppContext } from "@/app/(context)/AppContext";
import {
  formatDateToDDMM,
  formatDateToHHMM,
  handleGetDataFormat,
} from "@/app/(helpers)/dates";
import { isBackgroundLight } from "@/app/(helpers)/textColor";
import { FamilyPropsResponse, UploadStatusType } from "@/app/(services)/demand";
import React, { useState } from "react";

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

const isNoWorkTime = (index: number) => {
  if (index === 4 || index === 12 || index === 20) return true;
  return false;
};

const isEndOfShift = (index: number) => {
  if (index === 7 || index === 15 || index === 23) return true;
  return false;
};

const ProductTable: React.FC<
  Partial<FamilyPropsResponse & { uploadStatus: UploadStatusType }>
> = ({ hours, statistics, uploadStatus }) => {
  const [selectedFamily, setSelectedFamily] = useState<
    "hpc" | "aero" | "foods" | "all"
  >("all");

  //  renderiza os dados da família selecionada
  const getFamilyData = () => {
    if (!selectedFamily) return null;

    console.log("Object.values(simulation!)", Object.values(hours!));

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

  const getTotalBox = (shift: number) => {
    // sum the boxes of all families in three shifts
    let total = 0;
    if (!selectedFamily) return null;

    // divide the ammount of elements inside the all families in 3, and depending on the shift, return the correspondent value
    total = Object.values(hours!)?.reduce((acc, data, index) => {
      if (shift === 1 && index < 8) {
        return acc + data["all"][index].boxes;
      } else if (shift === 2 && index > 7 && index < 16) {
        return acc + data["all"][index].boxes;
      } else if (shift === 3 && index > 15) {
        return acc + data["all"][index].boxes;
      }
      return acc;
    }, 0);

    // Return it as xx.xxx
    return total?.toLocaleString("pt-BR");
  };

  return (
    <div className="">
      <div className="flex">
        {/* <div className="">
          <div className="invisible font-medium text-base mb-2">-</div>
          {datesTable()}
        </div>
        <div className="flex flex-col items-center w-full">
          <div className="flex w-full justify-center items-center pb-2 ">
            <p className="font-medium text-base ">Total</p>
          </div>
          {totalTable()}
        </div> */}
        <div className="flex flex-col items-center w-full">
          <Swapper selectFamily={setSelectedFamily} />
          {familyTable()}
        </div>
        {/* <div className="pt-[70px]">
          <div className="flex flex-col h-1/3 items-center justify-center bg-[#003369] text-white px-3 rounded gap-2 py-2">
            <div className="flex flex-col items-center">
              <p>Turno</p>
              <p className="text-xl font-medium">1</p>
            </div>
            {simulation?.[selectedSimulationDate]?.[selectedFamily] ? (
              <div className="flex flex-col items-center">
                <p>Caixas</p>
                <p className="text-xl font-medium">{getTotalBox(1)}</p>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col h-[calc(33.3%-7px)] my-[6px] items-center justify-center bg-[#003369] text-white px-3 rounded gap-2 py-2">
            <div className="flex flex-col items-center">
              <p>Turno</p>
              <p className="text-xl font-medium">2</p>
            </div>
            {simulation?.[selectedSimulationDate]?.[selectedFamily] ? (
              <div className="flex flex-col items-center">
                <p>Caixas</p>
                <p className="text-xl font-medium">{getTotalBox(2)}</p>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col h-[calc(33.3%-7px)] items-center justify-center bg-[#003369] text-white px-3 rounded gap-2 py-2">
            <div className="flex flex-col items-center">
              <p>Turno</p>
              <p className="text-xl font-medium">3</p>
            </div>
            {simulation?.[selectedSimulationDate]?.[selectedFamily] ? (
              <div className="flex flex-col items-center">
                <p>Caixas</p>
                <p className="text-xl font-medium">{getTotalBox(3)}</p>
              </div>
            ) : null}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProductTable;
