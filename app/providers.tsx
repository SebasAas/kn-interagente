"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { AppProvider } from "./(context)/AppContext";
import { generateDates } from "./(helpers)/generateDates";

type Props = {
  children?: React.ReactNode;
};

const getInitialState = async () => {
  const result = await generateDates()
    .then((data) => data)
    .catch((err) => [{ date: new Date().toISOString(), uploaded: false }]);

  const initialState = {
    demands: {
      uploadStatus: result,
    },
    productivity: {
      HPC: [],
      AERO: [],
      FOODS: [],
    },
  };

  return initialState;
};

export const Providers = async ({ children }: Props) => {
  const initialState = await getInitialState();

  return (
    <AppProvider initialState={initialState}>
      <NextUIProvider>
        <SessionProvider>{children}</SessionProvider>
      </NextUIProvider>
    </AppProvider>
  );
};
