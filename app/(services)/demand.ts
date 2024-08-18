export const BASE_URL = "https://kn-back-planning-dev-emachzhqzq-rj.a.run.app/";

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

export type SimulationType = {
  [key: string]: {
    aero: {
      hour: string;
      boxes: number;
      visits: number;
      base_workers: number;
      workers: number;
      criticity: string;
      backlog: number;
      demand: number;
      storage: number;
      isWorkingHour: boolean;
    }[];
    foods: {
      hour: string;
      boxes: number;
      visits: number;
      base_workers: number;
      workers: number;
      criticity: string;
      backlog: number;
      demand: number;
      storage: number;
      isWorkingHour: boolean;
    }[];
    hpc: {
      hour: string;
      boxes: number;
      visits: number;
      base_workers: number;
      workers: number;
      criticity: string;
      backlog: number;
      demand: number;
      storage: number;
      isWorkingHour: boolean;
    }[];
    all: {
      hour: string;
      boxes: number;
      visits: number;
      base_workers: number;
      workers: number;
      criticity: string;
      backlog: number;
      demand: number;
      storage: number;
      isWorkingHour: boolean;
    }[];
  };
};

export type FamilyPropsResponse = {
  simulation: SimulationType;
  alarms: {
    [key: string]: {
      day: string;
      message: string;
      criticity: string;
    }[];
  };
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

export const demandSimulation = async (data: FamilyProps) => {
  const promise = await fetch(`${BASE_URL}demand/simulation`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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
  });

  const simulationData = await promise.json();

  return simulationData;
};
