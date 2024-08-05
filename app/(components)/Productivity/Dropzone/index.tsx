import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Subtitle from "../../Text/Subtitle";
import Dropzone from "../../Dropzone";
import { toast } from "react-toastify";

import { uploadFiles } from "@/app/(services)/productivity";

function DropzoneProductivity({
  wssChartFinished,
  setWSSChartFinished,
  setDateInfo,
  dateRangeChart,
  buttonDisabled,
  lastUploadFileSummary,
  handleGetInfoByData,
}: {
  wssChartFinished: boolean;
  setWSSChartFinished: React.Dispatch<React.SetStateAction<boolean>>;
  setDateInfo: React.Dispatch<React.SetStateAction<any>>;
  dateRangeChart: {
    latest_updated_visit: string;
    newest_updated_visit: string;
  };
  buttonDisabled: boolean;
  lastUploadFileSummary: {
    day: string;
    state: string;
    name: string;
  }[];
  handleGetInfoByData: ({
    year,
    month,
    shift,
  }: {
    year: string;
    month: string;
    shift: string;
  }) => void;
}) {
  const [productivityFile, setProductivityFile] = useState<File | null>(null);

  useEffect(() => {
    if (wssChartFinished) {
      onFileSelect(null);
      setWSSChartFinished(false);
    }
  }, [wssChartFinished]);

  // Trigger the upload process when the file is selected
  const onFileSelect = (file: File | null) => {
    setProductivityFile(file);
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file) {
      const toastPromise = toast.promise(uploadFiles([file]), {
        pending: "Enviando arquivo...",
      });

      await toastPromise
        .then((response) => response.json())
        .then((res: any) => {
          if (res?.detail) {
            toast.error(
              <div>
                <h2>{res?.detail}</h2>
              </div>
            );
            setProductivityFile(null);
            return;
          }
        })
        .catch((err) => {
          toast.error(
            `Algo deu errado enviando o arquivo, tente novamente! ${err.message}`
          );
          setProductivityFile(null);
        });
    }
  };

  const handleGetDataFormat = () => {
    // Find the obj inside lastUploadFileSummary with name "upload" the type of the data is 2024-07-18T18:00:00, and I want to show like "18:00 - 18/07"
    const uploadData = lastUploadFileSummary?.find(
      (data) => data?.name === "upload"
    );
    if (uploadData) {
      const date = new Date(uploadData.day);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      return `${hours}:${minutes} - ${day}/${month}`;
    }

    return "";
  };

  return (
    <Card className="p-4 h-fit ">
      <CardHeader className="p-0 pb-2 flex-col items-start">
        <Subtitle>Base Produtividade</Subtitle>
      </CardHeader>
      <CardBody className="overflow-visible !p-0 !pt-2">
        <Dropzone
          file={productivityFile}
          setFile={onFileSelect}
          dateRangeChart={dateRangeChart}
          setWSSChartFinished={setWSSChartFinished}
          setDateInfo={setDateInfo}
          isDisable={buttonDisabled}
          handleGetInfoByData={handleGetInfoByData}
        />
        <span className="text-xs mt-5 text-gray-400">
          Ultimo upload:{" "}
          <span className="text-xs text-black">{handleGetDataFormat()}</span>
        </span>
      </CardBody>
    </Card>
  );
}

export default DropzoneProductivity;
