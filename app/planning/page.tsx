"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
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
import useGetUploadDatesTrucks from "../(hooks)/useGetUploadDatesTrucks";
import { ArrowDownIcon } from "../(assets)/ArrowIcon";
import { formatDateToDDMM } from "../(helpers)/dates";
import AttatchIcon from "../(assets)/AttatchIcon";

const PlanningPage: React.FC = () => {
  const { data: session, status } = useSession();
  const { dispatch, simulation, selectedSimulationDate, productivityStats } =
    useAppContext();
  const [demandFile, setDemandFile] = useState<File | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    console.log("first", file);
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
            <Subtitle>Data</Subtitle>
            <TruckIcon />
          </div>
          <DateSelector onDateSelect={handleDateSelect} isLoading={isLoading} />
        </Card>
        <Card className="p-4 h-fit ">
          <CardHeader className="p-0 pb-2 flex-col items-start">
            <Subtitle>Demanda</Subtitle>
          </CardHeader>
          <CardBody className="overflow-visible !p-0 !pt-2">
            <div>
              <label
                onClick={() => {}}
                className="h-7 text-xs bg-[#003369] rounded text-white cursor-pointer flex justify-center items-center"
              >
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xls,.xlsx"
                />
                <div className="flex w-full justify-between ml-2 mr-3">
                  <span className="ml-2">Adicionar dock</span>
                  <AttatchIcon />
                </div>
              </label>
              <div className="text-xs text-gray-500 flex gap-2 mt-1.5 pl-1.5">
                Ultimo upload: <p className="text-black font-semibold">-</p>
              </div>
            </div>

            <div className="mt-4">
              <label
                onClick={() => {}}
                className="h-7 text-xs bg-[#003369] rounded text-white cursor-pointer flex justify-center items-center"
              >
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xls,.xlsx"
                />
                <div className="flex w-full justify-between ml-2 mr-3">
                  <span className="ml-2">Adicionar caixa/pallets</span>
                  <AttatchIcon />
                </div>
              </label>
              <div className="text-xs text-gray-500 flex gap-2 mt-1.5 pl-1.5">
                Ultimo upload: <p className="text-black font-semibold">-</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="p-4 h-fit ">
          <CardHeader className="p-0 pb-2 flex-col items-start">
            <Subtitle>Parâmetros de produtividade</Subtitle>
          </CardHeader>
          <CardBody className="overflow-visible !p-0 !pt-2">
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <p className="font-medium invisible">HPC</p>
                <div className={`p-1 w-1/2 text-center text-xs text-gray-400`}>
                  <p>Perfil</p>
                </div>
                <div className={`p-1 w-1/2 text-center text-xs text-gray-400`}>
                  <p>Media</p>
                  <p>Visitas</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <p className="font-medium">HPC</p>
                <div
                  className={`cursor-pointer rounded p-1 w-1/2 text-center bg-gray-100 font-medium`}
                >
                  {productivityStats.find((el) => el.family === "HPC")
                    ?.mean_profile || "-"}
                </div>
                <div
                  className={`cursor-pointer rounded p-1 w-1/2 text-center bg-gray-100 font-medium`}
                >
                  {productivityStats.find((el) => el.family === "HPC")
                    ?.mean_visits_per_hour || "-"}
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <p className="font-medium">Aero</p>
                <div
                  className={`cursor-pointer rounded p-1 w-1/2 text-center bg-gray-100 font-medium`}
                >
                  {productivityStats.find((el) => el.family === "AERO")
                    ?.mean_profile || "-"}
                </div>
                <div
                  className={`cursor-pointer rounded p-1 w-1/2 text-center bg-gray-100 font-medium`}
                >
                  {productivityStats.find((el) => el.family === "AERO")
                    ?.mean_visits_per_hour || "-"}
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <p className="font-medium">Food</p>
                <div
                  className={`cursor-pointer rounded p-1 w-1/2 text-center bg-gray-100 font-medium`}
                >
                  {productivityStats.find((el) => el.family === "FOODS")
                    ?.mean_profile || "-"}
                </div>
                <div
                  className={`cursor-pointer rounded p-1 w-1/2 text-center bg-gray-100 font-medium`}
                >
                  {productivityStats.find((el) => el.family === "FOODS")
                    ?.mean_visits_per_hour || "-"}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="p-4 h-fit flex-1">
        <div className="flex flex-col gap-4">
          <Subtitle>
            Separação de Caixas{" "}
            {selectedSimulationDate
              ? `- ${formatDateToDDMM(selectedSimulationDate)}`
              : ""}
          </Subtitle>
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

      {/* <Card className="p-4 h-fit w-fit max-w-[300px]">
        <AlertBoard />
        <div className="border-1 border-solid rounded-lg transform rotate-x-2 shadow-md h-2/5">
          <p>Gráfico Produção x Recursos</p>
        </div>
      </Card> */}
    </div>
  );
};

export default PlanningPage;
