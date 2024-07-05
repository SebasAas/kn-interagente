"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import DateSelector from "../(components)/Planning/DateSelector";
import AlertBoard from "../(components)/Planning/AlertBoard";
import UploadButton from "../(components)/Planning/UploadButton";
import TruckIcon from "../(assets)/TruckIcon";
import TooltipIcon from "../(assets)/TooltipIcon";
import { Tooltip } from "react-tooltip";
import ProductTable from "../(components)/Planning/ProductTable";
import PoliticsForm from "../(components)/Planning/PoliticsForm";
import Subtitle from "../(components)/Text/Subtitle";
import { toast } from "react-toastify";
import Dropzone from "../(components)/Dropzone";
import { demandFiles, fetchUploadStatus } from "../(services)/demand";
import { useAppContext } from "../(context)/AppContext";
import { useSession } from "next-auth/react";
import { getBaseUrl } from "../(helpers)/env";
import { redirect } from "next/navigation";
import { generateDates } from "../(helpers)/generateDates";
import useGetUploadDatesTrucks from "../(hooks)/useGetUploadDatesTrucks";
import { ArrowDownIcon } from "../(assets)/ArrowIcon";
import mockedSimulation from "../(helpers)/mockedSimulation";
import { formatDateToDDMM } from "../(helpers)/dates";

const PlanningPage: React.FC = () => {
  const { data: session, status } = useSession();
  const { dispatch, simulation, selectedSimulationDate } = useAppContext();
  const [demandFile, setDemandFile] = useState<File | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [dateInfoCallback, setDateInfoCallback] = useState({
    year: "2024",
    month: "03",
    shift: "0",
  });

  const { isLoading, error } = useGetUploadDatesTrucks();

  useEffect(() => {
    if (!session && status === "unauthenticated") {
      console.log("session", session, "status", status);
      const url = new URL("/login", getBaseUrl());
      url.searchParams.append("callbackUrl", "/");
      redirect(url.toString());
    }
  }, [session, status]);

  function handleDateSelect(date: Date) {
    //Lógica pra carregar dados do back
    console.log("Carregar dados para:", date);
  }
  const handleUploadComplete = () => {
    console.log("Upload completo!");
  };

  // Handler for file upload
  const handleFileUpload = async (file: File) => {
    if (file) {
      const toastPromise = toast.promise(demandFiles([file]), {
        pending: "Enviando arquivo...",
      });

      await toastPromise
        .then((response) => response.json())
        .then(async (res: any) => {
          if (res === null) {
            dispatch({
              type: "SET_UPLOAD_STATUS",
              payload: await fetchUploadStatus(),
            });
            return;
          }

          toast.error(
            <div>
              <h2>Algo deu errado enviando o arquivo, {res.detail}</h2>
            </div>
          );
          setDemandFile(null);
          // uploadStatus();
        })
        .catch((err) => {
          toast.error(
            `Algo deu errado enviando o arquivo, tente novamente! ${err.detail}`
          );
          setDemandFile(null);
        });
    }
  };

  // Trigger the upload process when the file is selected
  const onFileSelect = (file: File | null) => {
    setDemandFile(file);
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="flex flex-row gap-4 w-full h-full">
      <div className="flex flex-col gap-6 w-[20%] max-w-[240px]">
        <Card className="p-4 h-fit ">
          <div className="flex flex-row justify-between mb-4">
            <h3 className="text-[#353535] font-medium">Data</h3>
            <TruckIcon />
          </div>
          <DateSelector onDateSelect={handleDateSelect} isLoading={isLoading} />
        </Card>
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
              setDateInfo={setDateInfoCallback}
              isDisable={false}
              hasWSS={false}
            />
          </CardBody>
        </Card>
      </div>

      <Card className="p-4 h-fit flex-1">
        <div className="flex flex-col gap-4">
          <h3 className="text-[#353535] font-medium text-lg">
            Separação de Caixas -{" "}
            {selectedSimulationDate
              ? formatDateToDDMM(selectedSimulationDate)
              : ""}
          </h3>
          <div className="flex flex-col">
            <div className="flex flex-row gap-1 ">
              <p>Políticas</p>
              <a className="tooltip-politicas">
                <TooltipIcon />
              </a>
              <button
                onClick={() => setIsVisible(!isVisible)}
                className={isVisible ? "rotate-180" : ""}
              >
                <ArrowDownIcon />
              </button>

              <Tooltip
                anchorSelect=".tooltip-politicas"
                content="Defina aqui as regras de negócio por família e gere novas simulações"
              />
            </div>
            <PoliticsForm isVisible={isVisible} />
          </div>
          <ProductTable simulation={simulation?.simulation || []} />
        </div>
      </Card>

      <Card className="p-4 h-fit w-fit max-w-[300px]">
        <AlertBoard />
        {/* <div className="border-1 border-solid rounded-lg transform rotate-x-2 shadow-md h-2/5">
          <p>Gráfico Produção x Recursos</p>
        </div> */}
      </Card>
    </div>
  );
};

export default PlanningPage;
