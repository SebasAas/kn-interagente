import dynamic from "next/dynamic";

import { nextauthOptions } from "@/lib/nextauthOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Dynamic import LineChart
const LineChart = dynamic(() => import("@/components/Chart/LineChart"), {
  ssr: false,
});

export default async function Home() {
  const session = await getServerSession(nextauthOptions);
  // redirect to signin if there is no session.

  if (!session) {
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
