// Create a react context with two main props productivity and demand, inside demand there should be uploadstatus prop that is an array ofo obj with date as string and uploaoded as bool, create also the methods to update the context and the initial state.

import type { ReactNode } from "react";

import { createContext, useReducer, useMemo, useContext } from "react";

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
};

type ProviderProps = {
  children: ReactNode;
  initialState: State;
};

type ContextValue = State & {
  dispatch: React.Dispatch<Action>;
};

type Action = {
  type: "SET_UPLOAD_STATUS";
  payload: State["demands"]["uploadStatus"];
};

const AppContext = createContext<ContextValue | undefined>(undefined);

const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_UPLOAD_STATUS":
      return {
        ...state,
        demands: {
          ...state.demands,
          uploadStatus: action.payload,
        },
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
