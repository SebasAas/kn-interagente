import React, { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Spinner } from "../Spinner";
import { toast } from "react-toastify";

export const WebSocketFilter = ({
  setWSSChartFinished,
  setDateInfo,
}: {
  setWSSChartFinished: (newFiles: boolean) => void;
  setDateInfo: (dateInfo: {
    month: string;
    year: string;
    shift: string;
  }) => void;
}) => {
  const [socketUrl, setSocketUrl] = useState(
    `wss://kn-productivity-dev-emachzhqzq-uc.a.run.app/ws/status_filter`
  );
  const { lastMessage, readyState, getWebSocket } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage?.data) {
      const parsedData = JSON.parse(JSON.parse(lastMessage?.data));
      const status = parsedData?.data?.status;

      if (status === "finished") {
        setTimeout(() => {
          toast.success("Arquivo processado com sucesso!");
          getWebSocket()?.close();
          setWSSChartFinished(true);
        }, 1000);
      }
    }
  }, [lastMessage, getWebSocket]);

  if (lastMessage?.data) {
    const parsedData = JSON.parse(JSON.parse(lastMessage?.data));
    const message = parsedData?.data?.text;

    if (message === "Processamento finalizado") {
      const filters = parsedData?.data?.filter;

      setTimeout(() => {
        setDateInfo({
          month: filters?.month,
          year: filters?.year,
          shift: filters?.shift,
        });
        setWSSChartFinished(true);
      }, 1000);
    }
    // Display both message and Spinner with progress
    return (
      <div className="flex items-center gap-4 mb-3">
        <Spinner value={undefined} />
        <p className="font-medium text-sm">{message}</p>
      </div>
    );
  }

  // Show spinner with initial progress or when there's no message
  return <></>;
};
