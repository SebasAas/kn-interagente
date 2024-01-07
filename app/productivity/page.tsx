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

  console.log("productivityFile", productivityFile);

  // display the page
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <div className="flex flex-1 flex-col">
          <Card className="p-4 h-full flex-col w-full">
            <CardBody className="overflow-visible">
              <div>
                {/* <Subtitle>Produtividade</Subtitle> */}
                <Text className="font-medium">
                  Produção x Recurso em atividade
                </Text>
              </div>
              <MixedChart state={stateProductionxResources} />
            </CardBody>
          </Card>
          <Card className="p-4 h-full flex-col w-full">
            <CardBody className="overflow-visible">
              <div>
                {/* <Subtitle>Produtividade</Subtitle> */}
                <Text className="font-medium">
                  Produtividade x Horas diretas
                </Text>
              </div>
              <MixedChart state={stateProductivityxHour} />
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-col h-full max-w-[23%] gap-6">
          {/* <Card className="p-4 h-fit ">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="">Base Produtividade</h2>
            </CardHeader>
            <CardBody className="overflow-visible !p-0 !pt-2">
              <Dropzone file={productivityFile} setFile={setProductivityFile} />
            </CardBody>
          </Card>
          <Card className="p-4 h-fit ">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="">Base Demanda</h2>
            </CardHeader>
            <CardBody className="overflow-visible !p-0 !pt-2">
              <Dropzone file={demandFile} setFile={setDemandFile} />
            </CardBody>
          </Card> */}
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
                  className="p-1 rounded-md text-sm bg-[#F1F0F9]"
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
                <select
                  name="month"
                  className="p-1 rounded-md text-sm bg-[#F1F0F9]"
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
