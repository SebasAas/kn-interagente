"use client";
import { useEffect, useState } from "react";

interface Alert {
  id: number;
  message: string;
}

const AlertBoard: React.FC = () => {
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
    <div className="flex justify-around gap-2 flex-wrap ">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="min-w-[100px] p-3 my-2 bg-[#ac3e31] rounded-lg"
        >
          <p className="text-sm text-center text-white">{alert.message}</p>
        </div>
      ))}
    </div>
  );
};

export default AlertBoard;
