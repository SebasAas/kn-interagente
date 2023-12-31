"use client";

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
        } p-2.5 rounded-lg min-h-[6rem] text-center flex flex-col items-center justify-center`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Solte o arquivo aqui ...</p>
        ) : (
          <p>Arraste e solte o arquivo aqui ou clique para seleciona-lo</p>
        )}
      </div>
      {/* <input
          className="hidden"
          ref={inputRef}
          type="file"
          multiple={true}
          onChange={handleChange}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        /> */}

      <div className="flex flex-col items-center">
        {file && (
          <div className="flex flex-row space-x-5  m-3">
            <span style={{ lineBreak: "anywhere" }}>{file?.name}</span>
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => setFile(null)}
            >
              remove
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// import React, { useEffect } from "react";

// function Dropzone({ handleGetFile }: { handleGetFile: (file: File) => void }) {
//   const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
//     maxFiles: 1,
//   });

//   useEffect(() => {
//     if (acceptedFiles.length > 0) {
//       console.log(acceptedFiles);
//       handleGetFile(acceptedFiles[0]);
//     }
//   }, [acceptedFiles, handleGetFile]);

//   const files = acceptedFiles.map((file) => {
//     if (!file) return <> </>;

//     return (
//       <li key={file.name}>
//         {file.name} - {file.size} bytes
//       </li>
//     );
//   });

//   return (
//     <div className="container">
//       <div {...getRootProps({ className: "dropzone" })}>
//         <input {...getInputProps()} />
//         <p>Drag and drop some files here</p>
//         <button type="button" onClick={open}>
//           Open File Dialog
//         </button>
//       </div>
//       <aside>
//         <h4>Files</h4>
//         <ul>{files}</ul>
//       </aside>
//     </div>
//   );
// }

// export default Dropzone;
