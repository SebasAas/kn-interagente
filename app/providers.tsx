"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { AppProvider } from "./(context)/AppContext";
import { generateDates } from "./(helpers)/generateDates";

type Props = {
  children?: React.ReactNode;
};

const getInitialState = () => {
  const initialState = {
    demands: {
      uploadStatus: [],
    },
    productivity: {
      HPC: [],
      AERO: [],
      FOODS: [],
    },
  };

  return initialState;
};

export const Providers = ({ children }: Props) => {
  return (
    <AppProvider initialState={getInitialState()}>
      <NextUIProvider>
        <SessionProvider>{children}</SessionProvider>
      </NextUIProvider>
    </AppProvider>
  );
};
