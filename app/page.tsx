"use client";

import dynamic from "next/dynamic";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { getBaseUrl } from "./_helpers/env";

// Dynamic import BarChart
const BarChart = dynamic(() => import("@/components/Chart/BarChart"), {
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
      <div className="w-full">
        <BarChart />
      </div>
    </main>
  );
}
