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

const AlertBoard = ({ alarms }: { alarms: Alarm }) => {
  const [alerts, setAlerts] = useState(alarms || []);

  console.log("simulation?.alarms", alarms);

  return (
    <div className="flex flex-row gap-2 flex-wrap min-w-[120px] h-[calc(100vh-7.5rem)] overflow-y-auto ">
      <Subtitle>Alertas</Subtitle>
      <div className="text-center">
        {Object.values(alerts).length > 0 ? (
          Object.values(alerts)?.map((date) => (
            <>
              <p className="flex justify-center items-center font-medium underline mt-6 mb-2 text-center">
                {formatDateToDDMM(date && date.length > 0 ? date[0]?.day : "")}
              </p>

              {Object.values(alerts)?.map((alert) => {
                return alert.map((a) => {
                  return (
                    <div
                      key={a?.day}
                      className={`min-w-[100px] p-3 my-2  rounded-lg`}
                      style={{ background: `${a?.criticity}` }}
                    >
                      <p className="text-sm text-center text-white">
                        {a?.message}
                      </p>
                    </div>
                  );
                });
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
