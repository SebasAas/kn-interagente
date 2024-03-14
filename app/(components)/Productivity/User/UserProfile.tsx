"use client";

import { fetchWorker } from "@/app/(services)/ranking";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import UserTable from "./UserTable";
import { Tooltip } from "react-tooltip";
import TooltipIcon from "@/app/(assets)/TooltipIcon";

const RadarChart = dynamic(() => import("../../Chart/RadarChart"), {
  ssr: false,
  loading: () => (
    <Loader className="h-[250px] flex justify-center items-center" />
  ),
});

import Loader from "../../Loader";
import dynamic from "next/dynamic";

const UserProfile = ({
  rankingData,
  user,
  date,
  selectedKeys,
}: {
  rankingData: any;
  user: any;
  date: { month: string; year: string; shift: string };
  selectedKeys: Set<string>;
}) => {
  const [userData, setUserData] = React.useState<any>({
    workloads: [],
  });

  useEffect(() => {
    if (rankingData.length === 0) {
      setUserData({
        workloads: [],
      });
      return;
    }

    if (!user) return;

    const code = Array.from(user)[0] as string;

    if (!code) return;

    const toastPromiseGraph = toast.promise(
      fetchWorker(code, date.month, date.year, date.shift),
      {
        pending: "Obtendo dados do empregado...",
      }
    );
    toastPromiseGraph
      .then((res: any) => {
        if (res.error) {
          toast.error(
            <div>
              <h2>Algo deu errado obtendo empregado, tente novamente!</h2>
            </div>
          );
        } else {
          setUserData(res);
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Algo deu errado obtendo empregado, tente novamente!");
        setUserData({});
      });
  }, [user]);

  return (
    <div className="flex flex-col  w-full">
      <div className="flex gap-6 mt-4">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-4xl font-bold">{userData?.position}</p>
          <p>{userData?.worker_code}</p>
        </div>
        <div className="flex gap-6 flex-wrap">
          <div className="flex flex-col text-center">
            <div className="flex flex-row">
              <p className="text-gray-400 text-sm font-medium">Trabalho</p>
              <a className="tooltip-trabalho">
                <TooltipIcon />
              </a>
              <Tooltip
                anchorSelect=".tooltip-trabalho"
                content="Total de caixas por peso e distância"
              />
            </div>
            <p className="text-2xl text-red-700 font-semibold">
              {userData?.workloads[0]?.work?.toFixed(0)}
            </p>
          </div>
          <div className="flex flex-col text-center">
            <div className="flex flex-row">
              <p className="text-gray-400 text-sm font-medium">Produção</p>
              <a className="tooltip-producao">
                <TooltipIcon />
              </a>
              <Tooltip
                anchorSelect=".tooltip-producao"
                content="Total de caixas separadas"
              />
            </div>
            <p className="text-2xl text-blue-700 font-semibold">
              {userData?.workloads[0]?.production}
            </p>
          </div>
          <div className="flex flex-col text-center">
            <div className="flex flex-row">
              <p className="text-gray-400 text-sm font-medium">Produtividade</p>
              <a className="tooltip-produtividade">
                <TooltipIcon />
              </a>
              <Tooltip
                anchorSelect=".tooltip-produtividade"
                content="Média de caixas separadas por hora"
              />
            </div>
            <p className="text-2xl text-blue-700 font-semibold">
              {userData?.workloads[0]?.productivity?.toFixed(0)}
            </p>
          </div>
          <div className="flex flex-col text-center">
            <div className="flex flex-row">
              <p className="text-gray-400 text-sm font-medium">Perfil</p>
              <a className="tooltip-perfil">
                <TooltipIcon />
              </a>
              <Tooltip
                anchorSelect=".tooltip-perfil"
                content="Média de caixas separadas por visita"
              />
            </div>
            <p className="text-2xl text-blue-700 font-semibold">
              {userData?.workloads[0]?.profile?.toFixed(0)}
            </p>
          </div>
          {/* <div className="flex flex-col text-center">
            <div className="flex flex-row">
              <p className="text-gray-400 text-sm font-medium">Horas Diretas</p>
              <a className="tooltip-horasDiretas">
                <TooltipIcon />
              </a>
              <Tooltip
                anchorSelect=".tooltip-horasDiretas"
                content="Horas do usuário disponíveis para o trabalho"
              />
            </div>
            <p className="text-2xl text-blue-700 font-semibold">
              {userData?.workloads[0]?.direct_hours}
            </p>
          </div> */}
          <div className="flex flex-col text-center">
            <div className="flex flex-row">
              <p className="text-gray-400 text-sm font-medium">
                Horas Media Diretas
              </p>
              <a className="tooltip-horasDiretas">
                <TooltipIcon />
              </a>
              <Tooltip
                anchorSelect=".tooltip-horasDiretas"
                content="Media de horas diretas do usuário disponíveis para o trabalho"
              />
            </div>
            <p className="text-2xl text-blue-700 font-semibold">
              {userData?.workloads[0]?.mean_direct_hours}
            </p>
          </div>

          <div className="flex flex-col text-center">
            <div className="flex flex-row">
              <p className="text-gray-400 text-sm font-medium">Velocidade</p>
              <a className="tooltip-velocidade">
                <TooltipIcon />
              </a>
              <Tooltip
                anchorSelect=".tooltip-velocidade"
                content="Velocidade média dos usuários no picking"
              />
            </div>
            <p className="text-2xl text-blue-700 font-semibold">
              {userData?.workloads[0]?.speed?.toFixed(2)}
            </p>
          </div>
          {/* <div className="flex flex-col text-center">
            <div className="flex flex-row">
              <p className="text-gray-400 text-sm font-medium">Distância</p>
              <a className="tooltip-distancia">
                <TooltipIcon />
              </a>
              <Tooltip
                anchorSelect=".tooltip-distancia"
                content="Distância total percorrida pelo usuário em picking"
              />
            </div>
            <p className="text-2xl text-blue-700 font-semibold">
              {userData?.workloads[0]?.distance?.toFixed(0)}
            </p>
          </div> */}
          <div className="flex flex-col text-center">
            <div className="flex flex-row">
              <p className="text-gray-400 text-sm font-medium">
                Distância Media
              </p>
              <a className="tooltip-distancia">
                <TooltipIcon />
              </a>
              <Tooltip
                anchorSelect=".tooltip-distancia"
                content="Media Distância percorrida pelo usuário em picking"
              />
            </div>
            <p className="text-2xl text-blue-700 font-semibold">
              {userData?.workloads[0]?.mean_distance?.toFixed(0)}
            </p>
          </div>
        </div>
      </div>
      {selectedKeys.size !== 0 && (
        <div className="flex flex-row justify-between mt-12 px-6">
          <UserTable userData={userData} />
          <RadarChart data={userData} />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
