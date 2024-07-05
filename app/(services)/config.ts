export const BASE_URL = "https://kn-productivity-dev-emachzhqzq-uc.a.run.app/";

export type ConfigType = {
  directed_hours_min: number;
  directed_hours_max: number;
  visits_min: number;
  visits_max: number;
  boxes_min: number;
  boxes_max: number;
};

export const fetchConfig = async () => {
  const response = await fetch(`${BASE_URL}filter`);
  if (!response.ok) {
    return {
      directed_hours_min: 0,
      directed_hours_max: 0,
      visits_min: 0,
      visits_max: 0,
      boxes_min: 0,
      boxes_max: 0,
    };
  }
  const data = await response.json();
  return data;
};

export const updateConfig = async ({ config }: { config: ConfigType }) => {
  const response = await fetch(`${BASE_URL}filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });
  const data = await response.json();
  return data;
};
