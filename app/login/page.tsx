import { nextauthOptions } from "@/lib/nextauthOptions";
import { getServerSession } from "next-auth/next";

import { redirect } from "next/navigation";
import Login from "./form";
import { getBaseUrl } from "../_helpers/env";
import { useEffect } from "react";

export default async function LoginPage() {
  const session = await getServerSession(nextauthOptions);

  useEffect(() => {
    if (session) {
      const url = new URL("/", getBaseUrl());
      redirect(url.toString());
    }
  }, [session]);

  return (
    <section className="text-black w-full h-screen overflow-hidden flex flex-col text-dark-gray">
      <Login />
    </section>
  );
}
