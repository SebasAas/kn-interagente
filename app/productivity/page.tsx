"use client";
import React, { useEffect } from "react";

// Next
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

// Auth
import { useSession } from "next-auth/react";

// Components
import Table from "../(components)/Table";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

// Helpers
import { getBaseUrl } from "../(helpers)/env";

const LineChart = dynamic(() => import("../(components)/Chart/LineChart"), {
  ssr: false,
});

export default function Productivity() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session && status === "unauthenticated") {
      console.log("session", session, "status", status);
      const url = new URL("/login", getBaseUrl());
      url.searchParams.append("callbackUrl", "/");
      redirect(url.toString());
    }
  }, [session, status]);

  // display the page
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <Card className="p-4 w-full">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <div className="flex w-full justify-between">
              <p className="text-tiny uppercase font-bold">Ranking</p>
              <p className="text-tiny uppercase font-bold">2023</p>
            </div>
          </CardHeader>
          <CardBody className="overflow-visible py-2 gap-6">
            <div className="flex gap-4 mt-5">
              <Card className="p-4">1</Card>
              <Card className="p-4">2</Card>
              <Card className="p-4">3</Card>
            </div>
            <div>
              <Table />
            </div>
          </CardBody>
        </Card>
        <Card className="p-4 h-fit ">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h2 className="">Base Produtividade</h2>
          </CardHeader>
          <CardBody className="overflow-visible">
            <div className="flex w-full rounded-3xl h-min bg-sky-500">
              <p>Adicionar base</p>
            </div>
          </CardBody>
        </Card>
      </div>
      <Card className="p-4 h-full flex-col">
        <CardBody className="overflow-visible">
          <LineChart />
        </CardBody>
      </Card>
    </div>
  );
}
