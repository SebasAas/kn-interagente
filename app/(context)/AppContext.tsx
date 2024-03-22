// Create a react context with two main props productivity and demand, inside demand there should be uploadstatus prop that is an array ofo obj with date as string and uploaoded as bool, create also the methods to update the context and the initial state.

import type { ReactNode } from "react";

import { createContext, useReducer, useMemo, useContext } from "react";
import { FamilyProps, FamilyPropsResponse } from "../(services)/demand";

export type ChartProps = {
  color: string;
  data: number[];
  indicator: string;
  label: number[];
  linetype: string;
  month: number;
  shift: number;
  type: string;
  year: number;
};

export type State = {
  productivity: {
    HPC: {
      hour: string;
      estimated: number;
      boxes: number;
      visits: number;
    }[];
    AERO: {
      hour: string;
      estimated: number;
      boxes: number;
      visits: number;
    }[];
    FOODS: {
      hour: string;
      estimated: number;
      boxes: number;
      visits: number;
    }[];
  };
  demands: {
    uploadStatus: {
      date: string;
      uploaded: boolean;
    }[];
  };
  chartData: ChartProps[];
  lengthSeries: any;
  selectedSimulationDate: string;
  simulation: FamilyPropsResponse;
};

type ProviderProps = {
  children: ReactNode;
  initialState: State;
};

type ContextValue = State & {
  dispatch: React.Dispatch<Action>;
};

type Action =
  | {
      type: "SET_UPLOAD_STATUS";
      payload: State["demands"]["uploadStatus"];
    }
  | {
      type: "SET_CHART_DATA";
      payload: State["chartData"];
    }
  | {
      type: "SET_LENGTH_SERIES";
      payload: any;
    }
  | {
      type: "SET_SIMULATION";
      payload: FamilyProps;
    }
  | {
      type: "SET_SELECTED_SIMULATION_DATE";
      payload: string;
    };

const AppContext = createContext<ContextValue | undefined>(undefined);

const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_UPLOAD_STATUS":
      return {
        ...state,
        demands: {
          uploadStatus: action.payload,
        },
      };
    case "SET_CHART_DATA":
      return {
        ...state,
        chartData: action.payload,
      };
    case "SET_LENGTH_SERIES":
      return {
        ...state,
        lengthSeries: action.payload,
      };
    case "SET_SIMULATION":
      return {
        ...state,
        simulation: {
          ...state.simulation,
          ...action.payload,
        },
      };
    case "SET_SELECTED_SIMULATION_DATE":
      return {
        ...state,
        selectedSimulationDate: action.payload,
      };
    default:
      return state;
  }
};

const AppProvider = ({ children, initialState }: ProviderProps) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const value = useMemo(() => ({ dispatch, ...state }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  return context;
};

export { AppProvider, useAppContext };
