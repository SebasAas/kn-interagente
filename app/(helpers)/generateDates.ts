export async function generateDates(): Promise<
  { date: string; uploaded: boolean }[]
> {
  const data = (await (
    await fetch(
      "https://kn-demand-dev-emachzhqzq-uc.a.run.app/demand/uploadstatus"
    )
  ).json()) as { date: string; uploaded: boolean }[];

  const datesArray = data.map((status) => {
    return { date: status.date, uploaded: false };
  });

  return datesArray;
}
