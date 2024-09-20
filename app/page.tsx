import { redirect } from "next/navigation";

// Helpers
import { getBaseUrl } from "./(helpers)/env";

// Import dynamically productivity
import dynamic from "next/dynamic";
import {
  checkNewestDateUploadFiles,
  fetchProductionCharts,
  getProducitivitySummary,
} from "./(services)/productivity";
import { fetchRanking } from "./(services)/ranking";
import { fetchConfig } from "./(services)/config";

const Productivity = dynamic(() => import("./(components)/Productivity"), {
  ssr: false,
});

export default async function Home() {
  const today = new Date();
  const month = (today.getMonth() + 1).toString();
  const year = today.getFullYear().toString();
  const shift = "0";

  const dataRankings = await fetchRanking(month, year, shift);
  const lastUpdate = await checkNewestDateUploadFiles();
  const dataConfig = await fetchConfig();
  const dataSummary = await getProducitivitySummary();

  return (
    <main className="min-h-[100vh]">
      <Productivity
        date={{
          month: month,
          year: year,
          shift: shift,
        }}
        ranking={dataRankings}
        lastUpdate={lastUpdate}
        dataConfig={dataConfig}
        dataSummary={dataSummary}
      />
    </main>
  );
}
