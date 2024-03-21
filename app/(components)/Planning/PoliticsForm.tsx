import React, { useState } from "react";
import TooltipIcon from "@/app/(assets)/TooltipIcon";
import { Tooltip } from "react-tooltip";
import { Button, Input } from "@nextui-org/react";
import { demandSimulation } from "@/app/(services)/demand";
import useDemandSimulation from "@/app/(hooks)/useDemandSimulation";
import { toast } from "react-toastify";

const PoliticsForm = ({ isVisible }: { isVisible: boolean }) => {
  const { handleSend, isLoading, error } = useDemandSimulation();
  const [politicsData, setPoliticsData] = useState({
    aero: {
      max_storage: "",
      shift_1: "",
      shift_2: "",
      shift_3: "",
    },
    hpc: {
      max_storage: "",
      shift_1: "",
      shift_2: "",
      shift_3: "",
    },
    food: {
      max_storage: "",
      shift_1: "",
      shift_2: "",
      shift_3: "",
    },
  });

  // {
  //   family: "aero";
  //   workers_per_shift: { shift_1: 10; shift_2: 20; shift_3: 30 };
  //   max_storage: 10;
  // },
  // {
  //   family: "hpc";
  //   workers_per_shift: { shift_1: 15; shift_2: 25; shift_3: 35 };
  //   max_storage: 20;
  // },
  // {
  //   family: "foods";
  //   workers_per_shift: { shift_1: 12; shift_2: 22; shift_3: 32 };
  //   max_storage: 30;
  // }

  const handleUpdatePolitics = (
    family: "aero" | "hpc" | "food",
    key: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPoliticsData({
      ...politicsData,
      [family]: {
        ...politicsData[family],
        [key]: e.target.value,
      },
    });
  };

  const transformPoliticsData = (data: typeof politicsData) => {
    const transformedData = [
      {
        families: [
          {
            family: "aero",
            workers_per_shift: {
              shift_1: parseInt(data.aero.shift_1),
              shift_2: parseInt(data.aero.shift_2),
              shift_3: parseInt(data.aero.shift_3),
            },
            max_storage: parseInt(data.aero.max_storage),
          },
          {
            family: "hpc",
            workers_per_shift: {
              shift_1: parseInt(data.hpc.shift_1),
              shift_2: parseInt(data.hpc.shift_2),
              shift_3: parseInt(data.hpc.shift_3),
            },
            max_storage: parseInt(data.hpc.max_storage),
          },
          {
            family: "foods",
            workers_per_shift: {
              shift_1: parseInt(data.food.shift_1),
              shift_2: parseInt(data.food.shift_2),
              shift_3: parseInt(data.food.shift_3),
            },
            max_storage: parseInt(data.food.max_storage),
          },
        ],
      },
    ];

    return transformedData;
  };

  const checkPoliticsIsDry = (data: typeof politicsData) => {
    const isDry = Object.values(data).some((family) => {
      return Object.values(family).some((value) => value === "");
    });

    return isDry;
  };

  const onSubmit = async () => {
    if (checkPoliticsIsDry(politicsData)) {
      return toast.error(
        "Preencha todos os campos das politicas para simular a demanda"
      );
    }

    const politicsDataTransformed: any = transformPoliticsData(politicsData);

    const res = handleSend(politicsDataTransformed);

    console.log(res);
  };

  return (
    <>
      {isVisible && (
        <>
          <div className="flex flex-row justify-between py-2">
            <div className="flex flex-col gap-4">
              <p className="text-semibold text-center invisible">-</p>
              <div className="flex flex-row items-center h-8">
                <label htmlFor="stage" className="text-sm font-medium">
                  Stage
                </label>
                <button className="tooltip-stage ml-1">
                  <TooltipIcon />
                </button>
                <Tooltip
                  anchorSelect=".tooltip-stage"
                  content="Defina aqui o limite máximo de estoque de caixas para cada família"
                  className="z-50"
                />
              </div>
              <div className="flex flex-row items-center h-8">
                <label htmlFor="user-turno" className="text-sm font-medium">
                  Usuário/Turno
                </label>
                <button className="tooltip-usuarioturno">
                  <TooltipIcon />
                </button>
                <Tooltip
                  anchorSelect=".tooltip-usuarioturno"
                  content="Defina aqui a quantidade de usuários escalados para cada turno e familia"
                  className="z-50"
                />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-4 w-fit">
                <p className="font-medium text-center">Aero</p>
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8 min-h-unit-8",
                  }}
                  placeholder="stage"
                  value={politicsData.aero.max_storage.toString()}
                  onChange={(e) =>
                    handleUpdatePolitics("aero", "max_storage", e)
                  }
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      label: "text-[0.8rem]",
                      inputWrapper: "h-2 min-h-unit-8",
                    }}
                    placeholder="turno 1"
                    value={politicsData.aero.shift_1.toString()}
                    onChange={(e) => handleUpdatePolitics("aero", "shift_1", e)}
                  />
                  <Input
                    type="number"
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      label: "text-[0.8rem]",
                      inputWrapper: "h-2 min-h-unit-8",
                    }}
                    placeholder="turno 2"
                    value={politicsData.aero.shift_2.toString()}
                    onChange={(e) => handleUpdatePolitics("aero", "shift_2", e)}
                  />
                  <Input
                    type="number"
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      label: "text-[0.8rem]",
                      inputWrapper: "h-2 min-h-unit-8",
                    }}
                    placeholder="turno 3"
                    value={politicsData.aero.shift_3.toString()}
                    onChange={(e) => handleUpdatePolitics("aero", "shift_3", e)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 w-fit">
                <p className="font-medium text-center">HPC</p>
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
                  placeholder="stage"
                  value={politicsData.hpc.max_storage.toString()}
                  onChange={(e) =>
                    handleUpdatePolitics("hpc", "max_storage", e)
                  }
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      label: "text-[0.8rem]",
                      inputWrapper: "h-2 min-h-unit-8",
                    }}
                    placeholder="turno 1"
                    value={politicsData.hpc.shift_1.toString()}
                    onChange={(e) => handleUpdatePolitics("hpc", "shift_1", e)}
                  />
                  <Input
                    type="number"
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      label: "text-[0.8rem]",
                      inputWrapper: "h-2 min-h-unit-8",
                    }}
                    placeholder="turno 2"
                    value={politicsData.hpc.shift_2.toString()}
                    onChange={(e) => handleUpdatePolitics("hpc", "shift_2", e)}
                  />
                  <Input
                    type="number"
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      label: "text-[0.8rem]",
                      inputWrapper: "h-2 min-h-unit-8",
                    }}
                    placeholder="turno 3"
                    value={politicsData.hpc.shift_3.toString()}
                    onChange={(e) => handleUpdatePolitics("hpc", "shift_3", e)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 w-fit">
                <p className="font-medium text-center">Food</p>
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
                  placeholder="stage"
                  value={politicsData.food.max_storage.toString()}
                  onChange={(e) =>
                    handleUpdatePolitics("food", "max_storage", e)
                  }
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      label: "text-[0.8rem]",
                      inputWrapper: "h-2 min-h-unit-8",
                    }}
                    placeholder="turno 1"
                    value={politicsData.food.shift_1.toString()}
                    onChange={(e) => handleUpdatePolitics("food", "shift_1", e)}
                  />
                  <Input
                    type="number"
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      label: "text-[0.8rem]",
                      inputWrapper: "h-2 min-h-unit-8",
                    }}
                    placeholder="turno 2"
                    value={politicsData.food.shift_2.toString()}
                    onChange={(e) => handleUpdatePolitics("food", "shift_2", e)}
                  />
                  <Input
                    type="number"
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      label: "text-[0.8rem]",
                      inputWrapper: "h-2 min-h-unit-8",
                    }}
                    placeholder="turno 3"
                    value={politicsData.food.shift_3.toString()}
                    onChange={(e) => handleUpdatePolitics("food", "shift_3", e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={onSubmit}
            variant="shadow"
            radius="none"
            className="h-9 text-sm font-medium bg-[#1e3a8a] text-white mt-3"
          >
            Simular
          </Button>
        </>
      )}
    </>
  );
};

export default PoliticsForm;
