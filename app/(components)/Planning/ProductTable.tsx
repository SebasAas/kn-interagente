import { ArrowLeftIcon, ArrowRigthIcon } from "@/app/(assets)/ArrowIcon";
import { formatDateToHHMM } from "@/app/(helpers)/dates";
import React, { useState } from "react";

interface ProductData {
  hour: string;
  boxes: number;
  visits: number;
  workers: number;
  criticity: string;
}

interface ProductTableProps {
  simulation: {
    aero: ProductData[];
    foods: ProductData[];
    hpc: ProductData[];
    all: ProductData[];
  };
}

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
    <div className="flex gap-2 mb-2">
      <button onClick={() => handleSwap("back")}>
        <ArrowLeftIcon />
      </button>
      <p className="min-w-[55px] text-center font-medium text-base uppercase">
        {data[index]}
      </p>
      <button onClick={() => handleSwap("next")}>
        <ArrowRigthIcon />
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

const ProductTable: React.FC<ProductTableProps> = ({ simulation }) => {
  const [selectedFamily, setSelectedFamily] = useState<
    "hpc" | "aero" | "foods"
  >("hpc");

  //  renderiza os dados da família selecionada
  const getFamilyData = () => {
    if (!selectedFamily || !simulation[selectedFamily]) return null;

    return simulation[selectedFamily].map((data, index) => (
      <tr
        key={index}
        className={`text-center ${
          isEndOfShift(index)
            ? "border-solid border-0  border-b-1.5 border-black "
            : ""
        }`}
      >
        <td className="py-0.5 text-center flex justify-center">
          <div
            className={`${
              isNoWorkTime(index) ? "w-full" : "min-w-[70px] w-min rounded"
            }  bg-[${data.criticity}] text-white`}
          >
            {data.boxes}
          </div>
        </td>
        <td>
          <div
            className={
              isNoWorkTime(index) ? `bg-[${data.criticity}] text-white` : ""
            }
          >
            {data.visits}
          </div>
        </td>
        <td>
          <div
            className={
              isNoWorkTime(index) ? `bg-[${data.criticity}] text-white` : ""
            }
          >
            {data.workers}
          </div>
        </td>
      </tr>
    ));
  };

  const getTotalData = () => {
    if (!selectedFamily || !simulation["all"]) return null;

    return simulation["all"].map((data, index) => (
      <tr
        key={index}
        className={`text-center ${
          isEndOfShift(index)
            ? "border-solid border-0  border-b-1.5 border-black "
            : ""
        }`}
      >
        <td className="py-0.5 text-center flex justify-center">
          <div
            className={`${
              isNoWorkTime(index)
                ? `w-full bg-[${data.criticity}] text-white`
                : "min-w-[70px] w-min rounded"
            }  `}
          >
            {data.boxes}
          </div>
        </td>
        <td>
          <div
            className={
              isNoWorkTime(index) ? `bg-[${data.criticity}] text-white` : ""
            }
          >
            {data.visits}
          </div>
        </td>
        <td className="py-0.5 text-center flex justify-center">
          <div
            className={`${
              isNoWorkTime(index) ? "w-full" : "min-w-[70px] w-min rounded"
            }  bg-[${data.criticity}] text-white`}
          >
            {data.workers}
          </div>
        </td>
      </tr>
    ));
  };

  const getDatesData = () => {
    if (!selectedFamily || !simulation[selectedFamily]) return null;

    return simulation[selectedFamily].map((data, index) => (
      <tr
        key={index}
        className={`text-center ${
          isEndOfShift(index)
            ? "border-solid border-0  border-b-1.5 border-black "
            : ""
        }`}
      >
        <td className={`py-0.5 text-center flex justify-center`}>
          <div
            className={`px-3 ${
              isNoWorkTime(index) ? `bg-[${data.criticity}] text-white` : ""
            } `}
          >
            {formatDateToHHMM(data.hour)}
          </div>
        </td>
      </tr>
    ));
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
            <th>Hora</th>
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
          <tr>
            <th>Caixas</th>
            <th>Visitas</th>
            <th>Aux</th>
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
          <tr className="text-sm text-gray-400 font-poppins">
            <th>Estimados</th>
            <th>Visitas</th>
            <th>Caixas</th>
          </tr>
        </thead>
        <tbody>{getFamilyData()}</tbody>
      </table>
    );
  };

  return (
    <div>
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
          <p className="text-gray-500 font-medium text-base mb-2">Total</p>
          {totalTable()}
        </div>
        <div className="pt-11">
          <div className="flex flex-col h-1/3 items-center justify-center bg-[#003369] text-white px-3 gap-2 rounded">
            <div className="flex flex-col items-center">
              <p>Turno</p>
              <p className="text-xl font-medium">1</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Caixas</p>
              <p className="text-xl font-medium">19.500</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Pallets</p>
              <p className="text-xl font-medium">1.200</p>
            </div>
          </div>
          <div className="flex flex-col h-[calc(33.3%-5px)] my-[2.5px] items-center justify-center bg-[#003369] text-white px-3 gap-2 rounded">
            <div className="flex flex-col items-center">
              <p>Turno</p>
              <p className="text-xl font-medium">2</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Caixas</p>
              <p className="text-xl font-medium">19.500</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Pallets</p>
              <p className="text-xl font-medium">1.200</p>
            </div>
          </div>
          <div className="flex flex-col h-[calc(33.3%-5px)] my-[2.5px] items-center justify-center bg-[#003369] text-white px-3 gap-2 rounded">
            <div className="flex flex-col items-center">
              <p>Turno</p>
              <p className="text-xl font-medium">3</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Caixas</p>
              <p className="text-xl font-medium">19.500</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Pallets</p>
              <p className="text-xl font-medium">1.200</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
