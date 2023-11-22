"use client";

import React, { useEffect } from "react";
// Next
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

// Components
import { Card } from "@nextui-org/react";

// Helpers
import { getBaseUrl } from "../_helpers/env";

export default async function Productivity() {
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
    <div>
      <Card>Restricted Page {session?.user?.name}</Card>
    </div>
  );
}
