// Helpers
import dynamic from "next/dynamic";
import { fetchUploadStatus, getSimulation } from "../(services)/demand";

const Planning = dynamic(() => import("../(components)/Planning"), {
  ssr: false,
});

export default async function PlanningPage() {
  const simulationFetch = await getSimulation();
  const uploadStatusFetch = await fetchUploadStatus();

  if (simulationFetch?.detail) {
    if (simulationFetch?.detail.includes("Não tem dados")) {
      console.log("Não encontramos dados de grafico para essa data");
    } else {
      console.log("Algo deu errado obtendo graficos, tente novamente!");
    }
  }

  console.log("simulationFetch", simulationFetch);

  return (
    <main className="h-[100vh]">
      <Planning
        simulationFetch={simulationFetch}
        uploadStatusFetch={uploadStatusFetch}
      />
    </main>
  );
}
