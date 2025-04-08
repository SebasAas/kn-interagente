export const BASE_URL =
  "https://kn-back-planning-472839323482.southamerica-east1.run.app/";

export type FamilyProps = {
  families: [
    {
      family: "aero";
      workers_per_shift: { shift_1: number; shift_2: number; shift_3: number };
      max_storage: number;
    },
    {
      family: "hpc";
      workers_per_shift: { shift_1: number; shift_2: number; shift_3: number };
      max_storage: number;
    },
    {
      family: "foods";
      workers_per_shift: { shift_1: number; shift_2: number; shift_3: number };
      max_storage: number;
    }
  ];
};

export interface Families {
  aero: {
    user: number[];
  };
  hpc: {
    user: number[];
  };
  foods: {
    user: number[];
  };
}

export interface DemandSimulationType {
  families: Families;
  period?: {
    start: string;
    end: string;
  };
}

export interface Picking {
  hour: string;
  truck_hour: string;
  delay: number;
  boxes: number;
  truck: string;
  visits: string;
  remaining: number;
}

export type TrucksType = {
  code: string;
  hour: string;
  pickings: {
    [key: string]: Picking[];
  };
  priority: number;
  products: any;
};

export type SimulationType = {
  [key: string]: {
    aero: {
      hour: string;
      shift: number;
      backlog: number;
      demand: number;
      boxes: number;
      visits: number;
      workers: number;
      is_working_hour: boolean;
      criticity: string;
      pickings: Picking[];
    }[];
    foods: {
      hour: string;
      shift: number;
      backlog: number;
      demand: number;
      boxes: number;
      visits: number;
      workers: number;
      is_working_hour: boolean;
      criticity: string;
      pickings: Picking[];
    }[];
    hpc: {
      hour: string;
      shift: number;
      backlog: number;
      demand: number;
      boxes: number;
      visits: number;
      workers: number;
      is_working_hour: boolean;
      criticity: string;
      pickings: Picking[];
    }[];
    all: {
      hour: string;
      shift: number;
      backlog: number;
      demand: number;
      boxes: number;
      visits: number;
      workers: number;
      is_working_hour: boolean;
      criticity: string;
      pickings: Picking[];
    }[];
  };
};

export interface UploadStatusType {
  upload_status: string[];
  planning_status: string;
  production_status: string;
}

export interface DashDTTypes {
  dt: string;
  estimated_end_complexity: string;
  percentual: number;
  profile_all: number;
  boxes: number;
}
export interface DashWorkersTypes {
  families: Record<
    "aero" | "hpc" | "foods" | "all",
    {
      workers: DashWorkersList[];
      workers_per_shift: number;
    }
  >;
  error?: string;
  detail?: string;
}

export interface DashWorkersList {
  boxes: number;
  directed_hours: string;
  productivity: number;
  worker_code: string;
}

export type FamilyPropsResponse = {
  hours: SimulationType;
  alarms: {
    [key: string]: {
      day: string;
      message: string;
      criticity: string;
    }[];
  };
  trucks: TrucksType[];
  statistics: {
    [key: string]: {
      family: string;
      median_profile: number;
      median_n_visits_per_hour: number;
    };
  };
};

export const demandFiles = async (files: File[]) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const promise = fetch(`${BASE_URL}demand/uploadfile`, {
    method: "POST",
    body: formData,
  });

  return promise;
};

export const fetchUploadStatus = async () => {
  const response = await fetch(`${BASE_URL}demand/uploadstatus`);
  const data = await response.json();
  return data;
};

export const demandSimulation = async (data: DemandSimulationType) => {
  const promise = await fetch(`${BASE_URL}demand/simulation`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-cache",
  });

  const simulationData = await promise.json();

  return simulationData;
};

export const getSimulation = async () => {
  const promise = await fetch(`${BASE_URL}demand/simulation`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  if (!promise.ok) {
    const errorText = await promise.text();
    console.log("Error fetching simulation data", errorText);

    return {
      detail: "Não encontramos dados de grafico para essa data, ",
      error: errorText,
    };
  }

  // Try parsing the promise as JSON
  try {
    const simulationData = await promise.json();
    return simulationData;
  } catch (error) {
    return {
      detail: "Algo deu errado obtendo graficos, tente novamente! ",
      error: error,
    };
  }
};

export const getDashDT = async () => {
  const promise = await fetch(`${BASE_URL}demand/dash_dt`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  if (!promise.ok) {
    const errorText = await promise.text();
    console.log("Error fetching dash dt data", errorText);

    return {
      detail: "Não encontramos dados de caminhões para essa data, ",
      error: errorText,
    };
  }

  // Try parsing the promise as JSON
  try {
    const dashboardDTData = await promise.json();
    return dashboardDTData;
  } catch (error) {
    return {
      detail: "Algo deu errado obtendo dados de caminhões, tente novamente! ",
      error: error,
    };
  }
};

export const getDashWorkers = async () => {
  const promise = await fetch(`${BASE_URL}demand/dash_worker`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  if (!promise.ok) {
    const errorText = await promise.text();
    console.log("Error fetching simulation data", errorText);

    return {
      detail: "Não encontramos dados de workers para essa data, ",
      error: errorText,
    };
  }

  // Try parsing the promise as JSON
  try {
    const dashboardWorkersData = await promise.json();
    return dashboardWorkersData;
  } catch (error) {
    return {
      detail: "Algo deu errado obtendo dados de workers, tente novamente! ",
      error: error,
    };
  }
};

// Endpoint to download the demand file, will be a blob the response
export const downloadDemandFile = async () => {
  const response = await fetch(`${BASE_URL}demand/simulation_download`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  if (!response.ok) {
    return null;
  }

  const blob = await response.blob();
  return blob;
};
