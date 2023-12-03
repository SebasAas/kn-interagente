import { nextauthOptions } from "../(lib)/nextauthOptions";
import { getServerSession } from "next-auth/next";
import React from "react";
import { redirect } from "next/navigation";

export default async function RestrictedPage() {
  // get the session
  const session = await getServerSession(nextauthOptions);
  // const user = session?.user;

  // console.log("session", session);

  // redirect to signin if there is no session.
  if (!session) {
    // const url = new URL("login", getBaseUrl());
    // url.searchParams.append("callbackUrl", "/restricted");
    // redirect(url.toString());
  }

  // display the page
  return (
    <div>
      <h1>Welcome to the Restricted Page, {session?.user?.name}</h1>
    </div>
  );
}
