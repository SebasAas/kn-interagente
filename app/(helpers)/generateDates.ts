export async function generateDates() {
  const data = (await (
    await fetch("https://kn-demand-emachzhqzq-uc.a.run.app/demand/uploadstatus")
  ).json()) as { date: string; uploaded: boolean }[];

  const datesArray = data.map((status) => {
    return { date: status.date, uploaded: status.uploaded };
  });

  return datesArray;
}
