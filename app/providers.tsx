"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { AppProvider } from "./(context)/AppContext";

type Props = {
  children?: React.ReactNode;
};

const initialState = {
  demands: {
    uploadStatus: [],
  },
  productivity: {
    HPC: [],
    AERO: [],
    FOODS: [],
    ALL: [],
  },
  chartData: [],
  lengthSeries: {},
  selectedSimulationDate: "",
  simulation: {
    alarms: {},
    hours: {},
    statistics: {},
  },
  modal: {
    open: false,
    header: null,
    body: null,
  },
};

export const Providers = ({ children }: Props) => {
  return (
    <AppProvider initialState={initialState}>
      <NextUIProvider>
        <SessionProvider>{children}</SessionProvider>
      </NextUIProvider>
    </AppProvider>
  );
};
