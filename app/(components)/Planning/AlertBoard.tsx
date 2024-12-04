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
  if (!alarms) return null;
  return (
    <div className="flex flex-col gap-2 min-w-[120px] h-[calc(100vh-7.5rem)] overflow-y-auto ">
      <Subtitle>Alertas</Subtitle>
      <div className="text-center">
        {Object.values(alarms)?.length > 0 &&
          Object.values(alarms)?.map((date) => (
            <>
              <p className="flex justify-center items-center font-medium underline mt-6 mb-2 text-center">
                {formatDateToDDMM(date && date?.length > 0 ? date[0]?.day : "")}
              </p>

              <div>
                {date?.map((alert) => {
                  return (
                    <div
                      key={alert?.day}
                      className={`min-w-[100px] p-3 my-2  rounded-lg`}
                      style={{ background: `${alert?.criticity}` }}
                    >
                      <p className="text-sm text-center text-white">
                        {alert?.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default AlertBoard;
