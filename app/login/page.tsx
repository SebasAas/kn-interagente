import { nextauthOptions } from "@/lib/nextauthOptions";
import { getServerSession } from "next-auth/next";

import { redirect } from "next/navigation";
import Login from "./form";

export default async function LoginPage() {
  const session = await getServerSession(nextauthOptions);

  const isDev = process.env.NODE_ENV === "development";

  if (session) {
    const url = new URL(
      "/",
      isDev ? "http://localhost:3000" : "https://kn-interagente.vercel.app"
    );
    redirect(url.toString());
  }

  return (
    <section className="text-black w-full h-screen overflow-hidden flex flex-col text-dark-gray">
      <Login />
    </section>
  );
}
