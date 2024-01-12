"use client";

import { fetchWorker } from "@/app/(services)/ranking";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const UserProfile = ({
  user,
  date,
}: {
  user: any;
  date: { month: string; year: string; shift: string };
}) => {
  const [userData, setUserData] = React.useState<any>(null);

  // get first value from Set user
  const code = Array.from(user)[0] as string;

  useEffect(() => {
    if (!code) return;

    const toastPromiseGraph = toast.promise(
      fetchWorker(code, date.month, date.year, date.shift),
      {
        pending: "Obtendo dados do empregado...",
      }
    );
    toastPromiseGraph
      .then((res: any) => {
        console.log("res", res);
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
      });
  }, [user]);

  // const { photo, rankingPosition, name, age, sector, indicators } = user;

  const allWorkload =
    userData && userData?.length > 0 ? userData?.workloads[0] : [];

  console.log(allWorkload, userData);

  return (
    <div className="flex gap-6 mt-4">
      <div className="flex flex-col gap-3 text-center">
        <p className="text-4xl font-bold">{userData?.position}</p>
        <p>{userData?.worker_code}</p>
      </div>
      <div className="flex gap-6 flex-wrap">
        <div className="flex flex-col text-center">
          <p className="text-gray-400 text-sm font-medium">Trabalho</p>
          <p className="text-xl text-red-700 font-semibold">
            {userData?.workloads[0]?.work?.toFixed(1)}
          </p>
        </div>
        <div className="flex flex-col text-center">
          <p className="text-gray-400 text-sm font-medium">Produção</p>
          <p className="text-xl text-blue-700 font-semibold">
            {userData?.workloads[0]?.production}
          </p>
        </div>
        <div className="flex flex-col text-center">
          <p className="text-gray-400 text-sm font-medium">Produtividade</p>
          <p className="text-xl text-blue-700 font-semibold">
            {userData?.workloads[0]?.productivity?.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-col text-center">
          <p className="text-gray-400 text-sm font-medium">Perfil</p>
          <p className="text-xl text-blue-700 font-semibold">
            {userData?.workloads[0]?.profile?.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-col text-center">
          <p className="text-gray-400 text-sm font-medium">Horas Diretas</p>
          <p className="text-xl text-blue-700 font-semibold">
            {userData?.workloads[0]?.hours?.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col text-center">
          <p className="text-gray-400 text-sm font-medium">Velocidade</p>
          <p className="text-xl text-blue-700 font-semibold">
            {userData?.workloads[0]?.speed?.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-col text-center">
          <p className="text-gray-400 text-sm font-medium">Distancia</p>
          <p className="text-xl text-blue-700 font-semibold">
            {userData?.workloads[0]?.distance?.toFixed(2)}
          </p>
        </div>
      </div>
      {/* {Array.isArray(userData?.workloads) && userData?.workloads?.length > 0 ? (
        userData?.workloads.map((indicator, index) => (
          <div key={index}>
            <p>Título {index + 1}</p>
            <span>{indicator}</span>
          </div>
        ))
      ) : (
        <p>Sem indicadores</p>
      )} */}
    </div>
  );
};

export default UserProfile;
