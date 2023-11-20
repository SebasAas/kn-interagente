"use client";

import dynamic from "next/dynamic";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

// Dynamic import LineChart
const LineChart = dynamic(() => import("@/components/Chart/LineChart"), {
  ssr: false,
});

export default async function Home() {
  const { data: session } = useSession();
  // redirect to signin if there is no session.

  if (!session) {
    console.log("session", session);

    const url = new URL("/login", "https://kn-interagente.vercel.app");
    url.searchParams.append("callbackUrl", "/");
    redirect(url.toString());
  }

  return (
    <main className="h-[100vh]">
      <div className="w-full">
        <LineChart />
      </div>
    </main>
  );
}
