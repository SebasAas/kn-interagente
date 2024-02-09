import React, { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Spinner } from "../Spinner";
import { toast } from "react-toastify";

export const WebSocketRanking = ({
  file,
  setWSSRankingFinished,
}: {
  file: File | null;
  setWSSRankingFinished: (status: boolean) => void;
}) => {
  const [socketUrl, setSocketUrl] = useState(
    `ws://kn-workers-dev-emachzhqzq-uc.a.run.app/ws/status_ranking`
  );
  const [connectionTrigger, setConnectionTrigger] = useState(0); // Used to trigger reconnection

  const { lastMessage, readyState, getWebSocket } = useWebSocket(socketUrl);

  const [progress, setProgress] = useState(0);

  // Mapping statuses to progress values
  const statusToProgress: Record<string, number> = {
    idle: 0,
    processing_visits: (1 / 5) * 100,
    processing_workdays: (2 / 5) * 100,
    processing_workloads: (3 / 5) * 100,
    processing_ranking: (4 / 5) * 100,
    finished: 100,
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
          getWebSocket()?.close();
          setWSSRankingFinished(true);
        }, 1000);
      }
    }
  }, [lastMessage, file, getWebSocket]);

  if (lastMessage?.data && file) {
    const parsedData = JSON.parse(JSON.parse(lastMessage?.data));
    const message = parsedData?.data?.text;

    if (message === "Processamento finalizado") {
      setTimeout(() => {
        setWSSRankingFinished(true);
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
