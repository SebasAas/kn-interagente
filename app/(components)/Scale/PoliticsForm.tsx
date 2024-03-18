import React, { useState } from "react";
import TooltipIcon from "@/app/(assets)/TooltipIcon";
import { Tooltip } from "react-tooltip";

const PoliticsForm: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button onClick={() => setIsVisible(!isVisible)} className="">&#8744;</button>
      {isVisible && (
        <div className="flex flex-col justify-between">
          <div className="flex flex-row gap-4">
            <div className="flex flex-row mr-12">
              <label htmlFor="stage" className="mb-2 mt-6">
                Stage
              </label>
              <a className="tooltip-stage mt-6">
                <TooltipIcon />
              </a>
              <Tooltip
                anchorSelect=".tooltip-stage"
                content="Defina aqui o limite máximo de estoque de caixas para cada família"
              />
            </div>
            <input
              type="number"
              id="aero"
              className="border border-gray-400 rounded-xl h-3/4 mt-6 text-center "
            />
            <input
              type="number"
              id="hpc"
              className="border border-gray-400 rounded-xl h-3/4 mt-6 text-center"
            />
            <input
              type="number"
              id="foods"
              className="border border-gray-400 rounded-xl h-3/4 mt-6 text-center"
            />
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-row">
              <label htmlFor="user-turno" className="mb-2">
                Usuário/Turno
              </label>
              <a className="tooltip-usuarioturno">
                <TooltipIcon />
              </a>
              <Tooltip
                anchorSelect=".tooltip-usuarioturno"
                content="Defina aqui a quantidade de usuários escalados para cada turno e familia"
              />
            </div>
            <div className="flex gap-4">
              <input
                type="number"
                id="user-turno1"
                className="border border-gray-400 rounded-xl w-3/12 h-3/4 text-center"
              />
              <input
                type="number"
                id="user-turno2"
                className="border border-gray-400 rounded-xl w-3/12 h-3/4 text-center"
              />
              <input
                type="number"
                id="user-turno3"
                className="border border-gray-400 rounded-xl w-3/12 h-3/4 text-center"
              />
            </div>
            <div className="flex gap-4">
              <input
                type="number"
                id="user-turno4"
                className="border border-gray-400 rounded-xl w-3/12 h-3/4 text-center"
              />
              <input
                type="number"
                id="user-turno5"
                className="border border-gray-400 rounded-xl w-3/12 h-3/4 text-center"
              />
              <input
                type="number"
                id="user-turno6"
                className="border border-gray-400 rounded-xl w-3/12 h-3/4 text-center"
              />
            </div>
            <div className="flex gap-4">
              <input
                type="number"
                id="user-turno7"
                className="border border-gray-400 rounded-xl w-3/12 h-3/4 text-center"
              />
              <input
                type="number"
                id="user-turno8"
                className="border border-gray-400 rounded-xl w-3/12 h-3/4 text-center"
              />
              <input
                type="number"
                id="user-turno9"
                className="border border-gray-400 rounded-xl w-3/12 h-3/4 text-center"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PoliticsForm;

