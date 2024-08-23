export async function generateDates() {
  const data = (await (
    await fetch(
      "https://kn-demand-dev-emachzhqzq-uc.a.run.app/demand/uploadstatus"
    )
  ).json()) as {
    upload_status: string[];
    planning_status: string;
    production_status: string;
  };

  return data;
}
