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

const BarChart = dynamic(() => import("./(components)/Chart/BarChart"), {
  ssr: false,
});

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session && status === "unauthenticated") {
      console.log("session", session, "status", status);
      const url = new URL("/login", getBaseUrl());
      url.searchParams.append("callbackUrl", "/");
      redirect(url.toString());
    }
  }, [session, status]);

  return (
    <main className="h-[100vh]">
      <div className="w-full flex flex-col gap-14">
        <Chart />
        <Alerts />
      </div>
    </main>
  );
}
