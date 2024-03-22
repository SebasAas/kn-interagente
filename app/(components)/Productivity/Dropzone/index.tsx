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
}: {
  wssChartFinished: boolean;
  setWSSChartFinished: React.Dispatch<React.SetStateAction<boolean>>;
  setDateInfo: React.Dispatch<React.SetStateAction<any>>;
  dateRangeChart: {
    latest_updated_visit: string;
    newest_updated_visit: string;
  };
  buttonDisabled: boolean;
}) {
  const [productivityFile, setProductivityFile] = useState<File | null>(null);

  useEffect(() => {
    if (wssChartFinished) {
      onFileSelect(null);
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
          console.log(res);
          if (res.detail) {
            toast.error(
              <div>
                <h2>{res.detail}</h2>
              </div>
            );
            setProductivityFile(null);
            return;
          }
        })
        .catch((err) => {
          console.log("Aquiiiii");
          toast.error(
            `Algo deu errado enviando o arquivo, tente novamente! ${err.message}`
          );
          setProductivityFile(null);
        });
    }
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
        />
      </CardBody>
    </Card>
  );
}

export default DropzoneProductivity;
