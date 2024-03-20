"use client";

import { Divider } from "@nextui-org/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { WebSocket } from "../WSS";
import { WebSocketRanking } from "../WSS/WebSocketRanking";

export default function Dropzone({
  file,
  setFile,
  dateRangeChart,
  setWSSChartFinished,
  setDateInfo,
  isDisable = false,
  hasWSS = true,
}: {
  file: File | null;
  setFile: (newFiles: File | null) => void;
  dateRangeChart: {
    latest_updated_visit: string;
    newest_updated_visit: string;
  };
  setWSSChartFinished: (newFiles: boolean) => void;
  setDateInfo: any;
  isDisable?: boolean;
  hasWSS?: boolean;
}) {
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      if (!isDisable) {
        return setFile(acceptedFiles[0]);
      }

      if (
        acceptedFiles.length > 0 &&
        dateRangeChart.newest_updated_visit !== ""
      ) {
        Papa.parse(acceptedFiles[0], {
          header: false,
          preview: 10,
          complete: function (results, file) {
            if (results?.data?.length > 0) {
              const firstDateInFile = results.data[1] as string[];
              if (firstDateInFile && firstDateInFile.length > 0) {
                // Check if position 8 exisit in firstDateInFile
                if (firstDateInFile.length < 9) {
                  toast.error("Erro ao ler data do arquivo");
                  return;
                }
                const bipPositionOrigin = firstDateInFile[8];
                // keepe only the 10 first characters from bipPositionOrigin
                const bipPositionOriginSplit = bipPositionOrigin.substring(
                  0,
                  10
                );
                // bigPositionOriginSplit is in the format DD/MM/YYYY, convert to MM/DD/YYYY
                const bipPositionOriginSplitSplit =
                  bipPositionOriginSplit.split("/");
                const bipPositionOriginSplitSplitFormatted = `${bipPositionOriginSplitSplit[1]}/${bipPositionOriginSplitSplit[0]}/${bipPositionOriginSplitSplit[2]}`;
                // Transform firstDateInFile and newest_updated_visit to Date and check if firstDateInFile is 2 or more days in front of newest_updated_visit
                const bipPositionOriginDate = new Date(
                  bipPositionOriginSplitSplitFormatted
                );
                const newestUpdatedVisitDate = new Date(
                  dateRangeChart.newest_updated_visit
                );
                // +1 day to newest_updated_visitDate
                const nextDayNewestUpdatedVisitDate = new Date(
                  newestUpdatedVisitDate
                );
                nextDayNewestUpdatedVisitDate.setDate(
                  nextDayNewestUpdatedVisitDate.getDate() + 1
                );
                // Format nextDayNewestUpdatedVisitDate to DD/MM/YYYY
                const day = nextDayNewestUpdatedVisitDate.getDate();
                const month = nextDayNewestUpdatedVisitDate.getMonth() + 1;
                const year = nextDayNewestUpdatedVisitDate.getFullYear();
                const formattedNextDayNewestUpdatedVisitDate = `${day}/${month}/${year}`;
                const diffTime =
                  bipPositionOriginDate.getTime() -
                  newestUpdatedVisitDate.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 2) {
                  toast.error(
                    `Data do arquivo maior que ${formattedNextDayNewestUpdatedVisitDate}`
                  );
                  return;
                } else {
                  setFile(acceptedFiles[0]);
                }
              } else {
                toast.error(
                  "O arquivo não possui informações válidas ou esta vazio"
                );
              }
            } else {
              toast.error("Erro ao ler o arquivo");
            }
          },
        });
      }
    },
    [dateRangeChart]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv", ".xls", ".xlsx"],
    },
    onDrop,
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${
          isDragActive
            ? "bg-blue-400"
            : "border-2 border-dashed border-gray-400"
        } ${
          isDisable
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-white cursor-pointer"
        } p-2.5 rounded-lg min-h-[6rem] text-center flex flex-col items-center justify-center  w-full`}
        {...getRootProps()}
      >
        <input {...getInputProps()} disabled={isDisable} />
        {isDragActive && <p>Solte o arquivo aqui ...</p>}
        {!isDragActive && (
          <p>Arraste e solte o arquivo aqui ou clique para seleciona-lo</p>
        )}
      </div>

      {file && (
        <>
          <Divider className="mt-4 mb-2" />
          <div className="flex flex-col items-center w-full">
            <div className="flex w-full flex-row justify-around items-center">
              <span
                className="font-normal text-center"
                style={{ lineBreak: "anywhere" }}
              >
                {file?.name}
              </span>
            </div>
          </div>
          {hasWSS ? (
            <>
              <div className="flex flex-col items-start w-full">
                <WebSocket
                  file={file}
                  setWSSChartFinished={setWSSChartFinished}
                  setDateInfo={setDateInfo}
                />
                <WebSocketRanking file={file} />
              </div>
              <div className="flex items-center justify-center mt-4">
                <button
                  className={`text-red-500 cursor-pointer text-sm border-1 border-solid border-red-500 rounded-md px-2 py-1`}
                  onClick={() => setFile(null)}
                >
                  Remover
                </button>
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
