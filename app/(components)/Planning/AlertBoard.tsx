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

  return (
    <div className="flex gap-2 flex-wrap min-w-[120px] h-[calc(100vh-7.5rem)] overflow-y-auto flex-col">
      <Subtitle>Alertas</Subtitle>
      <div className="text-center">
        {alerts.length > 0 ? (
          alerts?.map((alert) => {
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
          })
        ) : (
          <p className="text-sm font-medium mt-2">Não há alertas</p>
        )}
      </div>
    </div>
  );
};

export default AlertBoard;
