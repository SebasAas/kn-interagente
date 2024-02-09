import React, { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Spinner } from "../Spinner";
import { toast } from "react-toastify";

export const WebSocket = ({
  file,
  setWSSChartFinished,
}: {
  file: File | null;
  setWSSChartFinished: (newFiles: boolean) => void;
}) => {
  const [socketUrl, setSocketUrl] = useState(
    `ws://kn-productivity-dev-emachzhqzq-uc.a.run.app/ws/status_csv`
  );
  const [connectionTrigger, setConnectionTrigger] = useState(0); // Used to trigger reconnection

  const { lastMessage, readyState, getWebSocket } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true, // Always attempt to reconnect
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  const [progress, setProgress] = useState(0);

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
        setWSSChartFinished(true);
        getWebSocket()?.close();
      }
    }
  }, [lastMessage, file, getWebSocket]);

  if (lastMessage?.data && file) {
    const parsedData = JSON.parse(JSON.parse(lastMessage?.data));
    const message = parsedData?.data?.text;

    if (message === "Processamento finalizado") {
      const filters = parsedData?.data?.filter;
      setTimeout(() => {
        setWSSChartFinished(true);
      }, 1000);
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
