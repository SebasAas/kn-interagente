"use client";

// Use usePathname for catching route name.
import { usePathname } from "next/navigation";
// Providers
import { Providers } from "./providers";
// CSS
import "./globals.css";
import Header from "@/components/Header";

const notShowBtnLoginRegisterInPaths = ["/login", "/register"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname: string | null = usePathname();

  return (
    <html lang="en">
      <body>
        <Providers>
          <Header activePath={pathname || ""} />
          <section
            className={
              !notShowBtnLoginRegisterInPaths?.includes(pathname || "")
                ? "pt-16 px-8"
                : ""
            }
          ></section>
          {children}
        </Providers>
      </body>
    </html>
  );
}
