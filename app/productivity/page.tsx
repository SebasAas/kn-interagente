"use client";
import React, { useEffect, useState } from "react";

// Next
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

// Auth
import { useSession } from "next-auth/react";

// Components
import Table from "../(components)/Table";
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import DateFilter from "../(components)/DateFilter/DateFilter";
import UserProfile from "../(components)/Productivity/UserProfile";

// Helpers
import { getBaseUrl } from "../(helpers)/env";
import Subtitle from "../(components)/Text/Subtitle";
import Text from "../(components)/Text/Text";
import Loader from "../(components)/Loader";
import Medal from "../(assets)/MedalIcon";
import UserCard from "../(components)/Productivity/UserCard";
import Dropzone from "../(components)/Dropzone";
import {
  stateProductionxResources,
  stateProductivityxHour,
} from "../(helpers)/mockedData";
import { uploadFiles } from "../(services)/productivity";
import { toast } from "react-toastify";

const MixedChart = dynamic(() => import("../(components)/Chart/MixedChart"), {
  ssr: false,
  loading: () => (
    <Loader className="h-[350px] flex justify-center items-center" />
  ),
});

const RadarChart = dynamic(() => import("../(components)/Chart/RadarChart"), {
  ssr: false,
  loading: () => (
    <Loader className="h-[350px] flex justify-center items-center" />
  ),
});

export default function Productivity() {
  const { data: session, status } = useSession();

  const [productivityFile, setProductivityFile] = useState<File | null>(null);

  const [demandFile, setDemandFile] = useState<File | null>(null);

  useEffect(() => {
    if (!session && status === "unauthenticated") {
      console.log("session", session, "status", status);
      const url = new URL("/login", getBaseUrl());
      url.searchParams.append("callbackUrl", "/");
      redirect(url.toString());
    }
  }, [session, status]);

  // Handler for file upload
  const handleFileUpload = async (file: File) => {
    if (file) {
      const toastPromise = toast.promise(uploadFiles([file]), {
        pending: "Enviando arquivo...",
      });

      await toastPromise
        .then((res: any) => {
          if (res.error) {
            toast.error(
              <div>
                <h2>Algo deu errado, tente novamente!</h2>
                <p className="text-xs"> {res?.error?.data?.code} </p>
              </div>
            );
            setProductivityFile(null);
          } else {
            toast.success("Arquivos enviados com sucesso!");
          }
        })
        .catch((err) => {
          toast.error("Algo deu errado, tente novamente!");
          setProductivityFile(null);
        });
    }
  };

  // Trigger the upload process when the file is selected
  const onFileSelect = (file: File | null) => {
    setProductivityFile(file);
    if (file) {
      handleFileUpload(file);
    }
  };

  // display the page
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <div className="flex flex-1 flex-col gap-6">
          <Card className="p-4 h-full flex-col w-full">
            <CardBody className="overflow-visible">
              <div>
                {/* <Subtitle>Produtividade</Subtitle> */}
                <Text className="font-medium">
                  Produção x Recurso em atividade
                </Text>
              </div>
              <MixedChart state={stateProductionxResources} />
              <Divider />
              <div className="mt-3">
                {/* <Subtitle>Produtividade</Subtitle> */}
                <Text className="font-medium">
                  Produtividade x Horas diretas
                </Text>
              </div>
              <MixedChart state={stateProductivityxHour} />
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-col h-full w-[20%] gap-6">
          <Card className="p-4 h-fit">
            <CardHeader className="p-0 pb-2 flex-col items-start">
              <Text className="font-medium">Filtros</Text>
            </CardHeader>
            <CardBody className="overflow-visible !p-0 !pt-2 gap-3">
              {/* Create two select with the years 2023, 2024 and a select with the months */}
              <select
                name="shift"
                id=""
                className="p-1 bg-[#F1F0F9] rounded-md text-sm"
              >
                <option value="1">1° turno</option>
                <option value="2">2° turno</option>
                <option value="3">3° turno</option>
              </select>
              <div className="flex justify-between gap-2">
                <select
                  name="year"
                  className="p-1 rounded-md text-sm bg-[#F1F0F9] w-full"
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
                <select
                  name="month"
                  className="p-1 rounded-md text-sm bg-[#F1F0F9] w-full"
                >
                  <option value="jan">Janeiro</option>
                  <option value="fev">Fevereiro</option>
                  <option value="mar">Março</option>
                  <option value="apr">Abril</option>
                  <option value="may">Maio</option>
                  <option value="jun">Junho</option>
                  <option value="jul">Julho</option>
                  <option value="aug">Agosto</option>
                  <option value="sept">Setembro</option>
                  <option value="oct">Outubro</option>
                  <option value="nov">Novembro</option>
                  <option value="dec">Dezembro</option>
                </select>
              </div>
              <button className="px-2 py-1 rounded-md bg-blue-900 text-white text-sm font-medium mt-2">
                Buscar
              </button>
            </CardBody>
          </Card>
          <Card className="p-4 h-fit ">
            <CardHeader className="p-0 pb-2 flex-col items-start">
              <Text className="font-medium">Base Produtividade</Text>
            </CardHeader>
            <CardBody className="overflow-visible !p-0 !pt-2">
              <Dropzone file={productivityFile} setFile={onFileSelect} />
            </CardBody>
          </Card>
          {/* <Card className="p-4 h-fit ">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="">Base Demanda</h2>
            </CardHeader>
            <CardBody className="overflow-visible !p-0 !pt-2">
              <Dropzone file={demandFile} setFile={setDemandFile} />
            </CardBody>
          </Card> */}
        </div>
      </div>
      <div className="flex flex-row gap-4 mt-4">
        <div className="w-1/2">
          <Card className="p-4 w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <div className="flex w-full justify-between">
                <div className="w-1/5">
                  <Subtitle>Ranking</Subtitle>
                  <Text className="text-gray-400">Usuarios</Text>
                </div>
                <DateFilter />
              </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2 gap-6">
              <div className="flex gap-4 mt-5 justify-around">
                <UserCard
                  name="Guilherme"
                  position={1}
                  medal="gold"
                  avatar="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                  score={100}
                />
                <UserCard
                  name="João"
                  position={2}
                  medal="silver"
                  avatar="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  score={90}
                />
                <UserCard
                  name="Diogo"
                  position={3}
                  medal="bronze"
                  avatar="https://i.pravatar.cc/150?u=a04258114e29026302d"
                  score={87}
                />
              </div>
              <div>
                <Table />
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-1 w-full">
          <Card className="p-4 w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <Subtitle>Informações do Usuario</Subtitle>
              <UserProfile
                photo="https://i.pravatar.cc/150?u=a04258114e29026302d"
                rankingPosition={4}
                name="John Doe"
                age={31}
                sector="Unilever"
                indicators={[10, 20, 15, 5, 30]}
              />
              {/*<Text className="text-gray-400">John Doe</Text>*/}
            </CardHeader>
            <CardBody>
              <RadarChart />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
