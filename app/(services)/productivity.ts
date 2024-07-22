export const BASE_URL = "https://kn-productivity-emachzhqzq-uc.a.run.app/";

export const fetchProductionCharts = async (
  month: string,
  year: string,
  shift: string
) => {
  const response = await fetch(
    `${BASE_URL}production/charts?month=${month}&year=${year}&shift=${shift}`
  );

  if (!response.ok) {
    return {
      detail: "Não tem dados disponíveis para o período selecionado!",
    };
  }

  const data = await response.json();

  return data;
};

export const fetchProductionVisits = async (
  month: string,
  year: string,
  shift: string
) => {
  const response = await fetch(
    `${BASE_URL}production/visits?month=${month}&year=${year}&shift=${shift}`
  );

  if (!response.ok) {
    return {
      detail: "Não tem dados disponíveis para o período selecionado!",
    };
  }

  const data = await response.json();
  return data;
};

export const uploadFiles = async (files: File[]) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const promise = fetch(`${BASE_URL}visits/uploadfile`, {
    method: "POST",
    body: formData,
  });

  return promise;
};

export const checkNewestDateUploadFiles = async () => {
  const response = await fetch(`${BASE_URL}visits/range`);
  const data = await response.json();
  return data;
};

export const getProducitivitySummary = async () => {
  const response = await fetch(`${BASE_URL}production/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
