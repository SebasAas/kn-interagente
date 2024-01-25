import { toast } from "react-toastify";

export const BASE_URL = "https://production-kn-emachzhqzq-uc.a.run.app/";

export const fetchProductionCharts = async (
  month: string,
  year: string,
  shift: string
) => {
  const response = await fetch(
    `${BASE_URL}production/charts?month=${month}&year=${year}&shift=${shift}`
  );
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
  const data = await response.json();
  return data;
};

export const uploadFiles = async (files: File[]) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const promise = fetch(`${BASE_URL}production/uploadfile`, {
    method: "POST",
    body: formData,
  });

  return promise;
};
