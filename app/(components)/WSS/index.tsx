import React, { useState, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Spinner } from "../Spinner";
import { toast } from "react-toastify";

export const WebSocket = ({
  file,
  setWSSChartFinished,
  setDateInfo,
  handleGetInfoByData,
}: {
  file: File | null;
  setWSSChartFinished: (newFiles: boolean) => void;
  setDateInfo: (dateInfo: {
    month: string;
    year: string;
    shift: string;
  }) => void;
  handleGetInfoByData?: ({
    year,
    month,
    shift,
  }: {
    year: string;
    month: string;
    shift: string;
  }) => void;
}) => {
  const [socketUrl, setSocketUrl] = useState(
    `wss://kn-productivity-dev-emachzhqzq-uc.a.run.app/ws/status_csv`
  );
  const [connectionTrigger, setConnectionTrigger] = useState(0); // Used to trigger reconnection

  const { lastMessage, readyState, getWebSocket } = useWebSocket(socketUrl);

  const [progress, setProgress] = useState(0);
  const hasExecuted = useRef(false);

  // Mapping statuses to progress values
  const statusToProgress: Record<string, number> = {
    idle: 0,
    processing_visits: (1 / 5) * 100,
    processing_products: (2 / 5) * 100,
    processing_production: (3 / 5) * 100,
    processing_charts: (4 / 5) * 100,
    finished: 100, // Assuming 'finished' means complete
  };

  // Re-establish connection on new file upload
  useEffect(() => {
    setConnectionTrigger((prev) => prev + 1); // Increment to trigger reconnection
  }, [file]);

  useEffect(() => {
    if (lastMessage?.data && file) {
      const parsedData = JSON.parse(JSON.parse(lastMessage?.data));
      const status = parsedData?.data?.status;

      // Set progress based on the status received
      const newProgress = statusToProgress[status] || 0; // Fallback to 0 if status is unrecognized
      setProgress(newProgress);

      if (status === "finished") {
        setTimeout(() => {
          toast.success("Arquivo processado com sucesso!");
          getWebSocket()?.close();
          setWSSChartFinished(true);
        }, 1000);
      }
    }
  }, [lastMessage, file, getWebSocket, setWSSChartFinished]);

  useEffect(() => {
    hasExecuted.current = false; // Reset hasExecuted when the component mounts
    return () => {
      hasExecuted.current = false; // Ensure it resets on unmount
    };
  }, [file]);

  if (lastMessage?.data && file) {
    const parsedData = JSON.parse(JSON.parse(lastMessage?.data));
    const message = parsedData?.data?.text;

    if (message === "Processamento finalizado" && !hasExecuted.current) {
      const filters = parsedData?.data?.filter;

      // Only execute once no matter how many re-renders this component has
      setDateInfo({
        month: filters?.month,
        year: filters?.year,
        shift: filters?.shift || "0",
      });

      handleGetInfoByData &&
        handleGetInfoByData({
          month: filters?.month,
          year: filters?.year,
          shift: "0",
        });
      setWSSChartFinished(true);
      hasExecuted.current = true;
    }
    // Display both message and Spinner with progress
    return (
      <div className="flex items-center gap-4 mt-3">
        <Spinner value={progress} />
        <p className="font-medium text-sm">{message}</p>
      </div>
    );
  }

  // Show spinner with initial progress or when there's no message
  return <></>;
};
