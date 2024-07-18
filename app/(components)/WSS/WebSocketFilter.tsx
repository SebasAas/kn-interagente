import React, { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Spinner } from "../Spinner";
import { toast } from "react-toastify";

export const WebSocketFilter = ({
  setWSSChartFinished,
  setDateInfo,
  setButtonDisabled,
}: {
  setWSSChartFinished: (newFiles: boolean) => void;
  setDateInfo: (dateInfo: {
    month: string;
    year: string;
    shift: string;
  }) => void;
  setButtonDisabled: (isDisabled: boolean) => void;
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
          setButtonDisabled(false);
        }, 1000);
      }
    }
  }, [lastMessage, getWebSocket]);

  if (lastMessage?.data) {
    const parsedData = JSON.parse(JSON.parse(lastMessage?.data));
    const message = parsedData?.data?.text;
    const status = parsedData?.data?.status;

    if (message === "Processamento finalizado" || status === "finished") {
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

    if (status === "idle") {
      return <></>;
    }

    setButtonDisabled(true);

    if (status === "error") {
      return (
        <div className="mb-3">
          <p className="font-medium text-sm break-words text-red-600">
            {message}
          </p>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-4 mb-3">
        <Spinner value={undefined} size="sm" />
        <p className="font-medium text-sm break-words max-w-[180px]">
          {message}
        </p>
      </div>
    );
  }

  // Show spinner with initial progress or when there's no message
  return <></>;
};
