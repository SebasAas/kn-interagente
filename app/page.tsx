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

  const dataCharts = await fetchProductionCharts(month, year, shift);
  const dataRankings = await fetchRanking(month, year, shift);
  const lastUpdate = await checkNewestDateUploadFiles();
  const dataConfig = await fetchConfig();
  const dataSummary = await getProducitivitySummary();

  console.log("dataCharts", dataCharts);

  if (dataCharts?.detail) {
    if (dataCharts?.detail.includes("Não tem dados")) {
      // toast.info(
      //   <div>
      //     <h2>Não encontramos dados de grafico para essa data</h2>
      //   </div>
      // );
      console.log("Não encontramos dados de grafico para essa data");
    } else {
      // toast.error(
      //   <div>
      //     <h2>Algo deu errado obtendo graficos, tente novamente!</h2>
      //   </div>
      // );
      console.log("Algo deu errado obtendo graficos, tente novamente!");
    }
  }

  return (
    <main className="h-[100vh]">
      <Productivity
        date={{
          month: month,
          year: year,
          shift: shift,
        }}
        charts={dataCharts}
        ranking={dataRankings}
        lastUpdate={lastUpdate}
        dataConfig={dataConfig}
        dataSummary={dataSummary}
      />
    </main>
  );
}
