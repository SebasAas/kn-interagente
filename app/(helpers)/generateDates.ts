export async function generateDates() {
  const data = (await (
  await fetch(
      "https://kn-back-planning-emachzhqzq-rj.a.run.app/demand/uploadstatus"
    )
  ).json()) as {
    upload_status: string[];
    planning_status: string;
    production_status: string;
  };

  console.log("data", data);

  return data;
}
