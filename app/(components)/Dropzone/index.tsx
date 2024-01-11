"use client";

import { CircularProgress, Divider } from "@nextui-org/react";
import { useRef, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone({
  file,
  setFile,
}: {
  file: File | null;
  setFile: (newFiles: File | null) => void;
}) {
  const onDrop = useCallback((acceptedFiles: any) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: { "text/csv": [".csv"] },
    onDrop,
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${
          isDragActive
            ? "bg-blue-400"
            : "border-2 border-dashed border-gray-400"
        } p-2.5 rounded-lg min-h-[6rem] text-center flex flex-col items-center justify-center cursor-pointer w-full`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
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
              <span className="font-medium" style={{ lineBreak: "anywhere" }}>
                {file?.name}
              </span>
              <button
                className={`text-red-500 cursor-pointer text-sm`}
                onClick={() => setFile(null)}
              >
                Remover
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
