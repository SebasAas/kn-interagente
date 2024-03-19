"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import DateSelector from "../(components)/Scale/DateSelector";
import AlertBoard from "../(components)/Scale/AlertBoard";
import UploadButton from "../(components)/Scale/UploadButton";
import TruckIcon from "../(assets)/TruckIcon";
import TooltipIcon from "../(assets)/TooltipIcon";
import { Tooltip } from "react-tooltip";
import ProductTable from "../(components)/Scale/ProductTable";
import PoliticsForm from "../(components)/Scale/PoliticsForm";
import Subtitle from "../(components)/Text/Subtitle";
import { toast } from "react-toastify";
import Dropzone from "../(components)/Dropzone";
import { demandFiles, fetchUploadStatus } from "../(services)/demand";

const ScalePage: React.FC = () => {
  const [demandFile, setDemandFile] = useState<File | null>(null);

  const [dateInfoCallback, setDateInfoCallback] = useState({
    year: "2024",
    month: "03",
    shift: "0",
  });

  function handleDateSelect(date: Date) {
    //Lógica pra carregar dados do back
    console.log("Carregar dados para:", date);
  }
  const handleUploadComplete = () => {
    console.log("Upload completo!");
  };

  const productData = {
    HPC: [
      { hora: "06:00", estimado: 10, caixas: 22, visitas: 5 },
      { hora: "07:00", estimado: 12, caixas: 27, visitas: 6 },
      { hora: "08:00", estimado: 10, caixas: 22, visitas: 5 },
      { hora: "09:00", estimado: 12, caixas: 27, visitas: 6 },
      { hora: "10:00", estimado: 10, caixas: 22, visitas: 5 },
      { hora: "11:00", estimado: 12, caixas: 27, visitas: 6 },
      { hora: "12:00", estimado: 10, caixas: 22, visitas: 5 },
      { hora: "13:00", estimado: 12, caixas: 27, visitas: 6 },
    ],
    AERO: [
      { hora: "06:00", estimado: 11, caixas: 21, visitas: 7 },
      { hora: "07:00", estimado: 13, caixas: 26, visitas: 8 },
      { hora: "08:00", estimado: 11, caixas: 21, visitas: 7 },
      { hora: "09:00", estimado: 13, caixas: 26, visitas: 8 },
      { hora: "10:00", estimado: 11, caixas: 21, visitas: 7 },
      { hora: "11:00", estimado: 13, caixas: 26, visitas: 8 },
      { hora: "12:00", estimado: 11, caixas: 21, visitas: 7 },
      { hora: "13:00", estimado: 13, caixas: 26, visitas: 8 },
    ],
    FOODS: [
      { hora: "06:00", estimado: 12, caixas: 20, visitas: 4 },
      { hora: "07:00", estimado: 14, caixas: 25, visitas: 9 },
      { hora: "08:00", estimado: 12, caixas: 20, visitas: 4 },
      { hora: "09:00", estimado: 14, caixas: 25, visitas: 9 },
      { hora: "10:00", estimado: 12, caixas: 20, visitas: 4 },
      { hora: "11:00", estimado: 14, caixas: 25, visitas: 9 },
      { hora: "12:00", estimado: 12, caixas: 20, visitas: 4 },
      { hora: "13:00", estimado: 14, caixas: 25, visitas: 9 },
    ],
  };

  const uploadStatus = async () => {
    await fetchUploadStatus().then((res) => {
      console.log(res);
    });
  };

  // Handler for file upload
  const handleFileUpload = async (file: File) => {
    if (file) {
      const toastPromise = toast.promise(demandFiles([file]), {
        pending: "Enviando arquivo...",
      });

      await toastPromise
        .then((response) => response.json())
        .then((res: any) => {
          if (res === null) {
            return;
          }
          toast.error(
            <div>
              <h2>Algo deu errado enviando o arquivo, tente novamente!</h2>
            </div>
          );
          setDemandFile(null);
          uploadStatus();
        })
        .catch((err) => {
          toast.error("Algo deu errado enviando o arquivo, tente novamente!");
          setDemandFile(null);
        });
    }
  };

  // Trigger the upload process when the file is selected
  const onFileSelect = (file: File | null) => {
    console.log("first", file);
    setDemandFile(file);
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="flex flex-row gap-2 w-full h-full">
      <div className="flex flex-col gap-4 w-2/12 h-3/5">
        <div className="flex flex-col mt-8 p-4 border-1 border-solid rounded-lg transform rotate-x-2 shadow-md">
          <div className="flex flex-row justify-between mb-4">
            <h3 className="text-[#353535] font-medium">Data</h3>
            <TruckIcon />
          </div>
          <DateSelector onDateSelect={handleDateSelect} />
        </div>
        <Card className="p-4 h-fit ">
          <CardHeader className="p-0 pb-2 flex-col items-start">
            <Subtitle>Demanda</Subtitle>
          </CardHeader>
          <CardBody className="overflow-visible !p-0 !pt-2">
            <Dropzone
              file={demandFile}
              setFile={onFileSelect}
              dateRangeChart={{
                latest_updated_visit: "",
                newest_updated_visit: "",
              }}
              setWSSChartFinished={() => {}}
              setWSSRankingFinished={() => {}}
              setDateInfo={setDateInfoCallback}
              isEnabled={true}
              hasWSS={false}
            />
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col mt-8 p-4 border-1 border-solid rounded-lg transform rotate-x-2 shadow-md w-6/12 h-full overflow-auto">
        <div className="flex flex-col gap-4">
          <h3 className="text-[#353535] font-medium">Separação de Caixas - </h3>
          <div className="flex flex-col">
            <div className="flex flex-row">
              <p>Políticas</p>
              <a className="tooltip-politicas">
                <TooltipIcon />
              </a>
              <Tooltip
                anchorSelect=".tooltip-politicas"
                content="Defina aqui as regras de negócio por família e gere novas simulações"
              />
            </div>
            <div>
              <PoliticsForm />
            </div>
          </div>
          <ProductTable productData={productData} />
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8 w-4/12">
        <div className=" flex flex-row border-1 border-solid rounded-lg transform rotate-x-2 shadow-md h-2/5">
          <AlertBoard />
        </div>
        <div className="border-1 border-solid rounded-lg transform rotate-x-2 shadow-md h-2/5">
          <p>Gráfico Produção x Recursos</p>
        </div>
      </div>
    </div>
  );
};

export default ScalePage;
