"use client";

import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { useEffect } from "react";

// Auth
import { useSession } from "next-auth/react";

// Helpers
import { getBaseUrl } from "./(helpers)/env";

// Components
import Chart from "./(components)/Chart";
import Alerts from "./(components)/Alerts";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session && status === "unauthenticated") {
      console.log("session", session, "status", status);
      const url = new URL("/login", getBaseUrl());
      url.searchParams.append("callbackUrl", "/");
      redirect(url.toString());
    }

    redirect("/productivity");
  }, [session, status]);

  return (
    <main className="h-[100vh]">
      {/* <div className="w-full flex flex-col gap-14">
        <Chart />
        <div className="flex gap-20">
          <Alerts />
          <div className="flex flex-col h-full gap-14">
          <Card className="p-4 h-fit ">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="">Base Produtividade</h2>
            </CardHeader>
            <CardBody className="overflow-visible">
              <div className="flex w-full rounded-3xl h-6 bg-sky-500 items-center justify-center">
                <p className="text-white">Adicionar base</p>
              </div>
            </CardBody>
          </Card>
          <Card className="p-4 h-fit ">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h2 className="">Base Demanda</h2>
            </CardHeader>
            <CardBody className="overflow-visible">
              <div className="flex w-full rounded-3xl h-6 bg-sky-500 items-center justify-center">
                <p className="text-white">Adicionar base</p>
              </div>
            </CardBody>
          </Card>
        </div>
        </div>
      </div> */}
    </main>
  );
}
