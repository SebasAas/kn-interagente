import React, { useState } from "react";
import TooltipIcon from "@/app/(assets)/TooltipIcon";
import { Tooltip } from "react-tooltip";
import { Input } from "@nextui-org/react";

const PoliticsForm = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <>
      {isVisible && (
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
                />
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
                />
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
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
                />
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
                />
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
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
                />
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
                />
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    label: "text-[0.8rem]",
                    inputWrapper: "h-2 min-h-unit-8",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PoliticsForm;
