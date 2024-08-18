"use client";
import { useAppContext } from "@/app/(context)/AppContext";
import { useEffect, useState } from "react";
import Subtitle from "../Text/Subtitle";

import mockedSimulation from "@/app/planning/fakeDataSimulation.json";
import { formatDateToDDMM } from "@/app/(helpers)/dates";
import { FamilyPropsResponse } from "@/app/(services)/demand";

interface Alarm {
  [key: string]: {
    day: string;
    message: string;
    criticity: string;
  }[];
}

const AlertBoard = ({ simulation }: { simulation: Alarm }) => {
  const [alerts, setAlerts] = useState(simulation.alarms || []);

  console.log("alerts", alerts);

  return (
    <div className="flex gap-2 flex-wrap min-w-[120px] h-[calc(100vh-7.5rem)] overflow-y-auto flex-col">
      <Subtitle>Alertas</Subtitle>
      <div className="text-center">
        {Object.values(mockedSimulation?.alarms).length > 0 ? (
          Object.values(mockedSimulation?.alarms)?.map((date) => (
            <>
              <p className="flex justify-center items-center font-medium underline mt-6 mb-2 text-center">
                {formatDateToDDMM(date[0].day)}
              </p>
              {!alerts?.length && (
                <p className="text-sm font-medium mt-2">Não há alertas</p>
              )}
              {alerts?.map((alert) => {
                if (!alert)
                  return (
                    <p className="text-sm font-medium mt-2">Não há alertas</p>
                  );

                return (
                  <div
                    key={alert.day}
                    className={`min-w-[100px] p-3 my-2  rounded-lg`}
                    style={{ background: `${alert.criticity}` }}
                  >
                    <p className="text-sm text-center text-white">
                      {alert.message}
                    </p>
                  </div>
                );
              })}
            </>
          ))
        ) : (
          <p className="text-sm font-medium mt-2">Não há alertas</p>
        )}
      </div>
    </div>
  );
};

export default AlertBoard;
