"use client";

import dynamic from "next/dynamic";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getBaseUrl } from "./_helpers/env";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import BarChartApex from "@/components/Chart/BarChartApex";
import MixedChart from "@/components/Chart/MixedChart";
import LineChartApex from "@/components/Chart/LineChartApex";
import LineChart2Apex from "@/components/Chart/LineChart2Apex";

// Dynamic import BarChart
const BarChart = dynamic(() => import("@/components/Chart/BarChart"), {
  ssr: false,
});

export default function Home() {
  const { data: session, status } = useSession();
  const [chart, setChart] = useState("bar");

  useEffect(() => {
    if (!session && status === "unauthenticated") {
      console.log("session", session, "status", status);
      const url = new URL("/login", getBaseUrl());
      url.searchParams.append("callbackUrl", "/");
      redirect(url.toString());
    }
  }, [session, status]);

  const handleChangeChart = () => {
    setChart(chart === "bar" ? "line" : "bar");
  };

  return (
    <main className="h-[100vh]">
      <div className="w-full">
        <button type="button" onClick={handleChangeChart}>
          Change chart to {chart === "bar" ? "line v2" : "line"}
        </button>
        <Card className="p-4 h-fit ">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h2 className="">Base Produtividade</h2>
          </CardHeader>
          <CardBody className="overflow-visible">
            {/* <LineChart2Apex /> */}
            {chart === "bar" ? <LineChart2Apex /> : <LineChartApex />}
            {/* <LineChartApex /> */}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
