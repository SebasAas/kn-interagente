export const BASE_URL = "https://kn-productivity-dev-emachzhqzq-uc.a.run.app/";

export type ConfigType = {
  hours_min: string;
  hours_max: string;
  visits_min: number;
  visits_max: number;
  quantity_min: number;
  quantity_max: number;
};

export const fetchConfig = async () => {
  const response = await fetch(`${BASE_URL}production/filter`);
  if (!response.ok) {
    return {
      hours_min: 0,
      hours_max: 0,
      visits_min: 0,
      visits_max: 0,
      quantity_min: 0,
      quantity_max: 0,
    };
  }
  const data = await response.json();
  return data;
};

export const updateConfig = async ({ config }: { config: ConfigType }) => {
  const response = await fetch(`${BASE_URL}production/filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });
  const data = await response.json();
  return data;
};
