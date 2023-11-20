"use client";

import { useSession } from "next-auth/react";

import { redirect } from "next/navigation";
import Login from "./form";
import { getBaseUrl } from "../_helpers/env";
import { useEffect } from "react";

export default async function LoginPage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
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
