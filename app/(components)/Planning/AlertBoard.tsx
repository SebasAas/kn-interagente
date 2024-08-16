"use client";
import { useAppContext } from "@/app/(context)/AppContext";
import { useEffect, useState } from "react";
import Subtitle from "../Text/Subtitle";

import mockedSimulation from "@/app/planning/fakeDataSimulation.json";
import { formatDateToDDMM } from "@/app/(helpers)/dates";

interface Alert {
  id: number;
  message: string;
}

const AlertBoard: React.FC = () => {
  const { simulation, selectedSimulationDate } = useAppContext();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetchAlerts()
      .then((data) => setAlerts(data))
      .catch((error) => console.error("Deu erro: ", error));
  }, []);

  const fetchAlerts = async (): Promise<Alert[]> => {
    return new Promise<Alert[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, message: "Alerta 1" },
          { id: 2, message: "Alerta 2" },
          { id: 3, message: "Alerta 3" },
          { id: 4, message: "Alerta 4" },
          { id: 5, message: "Alerta 5" },
          { id: 6, message: "Alerta 6" },
        ]);
      }, 1000);
    });
  };

  return (
    <div className="flex justify-around gap-2 flex-wrap min-w-[100px] h-[calc(100vh-7.5rem)] overflow-y-auto flex-row ">
      <Subtitle>Alertas</Subtitle>
      <div>
        {Object.values(mockedSimulation?.alarms).length > 0 ? (
          Object.values(mockedSimulation?.alarms)?.map((date) => (
            <>
              <p className="flex justify-center items-center font-medium underline mt-6 mb-2">
                {formatDateToDDMM(date[0].day)}
              </p>
              {date?.map((alert) => (
                <div
                  key={alert.day}
                  className={`min-w-[100px] p-3 my-2  rounded-lg`}
                  style={{ background: `${alert.criticity}` }}
                >
                  <p className="text-sm text-center text-white">
                    {alert.message}
                  </p>
                </div>
              ))}
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
