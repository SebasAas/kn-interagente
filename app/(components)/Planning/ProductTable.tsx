import { ArrowLeftIcon, ArrowRightIcon } from "@/app/(assets)/ArrowIcon";
import { useAppContext } from "@/app/(context)/AppContext";
import { formatDateToHHMM } from "@/app/(helpers)/dates";
import { FamilyPropsResponse } from "@/app/(services)/demand";
import React, { useState } from "react";

const Swapper = ({ selectFamily }: { selectFamily: any }) => {
  const data = ["hpc", "aero", "foods"];
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
    <div className="flex gap-2 mb-[7px] ml-20">
      <button onClick={() => handleSwap("back")}>
        <ArrowLeftIcon />
      </button>
      <p className="min-w-[55px] text-center font-medium text-base uppercase">
        {data[index]}
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

const ProductTable: React.FC<Partial<FamilyPropsResponse>> = ({
  simulation,
}) => {
  const { selectedSimulationDate } = useAppContext();
  const [selectedFamily, setSelectedFamily] = useState<
    "hpc" | "aero" | "foods"
  >("hpc");

  //  renderiza os dados da família selecionada
  const getFamilyData = () => {
    if (
      !selectedFamily ||
      !simulation?.[selectedSimulationDate] ||
      !simulation?.[selectedSimulationDate]?.[selectedFamily]
    )
      return null;

    return simulation?.[selectedSimulationDate]?.[selectedFamily]?.map(
      (data, index) => (
        <tr
          key={index}
          className={`text-center ${
            isEndOfShift(index)
              ? "border-solid border-0 border-b-1.5 border-black"
              : ""
          }`}
        >
          <td className="py-0.5 text-center flex justify-center">
            <div
              className={`${
                isNoWorkTime(index) ? "w-full" : "min-w-[70px] w-min rounded"
              } text-white`}
              style={{ backgroundColor: data.criticity }}
            >
              {data.workers}
            </div>
          </td>
          <td>
            <div
              className={isNoWorkTime(index) ? "text-white" : ""}
              style={
                isNoWorkTime(index) ? { backgroundColor: data.criticity } : {}
              }
            >
              {data.visits}
            </div>
          </td>
          <td>
            <div
              className={isNoWorkTime(index) ? "text-white" : ""}
              style={
                isNoWorkTime(index) ? { backgroundColor: data.criticity } : {}
              }
            >
              {data.boxes}
            </div>
          </td>
        </tr>
      )
    );
  };

  const getTotalData = () => {
    if (!selectedFamily || !simulation?.[selectedSimulationDate]?.all)
      return null;

    return simulation?.[selectedSimulationDate]?.["all"]?.map((data, index) => (
      <tr
        key={index}
        className={`text-center ${
          isEndOfShift(index)
            ? "border-solid border-0 border-b-1.5 border-black"
            : ""
        }`}
      >
        <td className="py-0.5 text-center flex justify-center">
          <div
            className={`${
              isNoWorkTime(index) ? "w-full" : "min-w-[70px] w-min rounded"
            } text-white`}
            style={{ backgroundColor: data.criticity }}
          >
            {data.base_workers}
          </div>
        </td>
        <td className="text-center">
          <div className="w-full flex justify-center">
            <div
              className={`${
                isNoWorkTime(index) ? "w-full" : "min-w-[70px] w-min rounded"
              } text-white`}
              style={{ backgroundColor: data.criticity }}
            >
              {data.workers}
            </div>
          </div>
        </td>
        <td>
          <div
            className={isNoWorkTime(index) ? "text-white" : ""}
            style={
              isNoWorkTime(index) ? { backgroundColor: data.criticity } : {}
            }
          >
            {data.visits}
          </div>
        </td>
        <td className="py-0.5 text-center flex justify-center">
          <div
            className={`${
              isNoWorkTime(index) ? "w-full" : "min-w-[70px] w-min rounded"
            } text-white`}
            style={{ backgroundColor: data.criticity }}
          >
            {data.boxes}
          </div>
        </td>
      </tr>
    ));
  };

  const getDatesData = () => {
    if (
      !selectedFamily ||
      !simulation?.[selectedSimulationDate] ||
      !simulation?.[selectedSimulationDate]?.[selectedFamily]
    )
      return null;

    return simulation?.[selectedSimulationDate]?.[selectedFamily]?.map(
      (data, index) => (
        <tr
          key={index}
          className={`text-center ${
            isEndOfShift(index)
              ? "border-solid border-0 border-b-1.5 border-black"
              : ""
          }`}
        >
          <td className="py-0.5 text-center flex justify-center">
            <div
              className={`px-3 ${isNoWorkTime(index) ? "text-white" : ""}`}
              style={
                isNoWorkTime(index) ? { backgroundColor: data.criticity } : {}
              }
            >
              {formatDateToHHMM(data.hour)}
            </div>
          </td>
        </tr>
      )
    );
  };

  const datesTable = () => {
    return (
      <table
        cellSpacing="0"
        cellPadding="0"
        className="table-auto w-min border-collapse border-spacing-0 rounded"
      >
        <thead>
          <tr>
            <th>
              <p className="text-sm font-medium text-gray-500">Hora</p>
            </th>
          </tr>
        </thead>
        <tbody>{getDatesData()}</tbody>
      </table>
    );
  };

  const totalTable = () => {
    return (
      <table
        cellSpacing="0"
        cellPadding="0"
        className="table-auto w-full border-collapse border-spacing-0 rounded"
      >
        <thead>
          <tr className="text-sm">
            <th>
              <p className="text-sm font-medium text-gray-500">Escalado</p>
            </th>
            <th>
              <p className="text-sm font-medium text-gray-500">Estimado</p>
            </th>
            <th>
              <p className="text-sm font-medium text-gray-500">Visitas</p>
            </th>
            <th>
              <p className="text-sm font-medium text-gray-500">Caixas</p>
            </th>
          </tr>
        </thead>
        <tbody>{getTotalData()}</tbody>
      </table>
    );
  };

  const familyTable = () => {
    return (
      <table
        cellSpacing="0"
        cellPadding="0"
        className="table-auto w-full border-collapse border-spacing-0 rounded-md border-1 border-solid border-gray-300"
      >
        <thead>
          <tr className="text-sm">
            <th>
              <p className="text-sm font-medium">Estimados</p>
            </th>
            <th>
              <p className="text-sm font-medium">Visitas</p>
            </th>
            <th>
              <p className="text-sm font-medium">Caixas</p>
            </th>
          </tr>
        </thead>
        <tbody>{getFamilyData()}</tbody>
      </table>
    );
  };

  const getTotalBox = (shift: number) => {
    // sum the boxes of all families in three shifts
    let total = 0;
    if (!selectedFamily || !simulation?.[selectedSimulationDate]?.all)
      return null;

    // divide the ammount of elements inside the all families in 3, and depending on the shift, return the correspondent value
    total = simulation?.[selectedSimulationDate]?.["all"]?.reduce(
      (acc, data, index) => {
        if (shift === 1 && index < 8) {
          return acc + data.boxes;
        } else if (shift === 2 && index > 7 && index < 16) {
          return acc + data.boxes;
        } else if (shift === 3 && index > 15) {
          return acc + data.boxes;
        }
        return acc;
      },
      0
    );

    // Return it as xx.xxx
    return total?.toLocaleString("pt-BR");
  };

  return (
    <div className="mt-4">
      <div className="flex">
        <div className="">
          <div className="invisible font-medium text-base mb-2">-</div>
          {datesTable()}
        </div>
        <div className="flex flex-col items-center w-full">
          <Swapper selectFamily={setSelectedFamily} />
          {familyTable()}
        </div>
        <div className="flex flex-col items-center w-full">
          <p className="text-gray-500 font-medium text-base mb-2 ml-16">
            Total
          </p>
          {totalTable()}
        </div>
        <div className="pt-11">
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
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
