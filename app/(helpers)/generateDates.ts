import { DashDTTypes } from "../(services)/demand";

export async function generateDates() {
  const data = (await (
    await fetch(
      "https://kn-back-planning-dev-emachzhqzq-rj.a.run.app/demand/uploadstatus"
    )
  ).json()) as {
    upload_status: string[];
    planning_status: string;
    production_status: string;
  };

  console.log("data", data);

  return data;
}

export async function getDashDT() {
  const data = (await (
    await fetch(
      "https://kn-back-planning-dev-emachzhqzq-rj.a.run.app/demand/dash_dt"
    )
  ).json()) as DashDTTypes[];

  return data;
}
