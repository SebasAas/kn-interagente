import { ArrowLeftIcon, ArrowRightIcon } from "@/app/(assets)/ArrowIcon";
import {
  BoxesIcon,
  ClockIcon,
  PieChartIcon,
} from "@/app/(assets)/DashboardWorkersIcon";
import {
  DashWorkersTypes,
  FamilyPropsResponse,
  UploadStatusType,
} from "@/app/(services)/demand";
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

const DashboardWorkers = ({ workers }: { workers: DashWorkersTypes }) => {
  const [selectedFamily, setSelectedFamily] = useState<
    "hpc" | "aero" | "foods" | "all"
  >("all");

  const dashboardWorkersList = () => {
    if (!selectedFamily) return null;

    return (
      <div className="flex flex-col w-full gap-3 relative">
        <div className="sticky -bottom-4 w-full bg-white h-12 py-4 border-t-1 border-gray-700">
          Total de usuarios:{" "}
          {workers?.families[selectedFamily]?.workers_per_shift}
        </div>
        {workers?.families[selectedFamily]?.workers.map((worker, index) => (
          <div
            key={index}
            className="flex flex-col w-full  border p-2 border-gray-400 rounded-md"
          >
            <p>{worker?.worker_code}</p>
            <div className="flex px-4 mt-2 justify-between">
              <div>
                <BoxesIcon className="w-6 h-6" />
                <p>{worker?.boxes}</p>
              </div>
              <div>
                <ClockIcon className="w-6 h-6" />
                <p>{worker?.directed_hours}</p>
              </div>
              <div>
                <PieChartIcon className="w-6 h-6" />
                <p>{worker?.productivity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="">
      <div className="flex">
        <div className="flex flex-col items-center w-full mt-4">
          <Swapper selectFamily={setSelectedFamily} />
          {dashboardWorkersList()}
        </div>
      </div>
    </div>
  );
};

export default DashboardWorkers;
