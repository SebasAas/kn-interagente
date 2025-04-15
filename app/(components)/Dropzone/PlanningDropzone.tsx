"use client";

import { Divider } from "@nextui-org/react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { XLSIcon } from "@/app/(assets)/XLSIcon";

export default function PlanningDropzone({
  file,
  maxFiles = 1,
  setFile,
  dateRangeChart,
  isDisable = false,
}: {
  file: File[] | File | null;
  maxFiles?: number;
  setFile: (newFiles: File[] | File | null) => void;
  dateRangeChart: {
    latest_updated_visit: string;
    newest_updated_visit: string;
  };
  isDisable?: boolean;
}) {
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      if (!isDisable) {
        // Create a new file object with the same properties as the original file
        const files = [
          ...(Array.isArray(file) ? file : file ? [file] : []),
          ...acceptedFiles,
        ];

        return setFile(files);
      }

      if (
        acceptedFiles.length > 0 &&
        dateRangeChart.newest_updated_visit !== ""
      ) {
        setFile(acceptedFiles);
      }
    },
    [dateRangeChart]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: maxFiles,
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
            <div className="flex w-full flex-row  justify-start">
              <span className="font-normal " style={{ lineBreak: "anywhere" }}>
                {Array.isArray(file) ? (
                  file.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center justify-center gap-2 mb-2"
                    >
                      <XLSIcon height={20} width={20} />
                      <p className="text-sm text-gray-800 font-medium">
                        {f.name}
                      </p>
                      <button
                        className="text-red-500 hover:text-red-700 font-bold text-xs"
                        onClick={() => {
                          const newFiles = file.filter((item) => item !== f);
                          setFile(newFiles.length > 0 ? newFiles : null);
                        }}
                      >
                        X
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center">
                    <XLSIcon height={20} width={20} />
                    <p className="text-sm text-gray-800 font-medium">
                      {file.name}
                    </p>
                  </div>
                )}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
