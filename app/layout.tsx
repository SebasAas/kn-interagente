"use client";

// Use usePathname for catching route name.
import { usePathname } from "next/navigation";
// Providers
import { Providers } from "./providers";
// CSS
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import Header from "./(components)/Header";
import { Flip, ToastContainer } from "react-toastify";
import ModalComponent from "./(components)/Modal";

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
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            transition={Flip}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <Header activePath={pathname || ""} />
          <section
            className={
              !notShowBtnLoginRegisterInPaths?.includes(pathname || "")
                ? "pt-16 px-8"
                : ""
            }
          >
            {children}
          </section>
          <ModalComponent />
        </Providers>
      </body>
    </html>
  );
}
